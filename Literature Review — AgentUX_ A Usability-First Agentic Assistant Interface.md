# Literature Review — AgentUX: A Usability-First Agentic Assistant Interface

## 1. AgentUX: Formal Research Anchor

### 1.1 Core idea

**AgentUX** is a usability-first interface for LLM-powered agentic assistants that combines **conversational interaction with direct manipulation**, while making agent behaviour, uncertainty, reasoning, and actions visible and controllable.

The system is designed around six principles:

1. **Direct manipulation**
2. **Visible agent state**
3. **Error recovery**
4. **Progressive disclosure**
5. **Deliberate colour and visual hierarchy**
6. **Accessibility**

The central research question is:

> **Do deliberate HCI affordances for direct manipulation, visible agent state, transparency and error recovery change how users trust, rely on, and perform with an LLM agent?**

### 1.2 Research areas

AgentUX sits at the intersection of:

| Research area | Relevance to AgentUX |
|---|---|
| Explainable AI (XAI) | Explanations, confidence, transparency and traceability |
| Trust in automation | Trust calibration vs. over-reliance |
| Conversational agents | Chat-based interaction and agent UX |
| Agentic HCI | Human control over autonomous actions |
| Generative-AI UI design | Co-editing, uncertainty, variability and repair |
| Human–AI authority | User retains final control over agent actions |
| UX evaluation | SUS, task time, errors, trust and behavioural logs |

The literature review identifies **five major clusters**: XAI/transparency, trust calibration, conversational and agentic interfaces, generative-AI design patterns, and online evaluation methodology.

---

# 2. Proposed AgentUX System

| Component | AgentUX implementation | Purpose |
|---|---|---|
| **Hybrid interface** | GUI + conversational interface | Combine structured interaction with natural-language intent |
| **Action cards** | Draggable, reorderable and editable cards | Direct manipulation of agent actions |
| **Agent state** | Progress/status indicator | Show what the agent is currently doing |
| **Reasoning trace** | Collapsible step-by-step trace | Provide transparency without overwhelming the user |
| **Confidence indicator** | Colour-coded confidence bar | Make uncertainty visible |
| **Source citations** | Citations for retrieved information | Improve traceability |
| **Error recovery** | Confirmation, undo/redo, cancellation | Prevent and recover from unwanted actions |
| **Progressive disclosure** | Advanced information behind an expander | Balance transparency with cognitive load |
| **Event logger** | Records agent actions and interactions | Enable behavioural evaluation and debugging |
| **Accessibility** | WCAG AA, ARIA and keyboard navigation | Make the interface broadly usable |

The hybrid GUI+CUI approach is particularly motivated by evidence that conversational interaction can perform worse than direct manipulation for unfamiliar visual-spatial tasks.

---

# 3. Evaluation Metrics

| Metric | What it measures |
|---|---|
| **Trust** | User-reported trust in the agent |
| **Over-reliance rate** | Incorrect agent suggestions accepted without correction |
| **Task completion time** | Time required to complete the task |
| **Error count** | Number of user/component-level errors |
| **SUS** | Overall perceived usability |
| **Behavioural logs** | Actual interaction and reliance behaviour |
| **Qualitative feedback** | User perception of transparency and control |

The key design choice is to measure **both self-reported trust and observable behaviour**, because transparency may change behaviour without significantly changing reported trust.

---

# 4. Master Literature Comparison

### Similarity / relevance score

- **5** = Directly supports AgentUX's agentic UX / transparency / control problem
- **4** = Strongly relevant to a major AgentUX design or evaluation decision
- **3** = Provides supporting UX, trust or evaluation evidence
- **2** = Indirectly relevant to agentic interaction
- **1** = Contextual/background relevance

