import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme =
  | "light"
  | "dark"
  | "catppuccin-mocha"
  | "tokyo-storm"
  | "synthwave";

export const THEMES: { value: Theme; label: string; tagline: string }[] = [
  { value: "light", label: "Anthropic Light", tagline: "Bright & calm" },
  { value: "dark", label: "Anthropic Dark", tagline: "Warm classic" },
  { value: "catppuccin-mocha", label: "Catppuccin Mocha", tagline: "Soft pastel" },
  { value: "tokyo-storm", label: "Tokyo Storm", tagline: "Moody indigo" },
  { value: "synthwave", label: "Synthwave", tagline: "Neon nightlife" },
];

export interface ChartColors {
  bg: string;
  card: string;
  border: string;
  grid: string;
  text: string;
  muted: string;
  accent: string;
  pass: string;
  fail: string;
}

export const CHART_COLORS: Record<Theme, ChartColors> = {
  light: {
    bg: "#fafaf9",
    card: "#ffffff",
    border: "#e7e5e4",
    grid: "#e7e5e4",
    text: "#1c1917",
    muted: "#78716c",
    accent: "#c4593c",
    pass: "#16a34a",
    fail: "#dc2626",
  },
  dark: {
    bg: "#1a1a1a",
    card: "#242424",
    border: "#333",
    grid: "#333",
    text: "#f5f5f4",
    muted: "#a8a29e",
    accent: "#d97757",
    pass: "#4ade80",
    fail: "#f87171",
  },
  "catppuccin-mocha": {
    bg: "#1e1e2e",
    card: "#313244",
    border: "#45475a",
    grid: "#45475a",
    text: "#cdd6f4",
    muted: "#a6adc8",
    accent: "#cba6f7",
    pass: "#a6e3a1",
    fail: "#f38ba8",
  },
  "tokyo-storm": {
    bg: "#24283b",
    card: "#292e42",
    border: "#414868",
    grid: "#414868",
    text: "#c0caf5",
    muted: "#a9b1d6",
    accent: "#7aa2f7",
    pass: "#9ece6a",
    fail: "#f7768e",
  },
  synthwave: {
    bg: "#150a2e",
    card: "#241548",
    border: "#4a2d7a",
    grid: "#4a2d7a",
    text: "#f4e4ff",
    muted: "#b8a4d8",
    accent: "#ff2bd6",
    pass: "#00fff0",
    fail: "#ff5eb3",
  },
};

const STORAGE_KEY = "claude-cert-theme";
const DEFAULT_THEME: Theme = "dark";

const VALID_THEMES: readonly Theme[] = [
  "light",
  "dark",
  "catppuccin-mocha",
  "tokyo-storm",
  "synthwave",
];

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw && (VALID_THEMES as readonly string[]).includes(raw)) {
    return raw as Theme;
  }
  return DEFAULT_THEME;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  colors: ChartColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, colors: CHART_COLORS[theme] }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
