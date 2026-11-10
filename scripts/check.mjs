// Checks the repo: JSON parses, every skill folder matches its frontmatter and the
// catalog, every tool call in a SKILL.md names a connector tool with real input names,
// the footer is present, and no em dashes slipped in.
// Optional: --app <path to the Kunads app> also compares connector.json with the
// READ_ONLY list in src/app/api/mcp/route.ts.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const json = (f) => { try { return JSON.parse(readFileSync(join(root, f), "utf8")); } catch (e) { errors.push(`${f}: does not parse (${e.message})`); return null; } };
const FOOTER = "Runs on Kunads (kunads.ai): AI agents that check your Google and Meta ads against real orders and profit. Free to try.";

const connector = json("connector.json");
const index = json("index.json");
const copy = json("catalog-copy.json");
const tools = connector?.tools ?? {};

const appAt = process.argv.indexOf("--app");
if (appAt > 0) {
  const route = readFileSync(join(process.argv[appAt + 1], "src/app/api/mcp/route.ts"), "utf8");
  const m = route.match(/const READ_ONLY = \[([^\]]*)\]/);
  const live = new Set([...(m?.[1] ?? "").matchAll(/"([a-z_]+)"/g)].map((x) => x[1]).concat("list_accounts"));
  for (const t of live) if (!tools[t]) errors.push(`connector.json is missing ${t}, which the app serves`);
  for (const t of Object.keys(tools)) if (!live.has(t)) errors.push(`connector.json lists ${t}, which the app does not serve`);
  console.log(`app READ_ONLY + list_accounts: ${[...live].sort().join(", ")}`);
}

const folders = readdirSync(join(root, "skills"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const listed = new Set((index?.skills ?? []).map((s) => s.name));
const used = {};

for (const name of folders) {
  const file = `skills/${name}/SKILL.md`;
  if (!existsSync(join(root, file))) { errors.push(`${file}: missing`); continue; }
  const text = readFileSync(join(root, file), "utf8");
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) errors.push(`${file}: no frontmatter`);
  else {
    if (!new RegExp(`^name: ${name}$`, "m").test(fm[1])) errors.push(`${file}: frontmatter name is not ${name}`);
    if (!/^description: .{40,}/m.test(fm[1])) errors.push(`${file}: description missing or too short`);
  }
  if (!listed.has(name)) errors.push(`${file}: not in index.json`);
  if (copy && !copy[name]) errors.push(`${file}: not in catalog-copy.json`);
  if (!text.trimEnd().endsWith(FOOTER)) errors.push(`${file}: footer missing`);
  if (text.includes("\u2014")) errors.push(`${file}: contains an em dash`);
  for (const h of ["## Needs", "## Steps", "## Rules", "## Output format", "## Verification checklist"])
    if (!text.includes(h)) errors.push(`${file}: no "${h}" section`);

  // tool calls are written as inline code: `tool(arg, key: value)`
  const calls = [...text.matchAll(/`([a-z_]+)\(([^`]*)\)`/g)];
  if (!calls.length) errors.push(`${file}: names no tool calls`);
  for (const [, tool, args] of calls) {
    const t = tools[tool];
    if (!t) { errors.push(`${file}: ${tool} is not a connector tool`); continue; }
    (used[name] ??= new Set()).add(tool);
    const keys = args.split(",").map((a) => a.trim().split(":")[0].trim()).filter(Boolean);
    for (const k of keys) if (!t.inputs.includes(k)) errors.push(`${file}: ${tool} has no input "${k}"`);
    if (tool !== "list_accounts" && !keys.includes("account")) errors.push(`${file}: ${tool}(...) does not pass account`);
  }
}
for (const s of index?.skills ?? []) if (!folders.includes(s.name)) errors.push(`index.json: ${s.name} has no folder`);

for (const [n, set] of Object.entries(used)) console.log(`${n}: ${[...set].sort().join(", ")}`);
if (errors.length) { console.error(`\n${errors.length} problem(s):\n- ${errors.join("\n- ")}`); process.exit(1); }
console.log(`\nOK: ${folders.length} skills, every tool call is on the connector with real inputs, JSON parses.`);