| Ref. | Paper / Theme | Main concept | AgentUX relevance | Key lesson for AgentUX | Similarity |
|---|---|---|---|---|---:|
| **[1]** | Tiwari et al. — XAI & Trust | XAI for trust and understanding | Background for explainability | Establishes the broader XAI → trust trajectory | 3 |
| **[2]** | Haque et al. — End-user XAI | Explanation needs: format, completeness, accuracy, currency | Transparency design | Explanations should be designed around actual user needs | **5** |
| **[3]** | Sunny et al. — Explainability & Trust | Interactive explanations | Collapsible reasoning trace | Clarity and relevance matter more than simply providing more information | **5** |
| **[4]** | Sullivan et al. — AI Transparency | Low/medium/high transparency | Transparency manipulation | More transparency can increase trust, but there is no universal optimal level | **5** |
| **[5]** | Kusal et al. — Conversational Agents | UX gaps in conversational agents | Error recovery + transparency | Conversational-agent UX needs stronger empirical evaluation and recovery mechanisms | **5** |
| **[6]** | Michael et al. — Agent Permissions | User-level permissions | Confirmation / cancellation | Agent authority should be explicitly controlled by the user | **5** |
| **[7]** | Designing Conversational Agent(ic) Systems | Agentic conversational UX | Agentic interface design | Supports the emerging agentic-UX research direction | 4 |
| **[8]** | Borghoff et al. — Agentic HCI | Surface, observation, computation layers | Agent state + architecture | Agent UX should connect interface, observation and computation coherently | **5** |
| **[9]** | den Os & Boves — Conversational vs GUI | Direct manipulation vs conversational interaction | Hybrid GUI + CUI | Direct manipulation can outperform conversation for structured/spatial tasks | **5** |
| **[10]** | Agentic AI Survey | Goal-directed, adaptive agents | Agent definition | Provides broader architectural context for agentic AI | 3 |
| **[11]** | Garg et al. — Multi-Agent HCI | Human–multi-agent orchestration | Visible state + control | Future agent interfaces need explicit state and harm anticipation | 4 |
| **[12]** | Juhl et al. — Workplace Agent UX | Eight UX principles | Evaluation + workplace UX | Supports multi-method UX evaluation of human–AI agents | **5** |
| **[13]** | Khan et al. — Human-Centred Automation | Human-in-the-loop checkpoints | Inline editing + checkpoints | Agentic automation should retain explicit human intervention points | **5** |
| **[14]** | Maxim AI — A/B Testing Agents | Experimental methodology | AgentUX user study | Pre-register metrics, power analysis and rules for inconclusive results | **5** |
| **[15]** | Lee & Moray — Trust Calibration | Trust vs reliance | Trust + over-reliance measures | Trust should be evaluated as calibration, not simply maximised | **5** |
| **[16]** | ACM Conversational/Generative AI UX | Generative-agent UX | Supporting context | General background for conversational-agent UX | 2 |
| **[17]** | Hancock et al. — Trust Meta-analysis | Reliability, transparency, individual differences | Trust model | Trust depends on more than transparency alone | **4** |
| **[18]** | Schaefer et al. — Trust Meta-analysis | Reliability & transparency | Trust manipulation | Reliability is a stronger predictor; transparency has a smaller conditional effect | **5** |
| **[19]** | Weisz et al. — GenAI Design Principles | Six design principles | Core design rationale | Provides the strongest design-principle foundation for AgentUX | **5** |
| **[20]** | Wadinambiarachchi et al. — Agentic Workflows | Authority distribution | Human final control | Agentic workflows must deliberately distribute authority between human and AI | **5** |
| **[21]** | Jérvinen — GenCUI Patterns | Hybrid GUI/CUI patterns | Direct manipulation, transparency, state | Provides concrete interaction patterns matching AgentUX | **5** |
| **[22]** | AgentCraft Workshop | Agent state, debugging, mixed initiative, trust | Entire AgentUX evaluation | Identifies the major design concerns AgentUX addresses | **5** |
| **[23]** | CHI 2025 Agent UX | Generative/agentic UX | Background | Places AgentUX within current HCI research | 2 |
| **[24]** | Aryania et al. — Transparency & Trust | Transparency vs behaviour | Trust + over-reliance | Self-report trust and actual behaviour can diverge | **5** |
| **[25]** | CHI 2025 Agent UX | Human-centred GenAI | Background | Supports the broader research direction | 2 |

