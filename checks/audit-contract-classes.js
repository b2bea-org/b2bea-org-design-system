import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const contractPath = path.join(root, "b2bea.design.json");
const boardPath = path.join(root, "designer-review", "design-board.html");
const cssPath = path.join(root, "b2bea.css");

function flattenComponentClasses(components) {
  const classes = new Set();

  for (const value of Object.values(components || {})) {
    if (!Array.isArray(value)) continue;
    for (const token of value) classes.add(token);
  }

  return classes;
}

function extractClassAttributeTokens(html) {
  const classes = new Set();

  for (const match of html.matchAll(/\bclass=(["'])(.*?)\1/gs)) {
    for (const token of match[2].split(/\s+/)) {
      if (token.startsWith("b2bea-")) classes.add(token);
    }
  }

  return classes;
}

function extractCssClassSelectors(css) {
  const classes = new Set();

  for (const match of css.matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?:__[A-Za-z0-9_-]+)?(?:--[A-Za-z0-9_-]+)?)/g)) {
    if (match[1].startsWith("b2bea-")) classes.add(match[1]);
  }

  return classes;
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const declared = flattenComponentClasses(contract.components);
const boardClasses = extractClassAttributeTokens(fs.readFileSync(boardPath, "utf8"));
const cssClasses = extractCssClassSelectors(fs.readFileSync(cssPath, "utf8"));
const missing = [...new Set([...boardClasses, ...cssClasses])]
  .filter((token) => !declared.has(token))
  .sort();

if (missing.length) {
  console.log("B2BEA contract class manifest is missing shipped classes:");
  for (const token of missing) console.log(`- ${token}`);
  process.exitCode = 1;
} else {
  console.log("B2BEA contract class manifest covers shipped b2bea-* classes.");
}
