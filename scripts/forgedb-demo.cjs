// Builds the README's animated ForgeDB terminal (assets/forgedb-demo-{light,dark}.svg).
//
//   NODE_PATH=../Portfolio-lab/node_modules node scripts/forgedb-demo.cjs capture
//     Types the commands into ForgeDB running as WebAssembly on the live portfolio and saves
//     its real replies to scripts/forgedb-session.json.
//   node scripts/forgedb-demo.cjs build
//     Writes both SVGs from that session. Needs network once, for the JetBrains Mono subset.

const fs = require("node:fs")
const path = require("node:path")
const { THEMES } = require("./theme.cjs")

const SITE = "https://sreevardhan-portfolio-mu.vercel.app"
const SESSION = path.join(__dirname, "forgedb-session.json")
const ASSETS = path.join(__dirname, "..", "assets")
const COMMANDS = ['PING', 'SET visitor "hello" EX 30', "TTL visitor", "LPUSH queue a b c", "LRANGE queue 0 -1", "HSET user name Sree"]
const PROMPT = "127.0.0.1:6379>"

// ---------------------------------------------------------------- capture

async function capture() {
  const { chromium } = require("@playwright/test")
  const browser = await chromium.launch()
  try {
    const tab = await browser.newPage()
    await tab.goto(SITE)
    await tab.getByTestId("forgedb-status").filter({ hasText: "live" }).waitFor({ timeout: 30_000 })
    const log = tab.locator('[role="log"][aria-label="ForgeDB output"]')
    const intro = (await log.innerText()).split("\n").filter((line) => line.startsWith("#") && !line.includes("your turn"))
    const steps = []
    for (const cmd of COMMANDS) {
      const before = await log.locator(":scope > div").count()
      await tab.getByLabel("ForgeDB command").fill(cmd)
      await tab.getByLabel("ForgeDB command").press("Enter")
      const entry = log.locator(":scope > div").nth(before)
      await entry.locator(":scope > div").nth(1).waitFor({ timeout: 10_000 })
      const lines = (await entry.innerText()).split("\n")
      if (!lines[0].endsWith(cmd)) throw new Error(`unexpected echo for ${cmd}: ${lines[0]}`)
      const out = lines.slice(1).filter((line) => line.trim() !== "")
      if (!out.length) throw new Error(`no output for ${cmd}`)
      steps.push({ cmd, out })
    }
    // The writes ForgeDB's dispatcher appended to its log, as the portfolio's AOF panel shows them.
    const aof = await tab.locator('section[aria-label="Append-only log"] ol > li > span:last-child').allInnerTexts()
    if (!aof.length) throw new Error("AOF panel is empty")
    fs.writeFileSync(SESSION, JSON.stringify({ site: SITE, capturedAt: new Date().toISOString(), intro, steps, aof }, null, 2) + "\n")
    console.log("wrote", path.relative(process.cwd(), SESSION))
  } finally {
    await browser.close()
  }
}

// ---------------------------------------------------------------- build

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const pct = (t, total) => `${((t / total) * 100).toFixed(3)}%`

