from sqlmodel import SQLModel, Field, create_engine, Session
from datetime import datetime, timezone
import json, uuid

class Event(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    participant_id: str = Field(index=True)
    condition: str          # "transparency_on" | "transparency_off"
    event_type: str         # e.g. task_start, action_proposed, action_accepted, undo, cancel, trace_opened
    payload: str            # JSON blob
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

engine = create_engine("sqlite:///agentux.db")
SQLModel.metadata.create_all(engine)

def log(session_id, participant_id, condition, event_type, payload: dict):
    """Write an event to the SQLite log."""
    with Session(engine) as s:
        s.add(Event(session_id=session_id,
                    participant_id=participant_id,
                    condition=condition,
                    event_type=event_type,
                    payload=json.dumps(payload)))
        s.commit()
