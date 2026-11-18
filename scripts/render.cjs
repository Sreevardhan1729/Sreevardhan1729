// Renders the README's static images to assets/ as 2x PNGs, in light and dark.
//
// Usage (Playwright is borrowed from the Portfolio Lab checkout):
//   NODE_PATH=../Portfolio-lab/node_modules node scripts/render.cjs [target ...]
// With no targets, every target is rendered. Needs network access for Google Fonts
// and, for the portfolio card, the live site.

const path = require("node:path")
const { chromium } = require("@playwright/test")
const { THEMES } = require("./theme.cjs")

const ASSETS = path.join(__dirname, "..", "assets")
const FONTS =
  "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=block"

// An HTML document with the theme's tokens as CSS variables. Only #root is captured.
function page(theme, body, css = "") {
  const t = THEMES[theme]
  const p = t.panel
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
:root {
  --bg: ${t.background}; --surface: ${t.surface}; --surface-2: ${t.surface2}; --fg: ${t.foreground};
  --muted: ${t.muted}; --rule: ${t.rule}; --accent: ${t.accent}; --accent-fg: ${t.accentForeground};
  --p-bg: ${p.bg}; --p-bg-2: ${p.bg2}; --p-bg-3: ${p.bg3}; --p-fg: ${p.fg}; --p-muted: ${p.muted};
  --p-dim: ${p.dim}; --p-rule: ${p.rule}; --p-accent: ${p.accent}; --p-warn: ${p.warn}; --p-ok: ${p.ok};
  --p-err: ${p.err}; --p-a: ${p.a}; --p-b: ${p.b};
  --sans: "Instrument Sans", system-ui, sans-serif; --mono: "JetBrains Mono", ui-monospace, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: transparent; }
body { font-family: var(--sans); color: var(--fg); -webkit-font-smoothing: antialiased; }
#root { display: inline-block; }
.mono { font-family: var(--mono); }
.panel { background: var(--p-bg); color: var(--p-fg); border: 1px solid var(--p-rule); border-radius: 14px; overflow: hidden; }
.bar { display: flex; align-items: center; gap: 12px; height: 38px; padding: 0 14px; background: var(--p-bg-2);
  border-bottom: 1px solid var(--p-rule); font-family: var(--mono); font-size: 11.5px; color: var(--p-muted); }
.dots { display: flex; gap: 6px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--p-bg-3); border: 1px solid var(--p-rule); }
.grow { flex: 1; }
${css}
</style></head><body><div id="root">${body}</div></body></html>`
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// ---------------------------------------------------------------- targets

function header(theme) {
  return page(
    theme,
    `<div class="hero">
  <div class="grid"></div>
  <div class="content">
    <div class="eyebrow"><span class="mark mono">SV</span><span class="mono">Software Engineer, previously at DevRev</span></div>
    <div class="pill mono"><span class="dot"></span>Open to SWE roles · India / remote</div>
    <h1>Sree Vardhan Reddy</h1>
    <p>I build product features end to end: React and TypeScript on the frontend, Go and Python services on the backend.</p>
  </div>
</div>`,
    `.hero { position: relative; width: 830px; padding: 40px 44px 42px; background: var(--bg); border: 1px solid var(--rule);
  border-radius: 16px; overflow: hidden; }
.grid { position: absolute; inset: 0; background-image: radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px);
  background-size: 22px 22px; mask-image: radial-gradient(ellipse 85% 90% at 80% 10%, black 25%, transparent 75%); }
.content { position: relative; }
.eyebrow { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); }
.mark { display: inline-grid; place-items: center; width: 30px; height: 30px; border: 1px solid var(--accent); border-radius: 6px;
  color: var(--accent); font-size: 12px; background: var(--surface); }
