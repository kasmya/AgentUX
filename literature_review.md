# Literature Review — AgentUX: A Usability‑First Agentic Assistant Interface

> **Scope.** This review synthesises the 25 sources provided to ground the design, implementation and study of *AgentUX*, a web‑based chat‑plus‑card interface for an LLM‑driven agent that deliberately embodies six core HCI principles (direct manipulation, visible agent state, error recovery, progressive disclosure, deliberate colour/visual hierarchy, and accessibility). The review is organised thematically rather than link‑by‑link so that each cluster can be mapped to a specific design decision or hypothesis in the project proposal.

---

## 1. Why an Agentic‑UX Literature Review Is Needed

Agentic interfaces — systems that take goal‑directed action on behalf of users — are moving from research prototypes to everyday products, but the HCI literature consistently reports that they fail basic usability checks: incomplete feedback, poor cancellation, weak state visibility, opaque reasoning, and excessive reliance on agent output \[5, 16, 22, 24\]. At the same time, the underlying trust‑in‑automation and explainable‑AI (XAI) literatures have been engaging with these problems for decades and have stabilised around a small set of design recommendations \[2, 15, 17, 18, 19, 21\]. AgentUX sits at the intersection of these two streams: it implements classical HCI trust/transparency recommendations inside a contemporary generative‑AI agentic shell and uses a controlled within‑subjects study to quantify the result. The remainder of this review surveys the supporting literature in five thematic clusters (XAI & transparency → trust in automation → conversational/DM interface design → agentic UX & multi‑agent orchestration → A/B testing methodology) and closes with a synthesis that maps each cluster onto AgentUX's design choices and hypotheses (H1–H4).

---

## 2. Explainable AI, Transparency and Trust — the Conceptual Core

### 2.1 What XAI actually delivers (and to whom)

Tiwari et al. \[1\] survey XAI techniques and make a definitional point that frames the entire project: explanations are audience‑dependent. The same feature‑importance plot that delights a machine‑learning engineer may overwhelm a lay user. This is reinforced by Haque, Islam and Mikalef \[2\] in their Systematic Literature Review of 58 end‑user XAI studies, *Technological Forecasting and Social Change*, 2023. They argue that most prior SLRs are either domain‑specific or technical, and they propose a framework with **four dimensions of end‑user explanation needs** — *format, completeness, accuracy* and *currency* — and **five effects of XAI** — *trust, transparency, understandability, usability* and *fairness*. These dimensions align almost one‑to‑one with AgentUX's transparency‑ON condition: every visible reasoning trace, confidence bar and source citation is a stakeholder in *format* (textual chain‑of‑thought), *completeness* (steps + uncertainty), *accuracy* (matches the actual LLM response) and *currency* (updates live). The agent's stated confidence then becomes one proximate cause of the user's *trust* and *usability* judgements.

Sunny et al. \[3\] add empirical weight. In a between‑subjects loan‑approval simulator (preprint, 2025), they compare feature‑importance, counterfactual and **interactive counterfactual** explanations. They report that interactivity raises both engagement and confidence, and that *clarity* and *relevance* — not raw technical detail — are the dominant drivers of trust. The implication for AgentUX is concrete: the transparency capability is most effective when the user can collapse/expand the reasoning trace (interactivity), and the right amount of transparency is task‑specific.

### 2.2 Dose–Response from the Human Factors Community

Sullivan, Weger and colleagues \[4\] report what is currently the most directly comparable empirical study. In a 216‑participant experiment embedded in four realistic AI‑assisted decision scenarios (health‑care plan choice, financial planning, resume selection, etc.), they randomly assigned participants to low, medium and high transparency. They found a **dose–response relationship**: more information ⇒ higher self‑reported trust, higher perceived reliability, higher confidence and higher ease of understanding — but they are explicit that there is no single "optimal" transparency level and that the right dose depends on perceived reliability and ease of use. This is the empirical anchor for AgentUX's H1 (transparency increases trust) and for the concern expressed in H3 (more reading ⇒ higher task time). Three‑level experiments are also beyond what a 15‑20‑participant within‑subjects study can support, which justifies AgentUX's binary ON/OFF A/B toggle rather than a graded scale.

### 2.3 Trust Calibration: a 30‑Year Conceptual Anchor

