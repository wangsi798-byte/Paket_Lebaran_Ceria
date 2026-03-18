const app = require('../backend/src/server');

// Diagnostic route directly in the bridge
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Pong from Vercel Bridge', timestamp: new Date() });
});

module.exports = app;
