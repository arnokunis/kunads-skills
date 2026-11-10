---
name: money-losing-campaigns
description: "Use when someone asks which campaigns lose money, where the budget leaks, or what to cut. Finds Google and Meta campaigns spending below breakeven on real profit, sizes each loss in money, and says what to do about each one. Reads the Kunads connector only."
---

# Money-losing campaigns

A campaign loses money when the profit on the sales it brings in is smaller
than what it spends. With POAS (profit on ad spend) that line is 1.0. With
ROAS it is the breakeven ROAS, which is 1 divided by the margin. This skill
finds every campaign under that line, says how much it lost, and what to do.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
  Every tool below is read-only. Nothing here changes an ad account.

## Steps

1. **Pick the account.** Call `list_accounts()`. Use the account the person
   named. If they named none, ask which one, or offer to run all of them.

2. **Set the window.** Default to the last 30 complete days: `to` =
   yesterday, `from` = 29 days before. Use the person's window if they gave
   one. Always pass both `from` and `to`.

3. **Get the breakeven line.** Call `account_summary(account, from, to)`.
   From `economics` keep `platform_margin_pct`, `platform_breakeven_roas`,
   `kept_per_order` and `resting_on_assumptions`. Campaign revenue is what
   Google and Meta report (with VAT), so it must clear the `platform_*`
   figures, not `breakeven_roas`. If `economics.ready` is false, stop the
   profit verdicts, list `economics.still_needed`, and only rank campaigns
   by spend and ROAS.
   Also keep `platform_claimed_revenue` and `revenue_the_shop_credits_to_ads`.
   Their ratio is the account's over-claim (platform / shop).

4. **List the campaigns.** Call `campaigns(account, from, to, platform: "all")`.
   For each campaign with `spend` above 0:
   - Below breakeven: `poas` < 1 (the same as `roas` < `platform_breakeven_roas`).
   - Loss on platform figures = `spend` - `revenue` x `platform_margin_pct`.
   - Loss at the shop's rate (estimate) = `spend` - (`revenue` / over-claim)
     x `platform_margin_pct`. Show this second figure only when both shop
     fields in step 3 were present, and label it an estimate.
   - Too little to judge: `spend` below one `kept_per_order`, or
     `conversions` under 3. List these apart, without a verdict.
   If `poas` is null, the margin is unknown for this account: say so.

5. **Cross-check with the 14-day view.** Call `budget_plan(account)`. For
   each losing campaign, find its 14-day profit per euro and whether it
   spends its whole daily budget. A campaign that loses money on both
   windows is a firm finding. One that loses on only one window is a
   "watch".

6. **See what the agents already said.** Call `proposals(account)`. Note any
   proposal that names a losing campaign, with its `rule`, `state` and
   `cfo_says`. Do not repeat a proposal that was declined without saying it
   was declined.

7. **Look inside Meta campaigns.** If any losing campaign is on Meta, call
   `creatives(account, from, to, limit: 40)`. For that campaign, list ads
   with `verdict` "stop" or "fading" and their spend. Check `ad_sets`: an ad
   set under about 5 `conversions_per_week` is too thin for Meta to learn,
   which can be the cause rather than the creative.

8. **Say what to do with each one.** Pick one per campaign and give the
   figure that supports it:
   - **Pause**: below breakeven on both windows, with enough data.
   - **Cut budget**: below breakeven, but some ads or ad sets inside clear it.
   - **Fix, then judge**: a Google search campaign with high `lost_to_rank`
     (rank, not budget, is the limit), or Meta ad sets too thin to learn.
   - **Wait**: too little data, or below breakeven on one window only.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show.
- Say which tool each figure came from, for example "(campaigns)".
- If a tool returns nothing or an error, say so and carry on.
- Brand search often looks profitable because those buyers would have come
  anyway. Do not call it a winner on POAS alone; say the return may be
  overstated.
- Read-only: Kunads changes nothing from here. To act, a person approves
  the matching proposal in the Kunads app (app.kunads.ai), or makes the
  change in Google Ads or Meta.

## Output format

```
<Account>, <from> to <to>. Breakeven: POAS 1.0 = ROAS <platform_breakeven_roas> (account_summary).
Platforms claim N.Nx what the shop credits to ads.

Losing money: <count> campaigns, <total loss> over the window.
```

| Campaign | Platform | Spend | ROAS | POAS | Loss | Loss at shop rate (est.) | 14-day profit per euro | Do |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Then one line per campaign: the action, the figure behind it, and any
waiting proposal that already covers it. End with "Too little to judge" and
"Not known" lists.

## Verification checklist

- [ ] Breakeven used `platform_breakeven_roas` (VAT-inclusive), not `breakeven_roas`.
- [ ] Each loss shows its formula and its source tool.
- [ ] Shop-rate estimates appear only where both shop fields existed, and are labeled.
- [ ] Low-data campaigns are listed apart, without a verdict.
- [ ] Every action names its supporting figure.
- [ ] Nothing claims a change was made.

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