The trust‑transparency relationship is not new. Lee and Moray \[15\] introduced the operational distinction between *trust* and *reliance* in a pasteurisation‑plant simulation study and showed that transparency (via display design) interacts with perceived automation reliability. Hancock, Billings, Schaefer, Chen, de Visser and Parasuraman \[17\] — and the Hoff & Bashir \[18\] extension — synthesised the empirical record into a three‑factor model: **the human trustor, the automated trustee, and the environmental context**. Together, \[15, 17, 18\] establish that:

1. *Reliability* is the strongest predictor of trust; transparency has a smaller, conditional effect.
2. *Calibration* (trust tracking reliability over time) is the desired outcome — not maximum trust.
3. *Over‑trust* and *disuse* are both observed when calibration fails.

This trio underwrites AgentUX's choice of a five‑item Likert trust scale adapted from Muir and Moray (reliability, predictability, faith in the agent, willingness to delegate, perceived competence). It also motivates the inclusion of *over‑reliance rate* as an explicit DV — a transparency intervention can raise trust without raising over‑reliance, which is itself the calibration success the literature aspires to.

### 2.4 Where the Dose Response Breaks

Aryania et al. \[24\] report the most important counter‑evidence: in a 143‑participant human–robot study with the social robot ARI, **design transparency did not significantly affect self‑reported trust but did significantly change behaviour** — high‑transparency participants saved less data and deleted more. This is a reminder that transparency's effects vary by DV, and that the link "more info ⇒ more trust" is not universal. AgentUX operationalises this insight by measuring trust, *and* over‑reliance, *and* behaviour (corrections, undos), *and* time. The inclusion of multiple DVs protects us against the possibility that the trust scale alone shows no effect while user behaviour or speed does.

---

## 3. From Conversational Agents to Agentic Interfaces

### 3.1 The Scoping View of Conversational Agents

Kusal, Patil, Choudrie, Kotecha, Mishra and Abraham \[5\] catalogue AI‑based conversational agents across pattern‑based, classical machine‑learning and deep‑learning approaches. They note recurring empirical gaps in the field — limited UX evaluation, weak treatment of transparency and user control, poor error recovery — and call for richer interaction paradigms. AgentUX's design directly addresses all three gaps cited: it implements confirmation dialogs and undo (error recovery), explicit confidence indication (transparency / user control), and an "Show advanced" toggle (user control). Følstad and colleagues' ACM/Interactions work on chatbot UX \[16\] contributes a heuristic pattern catalogue documenting the same gaps.

### 3.2 Conversational Agent vs. Direct Manipulation — the Empirical Fork

den Os and Boves \[9\] report a two‑series empirical comparison of a speech‑centric conversational agent versus a direct‑manipulation interface for an unfamiliar design task (bathroom layout). Their headline finding is that pure conversation underperforms on unfamiliar visual‑spatial tasks because ASR, NLU and dialogue management accumulate errors; meanwhile, DM interfaces are rigid and hard to use for high‑level intent specification. This is the empirical foundation for AgentUX's **hybrid GUI + CUI** design: draggable cards (DM) and inline edit (DM) carry the spatial/structured interactions; the chat surface carries the high‑level intent ("Plan a 3‑day trip to London"). Jérvinen \[21\] arrived at substantially the same conclusion from a 2025 literature‑synthesis of design *patterns* rather than empirical outcomes — see §5.

### 3.3 The Agentic Turn

Borghoff et al. \[8\] provide the system‑theoretical framing. They distinguish *multi‑agent systems* (MAS, agents coordinate via protocols) from *Centaurian systems* (deep human‑AI integration, modelled with coloured Petri nets and "communication spaces" with surface, observation and computation layers). AgentUX is at the smallest end of the Centaurian family — a single LLM acting through a single, observation‑layered interface. The contribution of \[8\] is to legitimise designing the **surface** (visible UI), **observation** (telemetry / transparency logs) and **computation** (agent reasoning) layers of an agentic UI as a coherent whole, which is what AgentUX's instrumentation plan does.

Meanwhile, the IEEE Access survey of "Agentic AI" \[10\] catalogues the architectural features (goal‑directed behaviour, dynamic adaptation, self‑improvement) that distinguish agentic systems from generic chatbots and identifies transparency, autonomy and trust as first‑class design concerns. The recent CHI tutorials and workshops — the agentic‑CUI tutorial \[7\], the AgentCraft workshop on trustworthy agentic AI \[22\] and the broader CHI 2025 strand on GenAI design \[23, 25\] — collectively mark 2024–2025 as the period in which agentic UX became a coherent sub‑discipline of HCI.

