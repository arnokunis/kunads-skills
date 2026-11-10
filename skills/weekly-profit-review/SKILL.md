---
name: weekly-profit-review
description: "Use when an agency owner or media buyer wants the Monday look at their book: for each ad account, what the last 7 days really earned against what Google and Meta claim, what changed from the week before, and the three actions worth taking first. Reads the Kunads connector only."
---

# Weekly profit review

One pass over every account (or the ones the person names) for the last 7
complete days. For each account: spend, what the platforms claim, what the
shop actually recorded, the profit left after ads, how that moved from the
week before, and the top three actions, each sized in money.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
  Every tool below is read-only. Nothing here changes an ad account.

## Steps

1. **Find the accounts.** Call `list_accounts()`. If the person named
   accounts, match them by name or id. If they did not, review all of them.
   If there are more than 10, say how many there are and ask whether to do
   all of them or a short list.

2. **Set the two windows.** This week: `to` = yesterday, `from` = 6 days
   before that (7 days in total). Last week: the 7 days before `from`.
   Always pass both `from` and `to`. If one is missing, the connector falls
   back to the last 30 days.

3. **Read the headline for both weeks.** For each account call
   `account_summary(account, from, to)` once per window. Keep:
   `ad_spend`, `platform_claimed_revenue`, `shop_recorded_revenue`,
   `shop_orders`, `revenue_the_shop_credits_to_ads`, and from `economics`:
   `margin_pct`, `breakeven_roas`, `platform_margin_pct`,
   `platform_breakeven_roas`, `kept_per_order`, `resting_on_assumptions`.
   Work out, and show the formula next to each:
   - Platform ROAS = `platform_claimed_revenue` / `ad_spend`.
   - Shop ROAS = `revenue_the_shop_credits_to_ads` / `ad_spend`.
   - Over-claim = `platform_claimed_revenue` / `revenue_the_shop_credits_to_ads`.
   - Profit after ads (estimate) = `revenue_the_shop_credits_to_ads` x
     `margin_pct` - `ad_spend`.
   If `economics.ready` is false, do not estimate profit. List
   `economics.still_needed` instead. If the shop fields are null, the
   account has no shop connected: say so and report platform figures only,
   labeled as platform claims.

4. **Put the week in the month.** Call `monthly_profit(account, months: 2)`.
   Report this month's `net_before_tax` so far and last month's. If
   `ad_spend` is null for a month, say the month has no ad data. Never
   treat it as zero.

5. **Find what changed.** Call `campaigns(account, from, to, platform: "all")`
   for both windows. Match campaigns by `id`. List the biggest moves in
   `spend` and in `poas` (largest absolute change first, at most five).
   Note any campaign whose `state` changed, and any Google search campaign
   whose `lost_to_rank` rose.

6. **Check pacing.** Call `budget_plan(account)`. Report spent so far, the
   projected month end and the daily amount that lands on budget. If no
   budget is set, say so.

7. **Read what the agents already proposed.** Call `proposals(account)`.
   Keep the ones still waiting for a decision, with their `rule`, `title`,
   `why` and `cfo_says`. Then call `track_record(account)`. If `judged` is
   0, say there is no measured record yet. Otherwise report how often the
   applied advice met its forecast.

8. **Pick the top three actions per account.** Prefer waiting proposals,
   since a person can approve them in Kunads today. Fill any remaining
   slots from steps 3 to 6 (a campaign below POAS 1, a capped campaign with
   POAS well above 1, pacing far off budget). Size each one in money from
   the tool figures and say how. If fewer than three are supported by the
   data, give fewer.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show.
- Say which tool each figure came from, for example "(account_summary)".
- If a tool returns nothing or an error, say so in that account's section
  and carry on with the rest.
- Campaign `revenue`, `roas` and `poas` are platform figures. Only
  `account_summary` carries what the shop recorded. Do not mix the two
  without saying which is which.
- Read-only: Kunads changes nothing from here. Actions are approved by a
  person in the Kunads app (app.kunads.ai).

## Output format

Start with one table for the whole book:

| Account | Spend | Platform ROAS | Shop ROAS | Profit after ads (est.) | vs last week |
| --- | --- | --- | --- | --- | --- |

Then one section per account, in order of spend:

```
## <Account name>
This week <from> to <to>: spend X, platforms claim Y, shop credits Z to ads.
Over-claim: N.Nx. Profit after ads (est.): P (last week: Q).
Month so far: net before tax R (monthly_profit). Pacing: <budget_plan line>.
What changed: <up to five bullets>
Top actions:
1. <action>, worth about <amount>, because <figure (tool)>.
2. ...
3. ...
Not known: <anything a tool did not return>
```

## Verification checklist

- [ ] Both windows are exactly 7 days and `from` and `to` were passed each time.
- [ ] Every number in the output traces to a named tool call or a shown formula.
- [ ] Profit was only estimated where `economics` was ready.
- [ ] Null months and null shop fields were reported as unknown, not zero.
- [ ] Each action is sized in money or says why it cannot be.
- [ ] Nothing claims a change was made.

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
