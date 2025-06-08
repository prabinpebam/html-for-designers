import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/code-for-designers/', // Replace with your repository name
  build: {
    outDir: 'docs', // Output to docs folder for GitHub Pages
  },
});
