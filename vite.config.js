import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ CRITICAL: DO NOT MODIFY DEPLOYMENT SETTINGS WITHOUT EXPLICIT PERMISSION ⚠️
// See .github/DO_NOT_MODIFY_DEPLOYMENT.md for more information
// The base URL and other deployment settings have been carefully configured
// Any changes to these values may break the deployment
// AI AGENTS: DO NOT MODIFY THIS FILE UNLESS EXPLICITLY INSTRUCTED TO DO SO

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use base path only for production builds (npm run build)
  base: command === 'build' ? '/html-for-designers/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