// Fetches a JetBrains Mono subset with exactly the glyphs used, as a base64 woff2 data URI.
async function fontSubset(weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&text=${encodeURIComponent(text)}`
  const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
  const css = await (await fetch(url, { headers: { "User-Agent": ua } })).text()
  const src = css.match(/url\((https:[^)]+)\) format\('woff2'\)/)
  if (!src) throw new Error(`no woff2 in Google Fonts response for weight ${weight}`)
  const font = Buffer.from(await (await fetch(src[1])).arrayBuffer())
  return `data:font/woff2;base64,${font.toString("base64")}`
}

const W = 830
const FONT = 13
const CW = FONT * 0.6 // JetBrains Mono advance width
const LH = 22
const PAD = 20
const TITLE_H = 40
const SUB_H = 34
const TYPE_MS = 55
const DATABASE_ICON = `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>`

// Lays out the session as timed lines: intro notes, then each command typed out followed by its reply.
function timeline(session) {
  const lines = []
  let t = 400
  for (const text of session.intro) lines.push({ kind: "note", text, at: t })
  t += 700
  for (const { cmd, out } of session.steps) {
    const at = t
    const typed = at + 250
    const done = typed + cmd.length * TYPE_MS
    lines.push({ kind: "cmd", text: cmd, at, typed, done })
    t = done + 300
    for (const text of out) lines.push({ kind: "out", text, at: t })
    t += 750
  }
  lines.push({ kind: "prompt", at: t })
  return { lines, total: t + 3500 }
}

function svg(theme, session, fonts) {
  const p = THEMES[theme].panel
  const { lines, total } = timeline(session)
  const bodyTop = TITLE_H + SUB_H + PAD
  const H = bodyTop + lines.length * LH + PAD - 6
  const css = []
  const rows = []

  lines.forEach((line, i) => {
    const y = bodyTop + i * LH + 15
    const show = `v${i}`
    css.push(`@keyframes ${show}{0%,${pct(line.at, total)}{opacity:0}${pct(line.at + 1, total)},100%{opacity:1}}`)
    css.push(`.${show}{animation:${show} ${total}ms step-end infinite}`)
    const promptX = PAD
    const textX = PAD + (PROMPT.length + 1) * CW
    if (line.kind === "note") {
      rows.push(`<text class="${show}" x="${promptX}" y="${y}" fill="${p.muted}">${esc(line.text)}</text>`)
    } else if (line.kind === "out") {
      const colour = /^\(error\)|^ERR/.test(line.text) ? p.err : p.fg
      rows.push(`<text class="${show}" x="${promptX}" y="${y}" fill="${colour}" fill-opacity="0.85">${esc(line.text)}</text>`)
    } else if (line.kind === "cmd") {
      // A panel-coloured cover slides right one character per step, revealing the command; the cursor rides its edge.
      const n = line.text.length
      const typer = `t${i}`
      const caret = `c${i}`
      css.push(
        `@keyframes ${typer}{0%,${pct(line.typed, total)}{transform:translateX(0);animation-timing-function:steps(${n},end)}${pct(line.done, total)},100%{transform:translateX(${(n * CW).toFixed(2)}px)}}`,
        `.${typer}{transform:translateX(${(n * CW).toFixed(2)}px);animation:${typer} ${total}ms linear infinite}`,
        `@keyframes ${caret}{0%,${pct(line.at, total)}{opacity:0}${pct(line.at + 1, total)},${pct(line.done + 250, total)}{opacity:1}${pct(line.done + 251, total)},100%{opacity:0}}`,
        `.${caret}{opacity:0;animation:${caret} ${total}ms step-end infinite}`,
      )
      rows.push(`<g class="${show}">
  <text x="${promptX}" y="${y}"><tspan fill="${p.accent}">${PROMPT}</tspan><tspan x="${textX}" fill="${p.fg}">${esc(line.text)}</tspan></text>
  <g class="${typer}"><rect class="cover" x="${textX}" y="${y - 15}" width="${W - textX}" height="${LH}" fill="${p.bg}"/><rect class="${caret}" x="${textX}" y="${y - 12}" width="${CW}" height="${16}" fill="${p.accent}"/></g>
</g>`)
    } else {
      const textX = PAD + (PROMPT.length + 1) * CW
      rows.push(`<g class="${show}"><text x="${promptX}" y="${y}" fill="${p.accent}">${PROMPT}</text><rect class="blink" x="${textX}" y="${y - 12}" width="${CW}" height="16" fill="${p.accent}"/></g>`)
    }
  })

  css.push(
    `@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}`,
    `.blink{animation:blink 1.1s step-end infinite}`,
    `@keyframes clear{0%,97%{opacity:1}100%{opacity:0}}`,
    `.body{animation:clear ${total}ms ease-in infinite}`,
    // With reduced motion, show the finished session without the typing.
    `@media (prefers-reduced-motion: reduce){*{animation:none!important}.cover{display:none}}`,
  )

  const fontFaces = [400, 500]
    .map((weight) => `@font-face{font-family:"JBM";font-weight:${weight};src:url(${fonts[weight]}) format("woff2")}`)
    .join("")
  const dot = (cx) => `<circle cx="${cx}" cy="${TITLE_H / 2}" r="5" fill="${p.bg3}" stroke="${p.rule}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title">
