import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Para GitHub Pages - cambia 'tu-usuario' y 'trip-countdown-reminder' por tus valores reales
const GITHUB_USERNAME = 'tu-usuario'; // Cambia esto
const REPO_NAME = 'trip-countdown-reminder'; // Cambia esto

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  
  // Configuración para GitHub Pages
  site: `https://${GITHUB_USERNAME}.github.io`,
  base: `/${REPO_NAME}`,
  
  // Configuración de build
  build: {
    assets: 'assets'
  },
  server: {
    port: 3000,
    host: true
  }
}); 