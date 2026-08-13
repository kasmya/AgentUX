from scenario import SCENARIO
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
def get_scenario(session_id: str, participant_id: str, condition: str):
    log(session_id, participant_id, condition, "task_start",
        {"task_id": SCENARIO["task_id"]})

    actions = []
    for a in SCENARIO["actions"]:
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
        "task_id": SCENARIO["task_id"],
        "prompt": SCENARIO["prompt"],
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