.pill { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; padding: 5px 11px; border: 1px solid var(--rule);
  border-radius: 999px; background: var(--surface); font-size: 12px; color: var(--fg); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
h1 { margin-top: 18px; font-size: 64px; font-weight: 600; line-height: 1; letter-spacing: -0.035em; }
p { margin-top: 16px; max-width: 600px; font-size: 20px; line-height: 1.5; color: var(--muted); }`,
  )
}

// Lucide icons (ISC). LinkedIn is the pre-1.0 lucide glyph; brand icons were dropped in 1.0.
const ICONS = {
  globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
  fileText: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`,
  mail: `<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>`,
  code: `<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>`,
  arrowUpRight: `<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`,
}
const icon = (name, size = 16) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`

const BUTTONS = [
  { file: "btn-resume", label: "Resume", icon: "fileText", primary: true },
  { file: "btn-portfolio", label: "Portfolio", icon: "globe", external: true },
  { file: "btn-linkedin", label: "LinkedIn", icon: "linkedin", external: true },
  { file: "btn-email", label: "Email", icon: "mail" },
  { file: "btn-leetcode", label: "LeetCode", icon: "code", external: true },
]

// The hero's primary and secondary buttons (components/site/buttons.ts), one image per button.
function buttons(theme) {
  const css = `.btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 6px;
  font-size: 14px; font-weight: 500; white-space: nowrap; }
.primary { background: var(--accent); color: var(--accent-fg); border: 1px solid var(--accent); }
.secondary { background: var(--surface); color: var(--fg); border: 1px solid var(--rule); }
.secondary .arrow { color: var(--muted); }`
  return Object.fromEntries(
    BUTTONS.map((b) => [
      b.file,
      page(
        theme,
        `<span class="btn ${b.primary ? "primary" : "secondary"}">${icon(b.icon)}${esc(b.label)}${
          b.external ? `<span class="arrow">${icon("arrowUpRight", 14)}</span>` : ""
        }</span>`,
        css,
      ),
    ]),
  )
}

// ---------------------------------------------------------------- featured-work cards (400 x 210)

const CARD_CSS = `.card { width: 400px; height: 210px; display: flex; flex-direction: column; }
.card .body { flex: 1; padding: 12px 16px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 14px; }
.chip { font-family: var(--mono); font-size: 10.5px; color: var(--p-muted); border: 1px solid var(--p-rule);
  background: var(--p-bg-2); border-radius: 5px; padding: 2px 7px; }`

const card = (barLeft, barRight, body, chips) => `<div class="panel card">
  <div class="bar"><span class="dots"><span></span><span></span><span></span></span><span>${barLeft}</span><span class="grow"></span><span>${barRight}</span></div>
  <div class="body">${body}</div>
  ${chips ? `<div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : ""}
</div>`

function cardForgedb(theme) {
  // The writes ForgeDB's dispatcher appended during the recorded session (scripts/forgedb-session.json).
  const aof = [...require("./forgedb-session.json").aof].reverse()
  const rows = aof
    .map((cmd, i) => `<li><span class="n">${i + 1}</span><span>${esc(cmd)}</span></li>`)
    .join("")
  return page(
    theme,
    card("tail -f appendonly.aof", `${aof.length} writes`, `<ol class="mono aof">${rows}</ol><p class="note">Replayed on startup · fork() snapshots for RDB</p>`, [
      "C++17",
      "kqueue",
      "RESP2",
      "RDB + AOF",
      "Pub/Sub",
    ]),
    `${CARD_CSS}
.aof { list-style: none; font-size: 12.5px; line-height: 1.9; }
.aof li { display: flex; gap: 12px; }
.aof .n { width: 14px; text-align: right; color: var(--p-dim); }
.note { margin-top: 10px; font-family: var(--mono); font-size: 10.5px; color: var(--p-muted); }`,
  )
}

function cardGateway(theme) {
  const stages = [
    ["Rate limiter", "token buckets"],
    ["Priority queue", "1,000-job heap"],
    ["Load balancer", "smooth WRR"],
  ]
  const flow = stages
    .map(([title, detail]) => `<div class="stage"><b>${title}</b><span>${detail}</span></div>`)
    .join(`<span class="arrow">→</span>`)
  return page(
    theme,
    card(
      "POST /v1/chat/completions",
      "stdlib only",
      `<div class="flow">${flow}</div>
<div class="backends">
  <div class="backend"><span class="sw a"></span>Backend A<em>w1</em><span class="state">● closed</span></div>
  <div class="backend"><span class="sw b"></span>Backend B<em>w3</em><span class="state">● closed</span></div>
  <div class="order mono">picks <b class="b">B</b><b class="b">B</b><b class="a">A</b><b class="b">B</b> …</div>
</div>`,
      ["Go", "SSE streaming", "Circuit breaker", "Prometheus"],
    ),
    `${CARD_CSS}
.flow { display: flex; align-items: stretch; gap: 6px; }
.stage { flex: 1; border: 1px solid var(--p-rule); background: var(--p-bg-2); border-radius: 7px; padding: 6px 8px; }
.stage b { display: block; font-size: 12px; font-weight: 600; white-space: nowrap; }
.stage span { display: block; margin-top: 2px; font-family: var(--mono); font-size: 9.5px; color: var(--p-muted); }
.arrow { align-self: center; color: var(--p-accent); font-family: var(--mono); font-size: 12px; }
.backends { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.backend { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 12px; font-weight: 500; border: 1px solid var(--p-rule);
  border-radius: 7px; padding: 5px 8px; }
.backend em { font-style: normal; font-family: var(--mono); font-size: 9.5px; color: var(--p-muted); }
.backend .state { margin-left: auto; font-family: var(--mono); font-size: 9.5px; color: var(--p-ok); }
.sw { width: 8px; height: 8px; border-radius: 2px; }
.sw.a, b.a { background: var(--p-a); } .sw.b, b.b { background: var(--p-b); }
.order { grid-column: 1 / -1; display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--p-muted); }
.order b { width: 16px; height: 16px; display: inline-grid; place-items: center; border-radius: 4px; color: #fff; font-weight: 500; font-size: 10px; }`,
  )
}

async function cardPortfolio(theme, browser) {
  // A real screenshot of the live hero in the same theme, once ForgeDB reports "live".
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, colorScheme: theme })
  const site = await context.newPage()
  await site.goto("https://sreevardhan-portfolio-mu.vercel.app")
  await site.getByTestId("forgedb-status").filter({ hasText: "live" }).waitFor({ timeout: 30_000 })
  await site.waitForTimeout(2500)
  const shot = (await site.screenshot()).toString("base64")
  await context.close()
  return page(
    theme,
    `<div class="panel card">
  <div class="bar"><span class="dots"><span></span><span></span><span></span></span><span class="url">sreevardhan-portfolio-mu.vercel.app</span><span class="grow"></span></div>
  <img src="data:image/png;base64,${shot}">
</div>`,
    `${CARD_CSS}
.url { white-space: nowrap; padding: 3px 10px; border: 1px solid var(--p-rule); border-radius: 999px; background: var(--p-bg); color: var(--p-fg); }
.card img { display: block; width: 100%; height: 172px; object-fit: cover; object-position: top; }`,
  )
}

