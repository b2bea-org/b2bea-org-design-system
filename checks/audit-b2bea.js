import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "checks") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && /\.(html|njk|css|js)$/.test(entry.name)) inspect(full);
  }
}

function inspect(file) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);

  if (/Hanken Grotesk/i.test(text)) {
    findings.push([rel, "Legacy Hanken Grotesk reference found. Lovable target pages use Open Sans."]);
  }

  if (/letter-spacing:\s*-\d/.test(text)) {
    findings.push([rel, "Negative letter spacing found. Standard B2BEA Lovable surfaces use normal letter spacing."]);
  }

  if (/font-size:\s*clamp\(3rem,\s*7vw,\s*6rem\)/.test(text) && !/marketing|hero exception|custom_html/i.test(text)) {
    findings.push([rel, "Marketing hero title scale found without an explicit exception marker."]);
  }
}

walk(root);

if (findings.length) {
  console.log("B2BEA design audit findings:");
  for (const [file, message] of findings) console.log(`- ${file}: ${message}`);
  process.exitCode = 1;
} else {
  console.log("B2BEA design audit passed.");
}
