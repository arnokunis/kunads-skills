---
name: creative-winners
description: "Use when someone asks which Meta ads or angles actually make money, why some ads stopped working, or what creative to make next. Ranks ads on profit, not clicks, groups them by angle, and proposes a few next concepts built on the evidence. Reads the Kunads connector only."
---

# Creative winners

Which ads earn more than they cost once the product margin is paid for,
which angles keep winning, and what to make next. Meta only: the
`creatives` and `creative_lab` tools cover Meta ads.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
  Every tool below is read-only. Nothing here changes an ad account or
  adds anything to the Creative lab.

## Steps

1. **Pick the account.** Call `list_accounts()` and use the account the
   person named. If they named none, ask which one.

2. **Set the window.** Default to the last 30 complete days: `to` =
   yesterday, `from` = 29 days before. Always pass both.

3. **Get the margin.** Call `account_summary(account, from, to)`. Keep
   `economics.platform_margin_pct` and `economics.kept_per_order`. If
   `economics.ready` is false, rank ads by revenue per euro spent only, and
   say the profit view needs `economics.still_needed`.

4. **Rank the ads.** Call `creatives(account, from, to, limit: 40)`. For each
   ad: profit after ad cost = `revenue` x `platform_margin_pct` - `spend`.
   Sort by that figure. Keep `verdict`, `because`, `frequency`,
   `hook_rate` and `hold_rate`. Treat ads with `verdict` "early" as not yet
   judged. Check `ad_sets`: ads in an ad set under about 5
   `conversions_per_week` are on thin data; say so beside them.

5. **Read the words that won.** Call `creative_evidence(account, days: 90)`.
   Take the winning ads and the words they used, the ads Meta stopped
   funding, the products that actually sold, and the typical frequency.
   Copy its "not measured" list into your output as unknowns.

6. **Read what the lab has learned.** Call `creative_lab(account)`. From the
   `ledger`, list which angles, desires, awareness stages and buyers have
   won or lost on this account. From `concepts`, note any already tested
   with a verdict of kill, keep, graduate or iterate, so the next batch does
   not repeat them.

7. **Name the pattern.** In two or three sentences: what the money-making
   ads have in common (angle, product, hook, format), backed by the figures
   from steps 4 to 6. If the evidence is thin, say that instead.

8. **Propose what to make next.** Three or four concepts, no more. Each one:
   the angle, the buyer it speaks to, the product (from the products that
   sold), a first line, and the evidence it builds on (a named winning ad
   or a ledger row). No two concepts may differ only in wording. Do not
   reuse an angle the ledger shows lost unless you say why this time is
   different.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show.
- Say which tool each figure came from, for example "(creatives)".
- If a tool returns nothing or an error, say so. If the account has no
  Meta ads, say this skill does not apply and stop.
- High click-through or hook rate is not a win on its own. A winner makes
  money after the margin.
- Read-only: Kunads changes nothing from here. To test a concept, a person
  adds it in the Creative lab in the Kunads app (app.kunads.ai).

## Output format

```
<Account>, Meta ads, <from> to <to>. Margin used: <platform_margin_pct> (account_summary).
```

| Ad | Campaign | Spend | Revenue | Profit after ad cost | Verdict | Hook rate | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |

Show the top 5 and the bottom 5. Then:

- **What wins here**: the pattern, with figures.
- **What the ledger says**: angles won and lost (creative_lab).
- **Make next**: the three or four concepts, each with its evidence.
- **Not known**: the not-measured list and any empty tool results.

## Verification checklist

- [ ] Ads are ranked on profit after ad cost, with the margin and its source shown.
- [ ] "Early" ads and thin ad sets are marked, not judged.
- [ ] Every proposed concept cites a winning ad or a ledger row.
- [ ] No concept repeats a lost angle without a stated reason.
- [ ] The not-measured items are listed as unknown.
- [ ] Nothing claims anything was added or changed.

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
