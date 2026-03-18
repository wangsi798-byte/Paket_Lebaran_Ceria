const express = require('express');

try {
  // Try to load the main server
  const app = require('../backend/src/server');
  module.exports = (req, res) => {
    // Basic ping to ensure the bridge itself is alive
    if (req.url === '/api/v3-bridge-ping') {
      return res.status(200).json({ message: 'Bridge v3.1 is alive', timestamp: new Date() });
    }
    return app(req, res);
  };
} catch (error) {
  // Emergency fallback if server fails to load or has missing dependencies
  const app = express();
  app.get('/api/v3-error', (req, res) => {
    res.status(500).json({
      status: 'BOOT_FAILURE',
      message: 'Vercel bridge failed to load backend/src/server.js',
      error: error.message,
      stack: error.stack
    });
  });
  
  app.get('/api/v3-bridge-ping', (req, res) => {
    res.status(200).json({ message: 'Bridge v3.1 is alive (FALLBACK MODE)', error: error.message });
  });

  module.exports = app;
}
