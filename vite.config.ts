import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Hosted on GitHub Pages under the repo subpath, so all assets resolve under /flappy-climber/.
export default defineConfig({
  base: '/flappy-climber/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Climb Runner',
        short_name: 'Climb Runner',
        description: 'A Tindeq-driven climbing trainer.',
        display: 'fullscreen',
        orientation: 'portrait',
        background_color: '#5BB8EE',
        theme_color: '#5BB8EE',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: { port: 3000, allowedHosts: true },
});
