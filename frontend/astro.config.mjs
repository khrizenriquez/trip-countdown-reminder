import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/',
  build: {
    assets: 'assets'
  },
  server: {
    port: 3000,
    host: true
  }
}); 