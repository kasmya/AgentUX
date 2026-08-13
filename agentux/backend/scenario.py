# backend/scenario.py
# The controlled study runs off THIS, not the live LLM.
# ~30% of actions are planted errors (is_correct=False) with HIGH confidence
# and plausible reasoning — so transparency can't trivially detect them.

SCENARIO = {
    "task_id": "ticket_triage_v1",
    "prompt": "Triage these 10 support tickets into the correct category.",
    "actions": [
        {"id": "t1",  "label": "Tag #1 as Billing",     "is_correct": True,
         "reasoning": "Explicitly requests a refund.",      "confidence": 0.93,
         "citations": ["ticket #1: 'I want a refund'"]},
        {"id": "t2",  "label": "Tag #2 as Billing",     "is_correct": False,
         "reasoning": "Contains the word 'charge'.",        "confidence": 0.88,
         "citations": ["ticket #2: 'phone won't charge'"]},   # planted error
        {"id": "t3",  "label": "Tag #3 as Technical",   "is_correct": True,
         "reasoning": "Reports an app crash on launch.",     "confidence": 0.95,
         "citations": ["ticket #3: 'app crashes'"]},
        {"id": "t4",  "label": "Tag #4 as Account",     "is_correct": True,
         "reasoning": "Password reset request.",            "confidence": 0.91,
         "citations": ["ticket #4: 'can't log in'"]},
        {"id": "t5",  "label": "Tag #5 as Technical",   "is_correct": False,
         "reasoning": "Mentions 'not working'.",            "confidence": 0.86,
         "citations": ["ticket #5: 'discount code not working'"]},  # planted (is Billing)
        {"id": "t6",  "label": "Tag #6 as Billing",     "is_correct": True,
         "reasoning": "Disputes an invoice amount.",        "confidence": 0.94,
         "citations": ["ticket #6: 'invoice is wrong'"]},
        {"id": "t7",  "label": "Tag #7 as Account",     "is_correct": True,
         "reasoning": "Wants to close their account.",      "confidence": 0.90,
         "citations": ["ticket #7: 'delete my account'"]},
        {"id": "t8",  "label": "Tag #8 as Account",     "is_correct": False,
         "reasoning": "Mentions 'my account balance'.",     "confidence": 0.87,
         "citations": ["ticket #8: 'account balance charged twice'"]},  # planted (is Billing)
        {"id": "t9",  "label": "Tag #9 as Technical",   "is_correct": True,
         "reasoning": "Screen freezes during video.",       "confidence": 0.92,
         "citations": ["ticket #9: 'screen freezes'"]},
        {"id": "t10", "label": "Tag #10 as Technical",  "is_correct": True,
         "reasoning": "Bluetooth won't pair.",             "confidence": 0.89,
         "citations": ["ticket #10: 'bluetooth pairing fails'"]},
    ],
}

# Sanity: error rate must be identical & known across conditions.
_bad = sum(1 for a in SCENARIO["actions"] if not a["is_correct"])
ERROR_RATE = _bad / len(SCENARIO["actions"])   # 3/10 = 0.30