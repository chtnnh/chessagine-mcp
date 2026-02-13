import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(() => {
  // Determine which app to build based on environment variable
  const app = process.env.BUILD_APP || 'chess-board';
  
  return {
    plugins: [react(), viteSingleFile()],
    build: {
      outDir: "dist",
      emptyOutDir: false, // Don't clear dist when building second app
      rollupOptions: {
        input: `${app}.html`,
        output: {
          entryFileNames: `${app}.js`,
        },
      },
    },
  };
});