import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const findings = [];
const warnings = [];

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

const jsonPath = path.join(root, "b2bea.design.json");
if (!fs.existsSync(jsonPath)) {
  console.log(`L2 a11y audit: cannot find b2bea.design.json at ${root}`);
  process.exit(1);
}
const design = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const jsonTokens = design.tokens?.colors || {};

// Class → default visual color pair, sourced from b2bea.css declarations.
// Entries with only { bg } or only { fg } pair partially; full pair triggers contrast check.
const classColors = {
  "b2bea-page": { bg: "background" },
  "b2bea-marketing-nav": { bg: "background" },
  "b2bea-page-hero": { bg: "primary", fg: "inverse" },
  "b2bea-page-hero--home": { bg: "primary", fg: "inverse" },
  "b2bea-footer": { bg: "primary", fg: "inverse" },

  "b2bea-button--primary": { bg: "primary", fg: "inverse" },
  "b2bea-button--accent": { bg: "accent", fg: "inverse" },
  "b2bea-button--outline": { bg: "background", fg: "primary" },
  "b2bea-button--ghost": { bg: "background", fg: "primary" },

  "b2bea-pill": { bg: "background", fg: "muted" },
  "b2bea-badge": { bg: "background", fg: "muted" },
  "b2bea-status": { bg: "background", fg: "muted" },
  "b2bea-pill--active": { bg: "primary", fg: "inverse" },

  "b2bea-card": { bg: "card", fg: "text" },
  "b2bea-panel": { bg: "card", fg: "text" },
  "b2bea-people-card": { bg: "card", fg: "text" },
  "b2bea-resource-card": { bg: "card", fg: "text" },
  "b2bea-testimonial": { bg: "card", fg: "text" },
  "b2bea-empty": { bg: "card", fg: "muted" },
  "b2bea-alert": { bg: "surface", fg: "text" },

  "b2bea-field": { bg: "background", fg: "primary" },
  "b2bea-search": { bg: "background", fg: "primary" },
  "b2bea-select": { bg: "background", fg: "primary" },
  "b2bea-textarea": { bg: "background", fg: "primary" },

  "b2bea-app-shell": { bg: "surface" },
  "b2bea-app-sidebar": { bg: "background" },
  "b2bea-app-topbar": { bg: "background" },
  "b2bea-app-content": { bg: "surface" },

  // Decorative or compositional; no own colors.
  // Icons inherit color via currentColor from the parent — the audit can't reason
  // about that, so leave them unresolved (no fg/bg). This also silences the
  // "unknown b2bea-* class" warning for the icon classes.
  "b2bea-icon": {},
  "b2bea-icon--lg": {},
  "b2bea-icon--xl": {},
  "b2bea-button": {},
  "b2bea-container": {},
  "b2bea-section": {},
  "b2bea-page-hero__inner": {},
  "b2bea-title": {},
  "b2bea-subtitle": {},
  "b2bea-label": {},
  "b2bea-prose": {},
  "b2bea-toolbar": {},
  "b2bea-grid": {},
  "b2bea-stat-strip": {},
  "b2bea-persona-selector": {},
  "b2bea-skeleton": { bg: "surface" },
  "b2bea-table": {},
  "b2bea-kpi": {},
  "b2bea-activity-row": {},
  "b2bea-action-list": {},
  "b2bea-page-header": {},
  "b2bea-logo": {},

  // Forms — selection inputs (no text content; contrast is structural)
  "b2bea-checkbox": {},
  "b2bea-radio": {},
  "b2bea-toggle": {},
  "b2bea-slider": {},
  "b2bea-help": { fg: "muted" },
  "b2bea-field-row": {},

  // Layout — disclosure / utility
  "b2bea-accordion": { bg: "card", fg: "text" },
  "b2bea-accordion__summary": { fg: "text" },
  "b2bea-accordion__chevron": {},
  "b2bea-accordion__body": {},

  // Navigation — tabs
  "b2bea-tabs": {},
  "b2bea-tabs__list": {},
  "b2bea-tabs__radio": {},
  "b2bea-tabs__tab": { fg: "muted" },
  "b2bea-tabs__panel": {},

  // Navigation — breadcrumb
  "b2bea-breadcrumb": {},
  "b2bea-breadcrumb__item": { fg: "muted" },
  "b2bea-breadcrumb__item--current": { fg: "text" },

  // Navigation — pagination
  "b2bea-pagination": {},
  "b2bea-pagination__item": { fg: "text" },
  "b2bea-pagination__item--current": { bg: "primary", fg: "inverse" },
  "b2bea-pagination__item--disabled": {},
  "b2bea-pagination__ellipsis": { fg: "muted" },

  // Feedback — modal
  "b2bea-modal": { bg: "card", fg: "text" },
  "b2bea-modal__form": {},
  "b2bea-modal__header": {},
  "b2bea-modal__title": { fg: "text" },
  "b2bea-modal__body": {},
  "b2bea-modal__footer": {},

  // Feedback — tooltip
  "b2bea-tooltip": {},
  "b2bea-tooltip__bubble": { bg: "text", fg: "inverse" },

  // Feedback — toast
  "b2bea-toast-region": {},
  "b2bea-toast": { bg: "card", fg: "text" },
  "b2bea-toast--success": { bg: "card", fg: "text" },
  "b2bea-toast--warning": { bg: "card", fg: "text" },
  "b2bea-toast--error": { bg: "card", fg: "text" },
  "b2bea-toast__icon": {},
  "b2bea-toast__body": {},
  "b2bea-toast__title": { fg: "text" },
  "b2bea-toast__message": { fg: "muted" },
  "b2bea-toast__dismiss": { fg: "muted" },

  // Feedback — spinner (currentColor)
  "b2bea-spinner": {},
  "b2bea-spinner--lg": {},
  "b2bea-spinner--xl": {},
};