function cardMeerkat(theme) {
  const pulls = [
    [293, "feat(meerkat-core): add join filter condition support for links", 532, 54],
    [299, "fix(meerkat-core): rewrite join conditions for aliased bridge tables", 199, 26],
    [300, "fix(snyk): patch high-severity js-yaml and tar vulnerabilities", 592, 72],
  ]
  const merge = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>`
  const rows = pulls
    .map(
      ([n, title, add, del]) =>
        `<li><span class="m">${merge}</span><span class="t">${esc(title)}</span><span class="mono num">#${n}</span><span class="mono add">+${add}</span><span class="mono del">−${del}</span></li>`,
    )
    .join("")
  return page(
    theme,
    card("devrev/meerkat", "3 merged", `<ul class="prs">${rows}</ul><p class="what mono">Cube-style queries → DuckDB SQL, in the browser or Node.js</p>`, ["TypeScript", "DuckDB", "SQL", "open source"]),
    `${CARD_CSS}
.prs { list-style: none; }
.what { margin-top: 10px; font-size: 10.5px; color: var(--p-muted); }
.prs li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--p-rule); font-size: 12px; }
.prs li:last-child { border-bottom: 0; }
.m { display: inline-flex; color: var(--p-b); }
.t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.num { color: var(--p-muted); font-size: 10.5px; }
.add { color: var(--p-ok); font-size: 10.5px; } .del { color: var(--p-err); font-size: 10.5px; }`,
  )
}

