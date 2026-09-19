import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import http from 'http';

function getBackendPort() {
  try {
    const portFile = path.resolve(__dirname, 'server/data/.backend_port');
    if (fs.existsSync(portFile)) {
      const port = fs.readFileSync(portFile, 'utf8').trim();
      if (port) return parseInt(port, 10);
    }
  } catch (e) {}
  return 5000;
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        router: () => `http://127.0.0.1:${getBackendPort()}`,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'BACKEND_STARTING', message: 'Backend is synchronizing...' }));
            }
          });
        },
      },
    },
  },
});
