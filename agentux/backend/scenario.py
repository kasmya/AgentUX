# backend/scenario.py
# The controlled study runs off THIS, not the live LLM.
# ~30% of actions are planted errors (is_correct=False) with HIGH confidence
# and plausible reasoning — so transparency can't trivially detect them.
#
# Each action carries three explanation fields consumed by the frontend
# when the round shows the AI's thinking:
#   - reasoning:   1–2 plain-English sentences ("How the AI decided")
#   - highlights:  short exact substrings of ticket_text the AI "focused on"
#   - alternative: {category, why_not} — the runner-up and why it lost
# The endpoint strips these fields in the transparency_off condition.

SCENARIO = {
    "task_id": "ticket_triage_v1",
    "prompt": "Below are 10 customer messages. An AI has suggested a category for each. Review each suggestion and tell us whether it looks right.",
    "actions": [
        {"id": "t1", "label": "Tag #1 as Billing", "is_correct": True,
         "ticket_text": "I want a refund",
         "confidence": 0.93,
         "reasoning": "The customer is directly asking for their money back, which is a payment matter and falls under Billing.",
         "highlights": ["refund"],
         "alternative": {
             "category": "Account",
             "why_not": "Refunds sometimes come up when someone closes an account, but the person hasn't mentioned their account at all — just the money."
         },
         "citations": ["ticket #1: 'I want a refund'"]},

        {"id": "t2", "label": "Tag #2 as Billing", "is_correct": False,
         "ticket_text": "phone won't charge",
         "confidence": 0.88,
         "reasoning": "The customer's message mentions 'charge', which often relates to Billing.",
         "highlights": ["charge"],
         "alternative": {
             "category": "Technical",
             "why_not": "It could be about the phone hardware, but 'charge' most often refers to a billing charge in customer messages."
         },
         "citations": ["ticket #2: 'phone won't charge'"]},   # planted error

        {"id": "t3", "label": "Tag #3 as Technical", "is_correct": True,
         "ticket_text": "app crashes",
         "confidence": 0.95,
         "reasoning": "The customer says the app is crashing — that's software breaking, which is a Technical problem.",
         "highlights": ["app crashes"],
         "alternative": {
             "category": "Account",
             "why_not": "A crash could sometimes happen on an account-related screen, but the person only mentions the app itself failing, not their account."
         },
         "citations": ["ticket #3: 'app crashes'"]},

        {"id": "t4", "label": "Tag #4 as Account", "is_correct": True,
         "ticket_text": "can't log in",
         "confidence": 0.91,
         "reasoning": "Not being able to log in is a problem with the customer's account access, so this fits under Account.",
         "highlights": ["can't log in"],
         "alternative": {
             "category": "Technical",
             "why_not": "A login screen could have a bug, but login problems are much more often about the account itself — wrong password, locked out, and so on."
         },
         "citations": ["ticket #4: 'can't log in'"]},

        {"id": "t5", "label": "Tag #5 as Technical", "is_correct": False,
         "ticket_text": "discount code not working",
         "confidence": 0.86,
         "reasoning": "The customer says something is 'not working', which sounds like a Technical fault.",
         "highlights": ["not working"],
         "alternative": {
             "category": "Billing",
             "why_not": "A discount code affects the price, but the phrase 'not working' points more to a functional problem than a payment question."
         },
         "citations": ["ticket #5: 'discount code not working'"]},  # planted (is Billing)

        {"id": "t6", "label": "Tag #6 as Billing", "is_correct": True,
         "ticket_text": "invoice is wrong",
         "confidence": 0.94,
         "reasoning": "The customer is disputing something on their invoice — invoices are payment documents, so this is Billing.",
         "highlights": ["invoice"],
         "alternative": {
             "category": "Account",
             "why_not": "Invoices are tied to an account, but the person is questioning the invoice itself — the money side — not their account details."
         },
         "citations": ["ticket #6: 'invoice is wrong'"]},

        {"id": "t7", "label": "Tag #7 as Account", "is_correct": True,
         "ticket_text": "delete my account",
         "confidence": 0.90,
         "reasoning": "The customer wants to close their account, which is a direct account management request.",
         "highlights": ["delete my account"],
         "alternative": {
             "category": "Other",
             "why_not": "It's a short request that could seem general, but 'delete my account' is a specific account action, so Account fits better than Other."
         },
         "citations": ["ticket #7: 'delete my account'"]},

        {"id": "t8", "label": "Tag #8 as Account", "is_correct": False,
         "ticket_text": "account balance charged twice",
         "confidence": 0.87,
         "reasoning": "The customer mentions their 'account balance', which suggests an Account issue.",
         "highlights": ["account balance"],
         "alternative": {
             "category": "Billing",
             "why_not": "Being charged twice is a payment issue, but the customer frames it around their account balance, which sounds like an Account matter."
         },
         "citations": ["ticket #8: 'account balance charged twice'"]},  # planted (is Billing)

        {"id": "t9", "label": "Tag #9 as Technical", "is_correct": True,
         "ticket_text": "screen freezes",
         "confidence": 0.92,
         "reasoning": "A screen freezing is a software or device problem — that's a Technical issue.",
         "highlights": ["screen freezes"],
         "alternative": {
             "category": "Other",
             "why_not": "It's a short message, but 'screen freezes' clearly describes a technical fault rather than a general question."
         },
         "citations": ["ticket #9: 'screen freezes'"]},

        {"id": "t10", "label": "Tag #10 as Technical", "is_correct": True,
         "ticket_text": "bluetooth pairing fails",
         "confidence": 0.89,
         "reasoning": "Bluetooth not connecting is a device or software problem, which falls under Technical.",
         "highlights": ["bluetooth pairing fails"],
         "alternative": {
             "category": "Account",
             "why_not": "Bluetooth has nothing to do with the customer's account — it's a connection problem, so Technical fits."
         },
         "citations": ["ticket #10: 'bluetooth pairing fails'"]},
    ],
}