async function cards(theme, browser) {
  return {
    "card-forgedb": cardForgedb(theme),
    "card-gateway": cardGateway(theme),
    "card-portfolio": await cardPortfolio(theme, browser),
    "card-meerkat": cardMeerkat(theme),
  }
}

// ---------------------------------------------------------------- DevRev trace waterfall

// Ported from Portfolio Lab's lib/trace.ts so spans sit exactly where the portfolio draws them.
const DAY_MS = 86_400_000
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
function parseDate(date, edge) {
  const [year, month, day] = date.split("-").map(Number)
  if (day) return new Date(Date.UTC(year, month - 1, day))
  return edge === "start" ? new Date(Date.UTC(year, month - 1, 1)) : new Date(Date.UTC(year, month, 0))
}
const periodBounds = (p) => ({ start: parseDate(p.start, "start"), end: parseDate(p.end, "end") })
function spanPosition(period, root) {
  const bounds = periodBounds(root)
  const rootStart = bounds.start.getTime()
  const rootEnd = bounds.end.getTime() + DAY_MS
  const total = rootEnd - rootStart
  const span = periodBounds(period)
  const start = Math.min(Math.max(span.start.getTime(), rootStart), rootEnd)
  const end = Math.min(Math.max(span.end.getTime() + DAY_MS, start), rootEnd)
  const widthPct = Math.max(((end - start) / total) * 100, 1.5)
  return { leftPct: Math.min(((start - rootStart) / total) * 100, 100 - widthPct), widthPct }
}
function formatPeriod(period) {
  const { start, end } = periodBounds(period)
  const label = (date, withDay) => `${withDay ? `${date.getUTCDate()} ` : ""}${MONTHS[date.getUTCMonth()]}`
  return `${label(start, period.start.length === 10)} – ${label(end, period.end.length === 10)} ${end.getUTCFullYear()}`
}

// Titles and periods from Portfolio Lab's lib/portfolio-data.ts (DevRev highlights).
const DEVREV_ROOT = { start: "2026-01", end: "2026-11" }
const DEVREV_SPANS = [
  { title: "TypeScript strict mode", period: { start: "2026-01", end: "2026-04-10" } },
  { title: "Real-time export progress", period: { start: "2026-10-27", end: "2026-11" } },
  { title: "Data freshness", period: { start: "2026-10", end: "2026-11" } },
  { title: "Multi-tab dashboards", period: { start: "2026-08", end: "2026-10" } },
  { title: "Multi-hop joins", period: { start: "2026-05", end: "2026-07" } },
  { title: "Build-time tracing", period: { start: "2026-05-22", end: "2026-06-11" } },
  { title: "Test reliability", period: { start: "2026-09-25", end: "2026-11-11" } },
]

function trace(theme) {
  const months = MONTHS.slice(0, 11)
  const spans = [...DEVREV_SPANS].sort(
    (a, b) => periodBounds(a.period).start.getTime() - periodBounds(b.period).start.getTime(),
  )
  const rows = spans
    .map((span) => {
      const { leftPct, widthPct } = spanPosition(span.period, DEVREV_ROOT)
      return `<div class="row"><div class="label"><b>${esc(span.title)}</b><span class="mono">${formatPeriod(span.period)}</span></div>
<div class="lane"><span class="span" style="left:${leftPct.toFixed(2)}%;width:${widthPct.toFixed(2)}%"></span></div></div>`
    })
    .join("")
  return page(
    theme,
    `<div class="panel trace">
  <div class="bar"><span>trace · internship · DevRev · Jan – Nov 2026 · 168 merged PRs · 10 repositories</span></div>
  <div class="row axis"><div class="label mono">SPAN</div><div class="lane months">${months.map((m) => `<span class="mono">${m}</span>`).join("")}</div></div>
  <div class="row root"><div class="label mono">internship · Member of Technical Staff Intern</div><div class="lane"><span class="rootbar"></span></div></div>
  ${rows}
</div>`,
    `.trace { width: 830px; }
.row { display: grid; grid-template-columns: 210px 1fr; border-bottom: 1px solid var(--p-rule); }
.row:last-child { border-bottom: 0; }
.label { padding: 9px 14px; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.label b { font-size: 13.5px; font-weight: 500; }
.label span { font-size: 10.5px; color: var(--p-muted); }
.lane { position: relative; margin-right: 14px; border-left: 1px solid var(--p-rule);
  background-image: linear-gradient(to right, var(--p-rule) 1px, transparent 1px); background-size: calc(100% / 11) 100%; }
.axis .label { font-size: 10px; color: var(--p-muted); letter-spacing: 0.08em; padding: 6px 14px; }
.months { display: grid; grid-template-columns: repeat(11, 1fr); background: none; border-left: 0; }
.months span { border-left: 1px solid var(--p-rule); padding: 6px 0 6px 5px; font-size: 10px; color: var(--p-muted); }
.root .label { font-size: 10.5px; color: var(--p-muted); }
.rootbar { position: absolute; left: 0; right: 0; top: 50%; height: 8px; margin-top: -4px; border-radius: 3px;
  border: 1px solid color-mix(in srgb, var(--p-accent) 60%, transparent); background: color-mix(in srgb, var(--p-accent) 15%, transparent); }
.span { position: absolute; top: 50%; height: 9px; margin-top: -4.5px; border-radius: 5px; background: var(--p-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--p-accent) 45%, transparent); }`,
  )
}

