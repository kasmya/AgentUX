# backend/events.py — the ONLY place event names are defined
EVENTS = {
    "TASK_START":      "task_start",
    "TASK_END":        "task_end",
    "ACTION_PROPOSED": "action_proposed",
    "ACTION_ACCEPTED": "action_accepted",
    "ACTION_EDITED":   "action_edited",
    "ACTION_REJECTED": "action_rejected",
    "UNDO":            "undo",
    "CANCEL":          "cancel",
    "TRACE_OPENED":    "trace_opened",
}