import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure Express to serve static files from the build directory
 * and handle client-side routing
 */
export function setupStaticServer(app: express.Express): void {
  const distDir = path.resolve(__dirname, '../dist/public');
  
  // Serve static files from the build directory
  app.use(express.static(distDir));
  
  // For any other request, send the index.html file
  // This enables client-side routing with wouter
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return;
    }
    
    res.sendFile(path.join(distDir, 'index.html'));
  });
}