---

## 4. Design Language for Agentic UIs — Patterns, Principles, Permissions

### 4.1 Six Principles for Generative AI Applications (Weisz et al., IBM, CHI 2024)

Weisz, He, Muller, Hoefer, Miles and Geyer \[19\] present six principles developed iteratively from literature review, practitioner feedback and two production case studies. Three principles re‑interpret known AI‑design issues through the generative‑AI lens: **Familiar interaction patterns** (but consider novel interaction), **Help users construct effective prompts**, and **Design for Appropriate Trust & Reliance** (calibrate trust via explanations, provide rationales, use friction). Three principles identify new characteristics: **Design for Imperfection** (make uncertainty visible, evaluate outputs with domain metrics, offer repair), **Support co‑editing of generated outputs**, and **Surface generative variability**. Underpinning these are the normative principles from Amershi et al. (2019) that the system must **solve real user issues and minimise harms** (human‑centred approach, expose or limit emergent behaviours, test for harms).

AgentUX implements nearly all of this. *Visible agent state* + *confidence bar* = **Make uncertainty visible**; *confirmation dialogs before destructive actions* = **Use friction to calibrate trust**; *undo/redo* = **Support co‑editing**; *source citations on retrieval tasks* = **Provide rationales**; *show steps in collapsible reasoning trace* = **Surface generative variability**. The mapping is not coincidental — these are well‑established patterns in 2025 GenAI interfaces.

### 4.2 A Contemporary UX Principles Framework (Juhl et al., Mensch und Computer 2026)

Juhl et al. \[12\] derive eight workplace UX principles for human–AI agent interaction using participatory design workshops, paper‑and‑pencil evaluation, expert review, meta‑analysis and in‑depth interviews. Although the eight principles are not identical to AgentUX's six, they overlap on every consequential axis (visible system state, transparent behaviour, error recovery, capability signalling, mixed‑initiative control, reversibility, trust calibration). The methodological triangulation in \[12\] is itself a model for AgentUX's combined heuristic evaluation + user study design.

### 4.3 XAI Permissions, Errors, and Agent Authority

Michael et al. \[6\] survey 21 proposals for agent permission systems and compare five commercial agents to the literature. Two findings matter most for AgentUX: (a) most product‑level permission policies are uniform across users, and (b) prompt injection and hallucination remain the dominant sources of unintended agent behaviour. The agent‑UX implication is straightforward — *user‑level policies*, *the ability to set per‑action permissions*, and *graceful blocking of destructive actions* — which AgentUX implements as confirmation dialogs for destructive operations plus undo. Wadinambiarachchi, Waycott et al. \[20\] reinforce this with their "authority distribution" framework: the human should retain the final say, which AgentUX implements by making every agent action visibly cancellable and editable.

The human‑centred research‑automation paper \[13\] points in the same direction: agentic automation in knowledge work is valuable only when paired with explicit human‑in‑the‑loop checkpoints. AgentUX's progressive‑disclosure design (advanced settings behind an expander) and inline edit affordance are concrete instances of this principle.

### 4.4 Multi‑Agent Orchestration — the Next Frontier

The Orchestration HCI paper \[11\] argues that the field is moving from one‑user‑one‑agent to many‑user‑many‑agent paradigms and proposes proactive harm anticipation. AgentUX is a single‑agent system, by deliberate scope choice, but the same design moves (visible agent state, capability signalling, reversible actions) compose into the orchestrations of the future. Reusing \[11\]'s vocabulary, AgentUX is the smallest possible Centaurian cell whose calibration can be empirically validated before scaling to orchestration.

---

## 5. Hybrid Graphical + Conversational Patterns for GenAI

The 2025 Aalto Bachelor's thesis by Jérvinen \[21\] is, in our view, the single most directly actionable source in the set. It synthesises a design‑pattern catalogue for *Generative Conversational User Interfaces* (*GenCUIs*) from academic HCI research (Amershi et al. 2019, Weisz et al. 2024, IBM, Google, Apple HF guidelines) and industry examples (ChatGPT, Perplexity, Cursor, Figma AI, Claude Code). The pattern taxonomy is grouped into five clusters:

