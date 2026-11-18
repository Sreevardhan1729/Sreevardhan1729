// Colour tokens copied from Portfolio Lab (app/globals.css), so the README matches the portfolio.
// `page` is the site background layer; `panel` is the window/trace layer drawn on top of it.

const THEMES = {
  light: {
    background: "#f6f5f1",
    surface: "#ffffff",
    surface2: "#eeece6",
    foreground: "#171714",
    muted: "#5c5b54",
    rule: "#dad7ce",
    accent: "#047857",
    accentForeground: "#ffffff",
    panel: {
      bg: "#ffffff",
      bg2: "#f7f6f2",
      bg3: "#f5f4ef",
      fg: "#171714",
      muted: "#5c5b54",
      dim: "#706e66",
      rule: "#e4e1d9",
      accent: "#047857",
      warn: "#b45309",
      ok: "#1f7a45",
      err: "#b42318",
      a: "#1d64c8",
      b: "#6d45c9",
    },
  },
  dark: {
    background: "#0b0c0a",
    surface: "#121410",
    surface2: "#1a1c17",
    foreground: "#e9e7e1",
    muted: "#9d9b93",
    rule: "#272923",
    accent: "#52e3a4",
    accentForeground: "#04130c",
    panel: {
      bg: "#0f110e",
      bg2: "#141712",
      bg3: "#1b1f18",
      fg: "#ecebe5",
      muted: "#9a988f",
      dim: "#5d5c56",
      rule: "#262a23",
      accent: "#52e3a4",
      warn: "#ffb02e",
      ok: "#5fd08a",
      err: "#ff6b5e",
      a: "#6cb8ff",
      b: "#b69cff",
    },
  },
}

module.exports = { THEMES }
