try {
    const app = require('../backend/src/server');

    // Diagnostic route directly in the bridge
    app.get('/api/ping', (req, res) => {
        res.json({ 
            message: 'Pong from Vercel Bridge', 
            timestamp: new Date(),
            env: {
                hasMongoUri: !!process.env.MONGODB_URI,
                nodeEnv: process.env.NODE_ENV
            }
        });
    });

    module.exports = app;
} catch (error) {
    console.error('FAILED TO LOAD BACKEND:', error);
    const express = require('express');
    const bootErrorApp = express();
    bootErrorApp.use((req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'Backend failed to boot on Vercel',
            details: error.message,
            stack: error.stack
        });
    });
    module.exports = bootErrorApp;
}
