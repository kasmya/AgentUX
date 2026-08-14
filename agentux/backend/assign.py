# backend/assign.py
def condition_order(participant_number: int) -> list[str]:
    # even -> ON first, odd -> OFF first
    if participant_number % 2 == 0:
        return ["transparency_on", "transparency_off"]
    return ["transparency_off", "transparency_on"]
