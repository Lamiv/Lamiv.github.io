---
title: From one forecast to an organisation
subtitle: What the experiment showed, why a strategy that adapted was not adopted, and how the pattern extends to an organisation's own decisions
part: 2
date: 24 November 2026
---

[Part 1](intelligence-that-compounds-1-building-it.html) described the reference architecture and how it was built, mostly by conversation. This part reports what the implemented experiment has actually shown, what that means in practice, and what the same pattern would mean for an organisation that wants to learn from its own decisions rather than only record them.

Three kinds of statement run through it, and each is labelled. **Implemented** means running and tested. **Designed** means part of the reference architecture, not yet running. **Findings** are what the implemented experiment measured, with the limits of how it was measured.

## What is implemented, and what is not

**Implemented and tested:** seven weeks of scheduled market watch that included Brent, in a broader monitoring workflow; Supabase as persistent empirical memory; Notion as reflective memory, research discussion and governance; a 60-session sequential learning experiment, in which a learning algorithm ran over historical Brent market observations, session by session, comparing three forecasting strategies; sequential probability updates from observed outcomes; scoring, daily reflections, hypothesis records and strategy comparison; and evidence-based rejection of strategies that did not improve.

**Designed, not yet implemented:** Firecrawl research acquisition; the full ten-table database, of which seven tables exist, five for the live pilot and two for the learning experiments; scheduled, unattended execution of the engines; forecasting and strategy refinement driven by news and the model; and prospective champion and challenger testing.

So the experiment demonstrates the mechanics of a governed learning loop. It is not a fully autonomous, self-improving investment agent, and its results are not investment performance.

## Where the experiment came from: seven weeks of market watch

The Brent experiment did not start from a blank page. It grew out of a broader market-monitoring workflow I already run, and that workflow had been watching Brent for weeks before any of the work in this series began.

Brent was added to the workflow's watchlist on 8 October 2026, and scheduled market analysis covering it continued through 24 November. On 13 November the monitoring was split in two: an *opportunity watch* and an *early-crisis watch*, with different objectives, shared risk controls, and a person's approval required before anything was acted on.

Those weeks taught several lessons that went straight into the Brent design: keep early warnings apart from opportunity signals; record a confidence and the conditions that would prove a view wrong; separate forecasts from outcomes; count false alarms and missed opportunities, not only successes; preserve the evidence; and require approval before a strategy changes.

They also exposed the gap this series is about. **The scheduled commentary did not reliably become scored forecast records.** Weeks of analysis had been produced, but very little of it had been recorded in a form that could later be checked against what actually happened. A manual test of saving forecasts was run on 23 November; automated recording and scoring of the monitoring's views has not yet been verified. Seven weeks of watching had produced memory of a kind, but almost nothing to learn from.

The 60-session experiment below is the response to that lesson. It tests a narrow mechanism, statistical adaptation from scored outcomes, in a setting where every forecast is recorded and every outcome is scored. Its results are kept separate from the monitoring workflow; they say nothing about the accuracy of the weeks of live analysis, and nothing about investment returns. The broader loop, in which a language model learns from news-driven forecasts, remains the proposed extension.

## How we will know

