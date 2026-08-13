# Pre‑Registration: AgentUX Transparency Study

## Hypotheses
- **H1:** Transparency increases user‑reported trust.
- **H2:** Transparency decreases over‑reliance (fewer incorrect agent suggestions accepted).
- **H3:** Transparency increases task completion time.
- **H4:** Error count and SUS scores remain broadly unchanged across conditions.

## Design
- **Study type:** Within‑subjects experiment.
- **Conditions:** Transparency **ON** vs **OFF**.
- **Counterbalancing:** Half participants complete ON→OFF, half OFF→ON (deterministic by participant number).
- **Tasks:** Two scenario variants (support‑ticket triage v1 and v2) with identical error rate (30% planted errors).
- **Agent behaviour:** Byte‑identical across conditions; only transparency fields gated.

## Participants
- **Target N:** 20 participants.
- **Stopping rule:** Collect until N=20, no interim peeking or early stopping.
- **Recruitment:** Coursework volunteers; ethics/consent clearance required before data collection.

## Operational Definitions
- **Trust:** Self‑report questionnaire score (Likert scale).
- **Over‑reliance:** `accepted_bad / proposed_bad`.
- **Task time:** `task_end − task_start` (seconds).
- **Error count:** `accepted_bad + rejected_good`.
- **SUS:** Standard 10‑item System Usability Scale.

## Analysis Plan
- **Tests:** Paired t‑test for each hypothesis.  
- **Normality check:** Shapiro–Wilk; if violated, use Wilcoxon signed‑rank.  
- **Significance level:** α = 0.05.  
- **Handling inconclusive results:** Report effect size and confidence intervals; no post‑hoc peeking or re‑analysis.

## Falsification Criteria
- **H1 falsified** if trust scores do not differ significantly between ON and OFF.  
- **H2 falsified** if over‑reliance rates do not decrease with transparency ON.  
- **H3 falsified** if task completion times do not increase with transparency ON.  
- **H4 falsified** if error counts or SUS scores differ significantly between conditions.

## Expected Contribution
Evidence on the **trust–control–speed trade‑off** in agentic interfaces, using a principle‑driven hybrid GUI+CUI design with controlled transparency manipulation.
