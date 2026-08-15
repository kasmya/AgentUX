from assign import condition_order
from scenario import SCENARIOS
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic, json
from logger import log
from fastapi.responses import PlainTextResponse
from sqlmodel import Session, select
from logger import engine, Event
import csv, io
from typing import Optional

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

client = anthropic.Anthropic()   # set ANTHROPIC_API_KEY env var

# --- Health check route ---
@app.get("/health")
def health():
    return {"ok": True}

class Turn(BaseModel):
    session_id: str
    participant_id: str
    condition: str
    message: str

class LogEvent(BaseModel):
    session_id: str
    participant_id: str
    condition: str
    event_type: str
    payload: dict

@app.post("/log")
def log_event(evt: LogEvent):
    log(evt.session_id, evt.participant_id, evt.condition, evt.event_type, evt.payload)
    return {"ok": True}

def sse(obj): 
    return f"data: {json.dumps(obj)}\n\n"

# --- Agent route ---
@app.post("/agent")
def agent(turn: Turn):
    def gen():
        yield sse({"type": "state", "value": "thinking"})
        resp = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system=("You are an agent that proposes ACTIONS as a JSON list. "
                    "Return JSON only: {\"reasoning\": str, \"confidence\": 0-1, "
                    "\"citations\": [str], \"actions\": [{\"id\": str, \"label\": str}]}"),
            messages=[{"role": "user", "content": turn.message}],
        )
        raw = resp.content[0].text
        data = json.loads(raw[raw.find("{"): raw.rfind("}") + 1])

        yield sse({"type": "reasoning", "value": data["reasoning"]})
        yield sse({"type": "confidence", "value": data["confidence"]})
        yield sse({"type": "citations", "value": data.get("citations", [])})
        for a in data["actions"]:
            log(turn.session_id, turn.participant_id, turn.condition,
                "action_proposed", a)
            yield sse({"type": "action", "value": a})
        yield sse({"type": "state", "value": "done"})
    return StreamingResponse(gen(), media_type="text/event-stream")

# --- Scenario route ---
@app.get("/scenario")
def get_scenario(session_id: str, participant_id: str, condition: str, scenario: str = "ticket_triage_v1"):
    data = SCENARIOS.get(scenario, SCENARIOS["ticket_triage_v1"])

    log(session_id, participant_id, condition, "task_start",
        {"task_id": data["task_id"]})

    actions = []
    for a in data["actions"]:
        item = {"id": a["id"], "label": a["label"]}   # always visible
        if condition == "transparency_on":
            item |= {
                "reasoning": a["reasoning"],
                "confidence": a["confidence"],
                "citations": a["citations"]
            }
        actions.append(item)

        # log full ground truth server-side
        log(session_id, participant_id, condition, "action_proposed",
            {"id": a["id"], "is_correct": a["is_correct"]})

    return {
        "task_id": data["task_id"],
        "prompt": data["prompt"],
        "actions": actions
    }

@app.get("/export", response_class=PlainTextResponse)
def export():
    with Session(engine) as s:
        rows = s.exec(select(Event)).all()
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["ts","session_id","participant_id","condition","event_type","payload"])
    for e in rows:
        w.writerow([e.ts, e.session_id, e.participant_id, e.condition, e.event_type, e.payload])
    return buf.getvalue()

@app.get("/assign")
def get_assignment(participant_number: int):
    order = condition_order(participant_number)
    return {"participant_number": participant_number, "order": order}

class SurveyResponse(BaseModel):
    session_id: str
    participant_id: str
    condition: str
    trust_1: int       # 1-7: "I trusted the agent's suggestions"
    trust_2: int       # 1-7: "I felt in control of the agent's actions"
    trust_3: int       # 1-7: "I understood why the agent made its suggestions"
    sus_scores: list[int]  # 10 items, 1-5 each, standard SUS
    comments: Optional[str] = None

@app.post("/survey")
def submit_survey(resp: SurveyResponse):
    payload = {
        "trust_1": resp.trust_1,
        "trust_2": resp.trust_2,
        "trust_3": resp.trust_3,
        "sus_scores": resp.sus_scores,
        "comments": resp.comments,
    }
    log(resp.session_id, resp.participant_id, resp.condition, "survey_submitted", payload)
    return {"ok": True}