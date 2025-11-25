import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './' ensures that the built assets use relative paths, 
  // making it easier to deploy to subdirectories or drag-and-drop static hosts (like Netlify/Vercel).
  base: './',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});