import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter({
      fallback: "index.html",
    }),
    alias: {
      "$comp/*": "./src/components/*",
    },
  },
  compilerOptions: {
    runes: true,
    experimental: {
      async: true,
    },
    customElement: true,
    warningFilter({ code }) {
      // For Unplugin Icons
      return code !== "custom_element_props_identifier";
    },
  },
};