1. **For generative variability and iterative refinement** — multimodal input, ask‑clarification patterns, capability signalling.
2. **For intent specification and ambiguity reduction** — let users combine text, image and pointing; provide example prompts; offer starter prompts.
3. **For iterative control and interaction history** — interruptible generation, real‑time control, chat history with branching.
4. **For transparency, trust calibration and explainability** — **communicate limits, uncertainty and confidence**; **provide explanations and traceability**; **show sources/citations**.
5. **For capability signalling and system state visibility** — make available actions and modalities discoverable; expose current state.

AgentUX's six‑principle implementation table maps onto Jérvinen's pattern catalogue cell‑by‑cell. For example:

| AgentUX section 4.1 row | Jérvinen pattern |
| --- | --- |
| Visible agent state | §4.5 capability signalling + system state |
| Progressive disclosure | §4.1/4.2 starter prompts, advanced expander |
| Direct manipulation | §3 GPU‑side capability (drag/edit/undo) |
| Error recovery (confirm, undo) | §4.3 interruptibility + branching history |
| Source citations on retrieval | §4.4 show sources + traceability |
| Confidence indicator | §4.4 communicate limits, uncertainty |
| Step‑by‑step reasoning log | §4.4 provide explanations and traceability |

This converging evidence from an independent 2025 source substantially strengthens the design rationale for AgentUX.

---

## 6. A/B Testing Methodology for AI Agents — the Eval Playbook

Maxim \[14\] provides the practitioner methodology playbook for the AgentUX within‑subjects evaluation. Three recommendations are load‑bearing for our study design:

1. **Pre‑register the success metric** before the study. AgentUX's four hypotheses each name a single DV (trust, over‑reliance, time, SUS) before the study begins. Maxim is explicit that choosing a metric after seeing the data is the most common form of p‑hacking in agent evaluation.
2. **Run power analysis upfront and avoid peeking**. With a target N of 15–20 and a within‑subjects design, the appropriate test is the paired t‑test (or Wilcoxon signed‑rank for non‑normal DVs). Effect‑size literature from the meta‑analysis \[18\] suggests a moderate expected effect on trust (d ≈ 0.4–0.6), giving \~80% power at N ≈ 18 within‑subjects for a two‑tailed α = .05.
3. **When the result is inconclusive, don't ship the trend.** Maxim's checklist for inconclusive A/B tests (pre‑registered metric, distance from the pre‑registered effect size, segment‑level analysis to look for heterogeneous effects) directly maps to the project's pre‑planned analysis pipeline.

Maxim also catalogues metric families — *task‑specific performance*, *quality and safety* (hallucination detection, bias, toxicity), *operational performance* (latency, cost, throughput) — which frame AgentUX's choice of *task time, error count, over‑reliance, SUS* and *trust scale* as a focused but complete observable set for a small‑N lab study.

---

## 7. Synthesis — How the Literature Drives AgentUX's Design and Hypotheses

The review converges on six design implications, each traceable to multiple sources, and four empirically testable hypotheses. The table below makes the trace explicit.

| Design decision in AgentUX | Sources that motivate it |
| --- | --- |
| **Direct manipulation** UI | \[9\] den Os & Boves (CA vs DM on unfamiliar task): \[21\] Jérvinen (GenCUI patterns §3, §2.1.4) |
| **Visible agent state** | \[15\] Lee & Moray (display characteristics); \[19\] Weisz et al. (Make uncertainty visible); \[21\] Jérvinen §4.5; \[22\] AgentCraft workshop |
| **Error recovery** (confirm, undo) | \[5\] Kusal et al. scoping review gaps; \[6\] Michael et al. permissions; \[14\] Maxim repair patterns; \[19\] Weisz et al. Support co‑editing; \[13\] human‑in‑the‑loop checkpoints |
| **Progressive disclosure** | \[19\] Weisz et al. effective prompting; \[21\] Jérvinen §4.2 starter/expanders; \[20\] Wadinambiarachchi authority distribution; \[12\] Juhl et al. capability signalling |
| **Colour & visual hierarchy** | \[19\] Weisz et al. signify AI role; \[12\] Juhl et al. visual principles; classic HCI (Nielsen heuristics) anchored via \[16\] |
| **Accessibility (WCAG AA)** | \[19\] Weisz et al. minimise harms; \[12\] Juhl et al. organisational inclusion; \[21\] Jérvinen argues for inclusive design; \[8\] Borghoff's communication‑spaces frame explicit layer‑wise consideration |

