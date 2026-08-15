# Pre‑Registration: AgentUX Transparency Study

## Hypotheses
- **H1:** Participants will detect more incorrect AI recommendations under AgentUX (transparency_on) than under Baseline (transparency_off).  
- **H2:** Participants will be less likely to accept incorrect AI recommendations under AgentUX than under Baseline.  
- **H3:** AgentUX will increase task completion time relative to Baseline, since users have more information to process.  
- **H4:** Self‑reported trust will not necessarily track actual reliance — i.e., trust scores may not differ significantly between conditions even if error‑detection behavior does.  

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
```markdown
Error detection rate = (wrong recommendations rejected or edited) / 3 [per condition, per participant]

Inappropriate acceptance rate = (wrong recommendations accepted) / 3

Task time = task_end_ts - task_start_ts

Trust = mean of 3-item Likert scale (trust_1, trust_2, trust_3)

SUS = standard 10-item scale, 0-100
