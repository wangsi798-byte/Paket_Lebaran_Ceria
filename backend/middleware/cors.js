// Middleware CORS
module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://paket-lebaran-ceria.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};