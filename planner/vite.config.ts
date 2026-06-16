import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/planner/',          // เสิร์ฟใต้ /planner ของเว็บเดียวกับแอปรายจ่าย
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      scope: '/planner/',
      manifest: {
        name: 'ตารางสัปดาห์',
        short_name: 'ตาราง',
        description: 'ปฏิทินตารางประจำสัปดาห์ส่วนตัว (WFH + เทรด)',
        lang: 'th',
        theme_color: '#1b1b1b',
        background_color: '#1b1b1b',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/planner/',
        start_url: '/planner/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: { host: true },   // เปิดให้เข้าจากมือถือในวง LAN ได้
})
