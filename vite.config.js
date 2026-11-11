import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { contactApiMiddleware } from './server/contactMiddleware.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files into process.env for local development
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'contact-api-plugin',
        configureServer(server) {
          server.middlewares.use('/api/contact', contactApiMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use('/api/contact', contactApiMiddleware);
        }
      }
    ]
  };
});
