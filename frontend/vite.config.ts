import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      port: 3000,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'hashnect.io',
        'www.hashnect.io',
        '6372-2804-14c-658b-45f1-4d79-508d-9189-f0b1.ngrok-free.app'
      ],
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://hashnect.onrender.com',
          changeOrigin: true,
        },
      },
    },
  };
});
