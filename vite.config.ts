import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  build: {
    target: "es6",
    minify: "terser",
    rollupOptions: {
      treeshake: "smallest",
    },
    terserOptions: {
      format: {
        comments: false,
      },
    },
  },
});