---

# 5. Detailed Analysis of the Most Relevant Literature

## [2] End-User Explainable AI — Haque et al.

**Contribution:**  
Synthesises 58 end-user XAI studies and identifies four dimensions of explanation needs:

- Format
- Completeness
- Accuracy
- Currency

It also identifies five major effects:

- Trust
- Transparency
- Understandability
- Usability
- Fairness

**Transferable pattern:**  
Transparency should be designed around **what information users actually need**, rather than simply exposing more technical detail.

**AgentUX implementation:**  
Collapsible reasoning trace + confidence indicator + source citations.

**Gap:**  
XAI literature does not directly address the interaction model of autonomous agentic systems.

---

## [3] Interactive Explanations — Sunny et al.

**Contribution:**  
Compares feature-importance, counterfactual and interactive-counterfactual explanations.

**Key finding:**  
Interactivity increases engagement and confidence, while **clarity and relevance** are more important for trust than raw explanation detail.

**AgentUX pattern:**  
Make the reasoning trace **collapsible and interactive** rather than permanently displaying extensive information.

**Gap:**  
The work focuses on explanation interaction rather than full agentic workflows.

---

## [4] Transparency Dose–Response — Sullivan et al.

**Contribution:**  
N=216 participants across multiple AI-assisted decision scenarios with low, medium and high transparency.

**Finding:**  
Greater transparency was associated with greater:

- Trust
- Perceived reliability
- Confidence
- Ease of understanding

However, the authors report that there is **no single universally optimal transparency level**.

**AgentUX implication:**  
Transparency has a potential benefit but also a cognitive/time cost.

**Direct hypothesis connection:**  
Supports:

- **H1:** Transparency → increased trust
- **H3:** Transparency → increased task time

---

## [5] Conversational-Agent UX — Kusal et al.

**Contribution:**  
Scoping review of AI-based conversational agents.

**Identified gaps:**

1. Limited empirical UX evaluation
2. Insufficient treatment of transparency and user control
3. Weak error-recovery mechanisms

**AgentUX response:**

| Literature gap | AgentUX solution |
|---|---|
| Transparency | Confidence + reasoning trace |
| User control | Editable/cancellable actions |
| Error recovery | Confirmation + undo |

---

## [6] Agent Permissions — Michael et al.

**Contribution:**  
Reviews 21 proposals for AI-agent permission systems and compares commercial agents.

**Key concept:**  
Permission systems should move beyond uniform product-level policies toward **user-level permission specifications**.

**AgentUX implementation:**

- Confirmation before destructive actions
- Per-action cancellation
- Undo after agent actions

**Core principle:**  
The agent can act, but the **user retains authority**.

---

## [8] Agentic HCI — Borghoff et al.

**Contribution:**  
Introduces a communication-space framework for agentic systems.

| Layer | AgentUX equivalent |
|---|---|
| **Surface** | React + Tailwind user interface |
| **Observation** | Event logger |
| **Computation** | LLM-driven agent reasoning |

**Key lesson:**  
The UI should not be treated as an afterthought to the AI model. The interface, observation and computation layers should be designed coherently.

---

## [9] Conversational Agent vs Direct Manipulation — den Os & Boves

**Contribution:**  
Compares a speech-centric conversational agent with direct manipulation for an unfamiliar visual-spatial task.

**Finding:**  
The conversational-agent metaphor performed worse than direct manipulation for the unfamiliar visual-spatial task.

**AgentUX response:**  

> **Conversation for intent + GUI for structured action.**

This motivates the **hybrid GUI + CUI** architecture rather than making the entire system conversational.

---

## [12] Human–AI Agent UX — Juhl et al.

**Contribution:**  
Develops a workplace framework of eight UX principles using:

- Participatory design workshops
- Paper-and-pencil evaluation
- Expert review
- Meta-analysis
- Interviews

**AgentUX implication:**  
Supports using multiple evaluation methods rather than relying on a single usability measure.

