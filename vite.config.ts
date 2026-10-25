import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/egx-scanner': {
        target: 'https://scanner.tradingview.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/egx-scanner/, '/egypt/scan'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      },
      '/api/forex-scanner': {
        target: 'https://scanner.tradingview.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/forex-scanner/, '/forex/scan'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      },
      '/api/cfd-scanner': {
        target: 'https://scanner.tradingview.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/cfd-scanner/, '/cfd/scan'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      },
      '/api/egx-news': {
        target: 'https://news.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: () => '/rss/search?q=' + encodeURIComponent('البورصة المصرية OR EGX OR البنك المركزي المصري') + '&hl=ar&gl=EG&ceid=EG:ar',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    }
  }
});