<title id="title">ForgeDB terminal: ${esc(session.steps.map((s) => `${s.cmd} → ${s.out.join(", ")}`).join("; "))}</title>
<style>${fontFaces}
text{font-family:"JBM",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:${FONT}px;white-space:pre}
${css.join("\n")}</style>
<defs><clipPath id="win"><rect width="${W}" height="${H}" rx="14"/></clipPath></defs>
<g clip-path="url(#win)">
<rect width="${W}" height="${H}" fill="${p.bg}"/>
<rect width="${W}" height="${TITLE_H}" fill="${p.bg2}"/>
<line x1="0" y1="${TITLE_H - 0.5}" x2="${W}" y2="${TITLE_H - 0.5}" stroke="${p.rule}"/>
${dot(20)}${dot(36)}${dot(52)}
<svg x="84" y="${TITLE_H / 2 - 7}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${p.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${DATABASE_ICON}</svg>
<text x="104" y="${TITLE_H / 2 + 4.5}" fill="${p.fg}" font-weight="500" style="font-size:12.5px">ForgeDB</text>
<text x="163" y="${TITLE_H / 2 + 4}" fill="${p.muted}" style="font-size:10px">C++</text>
<rect x="78" y="${TITLE_H - 2}" width="112" height="2" fill="${p.accent}"/>
<text x="214" y="${TITLE_H / 2 + 4.5}" fill="${p.muted}" style="font-size:12.5px">Gateway</text>
<text x="275" y="${TITLE_H / 2 + 4}" fill="${p.dim}" style="font-size:10px">Go</text>
<text x="${W - 16}" y="${TITLE_H / 2 + 4}" fill="${p.muted}" text-anchor="end" style="font-size:11px">recorded from the live demo</text>
<text x="${PAD}" y="${TITLE_H + SUB_H / 2 + 4}" fill="${p.muted}" style="font-size:11px">redis-cli · 127.0.0.1:6379</text>
<rect x="${W - 84}" y="${TITLE_H + 8}" width="68" height="19" rx="9.5" fill="${p.bg2}" stroke="${p.rule}"/>
<circle cx="${W - 73}" cy="${TITLE_H + 17.5}" r="3" fill="${p.dim}"/>
<text x="${W - 65}" y="${TITLE_H + 21}" fill="${p.muted}" style="font-size:10.5px">replay</text>
<line x1="0" y1="${TITLE_H + SUB_H - 0.5}" x2="${W}" y2="${TITLE_H + SUB_H - 0.5}" stroke="${p.rule}"/>
<g class="body">
${rows.join("\n")}
</g>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="13.5" fill="none" stroke="${p.rule}"/>
</svg>
`
}

async function build() {
  const session = JSON.parse(fs.readFileSync(SESSION, "utf8"))
  const allText = [
    PROMPT,
    "ForgeDB C++ Gateway Go recorded from the live demo redis-cli · 127.0.0.1:6379 replay",
    ...session.intro,
    ...session.steps.flatMap((s) => [s.cmd, ...s.out]),
  ].join(" ")
  const glyphs = [...new Set(allText)].join("")
  const fonts = { 400: await fontSubset(400, glyphs), 500: await fontSubset(500, glyphs) }
  for (const theme of ["light", "dark"]) {
    const out = path.join(ASSETS, `forgedb-demo-${theme}.svg`)
    fs.writeFileSync(out, svg(theme, session, fonts))
    console.log("wrote", path.relative(process.cwd(), out), `${(fs.statSync(out).size / 1024).toFixed(1)} KB`)
  }
}

const mode = process.argv[2] || "build"
;(mode === "capture" ? capture() : mode === "build" ? build() : Promise.reject(new Error(`unknown mode: ${mode}`))).catch(
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