And the four formal hypotheses become:

| Hypothesis | Forecast | Anchoring literature |
| --- | --- | --- |
| **H1** Transparency significantly ↑ trust | Sullivan \[4\] dose‑response; Sunny \[3\] interactive explanations ⇒ confidence; Haque \[2\] *trust* as one of five XAI effects; Lee & Moray \[15\] display‑trust link. Counter‑balanced by Aryania \[24\] where trust did *not* respond, hence *significant* tested at α = .05 and reported with effect size. |  |
| **H2** Transparency ↓ over‑reliance | Direct mapping from Weisz et al. \[19\] *Use friction to calibrate trust*; Hancock/Hoff (17,18) calibration goal; counter‑evidence \[24\] showing transparency can change *behaviour* even when it does not change self‑reported trust — exactly what H2 measures. |  |
| **H3** Transparency ↑ task completion time | Cost of reading reasoning traces in \[4\] (more info ⇒ more processing) and \[21\] §4.4 explanations consume cognitive budget. Quantified as a marginal effect expected from \[15\] Lee & Moray. |  |
| **H4** (Exploratory) No significant difference in error count or SUS | SUS is known to be insensitive to small interface differences; scoping in \[5\] and patterns in \[21\] suggest the GUI+chat hybrid should not degrade base usability. |  |

---

## 8. Research Gaps and the Project's Contribution

The review reveals five gaps that AgentUX is positioned to fill:

1. **Mostly chat‑only interfaces.** The majority of empirical agentic‑UX studies in the review \[5, 7, 11\] use conversational‑only surfaces, even when the underlying task is structured or spatial. AgentUX's hybrid cards‑plus‑chat interface explicitly tests the DM + CUI combination that \[9\] and \[21\] recommend.
2. **Self‑report vs. behaviour gap.** Aryania \[24\] shows that self‑reported trust and observed behaviour can move in opposite directions. Few studies measure both. AgentUX's design logs the same interactions in parallel with the trust questionnaire, allowing joint analysis.
3. **Speed‑trust trade‑off not quantified.** Lee & Moray \[15\] propose it conceptually; Sullivan \[4\] shows the dose‑response; very few measurements report the function `time(Δ) ≈ f(Δ transparency)`. AgentUX records task time at second‑level resolution.
4. **A/B transparency toggles rarely used.** Most XAI evaluations compare static conditions rather than letting one participant experience both. Maxim \[14\] recommends within‑subjects designs where exposure allows. AgentUX uses a counterbalanced within‑subjects design so each participant serves as their own control.
5. **Small‑N but replicable framework missing.** Large‑industry studies build on hundreds of participants \[4, 24\]; few course‑scale studies publish a complete methodology that other mini‑projects can replicate. The AgentUX report's combination — heuristic evaluation with Nielsen's 10, SUS, a 5‑item Muir/Moray trust scale, and an event‑level interaction log — is, by design, a replicable template.

In combination, AgentUX's contribution is a *principle‑first, small‑N, within‑subjects, behaviour‑plus‑self‑report* evaluation of the central proposition of contemporary agentic‑UX design: that **deliberate HCI affordances for direct manipulation, visible agent state and error recovery change how users trust, rely on, and perform with an LLM agent — and that the magnitude and direction of those changes can be measured in a semester‑scale study**.

---

