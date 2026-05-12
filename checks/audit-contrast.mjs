import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const findings = [];

function hexToRgb(hex) {
  let h = hex.replace(/^#/, "").toLowerCase();
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (!/^[0-9a-f]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function srgbToLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(hex1, hex2) {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  if (!a || !b) return null;
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function kebabToCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseCssTokens(css) {
  const tokens = {};
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) return tokens;
  const re = /--b2bea-color-([a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m;
  while ((m = re.exec(rootMatch[1]))) {
    tokens[kebabToCamel(m[1])] = m[2].toUpperCase();
  }
  return tokens;
}

const cssPath = path.join(root, "b2bea.css");
const jsonPath = path.join(root, "b2bea.design.json");

if (!fs.existsSync(cssPath) || !fs.existsSync(jsonPath)) {
  console.log(`L1 contrast audit: cannot find b2bea.css or b2bea.design.json at ${root}`);
  process.exit(1);
}

const css = fs.readFileSync(cssPath, "utf8");
const design = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const cssTokens = parseCssTokens(css);
const jsonTokens = design.tokens?.colors || {};
const contrastPairs = design.audit?.contrastPairs || [];

// Token sync: every token in b2bea.design.json must match b2bea.css :root, and vice versa.
for (const [name, jsonHex] of Object.entries(jsonTokens)) {
  const cssHex = cssTokens[name];
  if (!cssHex) {
    findings.push(`Token "${name}" present in b2bea.design.json but missing from b2bea.css :root.`);
    continue;
  }
  if (cssHex.toUpperCase() !== jsonHex.toUpperCase()) {
    findings.push(`Token "${name}" drift: b2bea.css has ${cssHex}, b2bea.design.json has ${jsonHex.toUpperCase()}.`);
  }
}
for (const name of Object.keys(cssTokens)) {
  if (!(name in jsonTokens)) {
    findings.push(`Token "${name}" present in b2bea.css :root but missing from b2bea.design.json tokens.colors.`);
  }
}

const thresholds = {
  "text": 4.5,
  "large-text": 3,
  "ui-state": 3,
  "focus-ring": 3,
};

if (!contrastPairs.length) {
  findings.push('No audit.contrastPairs declared in b2bea.design.json. Add a contrastPairs array to enable L1.');
}

for (const pair of contrastPairs) {
  const { fg, bg, kind, minRatio, reason } = pair;
  const fgHex = jsonTokens[fg];
  const bgHex = jsonTokens[bg];
  const label = `${fg} on ${bg}${reason ? ` (${reason})` : ""}`;
  if (!fgHex) { findings.push(`Pair ${label}: unknown fg token "${fg}".`); continue; }
  if (!bgHex) { findings.push(`Pair ${label}: unknown bg token "${bg}".`); continue; }
  const threshold = minRatio ?? thresholds[kind];
  if (threshold == null) { findings.push(`Pair ${label}: unknown kind "${kind}".`); continue; }
  const ratio = contrastRatio(fgHex, bgHex);
  if (ratio == null) { findings.push(`Pair ${label}: could not parse hex values (${fgHex} / ${bgHex}).`); continue; }
  if (ratio + 1e-3 < threshold) {
    findings.push(`Pair ${fg}(${fgHex}) on ${bg}(${bgHex}) = ${ratio.toFixed(2)}:1, need >=${threshold}:1 [${kind}${reason ? `: ${reason}` : ""}].`);
  }
}

if (findings.length) {
  console.log("L1 contrast audit findings:");
  for (const f of findings) console.log(`- ${f}`);
  process.exitCode = 1;
} else {
  console.log("L1 contrast audit passed.");
}
