"""
Computes primary/secondary DVs from the raw event export:
- error_detection_rate = wrong recs rejected/edited / 3
- inappropriate_acceptance_rate = wrong recs accepted / 3
- task_time_seconds = task_end - task_start
- trust_mean, sus_score (from survey_submitted payload)

Usage:
    curl "http://127.0.0.1:8000/export" > raw_export.csv
    python analyze.py raw_export.csv
"""
import csv
import json
import sys
from collections import defaultdict
from datetime import datetime

def parse_ts(ts_str):
    return datetime.fromisoformat(ts_str)

def sus_score(scores):
    # standard SUS scoring: odd items (0-indexed even) score value-1,
    # even items (0-indexed odd) score 5-value; sum * 2.5
    total = 0
    for i, v in enumerate(scores):
        if i % 2 == 0:
            total += (v - 1)
        else:
            total += (5 - v)
    return total * 2.5

def main(path):
    rows = list(csv.DictReader(open(path)))

    # group by (session_id, condition) = one "run" of a task
    runs = defaultdict(list)
    for r in rows:
        key = (r["session_id"], r["participant_id"], r["condition"])
        runs[key].append(r)

    results = []
    for (session_id, participant_id, condition), events in runs.items():
        events.sort(key=lambda r: r["ts"])

        ground_truth = {}  # ticket_id -> is_correct
        decisions = {}      # ticket_id -> final decision status
        task_start_ts = None
        task_end_ts = None
        trust_scores = []
        sus_raw = None

        for e in events:
            etype = e["event_type"]
            payload = json.loads(e["payload"])

            if etype == "task_start":
                if task_start_ts is None:
                    task_start_ts = e["ts"]
            elif etype == "action_proposed":
                ground_truth[payload["id"]] = payload["is_correct"]
            elif etype == "action_accepted":
                decisions[payload["id"]] = "accepted"
            elif etype == "action_rejected":
                decisions[payload["id"]] = "rejected"
            elif etype == "action_edited" and payload.get("type") != "reorder":
                decisions[payload["id"]] = "edited"
            elif etype == "task_end":
                task_end_ts = e["ts"]
            elif etype == "survey_submitted":
                trust_scores = [payload["trust_1"], payload["trust_2"], payload["trust_3"]]
                sus_raw = payload["sus_scores"]

        wrong_ids = [tid for tid, correct in ground_truth.items() if not correct]
        n_wrong = len(wrong_ids)

        detected = sum(
            1 for tid in wrong_ids
            if decisions.get(tid) in ("rejected", "edited")
        )
        inappropriately_accepted = sum(
            1 for tid in wrong_ids
            if decisions.get(tid) == "accepted"
        )

        task_time = None
        if task_start_ts and task_end_ts:
            task_time = (parse_ts(task_end_ts) - parse_ts(task_start_ts)).total_seconds()

        results.append({
            "session_id": session_id,
            "participant_id": participant_id,
            "condition": condition,
            "n_wrong_recommendations": n_wrong,
            "error_detection_rate": round(detected / n_wrong, 3) if n_wrong else None,
            "inappropriate_acceptance_rate": round(inappropriately_accepted / n_wrong, 3) if n_wrong else None,
            "task_time_seconds": task_time,
            "trust_mean": round(sum(trust_scores) / len(trust_scores), 2) if trust_scores else None,
            "sus_score": round(sus_score(sus_raw), 1) if sus_raw else None,
        })

    out_path = "computed_metrics.csv"
    with open(out_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)

    print(f"Wrote {len(results)} rows to {out_path}")
    for r in results:
        print(r)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analyze.py <export.csv>")
        sys.exit(1)
    main(sys.argv[1])