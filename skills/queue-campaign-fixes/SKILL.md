---
name: queue-campaign-fixes
description: "Use when someone says pause the losers, fix the campaigns that lose money, cut the budget on what doesn't pay, or act on the money-losing list. Finds Google and Meta campaigns below breakeven on real profit, shows the plan, and after a yes queues each pause or budget cut in Kunads for a person to approve. Changes nothing in an ad account."
---

# Queue campaign fixes

This skill turns a money-losing campaign list into changes waiting for
approval. It finds the campaigns below breakeven, picks pause or a budget
cut for each one, shows that plan in the chat, and only after the person
says yes puts each change into the account's Kunads approval queue with
`propose_change`.

Nothing changes in Google Ads or Meta from here. A person presses Approve
in Kunads, and Kunads then applies the change through its own safety rails:
brand protection, at most a 20% budget step, the month's cap, and fresh
data. Each applied change has a receipt and an undo.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
- Permission to queue proposals on the account. Reading tools work for
  anyone in the workspace.

## Steps

1. **Pick the account.** Call `list_accounts()`. Use the account the person
   named. If they named none, ask which one. Run one account at a time.

2. **Set the window.** Default to the last 30 complete days: `to` =
   yesterday, `from` = 29 days before. Always pass both `from` and `to`.

3. **Get the breakeven line.** Call `account_summary(account, from, to)`.
   Keep `economics.platform_breakeven_roas`, `platform_margin_pct` and
   `kept_per_order`. If `economics.ready` is false, stop here: say Kunads
   does not know this account's margin yet, list `economics.still_needed`,
   and queue nothing. Without a margin there is no honest loss figure.

4. **List the campaigns.** Call `campaigns(account, from, to, platform: "all")`.
   Keep each campaign's `id`, `name`, `platform`, `state`, `daily_budget`,
   `spend`, `revenue`, `roas`, `poas` and `conversions`. A campaign is a
   candidate when `state` is "live", `spend` is above 0 and `poas` < 1.
   - Loss = `spend` - `revenue` x `platform_margin_pct`.
   - Too little to judge: `spend` below one `kept_per_order`, or
     `conversions` under 3. These are never queued.

5. **Check the 14-day view.** Call `budget_plan(account)`. Find each
   candidate's `poas_14d` and `capped_by_budget`. A candidate that is also
   below 1.0 on 14 days is firm. One that clears 1.0 on 14 days is a
   "watch" and is not queued.

6. **Skip what is already waiting.** Call `proposals(account)`. Drop any
   candidate that already has a waiting proposal of the same kind, and say
   so. If the same change was declined before, show the decline and leave
   it out unless the person asks for it again.

7. **Pick one change per firm candidate.**
   - **Pause**: below breakeven on both windows and no part of it clears
     breakeven, or the loss over the window is above two `kept_per_order`.
   - **Cut budget by 20%**: below breakeven on both windows but close
     (POAS 0.7 or more), or `capped_by_budget` is false and it spends
     less than its budget anyway. New budget = `daily_budget` x 0.8,
     rounded to whole euros. Kunads blocks steps above 20%, so never
     propose a bigger cut in one go.
   - A campaign with no `daily_budget` (Meta budgets set on the ad sets)
     cannot take a budget cut from here: offer a pause or point to the
     Campaigns page in Kunads.
   - Brand search: never propose a pause. Buyers who search the brand
     often come anyway, so its POAS is not a fair test. List it apart.

8. **Show the plan, then Wait for a yes.** Show the table from the output
   format and ask: "Queue these N changes for approval in Kunads?" Do not
   call `propose_change` before the person answers. If they drop or change
   rows, use their version.

9. **Queue each change.** For each approved row call
   `propose_change(account, platform, campaign_id, action, daily_budget, why)`
   with `action: "pause"` or `action: "set_budget"` and the new
   `daily_budget` for budget cuts. Write `why` in one or two plain
   sentences with the figures: window, spend, POAS on both windows, loss,
   and the source tools. The approver reads it.
   If a call returns an error, report it word for word and carry on with
   the next row.

10. **Report.** List what was queued, what failed and why, and what was
    left out. Give the Kunads link the tool returned, so the person can
    approve.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show.
- Say which tool each figure came from, for example "(campaigns)".
- If a tool returns nothing or an error, say so and carry on.
- Never say a change was made. Say it was queued for approval. Nothing
  changes in an ad account until a person approves it in Kunads.
- Never queue without the yes in step 8, in this conversation.
- At most a 20% budget step per proposal.

## Output format

```
<Account>, <from> to <to>. Breakeven: POAS 1.0 = ROAS <platform_breakeven_roas> (account_summary).
Plan: N changes, together losing <total loss> over the window.
```

| Campaign | Platform | Spend | POAS 30d | POAS 14d | Loss | Change | New daily budget |
| --- | --- | --- | --- | --- | --- | --- | --- |

Then "Left out" (watch, too little data, brand, already waiting), and the
question from step 8. After queuing:

```
Queued for approval: N. Failed: N. Approve them in Kunads: <link>.
```

## Verification checklist

- [ ] Nothing was queued when `economics.ready` was false.
- [ ] Every queued row was below breakeven on both windows with enough data.
- [ ] The person said yes before any `propose_change` call.
- [ ] Every budget cut is 20% or less, from the campaign's own `daily_budget`.
- [ ] No brand search campaign was proposed for a pause.
- [ ] Every `why` carries its figures and sources.
- [ ] The report says "queued for approval", never "changed" or "paused".

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