// ---------------------------------------------------------------- competitive programming tiles

const ACHIEVEMENTS = [
  { value: "2,077", label: "LeetCode rating", detail: "Top 1.69% · 500+ problems" },
  { value: "4★", label: "CodeChef", detail: "Max rating 1,827" },
  { value: "Specialist", label: "Codeforces", detail: "Max rating 1,545" },
  { value: "565th", label: "IICPC", detail: "Of 47,000+ participants" },
]

function cp(theme) {
  const tiles = ACHIEVEMENTS.map(
    (a) => `<div class="tile"><span class="v mono">${esc(a.value)}</span><span class="l">${esc(a.label)}</span><span class="d mono">${esc(a.detail)}</span></div>`,
  ).join("")
  return page(
    theme,
    `<div class="tiles">${tiles}</div>`,
    `.tiles { width: 830px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--rule);
  border: 1px solid var(--rule); border-radius: 10px; overflow: hidden; }
.tile { background: var(--surface); padding: 16px; display: flex; flex-direction: column; }
.v { font-size: 28px; font-weight: 500; letter-spacing: -0.02em; color: var(--accent); }
.l { margin-top: 4px; font-size: 14px; }
.d { margin-top: 2px; font-size: 11px; color: var(--muted); }`,
  )
}

const TARGETS = { header, buttons, cards, "devrev-trace": trace, cp }

// ---------------------------------------------------------------- harness

async function renderPng(browser, html, outPath) {
  const context = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1000, height: 800 } })
  const tab = await context.newPage()
  await tab.setContent(html, { waitUntil: "networkidle" })
  // Every web font the page uses must have loaded, or the PNG silently falls back to system fonts.
  const missing = await tab.evaluate(async () => {
    await document.fonts.ready
    const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""))
    const used = new Set(
      [...document.querySelectorAll("#root, #root *")].map((el) =>
        getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/"/g, ""),
      ),
    )
    return ["Instrument Sans", "JetBrains Mono"].filter((family) => used.has(family) && !loaded.includes(family))
  })
  if (missing.length) throw new Error(`${path.basename(outPath)}: fonts not loaded: ${missing.join(", ")}`)
  await tab.locator("#root").screenshot({ path: outPath, omitBackground: true })
  await context.close()
}

async function main() {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TARGETS)
  const browser = await chromium.launch()
  try {
    for (const name of names) {
      if (!TARGETS[name]) throw new Error(`unknown target: ${name}`)
      for (const theme of ["light", "dark"]) {
        const out = await TARGETS[name](theme, browser)
        // A target returns one HTML string, or a map of output name -> HTML for several images.
        const outputs = typeof out === "string" ? { [name]: out } : out
        for (const [file, html] of Object.entries(outputs)) {
          const outPath = path.join(ASSETS, `${file}-${theme}.png`)
          await renderPng(browser, html, outPath)
          console.log("wrote", path.relative(process.cwd(), outPath))
        }
      }
    }
  } finally {
    await browser.close()
  }
}

module.exports = { page, esc }

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
