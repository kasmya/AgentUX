# backend/main.py
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic, json, uuid
from logger import log

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])
client = anthropic.Anthropic()   # set ANTHROPIC_API_KEY env var

class Turn(BaseModel):
    session_id: str
    participant_id: str
    condition: str
    message: str

def sse(obj): return f"data: {json.dumps(obj)}\n\n"

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
