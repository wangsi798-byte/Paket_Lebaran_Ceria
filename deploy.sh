#!/bin/bash

# Backend Deployment
cd backend
npm install
vercel --prod \
  --env MONGODB_URI=mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/?appName=Cluster0 \
  --env JWT_SECRET=PaketLebaranCeria2024_SecureKey! \
  --env NODE_ENV=production

# Frontend Deployment
cd ../frontend
npm install
vercel --prod \
  --env REACT_APP_API_URL=https://paket-lebaran-backend.vercel.app/api

echo "Deployment Complete!"