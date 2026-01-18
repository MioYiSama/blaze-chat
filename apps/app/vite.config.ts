import { sveltekit as SvelteKit } from "@sveltejs/kit/vite";
import TailwindCSS from "@tailwindcss/vite";
import UnpluginIcons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    SvelteKit(),
    TailwindCSS(),
    UnpluginIcons({
      compiler: "svelte",
      defaultClass: "size-6",
      scale: 0,
    }),
  ],
});