---

## [13] Human-Centred Research Automation — Khan et al.

**Contribution:**  
Argues that agentic automation in knowledge work should include explicit **human-in-the-loop checkpoints**.

**AgentUX implementation:**

- Inline editing
- Progressive disclosure
- Confirmation
- Cancellation
- User checkpoints

---

## [15] Trust Calibration — Lee & Moray

**Core distinction:**

| Concept | Meaning |
|---|---|
| **Trust** | Belief about how the system will behave |
| **Reliance** | Behavioural decision to depend on the system |

**AgentUX implication:**  
The objective should not be to maximise trust.

Instead:

> **Trust should be calibrated to actual system reliability.**

This directly motivates measuring **trust + over-reliance** together.

---

## [18] Trust Meta-analysis — Schaefer et al.

**Finding:**  
System reliability and performance are major predictors of trust, while transparency has a **smaller, conditional effect**.

**AgentUX implication:**

- Keep agent accuracy constant across experimental conditions.
- Do not interpret increased trust automatically as a positive outcome.
- Focus on **appropriate reliance** rather than maximum trust.

---

# 6. Six Core Design Principles → Literature Mapping

| AgentUX Principle | Implementation | Supporting Literature |
|---|---|---|
| **1. Direct manipulation** | Draggable cards, inline edit, reorder | [9], [21] |
| **2. Visible agent state** | Progress, status, reasoning trace | [15], [19], [21], [22] |
| **3. Error recovery** | Confirmation, undo/redo, cancellation | [5], [6], [13], [19] |
| **4. Progressive disclosure** | Advanced information behind expander | [12], [19], [20], [21] |
| **5. Colour & visual hierarchy** | Clear distinction between actions/states | [12], [19] |
| **6. Accessibility** | WCAG AA, ARIA, keyboard navigation | [12], [19], [21] |

The strongest design foundation is **Weisz et al.'s six generative-AI principles**, particularly appropriate trust/reliance, visible uncertainty, co-editing, repair of imperfect outputs and communicating generative variability.

---

# 7. GenCUI Pattern → AgentUX Mapping

Jérvinen's 2025 design-pattern synthesis groups GenCUI patterns into five clusters.

| AgentUX Feature | GenCUI Pattern |
|---|---|
| Visible agent state | System-state visibility |
| Confidence bar | Uncertainty communication |
| Source citations | Source/traceability |
| Reasoning log | Explanation + traceability |
| Draggable/editable cards | Interruptibility + interaction history |
| Progressive disclosure | Intent specification + ambiguity reduction |
| Confirmation + undo | Error recovery |
| Accessibility | Inclusive interaction |

---

# 8. Permissions, Authority & Human Control

| Research concept | AgentUX implementation |
|---|---|
| User-level permissions | Per-action confirmation |
| Authority distribution | Human retains final decision |
| Mixed initiative | User can pause/cancel agent |
| Debugging agent behaviour | Event/action log |
| Visible agent state | Live status indicator |
| Human-in-the-loop | Editable checkpoints |

This reflects the broader literature's shift from **"AI performs the task"** toward **"human and AI share authority while the human retains meaningful control."**

---

# 9. Hypotheses → Evidence Mapping

| Hypothesis | Expected result | Supporting evidence | Counter / limitation |
|---|---|---|---|
| **H1: Transparency increases trust** | Higher trust score with transparency ON | [2], [3], [4], [15] | [18] transparency has smaller conditional effect; [24] found no significant self-reported trust change |
| **H2: Transparency decreases over-reliance** | Fewer incorrect agent suggestions accepted | [19] friction to mitigate over-reliance; [15], [18] calibration framework | [24] shows behavioural and self-report measures can diverge |
| **H3: Transparency increases task time** | Higher completion time | [4] increased information processing; [21] explanation cognitive cost | No major counter-evidence identified |
| **H4: No significant difference in errors/SUS** | Similar error count and SUS | [5], [21] support need for hybrid UX evaluation | Exploratory hypothesis |

---

