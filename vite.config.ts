import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // ...other config...  npm install --save-dev @types/node
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});