import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function injectApiBaseMeta(apiUrl) {
  return {
    name: 'inject-api-base-meta',
    transformIndexHtml(html) {
      if (!apiUrl) return html
      if (/name=["']api-base-url["']/.test(html)) return html
      const safe = apiUrl.replace(/"/g, '&quot;')
      return html.replace('<head>', `<head>\n    <meta name="api-base-url" content="${safe}" />`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiUrl = stripSlash(env.VITE_API_URL || env.API_PUBLIC_URL || '')

  return {
    plugins: [react(), injectApiBaseMeta(apiUrl)],
    server: {
      port: 5174,
      proxy: {
        '/api': { target: 'http://localhost:3001', changeOrigin: true },
        '/images': { target: 'http://localhost:3001', changeOrigin: true },
      },
    },
  }
})

function stripSlash(s) {
  let t = String(s || '')
    .trim()
    .replace(/\/+$/, '')
  if (/\/api$/i.test(t)) t = t.replace(/\/api$/i, '').replace(/\/+$/, '')
  t = t.replace(/\/images(\/(products|temoignages))?$/i, '').replace(/\/+$/, '')
  return t
}