# 10. Research Methodology

## Proposed study

| Element | AgentUX approach |
|---|---|
| Design | Within-subjects |
| Conditions | Transparency **ON vs OFF** |
| Participants | Target **N = 15–20** |
| Primary measures | Trust, over-reliance, task time |
| Secondary measures | Error count, SUS |
| Behavioural data | Event/action logs |
| Statistical test | Paired t-test |
| Non-normal alternative | Wilcoxon signed-rank |
| Experimental control | Same agent accuracy/reliability across conditions |
| Analysis principle | Pre-register metrics and analysis decisions |

Maxim's AI-agent A/B testing guidance is used to support pre-registration, upfront power analysis, avoidance of result-peeking and predefined handling of inconclusive results.

---

# 11. Research Gaps

| Gap | Existing literature | AgentUX response |
|---|---|---|
| **1. Conversational-only interfaces dominate** | Many agent UX studies focus primarily on chat | Hybrid **cards + chat** interface |
| **2. Behaviour and self-report rarely combined** | [24] shows they can diverge | Trust questionnaire + behavioural event logs |
| **3. Speed–trust trade-off rarely quantified** | Transparency research supports the trade-off conceptually | Measure trust and task time per participant/condition |
| **4. Transparency A/B testing is uncommon** | Existing work often uses different transparency levels or settings | Within-subjects ON/OFF transparency manipulation |
| **5. Small-N replicable agent UX templates are limited** | Many studies use larger samples | Heuristic evaluation + SUS + trust + event logging |
| **6. Agent authority is still under-explored** | Permission and authority frameworks are emerging | Visible, editable and cancellable agent actions |

---

# 12. Overall Contribution / Novelty

AgentUX is positioned as a:

> **Principle-first, small-N, within-subjects, behaviour-plus-self-report evaluation of a hybrid agentic interface.**

Its contribution is not simply another chatbot UI. It combines:

| Dimension | AgentUX contribution |
|---|---|
| **Interaction** | Hybrid conversational + direct manipulation |
| **Transparency** | Visible state + reasoning + confidence + citations |
| **Control** | Editable, reversible and cancellable agent actions |
| **Trust** | Measures calibrated trust rather than maximum trust |
| **Behaviour** | Measures over-reliance alongside self-report |
| **Usability** | SUS + task time + errors |
| **Evaluation** | Controlled transparency ON/OFF experiment |
| **Accessibility** | WCAG AA + ARIA + keyboard interaction |
| **Research scale** | Replicable semester/course-scale methodology |

### Central research proposition

> **Deliberate HCI affordances for direct manipulation, visible agent state, transparency and error recovery can influence how users trust, rely on and perform with an LLM agent, and these effects can be measured through a combination of behavioural and self-reported UX metrics.**

---

# 13. One-Page Research Summary

| Category | AgentUX |
|---|---|
| **Problem** | Agentic interfaces can hide system state, reasoning and authority, making appropriate trust and control difficult |
| **Research gap** | Limited empirical evaluation of hybrid agentic interfaces combining transparency, direct manipulation and behavioural trust measures |
| **System** | LLM agent + hybrid GUI/CUI |
| **Key UI** | Action cards, chat, state indicator, reasoning trace, confidence bar, citations |
| **Control model** | User can edit, cancel, undo and confirm agent actions |
| **Main theoretical basis** | XAI + trust calibration + GenAI UX + agentic HCI |
| **Primary experiment** | Transparency ON vs OFF |
| **H1** | Transparency ↑ trust |
| **H2** | Transparency ↓ over-reliance |
| **H3** | Transparency ↑ task time |
| **H4** | Error count/SUS remain broadly unchanged |
| **Primary DVs** | Trust, over-reliance, task time |
| **Secondary DVs** | Errors, SUS |
| **Key methodological strength** | Behaviour + self-report |
| **Main novelty** | Principle-driven hybrid agent UX evaluated through controlled transparency manipulation |
| **Expected contribution** | Evidence on the trust–control–speed trade-off in agentic interfaces |