# backend/logger.py
from sqlmodel import SQLModel, Field, create_engine, Session
from datetime import datetime, timezone
import json, uuid, os

class Event(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    participant_id: str = Field(index=True)
    condition: str
    event_type: str
    payload: str
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Participant(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    age_range: str
    ai_familiarity: int
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///agentux.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SQLModel.metadata.create_all(engine)

def log(session_id, participant_id, condition, event_type, payload: dict):
    with Session(engine) as s:
        s.add(Event(session_id=session_id, participant_id=participant_id,
                    condition=condition, event_type=event_type,
                    payload=json.dumps(payload)))
        s.commit()