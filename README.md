# MERN Blog Application

A full-stack blog application built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication (Signup/Login) with JWT
- Blog CRUD operations
- User profiles
- Responsive design with SCSS
- Redux Toolkit for state management

## Project Structure

```
mern-blog-app/
├── backend/          # Express.js API server
├── frontend/         # React application
├── package.json      # Root package.json for scripts
└── README.md
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Setup environment variables:**
   - Copy `.env.example` to `.env` in the backend folder
   - Add your MongoDB Atlas connection string and JWT secret

3. **Run development servers:**
   ```bash
   npm run dev
   ```

## Deployment

### Frontend (Vercel)
- The frontend is configured for Vercel deployment
- Build command: `npm run build`
- Output directory: `frontend/build`

### Backend (Render/Railway)
- Deploy the backend folder as a Node.js service
- Set environment variables in your hosting platform
- The API will be available at your deployed URL

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update `REACT_APP_API_URL` to your deployed backend URL.
