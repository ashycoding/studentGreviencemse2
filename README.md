# Student Grievance Management System

This repository contains the backend and frontend for the Student Grievance Management System built using the MERN stack.

## Architecture
- **Backend**: Node.js, Express, MongoDB (Mongoose), inside the `/backend` directory.
- **Frontend**: React (Vite), React Router, Context API, inside the `/frontend` directory.

## Local Development

### 1. Backend
```bash
cd backend
npm install
# Ensure you have .env populated with MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Deploy Backend on Render
1. Connect this repository to your Render dashboard.
2. Render will automatically detect the `render.yaml` blueprint. Provide the missing environment variables (`MONGODB_URI` and `JWT_SECRET`) if prompted, or simply create a New Web Service.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Deploy Frontend on Vercel
1. Connect this repository to your Vercel dashboard and add a new Project.
2. Select the `frontend` folder as the Root Directory.
3. Vercel automatically detects Vite settings.
4. Add the Environment Variable `VITE_API_URL` pointing to the deployed Render backend URL.
5. Hit Deploy. The `vercel.json` ensures that deep links refresh properly handles single-page app (SPA) routing.
