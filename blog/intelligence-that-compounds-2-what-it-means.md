---
title: Watching a system learn
subtitle: Sixty sessions of decisions, outcomes and adaptations, measured against a baseline that never learns
part: 2
date: 24 November 2026
---

[Part 1](intelligence-that-compounds-1-building-it.html) set out the five responsibilities of a learning system: empirical memory, reflective memory, evaluation, adaptation and governance. This part watches them work together over 60 consecutive trading sessions of Brent crude oil, from a system that has seen nothing to one that has made 180 scored forecasts, written 60 reflections, and decided that its own best strategy is not yet good enough to adopt.

The story is told in eight stages, because that is how the learning unfolded: starting without experience, building confidence, making confident predictions, meeting failure, updating, measuring, comparing with a baseline, and finally rejecting a strategy and choosing the next experiment. At each significant moment the record shows the same five things: the experience the system had, the decision it made, what happened, how the decision was evaluated, and what changed next.

## How the experiment worked

A learning algorithm was executed over 60 trading sessions of Brent spot prices, from 25 August to 17 November 2026, one session at a time and in order. [EIA](https://www.eia.gov/dnav/pet/hist/RBRTED.htm) Before each session's outcome was read, three strategies each stated the probability that the price would rise. The outcome was then read, every forecast was scored, and the two learning strategies updated what they knew. Nothing was decided with hindsight: each forecast used only the sessions before it.

| Strategy | How it forms its probability |
|---|---|
| Fixed baseline | Always 50%. It never learns, which is what makes it the measure of whether learning helped. |
| Adaptive | The share of rises seen so far, starting from no prior view and updated after every outcome |
| Regime-sensitive | The same, but counted separately for sessions that followed a rise and sessions that followed a fall |

Every forecast was scored with the Brier score, which rewards honest confidence: a forecast of 80% that turns out wrong scores 0.64, while always saying 50% scores 0.25. Lower is better. [Wikipedia](https://en.wikipedia.org/wiki/Brier_score) In all, the experiment produced 60 evaluation sessions, 180 forecast comparisons and 60 outcome-driven reflections. Supabase held the records; Notion held the dashboard, the learning journal, the hypotheses and the strategy register.

The algorithm was run on 24 November over the historical price series, so the 60 sessions describe the order of learning, not 60 days of live operation. Because the price was the only input, the experiment isolates one form of learning: statistical adaptation from scored outcomes. The [technical appendix](#technical-appendix) sets out the implementation status and the methodological limits.

It was built this way for a reason. A broader monitoring workflow had been watching Brent on a schedule for seven weeks, and had produced plenty of analysis, but very little of it in a form that could later be checked against what happened. Seven weeks of commentary had produced memory of a kind, and almost nothing to learn from. This experiment was designed so that every decision would be recorded before its outcome, and every outcome would be scored.

![The agent's dashboard for the 60-session experiment: Brent spot price from late August to 17 November 2026, rising from about $88 to above $130 and falling back to about $93; below it, cumulative Brier loss for the adaptive strategy in teal and the regime-sensitive strategy in amber, both settling slightly above the dashed fixed baseline at 0.25; overall Brier scores fixed 0.2500, adaptive 0.2618, regime 0.2688; and the note that neither adaptive strategy beats the baseline overall, with no promotion and no trading returns claimed.](img/compounds/replay-dashboard.webp)

*Figure 1. The dashboard the system produced in Notion. Prices above; cumulative Brier loss below, where the dashed line is the fixed 50% baseline.*

The whole story is visible in one chart: how confident each learning strategy was, session by session, against what actually happened.

![Line chart of the probability of a rise stated before each of 60 sessions, from 25 August to 17 November 2026. The adaptive strategy, in blue, starts at 50%, dips to 25% after two falls, climbs steadily to about 71% during a run of rises in early September, then declines gradually through October and settles around 44% by mid-November. The regime-sensitive strategy, in orange, follows a much more volatile path: it peaks at 77.8% on 10 September, when Brent rose 10.5%, and 80% on 11 September, when Brent fell 2.4%, then swings repeatedly between about 36% and 75%, ending around 40%; on 4 November it stood at 41.4% and Brent fell 14.2%, and on 5 November at 40% and Brent rose 6.7%. A dashed line marks the fixed 50% baseline. A strip below marks each session's outcome as a rise or a fall. The three blocks of 20 sessions are labelled with the adaptive strategy's mean Brier loss: 0.277, 0.259 and 0.249, against 0.250 for the baseline.](img/compounds/exp-confidence.webp)

*Figure 2. Confidence over time, computed from the 60 stored session records. The adaptive strategy learns slowly and settles; the regime-sensitive strategy learns quickly and never settles.*

## 1. Starting without experience

On 25 August both learning strategies knew nothing, so both said 50%, exactly like the baseline. Brent fell. With one fall in memory, the adaptive strategy said 33.3% the next day; Brent fell again. With two falls in memory, it said 25%. Brent rose 2.75%, and that one forecast scored 0.5625, more than twice the baseline's 0.25.

This is the first lesson, and it is visible on the left of Figure 2: a strategy with almost no experience swings hardest. Two observations had moved its view further from 50% than it would ever move again.

## 2. Building confidence through observed outcomes

Between 1 and 10 September Brent rose in eight consecutive sessions. The adaptive strategy, counting every outcome, moved steadily with it: 33.3% before the run began, 50% after two rises, 60% after four, and 69.2% on 10 September, by which point it had seen 8 rises in 11 sessions. The regime-sensitive strategy, counting only what had followed a rise, moved faster.

This is learning in its plainest form. Nothing about the strategies changed; their experience did, and their decisions changed with it. Each step in Figure 2 is the direct consequence of one more recorded outcome.

## 3. Making increasingly confident predictions

By 10 September, Brent had risen in six of the seven sessions that followed a rise. The regime-sensitive strategy therefore put the chance of another rise at 77.8%, the most confident forecast it had made. Brent rose 10.47%, its largest move of the period. The forecast scored 0.049 against the baseline's 0.25: the best single result in the experiment.

## 4. Meeting failure and reversal

The next day, with seven rises in the eight sessions that had followed a rise, the regime-sensitive strategy raised its confidence to 80%. Brent fell 2.41%. That forecast scored 0.64, the worst result in the experiment, giving back the previous day's gain almost twice over. The adaptive strategy, at 71.4%, lost almost as heavily: 0.51.

| | 10 September | 11 September |
|---|---|---|
| Previous experience | Six rises in the seven sessions after a rise | Seven rises in the eight sessions after a rise |
| Decision | 77.8% chance of a rise | 80.0% chance of a rise |
| Observed outcome | Brent rose 10.47% | Brent fell 2.41% |
| Evaluation | Brier 0.049 against the baseline's 0.25: supported | Brier 0.64 against 0.25: confidence misplaced |
| Subsequent change | Confidence raised to 80% | Its next forecast fell to 50% |

![Case A, learning a rising trend: the experiment price rises from about $104 on 7 September to a peak near $121 and falls to $118.06 on 11 September. On 10 September the probability of an increase was 77.8% and the outcome was plus 10.47%, prediction supported. On 11 September the probability of an increase was 80.0% and the outcome was minus 2.41%, prediction failed.](img/compounds/exp-case-a.webp)

*Figure 3. Case A, the regime-sensitive strategy on 10 and 11 September: supported, then failed at the reversal.*

The learning journal recorded each of these sessions as it happened: the probability before the outcome, the realised move, the loss against the baseline, and the probability the strategy would carry into the next session.

![Notion page extract: Learning Journal, 60 outcome-driven reflections. Note: retrospective, mechanically derived reflections from stored statistical results, not historical LLM reasoning. Session 11, 9 September 2026: before outcome adaptive P(up) 66.7%, regime 75.0%; realised 3.19%; adaptive loss 0.1111 versus 0.2500 baseline; beat baseline; next adaptive probability 69.2%. Session 12, 10 September: adaptive 69.2%, regime 77.8%; realised 10.47%; loss 0.0947; beat baseline; next 71.4%. Session 13, 11 September: adaptive 71.4%, regime 80.0%; realised minus 2.41%; loss 0.5102 versus 0.2500; underperformed baseline, confidence was misplaced; next 66.7%.](img/compounds/notion-journal.webp)

*Figure 4. Three consecutive reflections from the learning journal: two confident wins, then a confident miss that cost almost as much as both had gained. Reproduced from the Notion page.*

The lesson of Case A is the central tension of learning from experience. Accumulated evidence improved trend recognition, and the same evidence built excessive confidence just before the reversal.

## 5. Updating subsequent predictions

What a system does after a failure shows how it learns, and the two strategies learned very differently.

The adaptive strategy carried its whole history with it. After the fall on 11 September it lowered its view only a little, to 66.7%, because one fall barely changes a record of nine rises in thirteen sessions. It then repeated the September pattern on a smaller scale: 68.8% and right on 15 September, 70.6% and wrong on 16 September. When Brent then fell in five consecutive sessions, from 16 to 22 September, the adaptive strategy kept saying a rise was more likely than not, from 70.6% down to 57.1%, and lost against the baseline every time. Its memory was stable, and therefore slow.

The regime-sensitive strategy reacted at once. After each fall it consulted only what had followed earlier falls, so through the same five sessions its view dropped from 75% to 40%, and it lost less. But speed cut both ways: at 36.4% on 23 September it was caught by a rebound, and it went on to swing between about 40% and 71% for the rest of the experiment, as Figure 2 shows.

November tested both again. Brent had fallen from about $120 at the end of October.

| | 4 November | 5 November |
|---|---|---|
| Previous experience | A falling market; the adaptive strategy had seen 23 rises in 50 sessions | One more fall recorded |
| Decision | Regime-sensitive: 41.4% chance of a rise, so 58.6% for a fall. Adaptive: 46.2% | Regime-sensitive: 40.0%, so 60% for a fall. Adaptive: 45.3% |
| Observed outcome | Brent fell 14.19% | Brent rebounded 6.66% |
| Evaluation | Both beat the baseline: 0.171 and 0.213 against 0.25 | Both lost: 0.36 and 0.299 against 0.25 |
| Subsequent change | Both leaned further towards a fall | Both moved back towards 50%, the regime-sensitive strategy past it to 52% |

![Case B, adapting to a declining market: the experiment price falls from about $120 on 30 October to about $92 and rebounds to $97.96 on 5 November. On 4 November the probability of a decline was 58.6% and the outcome was minus 14.19%, prediction supported. On 5 November the probability of a decline was 60.0% and the outcome was plus 6.66%, prediction failed.](img/compounds/exp-case-b.webp)

*Figure 5. Case B, the regime-sensitive strategy on 4 and 5 November: supported, then failed at the rebound.*

Case B shows a system that has learned something real. By November the adaptive strategy's probabilities sat in the mid-40s, close to the share of sessions in which Brent had actually risen, 27 of 60, or 45%. Its forecasts were far less extreme than in September, so its wins were smaller and its losses much smaller. It had learned the base rate of the market it was watching. The regime-sensitive strategy had adapted to falling prices too, and remained exposed to a sudden rebound.

These are selected sessions, chosen because they show the mechanism clearly. The measurements that follow cover all 60.

## 6. Measuring across learning stages

Whether a system has learned is a question about its decisions over time, so the sessions were grouped into three stages of 20 and measured as mean Brier loss.

![The experiment's summary figures: 60 sessions evaluated, 180 forecast comparisons, 60 learning iterations, and a 10.3% reduction in adaptive loss from the first to the final block. Forecast performance against the fixed baseline: the adaptive strategy was better in 28 sessions, worse in 27 and tied in 5; the regime-sensitive strategy was better in 23, worse in 27 and tied in 10.](img/compounds/exp-counts.webp)

*Figure 6. The experiment in numbers, computed from the 60 stored session records.*

| Sessions | Adaptive | Regime-sensitive | Fixed baseline |
|---|---|---|---|
| 1 to 20 | 0.2774 | 0.2577 | 0.2500 |
| 21 to 40 | 0.2593 | 0.2966 | 0.2500 |
| 41 to 60 | 0.2487 | 0.2521 | 0.2500 |
| All 60 | 0.2618 | 0.2688 | 0.2500 |

The adaptive strategy improved at every stage. Its loss fell by 10.3% from the first block to the last, from 9 sessions better than the baseline and 9 worse in the first 20, to 10 better and 8 worse in the last 20. In the final block its loss of 0.2487 was 0.5% below the baseline's. The regime-sensitive strategy showed no such progression: its worst stage was the middle one.

![Chart of adaptive prediction loss over time: the adaptive strategy's Brier loss falls from about 0.277 in sessions 1 to 20 to 0.24873 in sessions 41 to 60, crossing just below the fixed baseline's flat 0.25. Below it, a table: better than baseline 9 in the first 20 and 10 in the last 20; worse 9 and 8; tied 2 and 2; mean prediction loss 0.2774 and 0.2487.](img/compounds/exp-loss-over-time.webp)

*Figure 7. The adaptive strategy's loss over the three stages. It started well above the baseline and ended marginally below it.*

The record also shows whether confidence was earned. In the ten sessions where the regime-sensitive strategy was at least 65% sure of a rise, averaging 72.6%, Brent rose six times: 60%. In the nine sessions where the adaptive strategy put a rise below 45%, averaging 39.1%, Brent rose six times. Confidence ran ahead of the evidence in both directions, and the Brier score charged for it.

## 7. Comparing with the fixed baseline

The improvement is real, and it is not yet enough. Session by session, the adaptive strategy beat the fixed baseline 28 times, did worse 27 times and tied 5 times. The regime-sensitive strategy beat it 23 times, did worse 27 times and tied 10 times. Across all 60 sessions, the adaptive strategy's loss was 4.7% higher than simply saying 50% every day, and the regime-sensitive strategy's was 7.5% higher. Neither learning strategy beat the baseline overall.

Two things explain the gap. Much of the adaptive strategy's improvement came from becoming less confidently wrong, converging on a base rate close to 50%, which is exactly where the baseline started. And in a market that moved from $88 to above $130 and back to $93 in twelve weeks, the past frequency of rises was a poor guide to the next session. The adaptive strategy learned what there was to learn from prices alone; the baseline shows that it was not much.

It matters what kind of learning this was. The strategies learned statistically: deterministic updates of counted outcomes, with no language model in the loop. That is genuine learning, the kind that can be reproduced to the last decimal from the records, and every adaptive probability in this experiment can be. The 60 reflections in the journal were derived from those records, not written by a model reasoning about each day, and the journal says so at the top. Model-generated reflection, in which a language model interprets outcomes and proposes changes to its own strategy, is the next layer of the reference design. This experiment establishes the foundation it needs: a record in which any claimed improvement can be checked.

## 8. Rejecting an insufficient strategy and choosing the next experiment

Evaluation established that adaptation had not yet become improvement, and governance acted on it. The fixed baseline was retained. The adaptive strategy was not promoted, but stays under test, because it was improving. The regime-sensitive strategy was not promoted.

![Overall strategy evaluation over all 60 sessions, as mean Brier loss: fixed baseline 0.2500, adaptive strategy 0.2618, regime-sensitive strategy 0.2688. Governance decisions: fixed baseline, retain; adaptive strategy, continue testing; regime-sensitive strategy, do not promote; confidence-adjusted strategy, proposed experiment.](img/compounds/exp-governance.webp)

*Figure 8. The overall evaluation and the decisions it led to. Neither learning strategy is promoted; one stays under test, and a new experiment is proposed.*

The next experiment follows directly from stages 4 and 5. Both strategies lost most heavily when they were most confident, so the proposal is a confidence-adjusted strategy that pulls probabilities towards 50% until enough evidence has accumulated to justify moving away from it. The hypotheses, and the protocol for testing them, were written down before any test.

![Notion page extract: Hypotheses and Experiments. H01, accumulated directional frequency beats fixed probability, 0.2618 versus 0.2500, not supported. H02, prior direction improves forecast, 0.2688 versus 0.2500, not supported. H03, shrinkage reduces overconfidence, not tested, proposed. H04, physical supply evidence improves probability forecasts, news not integrated, proposed. Prospective protocol: freeze candidate and baseline, use same cutoff and instrument, minimum 30 paired observations, compare Brier and coverage, require human approval; no claims of statistical significance.](img/compounds/notion-hypotheses.webp)

*Figure 9. Hypotheses and the testing protocol, recorded before any test. Reproduced from the Notion page.*

The protocol is the same for every candidate: freeze the candidate and the baseline, use the same cutoff and the same instrument, collect at least 30 paired future observations, compare Brier score and coverage, and require human approval before anything changes. Because each new test runs forward on dates that did not exist when it began, it is walk-forward evaluation, the standard defence against strategies that merely fit the past. [Wikipedia](https://en.wikipedia.org/wiki/Walk_forward_optimization)

## What the experiment demonstrates

It would have been easy to report the 10.3% and stop. The architecture would not let that happen.

**Memory enabled adaptation.** Every decision was recorded before its outcome, so experience could accumulate and change the next decision. Figure 2 is that change, made visible.

**Evaluation separated adaptation from improvement.** The adaptive strategy got better at every stage; measured against a baseline that never learned, on the same sessions, it was still not good enough.

**Governance decided what to keep.** Neither strategy was adopted, one stays under test, and the next idea, less confidence rather than more cleverness, came directly from the evidence.

Learning, measurable improvement and authorisation to change behaviour are three different things, and a system that collapses them into one will promote its luckiest guesses. That is the series' thesis in practice: intelligence compounds when experience is preserved, subsequent decisions are informed by that experience, outcomes are independently evaluated, and adaptations are subjected to governance.

> Learning is not simply the accumulation of experience. It is the ability to measure whether experience improves decisions, and to reject the adaptations that do not.

[Part 3](intelligence-that-compounds-3-organisations.html) asks what that means for an organisation, where the decisions are commercial, the outcomes take months, and the question of who approves a change has real consequences.

## Technical appendix

**Implementation status.** Implemented and tested: Supabase as empirical memory, with seven of the ten designed tables, two of them for the learning experiments; Notion as reflective memory, with the dashboard, learning journal, hypotheses, strategy register and governance pages; the 60-session sequential learning experiment, with scoring, reflections, strategy comparison and governance decisions; and a manual test of recording live forecasts, which produced the first forecasts on 24 November, not yet scored and not part of this analysis. Designed, not yet implemented: the scheduled engines running unattended, Firecrawl research acquisition, the remaining three tables, forecasting and strategy revision informed by news and the model, automated recording of the monitoring workflow's views, and prospective champion and challenger testing.

**Methodological limitations.**

- The experiment was executed on 24 November 2026 over the historical series DCOILBRENTEU, the EIA price republished by FRED, in sequential order. It does not reconstruct what was known on each historical date: EIA publishes the series with a delay, and the experiment assumed each price was available immediately.
- The price inputs have not yet been independently re-checked against the source.
- Prices were the only input. No news was collected for the period and no language-model forecasts were made, so the experiment says nothing about the value of research or model judgement.
- Sixty sessions is a small sample, and market sessions are not independent of one another. No claim of statistical significance is made.
- Cases A and B are illustrations of the mechanism, not independent tests of it.
- The results are forecasting scores, not investment performance, and nothing here is investment advice.

:::question
**A question to sit with.** Which of your AI systems could show you, today, the difference between adapting and improving?
:::

## Sources

- U.S. Energy Information Administration, [*Europe Brent Spot Price FOB*](https://www.eia.gov/dnav/pet/hist/RBRTED.htm), accessed November 2026; republished by FRED as DCOILBRENTEU, the series used in the experiment.
- Wikipedia, [*Brier score*](https://en.wikipedia.org/wiki/Brier_score) and [*Walk forward optimization*](https://en.wikipedia.org/wiki/Walk_forward_optimization).