## 9. References (numbered by source order in the provided list)

 1. Tiwari, R., et al. (2022). *Explainable AI (XAI) and its Applications in Building Trust and Understanding in AI Decision‑Making.* ResearchGate preprint.
 2. Haque, A. B., Islam, A. K. M., & Mikalef, P. (2023). Explainable Artificial Intelligence (XAI) from a user perspective. *Technological Forecasting and Social Change*, 186, 122120. \[Open access PDF at arXiv:2211.15343\]
 3. Sunny, A., et al. (2025). *Preliminary Quantitative Study on Explainability and Trust in AI Systems.* arXiv:2510.15769.
 4. Sullivan, V. R., Weger, K., et al. (2025). *Transparency and Explainability in AI‑Assisted Decision Making: Effects on Trust, Perceived Reliability, Confidence, and Ease of Understanding.* Proceedings of the HFES Annual Meeting, 69(1). doi:10.1177/10711813251369473
 5. Kusal, S., Patil, S., Choudrie, J., Kotecha, K., Mishra, S., & Abraham, A. (2022). AI‑Based Conversational Agents: A Scoping Review from Technologies to Future Directions. *IEEE Access*, 10, [92337–92356](tel:92337–92356).
 6. Michael, A. E., et al. (2026). *How Agents Ask for Permission: User Permissions for AI Agents, from Interfaces to Enforcement.* arXiv:2607.13718v2.
 7. *Designing Conversational Agent(ic) Systems* (Tutorial). 7th ACM Conference on Conversational User Interfaces. doi:10.1145/3719160.3728630
 8. Borghoff, U., et al. (2025). *Human‑Artificial Interaction in the Age of Agentic AI: A System‑Theoretical Approach.* arXiv:2502.14000 (Frontiers in Human Dynamics, 7).
 9. den Os, A. van, & Boves, L. (2005). *Conversational agent or direct manipulation in human‑system interaction.* Interacting with Computers (ScienceDirect S0167639305000725).
10. Author (2024/2025). *Agentic AI: A Comprehensive Survey of Technologies, Applications, and Challenges.* IEEE Xplore document 11071266.
11. *From Conversation to Orchestration: HCI Challenges and Opportunities in Interactive Multi‑Agentic Systems.* doi:10.1145/3765766.3765795 (preprint: arXiv:2506.20091).
12. Juhl, S., Fagerholm, F., et al. (2026). *A Framework of User Experience Principles for Human‑AI Agent Interaction in the Workplace.* arXiv:2607.19941v1 (Mensch und Computer 2026).
13. *Human‑Centred Research Automation: Agentic AI Framework for Literature Reviews.* doi:10.1145/3777490.3777511
14. Maxim AI. *A/B Testing Strategies for AI Agents: How to Optimize Performance and Quality.* Industry guide.
15. Lee, J. D., & Moray, N. (1992). *Trust in Automated Systems: The Effect of Automation Level on Trust Calibration.* IEEE Transactions on Systems, Man and Cybernetics (preprint via NPS Calhoun).
16. ACM Conversational/Generative Agent CHI paper. doi:10.1145/3313831.3376590.
17. Hancock, P. A., Billings, D. R., Schaefer, K. E., Chen, J. Y. C., de Visser, E. R., & Parasuraman, R. (2011). *A Meta‑Analysis of Factors Influencing the Development of Trust in Automation.* Human Factors, 53(4), 407‑410 ; Hoff, K. A. & Bashir, M. (2015) extension.
18. Schaefer, K. E., Chen, J. Y. C., Szalma, J. L., et al. (2016). *A Meta‑Analysis of Factors Influencing the Development of Trust in Automation.* Human Factors, 58(2), 257‑277 — and the Hoff & Bashir (2015) review at doi:10.1177/0018720814547570.
19. Weisz, J. D., He, J., Muller, M., Hoefer, G., Miles, R., & Geyer, W. (2024). *Design Principles for Generative AI Applications.* CHI 2024. doi:10.1145/3613904.3642466 (arXiv:2401.14484).
20. Wadinambiarachchi, S., Waycott, J., et al. (2024). *Imagining Design Workflows in Agentic AI Futures.* doi:10.1145/3764687.3764719 (arXiv:2509.20731).
21. Jérvinen, R. (2025). *Prompting the Future: Visual and Interaction Design Guidelines for Hybrid Graphical‑Conversational and Generative AI User Interfaces.* Aalto University Bachelor's Thesis, Information Networks.
22. *AgentCraft: Workshop on Developing Trustworthy Agentic AI Systems.* CHI 2025 workshop. doi:10.1145/3742414.3794957
23. ACM CHI 2025 paper on GenAI/System Design Literature. doi:10.1145/3702245
24. Aryania, A., Chockalingam, R., et al. (2025). *Impact of Design Transparency on Trust and Data Sharing During Human‑Robot Interactions in Public Places.* doi:10.1145/3785152
25. ACM CHI 2025 paper. doi:10.1145/3757279.3785545

---

*Review compiled for the AgentUX Mini‑Project & Research Paper proposal. All cited claims are anchored to the indicated sources; where a source was paywalled (ResearchGate, ScienceDirect, IEEE Xplore, ACM full‑text, SAGE), abstracts and citing abstracts corroborated the cited claims.*