SCENARIO_V2 = {
    "task_id": "ticket_triage_v2",
    "prompt": "Below are 10 customer messages. An AI has suggested a category for each. Review each suggestion and tell us whether it looks right.",
    "actions": [
        {"id": "t1", "label": "Tag #1 as Technical", "is_correct": True,
         "ticket_text": "app won't launch after update",
         "confidence": 0.94,
         "reasoning": "The app stopped opening after an update — that's a software failure, which is a Technical issue.",
         "highlights": ["app won't launch", "after update"],
         "alternative": {
             "category": "Account",
             "why_not": "An update could sometimes affect an account, but the customer isn't mentioning their account — only that the app won't open."
         },
         "citations": ["ticket #1: 'app won't launch after update'"]},

        {"id": "t2", "label": "Tag #2 as Account", "is_correct": False,
         "ticket_text": "profile shows wrong plan, overcharged",
         "confidence": 0.87,
         "reasoning": "The customer refers to their 'profile', which points to Account information.",
         "highlights": ["profile"],
         "alternative": {
             "category": "Billing",
             "why_not": "They also mention being overcharged, but the mention of the profile suggests this is an Account setup issue."
         },
         "citations": ["ticket #2: 'profile shows wrong plan, overcharged'"]},  # planted (is Billing)

        {"id": "t3", "label": "Tag #3 as Billing", "is_correct": True,
         "ticket_text": "charged twice for same order",
         "confidence": 0.95,
         "reasoning": "The customer was charged twice for one order — that's a duplicate payment, which is a Billing problem.",
         "highlights": ["charged twice"],
         "alternative": {
             "category": "Account",
             "why_not": "The charge is tied to their account, but the issue is about the money — the payment happening twice — so Billing fits better."
         },
         "citations": ["ticket #3: 'charged twice for same order'"]},

        {"id": "t4", "label": "Tag #4 as Technical", "is_correct": True,
         "ticket_text": "keeps logging me out randomly",
         "confidence": 0.90,
         "reasoning": "The app keeps signing the customer out for no reason — that behaviour sounds like a Technical bug.",
         "highlights": ["logging me out randomly"],
         "alternative": {
             "category": "Account",
             "why_not": "Getting logged out sounds account-related, but the word 'randomly' suggests a bug rather than an account problem."
         },
         "citations": ["ticket #4: 'keeps logging me out randomly'"]},

        {"id": "t5", "label": "Tag #5 as Technical", "is_correct": False,
         "ticket_text": "error message says payment declined",
         "confidence": 0.85,
         "reasoning": "The customer mentions seeing an 'error message', which suggests a Technical problem.",
         "highlights": ["error message"],
         "alternative": {
             "category": "Billing",
             "why_not": "The message is about a declined payment, but the customer describes it as an error on screen, which sounds more Technical."
         },
         "citations": ["ticket #5: 'error message says payment declined'"]},  # planted (is Billing)

        {"id": "t6", "label": "Tag #6 as Account", "is_correct": True,
         "ticket_text": "need to update my email on file",
         "confidence": 0.93,
         "reasoning": "The customer wants to change the email attached to their account — that's an Account settings change.",
         "highlights": ["update my email"],
         "alternative": {
             "category": "Other",
             "why_not": "It's a simple request, but changing an email on file is a specific Account action, not a general question."
         },
         "citations": ["ticket #6: 'need to update my email on file'"]},

        {"id": "t7", "label": "Tag #7 as Billing", "is_correct": True,
         "ticket_text": "why did my subscription price go up",
         "confidence": 0.92,
         "reasoning": "The customer is asking about a price change on their subscription — that's a pricing question, which is Billing.",
         "highlights": ["subscription price go up"],
         "alternative": {
             "category": "Account",
             "why_not": "Their subscription lives inside their account, but the question is specifically about price, which is a Billing matter."
         },
         "citations": ["ticket #7: 'why did my subscription price go up'"]},

        {"id": "t8", "label": "Tag #8 as Technical", "is_correct": False,
         "ticket_text": "billing page won't load",
         "confidence": 0.86,
         "reasoning": "The customer says a page 'won't load', which sounds like a Technical problem.",
         "highlights": ["won't load"],
         "alternative": {
             "category": "Billing",
             "why_not": "The page in question is the billing page, but the problem the customer describes is that it isn't loading — a Technical failure."
         },
         "citations": ["ticket #8: 'billing page won't load'"]},  # planted (is Billing)

        {"id": "t9", "label": "Tag #9 as Account", "is_correct": True,
         "ticket_text": "forgot my username",
         "confidence": 0.91,
         "reasoning": "The customer forgot the username for their account — that's an Account access issue.",
         "highlights": ["forgot my username"],
         "alternative": {
             "category": "Technical",
             "why_not": "It could involve a recovery tool, but the person's issue is that they can't remember their own username — that's an Account matter."
         },
         "citations": ["ticket #9: 'forgot my username'"]},

        {"id": "t10", "label": "Tag #10 as Technical", "is_correct": True,
         "ticket_text": "no push notifications",
         "confidence": 0.89,
         "reasoning": "Push notifications not arriving is usually an app or device setting problem, which falls under Technical.",
         "highlights": ["no push notifications"],
         "alternative": {
             "category": "Account",
             "why_not": "Notifications can be tied to account preferences, but when they simply aren't arriving, it's most often a Technical issue."
         },
         "citations": ["ticket #10: 'no push notifications'"]},
    ],
}

SCENARIOS = {
    "ticket_triage_v1": SCENARIO,
    "ticket_triage_v2": SCENARIO_V2,
}

# Sanity: error rate must be identical & known across conditions.
_bad_v1 = sum(1 for a in SCENARIO["actions"] if not a["is_correct"])
_bad_v2 = sum(1 for a in SCENARIO_V2["actions"] if not a["is_correct"])
ERROR_RATE_V1 = _bad_v1 / len(SCENARIO["actions"])   # 3/10 = 0.30
ERROR_RATE_V2 = _bad_v2 / len(SCENARIO_V2["actions"])   # 3/10 = 0.30