# Writing a skill

Notes for whoever adds or edits a skill. The README is for the people who
use the skills; keep it short and plain.

## Layout

```
skills/<name>/SKILL.md   the runbook the assistant follows
index.json               machine catalog: name, version, path, summary, keywords
catalog-copy.json        the title and one-line pitch shown in the README
connector.json           the Kunads connector's tools and their inputs
scripts/build-readme.mjs rewrites the README table between the catalog markers
scripts/check.mjs        checks tool names, inputs, frontmatter and JSON
```

## A SKILL.md

- Frontmatter has `name` and `description`. `name` equals the folder name.
  `description` says when to use the skill, in the words a person would
  type, and that it reads the Kunads connector.
- Sections, in this order: a short intro, Needs, Steps, Rules, Output
  format, Verification checklist, then the footer after a `---` line.
- Steps are numbered and each one starts with a bold label.
- Write each tool call as inline code in call form, with the real input
  names: `campaigns(account, from, to, platform: "all")`. The check script
  reads these, so a misspelled tool or input fails the check.
- Only tools listed in `connector.json` may be called. Other Kunads tools
  (writing ones, raw search terms, SQL) are not on the connector.

## Connector facts worth repeating in a skill

- Call `list_accounts()` first. Every other tool needs `account`.
- `from` and `to` only apply together. With one missing, the window is the
  last 30 days.
- Campaign `revenue`, `roas` and `poas` are platform figures with VAT. Their
  breakeven is `platform_breakeven_roas` from `account_summary`, and POAS
  1.0.
- Only `account_summary` carries what the shop recorded. Shop fields are
  null when no shop is connected.
- `monthly_profit` returns null `ad_spend` for months without ad data.
  That is unknown, not zero.

## Writing style

- Plain English, US spelling, short sentences. No em dashes. No hype.
- Every skill keeps the four shared rules: never invent a number, name the
  source tool of each figure, say so when a tool returns nothing, and
  remember the connector is read-only.
- End with this footer, exactly:

  Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.

## Adding a skill

1. Create `skills/<name>/SKILL.md`.
2. Add an entry to `index.json` and to `catalog-copy.json`.
3. Run `node scripts/check.mjs`, then `node scripts/build-readme.mjs`.
4. When the connector changes, update `connector.json`. With the app
   checked out next to this repo, `node scripts/check.mjs --app ../app`
   also compares it with the connector's source.
