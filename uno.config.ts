import { defineConfig } from "unocss/vite";
import { presetMini, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetMini(), presetAttributify({ prefix: "anyPrefix-" })],
});
