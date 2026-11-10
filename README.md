# Kunads agent skills

Free skills for Claude and ChatGPT that read your Google and Meta ads
against your shop's real orders and profit.

Each skill is one page of steps your assistant follows. It calls the Kunads
connector, which answers from figures Kunads has already measured: spend,
what the platforms claim, what the shop actually recorded, margins,
breakeven and the agents' own proposals. The connector is read-only.
Nothing a skill does can change an ad account.

## Hand this page to your agent

1. **Connect Kunads to your assistant.** The server address is
   `https://app.kunads.ai/api/mcp`.
   - **Claude (claude.ai):** Settings, then Connectors, then Add custom
     connector. Name it Kunads, paste the server address, press Connect,
     sign in with your Kunads login and press Allow.
   - **ChatGPT:** Settings, then Connectors, then Create. Paste the server
     address, choose OAuth, sign in with your Kunads login and press Allow.
   - **Claude Code, Claude Desktop, Cursor, n8n:** create a key on the MCP
     page in Kunads (app.kunads.ai/api-keys) and send it as the header
     `Authorization: Bearer <key>`. For Claude Code that is
     `claude mcp add --transport http kunads https://app.kunads.ai/api/mcp --header "Authorization: Bearer <key>"`.
2. **Give your assistant a skill.** Paste the link to a skill's `SKILL.md`
   below, or upload the file, and say "follow this".
3. **Ask.** Start with "Using Kunads, list my accounts". Then, for example,
   "Run the weekly profit review" or "Which campaigns lose money on
   my biggest account?".

The connector is included in every paid Kunads plan and during the free
trial. A workspace on the Free plan gets "The MCP server is part of the
paid plans."

## Skills

<!-- catalog:start -->

| Skill | What your assistant does | Themes |
| --- | --- | --- |
| [Weekly profit review](skills/weekly-profit-review/SKILL.md) | Goes through every account for the last 7 days: what the ads really earned against what Google and Meta claim, what moved since last week, and the three things to do first. | Profit, Agency |
| [Money-losing campaigns](skills/money-losing-campaigns/SKILL.md) | Finds the campaigns that spend more than the profit they bring in, says how much each one lost, and what to do about it. | Profit, Budget |
| [Client report draft](skills/client-report-draft/SKILL.md) | Writes the monthly email for one client in plain words, using only numbers Kunads returned. You read it and send it. | Reporting, Agency |
| [Creative winners](skills/creative-winners/SKILL.md) | Shows which Meta ads and angles actually make money once the product cost is paid, and suggests what to make next. | Creative |

<!-- catalog:end -->

## What every skill promises

- Every number comes from a Kunads tool, or from arithmetic on one that the
  skill shows.
- Each figure says which tool it came from.
- When a tool returns nothing, the skill says so instead of filling the gap.
- Read-only. To act on a finding, a person approves it in Kunads or makes
  the change in Google Ads or Meta.

## For contributors

See [AUTHORING.md](AUTHORING.md). Run `node scripts/check.mjs` before
committing and `node scripts/build-readme.mjs` after changing the catalog.

MIT licensed. Runs on Kunads (kunads.ai): AI agents that check your Google
and Meta ads against real orders and profit. Free to try.