The Brier score is the primary measure because it rewards honest confidence: a forecast of 80% that turns out wrong scores 0.64, while always saying 50% scores 0.25. [Wikipedia](https://en.wikipedia.org/wiki/Brier_score) An agent that is often confidently wrong does worse than one that admits uncertainty.

Three comparisons matter, all on the same future dates: the learning agent against the no-change forecast, which any skill must beat; against the fixed V1 forecast, which shows whether learning added anything; and each challenger against the strategy it would replace. Because every test runs forward on dates that did not exist when it began, this is walk-forward evaluation, the standard defence against strategies that merely fit the past. [Wikipedia](https://en.wikipedia.org/wiki/Walk_forward_optimization)

Eight to twelve weeks of prospective forecasts gives a first dataset, not a verdict. Loaded history gives context, not experience: an agent's genuine record begins with its first forecast made before the outcome existed. That prospective test is designed, not yet running. What has been run is a 60-session experiment on recorded market data, and it already tests the part of the loop that matters most.

## The experiment: sequential learning over 60 trading sessions

**What was run.** A learning algorithm was executed over 60 trading sessions of historical market observations, the EIA Brent spot price from 25 August to 17 November 2026, one session at a time, in order. [EIA](https://www.eia.gov/dnav/pet/hist/RBRTED.htm) Nothing about the learning was simulated. Before each session's outcome was read, three strategies each stated a probability that the price would rise; the outcome was then read, every forecast was scored, and the adaptive strategies updated. In all: 60 evaluation sessions, three strategies, 180 probability comparisons and 60 outcome-driven reflections.

| Strategy | How it forms its probability |
|---|---|
| Fixed baseline | Always 50% |
| Adaptive | The share of rises seen so far, starting from no prior view and updated after every outcome |
| Regime-sensitive | The same, but counted separately after up days and after down days |

After each outcome, every forecast was scored with the Brier score, the adaptive strategies updated their counts, and the next session began. Supabase held the records; Notion held the dashboard, the journal, the hypotheses and the strategy register.

**What it was not.** It was not a simulated agent, and it was not a live deployment. The experiment was executed on 24 November 2026 over historical price inputs in sequential order, so it is not 60 days, or 12 weeks, of live operation. Nor was it a news-driven test of the model's judgement. It used prices only; no news was collected for the period, and no language-model forecasts were made. It also assumed that each day's price was available immediately, which the published series is not, it did not reconstruct what was actually known on each historical date, and the price inputs have not yet been independently re-checked against the source. The experiment's own records say so: *do not present as executable backtest.* What it does test is the machinery: whether memory changes behaviour, whether evaluation can tell change from improvement, and whether governance acts on the difference.

![Notion page extract: Brent Intelligence, Sequential Learning and Live Pilot. 60-session sequential learning experiment. Completed: 60 evaluation sessions, 3 strategies, 180 probability comparisons, 60 outcome-driven reflections. Market observation dates 25 August to 17 November 2026; experiment executed retrospectively on 24 November 2026 using historical price inputs in sequential order; publication delays not reconstructed; not a 12-week live deployment; price provenance not independently revalidated. Mean Brier loss: fixed baseline 0.2500, adaptive frequency 0.2618, prior-direction regime 0.2688. Adaptive loss declined 10.3% between the first and final 20-session blocks, but neither adaptive strategy beat the baseline overall. No promotion. The journal records algorithmic outcome-driven reflections, not independent historical LLM reasoning.](img/compounds/notion-summary.webp)

*Figure 1. The experiment's summary on the workspace's main page. Reproduced from the page's content, retrieved through the Notion connector: the words and numbers are the page's own; the layout is a reproduction, not a screenshot.*

![The agent's dashboard for the 60-session experiment: Brent spot price from late August to 17 November 2026, rising from about $88 to above $130 and falling back to about $93; below it, cumulative Brier loss for the adaptive strategy in teal and the regime-sensitive strategy in amber, both settling slightly above the dashed fixed baseline at 0.25; overall Brier scores fixed 0.2500, adaptive 0.2618, regime 0.2688; and the note that neither adaptive strategy beats the baseline overall, with no promotion and no trading returns claimed.](img/compounds/replay-dashboard.webp)

*Figure 2. The dashboard the agent produced in Notion for the 60-session experiment. Prices above; cumulative Brier loss below, where lower is better and the dashed line is the fixed 50% baseline.*

**What it found.** The results, by block of 20 sessions:

| Sessions | Adaptive | Regime-sensitive | Fixed baseline |
|---|---|---|---|
| 1 to 20 | 0.2774 | 0.2577 | 0.2500 |
| 21 to 40 | 0.2593 | 0.2966 | 0.2500 |
| 41 to 60 | 0.2487 | 0.2521 | 0.2500 |
| All 60 | 0.2618 | 0.2688 | 0.2500 |

The adaptive strategy's loss fell by 10.3% between the first and the last block. It adapted, and its forecasts got better over time. But across the whole period it did worse than simply saying 50% every day, and so did the regime-sensitive strategy. Only in the final block did the adaptive strategy edge below the baseline, by about one thousandth.

![The agent's figure titled learning under changing market conditions: Brier loss by block of 20 sessions, with the adaptive strategy falling from about 0.277 to 0.249, the regime-sensitive strategy rising to about 0.297 in the middle block before falling to 0.252, and the fixed baseline flat at 0.25; headline 10.3% lower loss in the final block than the first; overall adaptive loss 0.2618 against 0.2500 baseline, no promotion, block improvement descriptive and not proof of causal learning.](img/compounds/learning-stages.webp)

*Figure 3. The agent's own summary, prepared for this article. Its caption states the limit plainly: the block improvement is descriptive, not proof of learning.*

The audit trail shows why. With few outcomes counted, the adaptive strategy's probabilities swung widely, from 25% to over 70%, and confident forecasts that turned out wrong were punished hard. On 11 September it said 71% after a run of rises; Brent fell, and that one forecast cost 0.51. As outcomes accumulated, its probabilities settled in the mid-40s, close to the baseline's 50%, and its losses settled close to the baseline's too. Part of its improvement is the market changing; part is the strategy becoming less confidently wrong. Neither is the same as becoming better than a coin.

An initial five-session sequential experiment, run first, showed the same pattern in miniature: after two rises the strategy raised its confidence to 75%, the next day fell, and its loss for the period ended 22.7% *higher* than the baseline's. Single good days are just as misleading in the other direction. The regime-sensitive strategy's best day, 10 September, scored 0.05 against the baseline's 0.25, an 80% improvement for that observation. The agent recorded it as a *selected success, not typical performance*, which is exactly the right label.

**Memory, evaluation and governance.** The experiment produced 60 outcome-driven reflections in the Notion learning journal, one per session. They were generated algorithmically from each session's stored result, not by 60 separate runs of a language model reasoning about each day; the journal says so at the top. A typical entry:

![Notion page extract: Learning Journal, 60 outcome-driven reflections. Note: retrospective, mechanically derived reflections from stored statistical results, not historical LLM reasoning. Session 11, 9 September 2026: before outcome adaptive P(up) 66.7%, regime 75.0%; realised 3.19%; adaptive loss 0.1111 versus 0.2500 baseline; beat baseline; next adaptive probability 69.2%. Session 12, 10 September: adaptive 69.2%, regime 77.8%; realised 10.47%; loss 0.0947; beat baseline; next 71.4%. Session 13, 11 September: adaptive 71.4%, regime 80.0%; realised minus 2.41%; loss 0.5102 versus 0.2500; underperformed baseline, confidence was misplaced; next 66.7%.](img/compounds/notion-journal.webp)

*Figure 4. Three consecutive reflections from the learning journal: two confident wins, then a confident miss that cost almost as much as both had gained. Reproduced from the Notion page.*

Two distinctions matter here. The first is between simulating an agent and executing a learning algorithm: this experiment did the second, so the forecasts, updates and scores are real computations over real observations, not a story about what an agent might have done. The second is between statistical learning and model reflection: the learning here is deterministic, counts updated by arithmetic, and the journal is a record of it, not independent reasoning. Model-generated reflection, of the kind Part 1 designs for, is a separate capability that has not yet been tested.

Evaluation then did its job, and governance acted on it. The strategy register:

![Notion page extract: Strategy History and Promotion Register. Fixed, 50%, Brier 0.2500, retain benchmark. Adaptive V1, expanding Beta(1,1) frequency, 0.2618, not promoted. Regime V2, prior-direction conditional Beta counts, 0.2688, not promoted. V3 proposed, shrink confidence toward 50%, pending, untested. Note: final 20-session V1 loss 0.2487 versus first 20 0.2774; descriptive only; no live strategy changes; all versions evaluated retrospectively except proposed V3.](img/compounds/notion-register.webp)

*Figure 5. The strategy register: two strategies not promoted, a third proposed. Reproduced from the Notion page.*

And the hypotheses that came out of it:

![Notion page extract: Hypotheses and Experiments. H01, accumulated directional frequency beats fixed probability, 0.2618 versus 0.2500, not supported. H02, prior direction improves forecast, 0.2688 versus 0.2500, not supported. H03, shrinkage reduces overconfidence, not tested, proposed. H04, physical supply evidence improves probability forecasts, news not integrated, proposed. Prospective protocol: freeze candidate and baseline, use same cutoff and instrument, minimum 30 paired observations, compare Brier and coverage, require human approval; no claims of statistical significance.](img/compounds/notion-hypotheses.webp)

*Figure 6. Hypotheses, and the protocol for testing them, written down before any test. Reproduced from the Notion page.*

The protocol for testing them was written down before any test: freeze the candidate and the baseline, use the same cutoff and the same instrument, at least 30 paired future observations, compare Brier score and coverage, require human approval, and make no claims of statistical significance.

**Why this is the interesting result.** It would have been easy to report the 10.3% and stop. The architecture would not let that happen. Memory enabled adaptation: the strategy changed its behaviour as experience accumulated. Evaluation established that the change was not yet improvement: against a fixed baseline, on the same days, it lost. Governance decided that it should not be adopted, and the next idea, less confidence rather than more cleverness, follows directly from what the evidence showed. Learning, measurable improvement and authorisation to change behaviour are three different things, and a system that collapses them into one will promote its luckiest guesses.

## The first live forecast

Alongside the 60-session experiment, the pilot recorded its first live forecasts on 24 November: one made by the model using the first strategy as written, and the no-change baseline. There is no adaptive live forecast yet, and neither forecast has been scored. This is what it published.

![Screenshot of the Brent intelligence terminal for 24 November 2026: reference settlement $89.37 for the January 2027 futures contract on 23 November; forecast settlement $88.92 for 25 November, minus 0.50%; probability of upside 43%, labelled judgmental and uncalibrated; a chart of the FRED spot series from 11 to 17 November, labelled as a separate series that is stale for scoring; and an evidence balance listing recovering supply, a Libya pipeline restart and an unconfirmed inventory build as bearish drivers, against Hormuz logistics risk, physical supply vulnerability and reported backwardation as bullish counterweights.](img/compounds/terminal.webp)

*Figure 7. The agent's first forecast, as it appears in Notion. A real output from the experiment, not an illustration.*

Several details are worth reading closely, because they show the design doing its job.

**It chose a precise target, and kept the stale one at arm's length.** The forecast is scored against the settlement of a named contract, ICE Brent January 2027 futures: $89.37 on 23 November, forecast at $88.92 for 25 November, a fall of 0.50%. Naming the contract matters, because ICE's January contract stops trading on the last business day of November and a later contract then becomes the front month. [ICE](https://www.ice.com/products/219/Brent-Crude-Futures) The FRED spot series still appears, but as a separate chart labelled *stale for scored spot forecast*: the agent itself recognised the publication delay that [Part 1](intelligence-that-compounds-1-building-it.html) identified as the design's most important flaw.

**It is honest about its confidence.** The probability of a rise is 43%, labelled *judgmental, uncalibrated*. That is the right label for a first forecast: there is no record yet against which to calibrate it. The Brier score will make the stakes concrete. If Brent falls, the forecast scores 0.43², about 0.18; if it rises, 0.57², about 0.32. A plain 50% scores 0.25 either way, so this forecast beats a coin only if its lean turns out to be right.

**It separates fact from expectation.** The evidence balance lists bearish drivers against bullish counterweights, and marks the expected inventory build as *unconfirmed*. The footer says what the forecast is not: research only, no trade execution, and pending independent verification of the settlement, because the reference price came from news reporting rather than an official feed.

**It still shows how subtle the timing is.** The forecast was frozen at 14:30 UTC on 24 November, but it is measured from the 23 November settlement, so most of a trading day had already happened before the freeze. Some of the move it forecasts may already have been visible. The cleaner version measures from the first settlement *after* the freeze, the one on 24 November. This is exactly the kind of thing the weekly review exists to catch, and a good argument for having one.

![Screenshot of the Brent scenario analysis card: illustrative sensitivities from the $89.37 reference settlement. Bullish supply disruption, plus 3%, $92.05. Neutral balanced market, 0%, $89.37. Bearish supply recovery, minus 3%, $86.69. Recorded central forecast $88.92 for the 25 November 2026 settlement.](img/compounds/scenario-card.webp)

*Figure 8. Scenarios around the forecast. The agent labels them as illustrative sensitivities; only the central forecast is recorded and scored.*

Alongside the forecast, the Scenario and Risk Monitor page shows what plus or minus 3% would mean, and keeps a risk register with a control for each risk: match the January 2027 settlement exactly, against contract mismatch; search for contradictory evidence, against narrative bias; preserve retrieval and observation dates, against publication delay; score probabilities with the Brier score, against overconfidence; and freeze forecasts before the target date, against lookahead. The scenarios are clearly marked as sensitivities, not extra forecasts, which keeps the record honest: one forecast, one score.

The live pilot's Learning Laboratory also records a first research hypothesis from the live analysis, that physical supply recovery may outweigh geopolitical headlines when export flows improve, as proposed, untested and not acted on: on day one, the learning loop is a commitment, not a result.

### What Notion adds

Because the agent's interpretation lives in Notion, the experiment gains things a database alone would not give it.

**It can be shared.** A Notion page can be shared with chosen colleagues or guests at a chosen permission level, or published to the web. [Notion](https://www.notion.com/help/sharing-and-permissions) The research becomes something a team reads, not a file one person keeps.

**It can be discussed where it is written.** Readers can comment on a whole page or on a specific sentence. [Notion](https://www.notion.com/help/comments-mentions-and-reminders) A colleague who doubts the Libya assumption can say so next to it, and the weekly review becomes a conversation in place rather than a meeting about a document.

**It can be questioned.** Notion AI answers questions from the pages in a workspace that the person asking has access to, and follows the workspace's access rules. [Notion](https://www.notion.com/help/notion-ai-faqs) Anyone on the team can ask which hypotheses are waiting for a decision, or what the agent said about inventories last week, without reading every page.

Each of these has a governance edge. Sharing is an access decision: share the dashboards widely, but keep the Decisions page editable by its owner alone. Notion AI answers from Notion, which holds the interpretation; the numbers that count are in Supabase, and a dashboard figure should be checked against them before it is quoted. And Notion's own agent can create and edit pages, which makes it one more writer in the workspace to account for.

## What it means in practice

One forecast proves nothing about Brent. It says a good deal about building systems like this.

**The cost of building has collapsed; the cost of judging has not.** The pilot's database, its workspace, its first forecasts and the 60-session experiment were built by conversation, and a run, from research to forecast to updated Notion pages, completes in about ten minutes. The first prospective evidence worth reading will take eight to twelve weeks, and the most valuable hours in the whole project were spent reviewing a design, not producing one. In an organisation, that changes where AI effort should be budgeted: less on building, more on review, measurement and ownership.

**A capable designer still needs a reviewer.** The live system caught one data problem on its own, the stale spot series, and missed a subtler one, the timing of its reference price. Neither is exotic. Both would have quietly flattered the results. Design review of AI-built systems is real work, and someone has to be accountable for it.

**Honest uncertainty is a feature, and most organisations do not reward it.** A forecast labelled *uncalibrated* at 43% is less impressive on a slide than a confident call, and far more useful. The Brier score rewards the honest version; most management dashboards reward the confident one. An organisation that adopts learning agents has to decide which behaviour it wants, and measure accordingly.

**The agent is a research colleague, not a decision-maker.** It recommends nothing it cannot be scored on, executes nothing, and marks its scenarios as sensitivities rather than additional forecasts. That restraint was designed in, not added afterwards. In an enterprise, the same restraint is what makes decision support auditable.

**Shared work needs access decisions.** Moving the agent's interpretation into Notion turned a private experiment into something a team can read, question and comment on. It also made every sharing setting a decision about who may see, and who may change, what the agent has learned.

**A personal setup has personal limits.** The experiment runs on one person's accounts, with plugins that act with that person's rights, and its scheduled engines are still to come. That is acceptable for an experiment and not for an organisation, which is where the rest of this part goes.

## Extending it to an organisation

Brent is a useful teacher because the market publishes an independent outcome every day. Organisations generate far more experience than that, but it is scattered across email, meetings, chat, the CRM, documents and operational systems, and almost none of it is connected to what happened next.

What would the same architecture look like for a commercial team? This is a proposal, not something I have built. The connections it relies on exist. ChatGPT has connected apps for Outlook email and calendar, Microsoft Teams and Gmail, each limited to what the connected account can already see. [OpenAI](https://help.openai.com/articles/12512241)[OpenAI](https://help.openai.com/articles/12552368)[OpenAI](https://help.openai.com/en/articles/10291617-tasks-in-chatgpt) HubSpot's connector for ChatGPT can answer questions about CRM data, create and update records such as contacts and deals, and log activities, within the user's existing HubSpot permissions. [HubSpot](https://knowledge.hubspot.com/integrations/connect-your-hubspot-account-to-chatgpt)

| Source | What it contributes |
|---|---|
| Email | Customer conversations, objections, commitments |
| Teams | Internal discussion, dependencies, context |
| Calendar | Meetings and engagement history |
| CRM | Opportunities, stages, customers and commercial outcomes |
| Web research | Competitor news, announcements, market developments |
| Empirical memory | Observations, recommendations, actions taken and outcomes |
| Reflective memory | Commercial hypotheses, lessons, briefings |

The aim is not to summarise these systems. It is to learn from the relationships between outside events, internal activity, decisions and eventual outcomes.

A fictional example. An industrial automation company's agent finds that a manufacturer has announced a $50 million production expansion. The CRM shows the manufacturer is an existing customer, with no open automation opportunity. Email from last year shows interest in automated quality inspection. A Teams thread shows the engineering team has just finished a relevant solution. The agent connects the four and recommends that sales open a conversation about quality inspection for the new plant, recording its evidence, assumptions and confidence, exactly as the Brent agent records a forecast.

The sales team decides whether to act. If an opportunity is created, the agent follows it through the CRM until it is won, lost or abandoned, and records the result. Over many such cases it can begin to ask better questions. Which announcements tend to precede real opportunities? Which signals mislead? Which sources see things first? Which recommendations lead to genuine engagement?

One caution matters more than any other. An opportunity being won does not show that the recommendation caused it. The customer may have called anyway. Claims about cause need stronger designs, such as comparison groups or controlled trials, and should be made sparingly.

That caution marks the difference between three levels of learning:

- **Predictive learning:** getting better at saying what will happen. Will Brent rise? Will this deal close? Is this customer relationship deteriorating?
- **Intervention learning:** finding which actions make good outcomes more likely, such as resolving an objection early or involving engineering at the right moment. This needs a record of which recommendations were actually followed, and which were not.
- **Organisational learning:** using validated experience to improve how the organisation itself works: research practices, recurring bottlenecks, escalations that never help, handovers between sales and engineering.

At the third level the system stops being only a tool that performs tasks and becomes a way of understanding how those tasks are done.

```mermaid
flowchart TB
    subgraph EXT["External environment"]
        direction LR
        W["Web research"]
        PUB["Publications and<br/>announcements"]
    end
    subgraph INT["Internal environment"]
        direction LR
        EM["Email and<br/>calendar"]
        TM["Teams"]
        CR["CRM"]
    end
    EXT --> G["Ingest, resolve and add context"]
    INT --> G
    G --> AG["Commercial intelligence agent"]
    AG <--> MEM[("Empirical and reflective memory")]
    AG --> REC["Recommendation for people to decide"]
    REC --> OUT["Business outcome: won, lost or abandoned"]
    OUT --> EV["Evaluate and learn"]
    EV -->|"next cycle"| AG
    EV <--> MEM
```

*Figure 9. The proposed commercial architecture. Internal and external sources converge; recommendations go to people; business outcomes flow back as the evidence for learning.*

*Alt text: Web research and publications from the external environment, and email, calendar, Teams and the CRM from the internal environment, are ingested, resolved and given context. They feed a commercial intelligence agent, which makes recommendations for people to decide on. The business outcome, won, lost or abandoned, goes to evaluation and learning, which feeds the next cycle. The agent and evaluation share empirical and reflective memory.*

### Connecting is not understanding

A connected application gives access to information. It does not establish what the information means, how pieces relate or which to believe.

| Challenge | Example |
|---|---|
| Entity resolution | Linking an email thread to the right customer and the right opportunity |
| Time | Knowing what was known when a recommendation was made |
| Events | Telling an informal remark from a confirmed commitment |
| Duplicates | Recognising one event reported in email, Teams and the CRM |
| Authority | Deciding which system wins when they disagree |
| Outcomes | Telling a reported status from a verified result |
| Boundaries | Respecting existing access rights and confidentiality |
| Untrusted content | Stopping a web page or an email from acting as an instruction |

Every one of these has a Brent equivalent that was easier. A futures contract has one name; a customer may have five. A settlement price is published; a deal's real status is often only in someone's head. The barrier to building has fallen. The questions of evidence and governance have not.

### What changes when it belongs to an organisation

The governance that was a personal discipline in the Brent experiment has to become an organisational one.

**Separate identities.** In the experiment, the agent acts through its owner's accounts, so it could in principle change what its owner approved. In an organisation, the agent needs an identity of its own, and the person who approves its changes needs a different one, as [Whose authority is it acting on?](designing-agency-3-whose-authority.html) describes. Approval that the agent could have given itself is not approval.

**Read first, write later.** Start with read-only access to the information the agent is allowed to see. Messages to customers, CRM updates and anything else with consequences should wait for a person. The tools support this, and sometimes require it: HubSpot notes that records created through its connector bypass custom validation rules, including pipeline stage checks, and recommends setting its write tools to require approval. [HubSpot](https://knowledge.hubspot.com/integrations/connect-your-hubspot-account-to-chatgpt)

**Permissions follow the people, not the agent.** The connected apps work within the access their users already have, which is the right default and also a limit: an agent that learns from one sales manager's mailbox learns from one sales manager's view of the world. Which mailboxes, channels and records feed the learning is a decision for the business, not a side effect of who installed the plugin.

**Owners for the things that matter.** Someone owns the objective, someone owns the scoring, and someone owns the decision to adopt a change, and they should not all be the agent. [When the role is wrong](designing-agency-8-when-the-role-is-wrong.html) argued that agent roles and policies should be treated as changes to be reviewed; strategies a learning agent proposes belong in the same discipline.

**A slower clock.** Brent produces an outcome every day. A sales cycle may take months. Evidence accumulates more slowly, so the temptation to promote a change on a handful of wins is stronger, and the rule for promotion matters more.

The maturity scale from the [prologue](intelligence-that-compounds.html) is a useful way to place an organisation's ambitions. Connecting applications reaches level 2, and level 3, keeping experience, is now easy. Levels 4 and 5, reflecting and adapting on evidence, are what this series has built for one market. Level 6, turning validated experience into knowledge the whole organisation reuses, is where institutional intelligence begins, and it depends less on the agent than on whether the organisation is willing to be measured.

## Intelligence that compounds

Most enterprise systems are designed to record what an organisation does. The question this series has asked is whether we can design systems that help an organisation learn from what it does.

The principle stays the same at every scale. Agency lets an agent act. Observation lets it see its environment. Memory lets it keep experience. Reflection lets it question its understanding. Evaluation establishes whether an improvement is real. Governance decides which improvements it may adopt.

The experiment so far has shown exactly that sequence, on a small scale. Memory enabled adaptation. Evaluation showed that the adaptation was not yet improvement. Governance withheld the promotion. That is a modest result, and the right one: a system that could not reach it would have adopted its luckiest guess.

Building an agent with memory is now straightforward; this one was built by conversation and completes a run in minutes. Building one that can show it improves through experience is a different and harder problem, and most of it is not technical. Connecting more tools gives an agent more information. Designing a learning loop gives it a chance to get better at using that information. The opportunity is not only to build more capable agents, but to build organisations in which intelligence, human and artificial, compounds.

The next steps are the designed ones: scheduled engines, Firecrawl research, forecasts informed by news, and prospective tests of challengers against the baseline on days that have not happened yet. I will report those results here when there are enough of them to mean something, whichever way they point.

:::question
**A question to sit with.** Which decision in your organisation produces an outcome you could record within a month, and who would review what an agent learned from it?
:::

## Sources

- U.S. Energy Information Administration, [*Europe Brent Spot Price FOB*](https://www.eia.gov/dnav/pet/hist/RBRTED.htm), accessed November 2026; republished by FRED as DCOILBRENTEU, the series used in the 60-session experiment.
- ICE, [*Brent Crude Futures*](https://www.ice.com/products/219/Brent-Crude-Futures), contract specification, accessed November 2026.
- Notion, [*Sharing and permissions*](https://www.notion.com/help/sharing-and-permissions), [*Comments, mentions and reactions*](https://www.notion.com/help/comments-mentions-and-reminders) and [*Notion AI FAQs*](https://www.notion.com/help/notion-ai-faqs), accessed November 2026.
- OpenAI Help Center, [*Outlook Email and Calendar apps in ChatGPT*](https://help.openai.com/articles/12512241), [*Microsoft Teams app and setup in ChatGPT*](https://help.openai.com/articles/12552368) and [*Scheduled tasks in ChatGPT*](https://help.openai.com/en/articles/10291617-tasks-in-chatgpt), accessed November 2026.
- HubSpot Knowledge Base, [*Set up and use the HubSpot connector for ChatGPT*](https://knowledge.hubspot.com/integrations/connect-your-hubspot-account-to-chatgpt), accessed November 2026.
- Wikipedia, [*Brier score*](https://en.wikipedia.org/wiki/Brier_score) and [*Walk forward optimization*](https://en.wikipedia.org/wiki/Walk_forward_optimization).
