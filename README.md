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
Mern-bolg/
├── backend/                  # Express.js + MongoDB API
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── blogController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── blogModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── blogRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                 # React + Redux + SCSS app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Footer.js
│   │   │   └── blog/
│   │   │       ├── BlogForm.js
│   │   │       ├── BlogList.js
│   │   │       └── SingleBlog.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── BlogFeed.js
│   │   │   └── Profile.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── blogSlice.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles/
│   │       ├── main.scss
│   │       └── components/
│   │           └── navbar.scss
│   ├── .env.local.example
│   └── package.json
│
├── .gitignore
├── DEPLOYMENT.md
├── README.md
├── package-lock.json
├── package.json              # root scripts (install-all, dev)
└── vercel.json               # frontend deployment config

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
## AI Assistance & Manual Effort

This project was developed with the help of AI tools (ChatGPT and GitHub Copilot) for:
- Generating code snippets and fixing bugs
- Structuring the project (frontend + backend)
- Writing documentation (README, deployment guides)
- Styling with SCSS and React components

**Manual Effort:**
- Deployment of frontend (Render) and backend (Render)
- Integration of backend API with React frontend
- Testing and debugging the full application
- Ensuring responsive design and proper Redux state management
- Integration of MongoDB database (designing schemas, connecting backend, testing queries)

All code was reviewed, tested, and integrated manually.

