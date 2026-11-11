---
name: budget-pacing-fix
description: "Use when someone asks if the account will overspend or underspend this month, how to land on the monthly budget, or to move budget to what makes money. Reads the month's pacing and the moves Kunads suggests, shows them, and after a yes queues each daily-budget change in Kunads for a person to approve. Changes nothing in an ad account."
---

# Budget pacing fix

Kunads keeps a monthly budget per account and works out, every morning,
where the month will land and which daily budgets to move: up on campaigns
that make money and run out of budget, down on the ones that do not. This
skill reads that plan, explains it in plain words, and after the person
says yes queues each move with `propose_change`.

Nothing changes in Google Ads or Meta from here. A person approves each
move in Kunads, which then applies it through its safety rails: at most a
20% step, never past the month's budget or a platform's share of it, and
only on fresh data.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
- A monthly budget saved in Kunads for the account. Without one there is
  nothing to pace against.

## Steps

1. **Pick the account.** Call `list_accounts()`. Use the account the person
   named. If they named none, ask which one.

2. **Read the plan.** Call `budget_plan(account)` for this month, or pass
   `month` (YYYY-MM) if the person named one. If `budget` is null, stop:
   say no budget is set for that month and that a person sets it on the
   Campaigns page in Kunads. Queue nothing.

3. **Say where the month lands.** From `lines`, give for each line: the
   budget, `spent`, the 7-day `runRate`, the `projected` month end and
   `needPerDay`, the daily amount that lands on budget. Say plainly whether
   it will overspend, underspend or land, and by how much (projected minus
   budget). Use `summary` as a check, not as the answer.

4. **List the moves.** From `moves`, keep each one's `campaign`, `id`,
   `source`, `from`, `to`, `kind` and `why`. Match each to `campaigns` in
   the same result for `poas_14d` and `capped_by_budget`. If
   `margin_known` is false, say the moves rest on ROAS only, because
   Kunads does not know this account's margin.
   If `moves` is empty, say so and stop. Do not make up moves of your own.

5. **Skip what is already waiting.** Call `proposals(account)`. Drop any
   move that already has a waiting budget proposal on the same campaign,
   and say so.

6. **Show the plan, then Wait for a yes.** Show the table from the output
   format and ask: "Queue these N budget changes for approval in Kunads?"
   Do not call `propose_change` before the person answers. If they change
   an amount, keep it within 20% of `from`; if they ask for more, say
   Kunads takes it in 20% steps and queue the first step.

7. **Queue each move.** For each approved row call
   `propose_change(account, platform, campaign_id, action, daily_budget, why)`
   with `platform` = the move's `source`, `campaign_id` = its `id`,
   `action: "set_budget"` and `daily_budget` = its `to`. Write `why` in one
   or two plain sentences: the month's projection against budget, the
   campaign's 14-day POAS, whether it is capped by budget, and the move's
   own `why`. If a call returns an error, report it word for word and carry
   on.

8. **Report.** List what was queued, what failed and why, and the month's
   projection if every queued move is approved: for each move add
   (`to` - `from`) x days left to the projection, and show that sum.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show.
- Say which tool each figure came from, for example "(budget_plan)".
- If a tool returns nothing or an error, say so and carry on.
- Only queue moves that `budget_plan` returned, or the person's edit of
  one. Do not invent moves.
- Never say a budget was changed. Say it was queued for approval.
- Never queue without the yes in step 6, in this conversation.

## Output format

```
<Account>, <month>. Budget <amount>, spent <spent>, projected <projected> at the 7-day rate (budget_plan).
That is <over/under> by <difference>. To land on budget: <needPerDay> a day for the <days_left> days left.
```

| Campaign | Platform | Daily now | Daily after | Change | POAS 14d | Capped by budget | Why |
| --- | --- | --- | --- | --- | --- | --- | --- |

Then the question from step 6. After queuing:

```
Queued for approval: N. Failed: N. If all are approved the month projects to <new projection>.
Approve them in Kunads: <link>.
```

## Verification checklist

- [ ] Nothing was queued when no budget was set.
- [ ] Every queued move came from `moves`, or is the person's edit of one.
- [ ] Every change is 20% or less of the current daily budget.
- [ ] The person said yes before any `propose_change` call.
- [ ] The new projection shows its arithmetic.
- [ ] The report says "queued for approval", never "changed".

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
