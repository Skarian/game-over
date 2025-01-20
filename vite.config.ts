import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import type { PluginOption } from "vite"

// https://eikowagenknecht.de/posts/using-react-devtools-with-tauri-v2-and-vite/
const reactDevTools = (): PluginOption => {
  return {
    name: "react-devtools",
    apply: "serve", // Only apply this plugin during development
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "http://localhost:8097",
            },
            injectTo: "head",
          },
        ],
      }
    },
  }
}

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), reactDevTools()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}))
