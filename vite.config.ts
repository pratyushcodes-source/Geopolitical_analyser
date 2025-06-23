/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development, production)
  // VITE_ prefixed variables in .env files are automatically loaded.
  // We need to explicitly load non-prefixed variables if necessary, or ensure they are set in the build environment.
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars

  // Replace this with your GitHub repository name for GitHub Pages deployment
  const GITHUB_REPOSITORY_NAME = 'Geopolitical_analyser'; 

  return {
    plugins: [react()],
    // Define global constants. Note: Vite automatically replaces import.meta.env.VITE_YOUR_VAR
    // but to use process.env.YOUR_VAR, we need to define it.
    define: {
      // This makes process.env.API_KEY available in your client-side code.
      // It will be replaced with the value of VITE_API_KEY from your .env file during build.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
      // You might also want to define NODE_ENV if your code uses it,
      // though Vite handles this for its own optimizations.
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    // Configure base path for GitHub Pages deployment
    // Change 'your-repo-name' to your actual GitHub repository name
    base: mode === 'production' ? `/${GITHUB_REPOSITORY_NAME}/` : '/',
    server: {
      port: 3000, // Optional: define a port for dev server
    },
    build: {
      outDir: 'dist', // Output directory for build files
    },
  };
});
