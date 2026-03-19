const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors({
  origin: 'https://paket-lebaran-ceria.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

module.exports = app;