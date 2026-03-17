# Paket Lebaran Ceria

## Deployment Guide

### Backend Deployment
- **Platform**: Vercel
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT authentication
  - `NODE_ENV`: production

### Frontend Deployment
- **Platform**: Vercel
- **Environment Variables**:
  - `REACT_APP_API_URL`: Backend API URL

### Local Development
1. Clone the repository
2. Install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables
4. Run development servers
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm start
   ```

### Production Access
- **Backend**: https://paket-lebaran-backend.vercel.app
- **Frontend**: https://paket-lebaran-ceria.vercel.app

### Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React
- Deployment: Vercel
- Database: MongoDB Atlas