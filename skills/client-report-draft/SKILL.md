---
name: client-report-draft
description: "Use when an agency needs the monthly email or short report for one client: what the ads spent, what they really brought in, what changed and what comes next, in plain language. Every number comes from the Kunads connector. Drafts only; a person reviews and sends it."
---

# Client report draft

A short monthly email a client can read in a minute. Plain words, the few
numbers that matter, and nothing the tools did not return. The numbers and
their sources go in a separate list for the account manager, not in the
email.

## Needs

- The Kunads MCP connector, connected and signed in (see the README).
  Every tool below is read-only. Nothing here changes an ad account or
  sends an email.

## Steps

1. **Ask which client.** If the person did not name one, ask. Call
   `list_accounts()` and match the name. Also ask, or use these defaults:
   the month (default: last complete month), the recipient's first name,
   the language, and the sender's name.

2. **See what the client already receives.** Call `reports(account)`. If a
   saved report exists, note its `title`, `period`, `recipients` and
   whether it `has_client_link`. If it has a client link, the email can
   point to it. Do not send anything.

3. **Get the month's profit.** Call `monthly_profit(account, months: 3)`.
   Keep the reported month and the one before: `revenue`, `gross_profit`,
   `ad_spend`, `fixed_costs`, `net_before_tax`. If `ad_spend` is null, the
   month has no ad data: say so in the notes and leave profit out of the
   email.

4. **Get the month's ads against the shop.** With `from` = the 1st and
   `to` = the last day of the month, call `account_summary(account, from, to)`.
   Do the same for the month before. Keep `ad_spend`,
   `revenue_the_shop_credits_to_ads`, `shop_orders` and
   `shop_average_order_value`. If the shop fields are null, use the
   platform figures and call them "what Google and Meta report".

5. **Find the campaigns worth naming.** Call
   `campaigns(account, from, to, platform: "all")` for the month. Name at
   most three: the biggest by spend, and any that clearly carried or hurt
   the month on `poas`.

6. **Find what worked in the ads.** Call `creative_evidence(account, days: 30)`.
   Take one or two winning ads and, in a few words, what they said. If the
   tool lists something as not measured, do not describe it.

7. **Say what was done and what comes next.** Call `track_record(account)`
   for changes that were applied and measured in the month, and
   `proposals(account)` for what is waiting. Call
   `budget_plan(account, month: "YYYY-MM")` for the reported month to say
   whether spend landed on budget. Only mention a change as done if the
   tools show it was applied.

8. **Write the draft.** 120 to 220 words. Greeting, three or four short
   paragraphs (how the month went, what drove it, what was changed, what
   is next), sign-off. Round money to whole units. At most five numbers in
   the body. No tables, no jargon (write "return on ad spend" once, then
   "return"). If the month was bad, say so plainly with the reason the
   data shows.

## Rules

- Never invent a number. Every figure comes from a tool result or from
  arithmetic on tool results that you show in the notes.
- Say which tool each figure came from, in the notes under the draft.
- If a tool returns nothing or an error, say so in the notes and leave
  that topic out of the email rather than guessing.
- Never promise results. "We expect" only where a proposal or the track
  record gives a forecast, and name it as a forecast.
- Read-only: Kunads changes nothing and sends nothing from here. A person
  reads, edits and sends the email.

## Output format

```
Subject: <Client>, <Month> results

<email body>

---
Notes for you (not for the client)
- <figure>: <value> (<tool>, <window>)
- ...
- Not available: <anything a tool did not return>
- Saved report: <title, recipients, client link yes/no> (reports)
```

## Verification checklist

- [ ] The client and month were confirmed, not assumed silently.
- [ ] Every number in the email appears in the notes with its tool.
- [ ] Profit is left out where `ad_spend` was null.
- [ ] Platform figures are named as platform figures.
- [ ] No change is described as done unless `track_record` or `proposals` shows it applied.
- [ ] The email is under 220 words and has no tables.

---

Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.
