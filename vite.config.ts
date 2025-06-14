
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy /api/health requests to our handler
      '/api/health': {
        target: 'http://localhost:8080',
        bypass: (req) => {
          // Handle health checks during development
          if (req.url === '/api/health') {
            req.url = '/__health';
            return req.url;
          }
        }
      }
    },
  },
  plugins: [
    react(),
    tsconfigPaths(), // Add tsconfig paths resolver
    mode === 'development' &&
    componentTagger(),
    // Custom plugin to handle health checks
    {
      name: 'vite-plugin-health-check',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/__health', async (req: IncomingMessage, res: ServerResponse) => {
          try {
            // Use relative path instead of alias to avoid circular dependency in config
            const { healthCheck } = await import('./src/api/health');
            const health = await healthCheck();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = health.status === 'ok' ? 200 : 500;
            res.end(JSON.stringify(health));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'error',
              message: 'Health check failed',
              timestamp: new Date().toISOString()
            }));
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        'src/vite-env.d.ts',
        'src/types/**',
        'src/**/__mocks__/**',
      ],
      include: [
        'src/**/*.{ts,tsx}',
      ],
      all: true,
      functions: 80,
      lines: 80,
      statements: 80,
      branches: 70,
    }
  }
}));
