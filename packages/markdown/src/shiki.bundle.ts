/* Generate by @shikijs/codegen */
import {
  createBundledHighlighter,
  createSingletonShorthands,
} from "@shikijs/core";
import { createOnigurumaEngine } from "@shikijs/engine-oniguruma";
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from "@shikijs/types";

type BundledLanguage =
  | "c"
  | "cpp"
  | "c++"
  | "cmake"
  | "asm"
  | "llvm"
  | "csharp"
  | "c#"
  | "cs"
  | "java"
  | "kotlin"
  | "kt"
  | "kts"
  | "go"
  | "rust"
  | "rs"
  | "python"
  | "py"
  | "html"
  | "css"
  | "javascript"
  | "js"
  | "cjs"
  | "mjs"
  | "jsx"
  | "typescript"
  | "ts"
  | "cts"
  | "mts"
  | "tsx"
  | "vue"
  | "svelte"
  | "xml"
  | "json"
  | "yaml"
  | "yml"
  | "toml"
  | "dart"
  | "sql"
  | "shellscript"
  | "bash"
  | "sh"
  | "shell"
  | "zsh"
  | "markdown"
  | "md"
  | "latex"
  | "typst"
  | "typ";
type BundledTheme = "github-light-default" | "github-dark-default";
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

const bundledLanguages = {
  c: () => import("@shikijs/langs/c"),
  cpp: () => import("@shikijs/langs/cpp"),
  "c++": () => import("@shikijs/langs/cpp"),
  cmake: () => import("@shikijs/langs/cmake"),
  asm: () => import("@shikijs/langs/asm"),
  llvm: () => import("@shikijs/langs/llvm"),
  csharp: () => import("@shikijs/langs/csharp"),
  "c#": () => import("@shikijs/langs/csharp"),
  cs: () => import("@shikijs/langs/csharp"),
  java: () => import("@shikijs/langs/java"),
  kotlin: () => import("@shikijs/langs/kotlin"),
  kt: () => import("@shikijs/langs/kotlin"),
  kts: () => import("@shikijs/langs/kotlin"),
  go: () => import("@shikijs/langs/go"),
  rust: () => import("@shikijs/langs/rust"),
  rs: () => import("@shikijs/langs/rust"),
  python: () => import("@shikijs/langs/python"),
  py: () => import("@shikijs/langs/python"),
  html: () => import("@shikijs/langs/html"),
  css: () => import("@shikijs/langs/css"),
  javascript: () => import("@shikijs/langs/javascript"),
  js: () => import("@shikijs/langs/javascript"),
  cjs: () => import("@shikijs/langs/javascript"),
  mjs: () => import("@shikijs/langs/javascript"),
  jsx: () => import("@shikijs/langs/jsx"),
  typescript: () => import("@shikijs/langs/typescript"),
  ts: () => import("@shikijs/langs/typescript"),
  cts: () => import("@shikijs/langs/typescript"),
  mts: () => import("@shikijs/langs/typescript"),
  tsx: () => import("@shikijs/langs/tsx"),
  vue: () => import("@shikijs/langs/vue"),
  svelte: () => import("@shikijs/langs/svelte"),
  xml: () => import("@shikijs/langs/xml"),
  json: () => import("@shikijs/langs/json"),
  yaml: () => import("@shikijs/langs/yaml"),
  yml: () => import("@shikijs/langs/yaml"),
  toml: () => import("@shikijs/langs/toml"),
  dart: () => import("@shikijs/langs/dart"),
  sql: () => import("@shikijs/langs/sql"),
  shellscript: () => import("@shikijs/langs/shellscript"),
  bash: () => import("@shikijs/langs/shellscript"),
  sh: () => import("@shikijs/langs/shellscript"),
  shell: () => import("@shikijs/langs/shellscript"),
  zsh: () => import("@shikijs/langs/shellscript"),
  markdown: () => import("@shikijs/langs/markdown"),
  md: () => import("@shikijs/langs/markdown"),
  latex: () => import("@shikijs/langs/latex"),
  typst: () => import("@shikijs/langs/typst"),
  typ: () => import("@shikijs/langs/typst"),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>;

const bundledThemes = {
  "github-light-default": () => import("@shikijs/themes/github-light-default"),
  "github-dark-default": () => import("@shikijs/themes/github-dark-default"),
} as Record<BundledTheme, DynamicImportThemeRegistration>;

const createHighlighter = /* @__PURE__ */ createBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () =>
    createOnigurumaEngine(import("@shikijs/engine-oniguruma/wasm-inlined")),
});

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
);

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
};
export type { BundledLanguage, BundledTheme, Highlighter };