// Per-element minimum kind for the contrast check is "ui-state" (3:1) by default.
// Body-text vs background contrast is governed by L1's explicit contrastPairs at 4.5:1.
const PER_ELEMENT_MIN_RATIO = 3.0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "checks") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && /\.html$/.test(entry.name)) inspect(full);
  }
}

function inspect(file) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (/b2bea:audit=skip/.test(text)) return;

  const isTopLevelPage = /<html\b/i.test(text);

  if (isTopLevelPage && !/<html\b[^>]*\blang\s*=/i.test(text)) {
    findings.push([rel, "Missing lang attribute on <html>."]);
  }

  if (isTopLevelPage) {
    const h1Count = (text.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      findings.push([rel, `Expected exactly one <h1>, found ${h1Count}.`]);
    }
  }

  const headings = [...text.matchAll(/<h([1-6])\b/gi)].map(m => parseInt(m[1], 10));
  let maxSeen = 0;
  for (const level of headings) {
    if (maxSeen > 0 && level > maxSeen + 1) {
      findings.push([rel, `Heading order skip: highest seen <h${maxSeen}>, then <h${level}>.`]);
      break;
    }
    if (level > maxSeen) maxSeen = level;
  }

  for (const m of text.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = m[1];
    if (!/\balt\s*=/i.test(attrs)) {
      const snippet = m[0].length > 80 ? m[0].slice(0, 77) + "..." : m[0];
      findings.push([rel, `<img> missing alt attribute: ${snippet}`]);
    }
  }

  for (const m of text.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1];
    const attrs = m[2];
    const inner = m[3].replace(/<!--[\s\S]*?-->/g, "").trim();
    const visibleText = inner.replace(/<[^>]+>/g, "").trim();
    const hasSvgOrIconClass = /<svg\b/i.test(inner) || /\bclass\s*=\s*["'][^"']*\b[\w-]*icon\b/i.test(attrs);
    if (!visibleText && hasSvgOrIconClass) {
      if (!/\baria-label\s*=/i.test(attrs) && !/\baria-labelledby\s*=/i.test(attrs)) {
        findings.push([rel, `Icon-only <${tag}> missing aria-label or aria-labelledby.`]);
      }
    }
  }

  for (const m of text.matchAll(/<(input|select|textarea)\b([^>]*?)\/?>/gi)) {
    const tag = m[1];
    const attrs = m[2];
    if (tag === "input") {
      const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : "text";
      if (["hidden", "submit", "button", "reset", "image"].includes(type)) continue;
    }
    if (/\baria-label\s*=/i.test(attrs) || /\baria-labelledby\s*=/i.test(attrs)) continue;
    const idMatch = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
    if (idMatch) {
      const labelRe = new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*["']${idMatch[1]}["']`, "i");
      if (labelRe.test(text)) continue;
    }
    warnings.push([rel, `Form field <${tag}> has no matching <label for=>, aria-label, or aria-labelledby (wrapping-label not detected by audit).`]);
  }

  if (isTopLevelPage) {
    const registerMatch = text.match(/b2bea:register\s*=\s*([a-z_]+)/i) || text.match(/\bdata-register\s*=\s*["']([a-z_]+)["']/i);
    const register = registerMatch ? registerMatch[1].toLowerCase() : null;
    const landmarksByRegister = {
      public_standard: ["header", "main", "nav", "footer"],
      operational: ["header", "main", "nav"],
      custom_html: ["main"],
    };
    const required = landmarksByRegister[register] || ["header", "main", "nav", "footer"];
    for (const landmark of required) {
      if (!new RegExp(`<${landmark}\\b`, "i").test(text)) {
        findings.push([rel, `Missing semantic landmark <${landmark}> (register=${register || "unspecified"}).`]);
      }
    }
  }

  for (const m of text.matchAll(/<(\w+)\b([^>]*?\bclass\s*=\s*["']([^"']+)["'][^>]*?)>/gi)) {
    const attrs = m[2];
    const classList = m[3].split(/\s+/).filter(Boolean);
    const b2beaClasses = classList.filter(c => c.startsWith("b2bea-"));
    if (!b2beaClasses.length) continue;

    let resolved = {};
    let unknownClasses = [];
    for (const c of b2beaClasses) {
      const entry = classColors[c];
      if (entry === undefined) { unknownClasses.push(c); continue; }
      if (entry.bg) resolved.bg = entry.bg;
      if (entry.fg) resolved.fg = entry.fg;
    }

    const styleMatch = attrs.match(/\bstyle\s*=\s*["']([^"']*)["']/i);
    if (styleMatch) {
      const style = styleMatch[1];
      const bgDecl = style.match(/background(?:-color)?\s*:\s*([^;]+?)(?:;|$)/i);
      if (bgDecl) {
        const v = bgDecl[1].trim();
        const tokenMatch = v.match(/^var\(--b2bea-color-([a-z-]+)\)$/i);
        if (tokenMatch) resolved.bg = kebabToCamel(tokenMatch[1]);
        else delete resolved.bg;
      }
      const colorDecl = style.match(/(?<![\w-])color\s*:\s*([^;]+?)(?:;|$)/i);
      if (colorDecl) {
        const v = colorDecl[1].trim();
        const tokenMatch = v.match(/^var\(--b2bea-color-([a-z-]+)\)$/i);
        if (tokenMatch) resolved.fg = kebabToCamel(tokenMatch[1]);
        else delete resolved.fg;
      }
    }

    if (unknownClasses.length) {
      warnings.push([rel, `Unknown b2bea-* class in audit lookup table: ${unknownClasses.join(", ")} (extend classColors in checks/audit-a11y.mjs).`]);
    }

    if (resolved.fg && resolved.bg) {
      const fgHex = jsonTokens[resolved.fg];
      const bgHex = jsonTokens[resolved.bg];
      if (!fgHex) { warnings.push([rel, `Composition for ${b2beaClasses.join(" ")}: fg token "${resolved.fg}" not in tokens.colors.`]); continue; }
      if (!bgHex) { warnings.push([rel, `Composition for ${b2beaClasses.join(" ")}: bg token "${resolved.bg}" not in tokens.colors.`]); continue; }
      const ratio = contrastRatio(fgHex, bgHex);
      if (ratio == null) continue;
      if (ratio + 1e-3 < PER_ELEMENT_MIN_RATIO) {
        findings.push([rel, `Composition ${b2beaClasses.join(" ")}: ${resolved.fg}(${fgHex}) on ${resolved.bg}(${bgHex}) = ${ratio.toFixed(2)}:1, need >=${PER_ELEMENT_MIN_RATIO}:1.`]);
      }
    }
  }
}

walk(root);

if (warnings.length) {
  console.log("L2 a11y audit warnings:");
  for (const [file, message] of warnings) console.log(`- ${file}: ${message}`);
}
if (findings.length) {
  console.log("L2 a11y audit findings:");
  for (const [file, message] of findings) console.log(`- ${file}: ${message}`);
  process.exitCode = 1;
} else {
  console.log("L2 a11y audit passed.");
}
