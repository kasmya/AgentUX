# Pre-Registration — AgentUX Transparency Study

## 1. Hypotheses
H1: Participants will detect more incorrect AI recommendations under AgentUX (transparency_on) than under Baseline (transparency_off).
H2: Participants will be less likely to accept incorrect AI recommendations under AgentUX than under Baseline.
H3: AgentUX will increase task completion time relative to Baseline, since users have more information to process.
H4: Self-reported trust will not necessarily track actual reliance — i.e., trust scores may not differ significantly between conditions even if error-detection behavior does.

## 2. Design
- Within-subjects, 2 conditions: transparency_on, transparency_off
- Counterbalanced order (assign.py: even participant# -> ON first, odd -> OFF first)
- 2 scenario variants (ticket_triage_v1, ticket_triage_v2) to avoid repeat-task memorization
- Each participant does: [variant A, condition X] then [variant B, condition Y]

## 3. Participants
- Target N = [15–20]
- Recruitment: [source]
- Stopping rule: collect until N = [20], no interim analysis/peeking

### Exclusion criteria
- Participants who complete a round in under 20 seconds will be excluded
  as non-genuine attempts (insufficient time to read and consider tickets).
- Participants who fail the manipulation check (see below) will be flagged
  and their data reviewed separately, but not automatically excluded.
- Incomplete sessions (participant did not finish both rounds and both
  surveys) will be excluded from the paired analysis.

## 4. Operational Definitions
- Error detection rate = (wrong recommendations rejected or edited) / n_wrong   [per condition, per participant]
- Inappropriate acceptance rate = (wrong recommendations accepted) / n_wrong
- Task time = task_end_ts - task_start_ts
- Trust = mean of 3-item Likert scale (trust_1, trust_2, trust_3)
- SUS = standard 10-item scale, 0-100

## 4b. Manipulation Check
At the end of each round's survey, participants will be asked whether they
saw the AI's reasoning and confidence during that round (Yes/No). This
confirms participants noticed the transparency manipulation as intended.
Responses will be cross-checked against the actual condition assigned.

## 5. Analysis Plan
- Primary test per hypothesis: paired t-test (ON vs OFF, same participant)
- Normality check: Shapiro-Wilk on difference scores
- If normality fails: Wilcoxon signed-rank test instead
- Significance level: alpha = 0.05, two-tailed
- Inconclusive handling: report effect size (Cohen's d / r) regardless of p-value;
  do not reframe non-significant results as trends

## 5b. Additional Reported Statistics
- Effect sizes (Cohen's d) will be reported alongside p-values for all
  paired comparisons, regardless of significance.
- Order effects (ON-first vs. OFF-first) will be checked as a secondary
  analysis to confirm counterbalancing adequately controlled for
  sequence/learning effects.

## 6. Falsification Criteria
- H1 falsified if error detection rate does not differ significantly (or is lower) under AgentUX
- H2 falsified if inappropriate acceptance does not decrease under AgentUX
- H3 falsified if task time does not increase under AgentUX
- H4 falsified if trust and behavioral reliance move together in lockstep (i.e., trust significantly predicts error detection)

## 7. Planned Limitations (for paper write-up)
- Small sample size (N=15-20), appropriate for exploratory findings only.
- Single task domain (support ticket triage); results may not generalize
  to other agentic decision-making contexts.
- Single LLM (Claude) used for AI-generated reasoning; results may vary
  with other models.
- Participants likely drawn from a convenience sample (university-affiliated),
  limiting demographic generalizability.

## 8. Ethics
- Status: Confirmed exempt/cleared with supervisor
- Consent: Written consent obtained via in-app instructions/consent screen before participation; participant name collected for attendance tracking, stored separately from response data.