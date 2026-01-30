import TailwindCSS from "@tailwindcss/vite";
import { devtools as TanStackDevTools } from "@tanstack/devtools-vite";
import { tanstackRouter as TanStackRouter } from "@tanstack/router-plugin/vite";
import UnpluginIcons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import Solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    TanStackRouter({ target: "solid", autoCodeSplitting: true }),
    TanStackDevTools(),
    Solid(),
    TailwindCSS(),
    UnpluginIcons({
      compiler: "solid",
      scale: 0,
      defaultClass: "size-6",
    }),
  ],
  build: {
    modulePreload: {
      polyfill: false,
    },
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 3,
        unsafe: true,
      },
      format: {
        ascii_only: true,
        comments: false,
      },
    },
  },
});
