const express = require('express');
const corsMiddleware = require('./middleware/cors');
const app = express();

// Tambahkan middleware CORS
app.use(corsMiddleware);

// Rest of your backend code
// ...