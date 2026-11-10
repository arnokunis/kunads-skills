// Rewrites the skills table in README.md between the catalog markers,
// from index.json (paths, order) and catalog-copy.json (titles, pitches).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const index = JSON.parse(read("index.json"));
const copy = JSON.parse(read("catalog-copy.json"));

const rows = index.skills.map((s) => {
  const c = copy[s.name];
  if (!c) throw new Error(`catalog-copy.json has no entry for ${s.name}`);
  return `| [${c.title}](${s.path}/SKILL.md) | ${c.summary} | ${c.themes.join(", ")} |`;
});
const table = ["| Skill | What your assistant does | Themes |", "| --- | --- | --- |", ...rows].join("\n");

const START = "<!-- catalog:start -->", END = "<!-- catalog:end -->";
const readme = read("README.md");
const a = readme.indexOf(START), b = readme.indexOf(END);
if (a < 0 || b < a) throw new Error("README.md is missing the catalog markers");
writeFileSync(join(root, "README.md"), readme.slice(0, a + START.length) + "\n\n" + table + "\n\n" + readme.slice(b));
console.log(`README table: ${rows.length} skills`);
