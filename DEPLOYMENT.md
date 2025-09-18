# Deployment Guide for MERN Blog Application

This guide will walk you through deploying both the frontend and backend of your MERN blog application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- GitHub account
- Vercel account (for frontend)
- Render/Railway account (for backend)

## 1. Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=production
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` folder:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (use 0.0.0.0/0 for all IPs in production)
5. Get your connection string and update the `MONGO_URI` in your backend `.env` file

## 3. Backend Deployment Options

### Option A: Deploy to Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Choose the `backend` folder as the root directory
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Set the environment: `Node`

3. **Add Environment Variables:**
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, random string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default port)

4. **Deploy:** Click "Create Web Service"

### Option B: Deploy to Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project:**
   - Connect your GitHub repository
   - Select the `backend` folder

3. **Add Environment Variables:**
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, random string
   - `NODE_ENV`: `production`

4. **Deploy:** Railway will automatically deploy when you push to your repository

### Option C: Deploy to Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from backend folder:**
   ```bash
   cd backend
   vercel
   ```

3. **Add Environment Variables** in Vercel dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV`: `production`

## 4. Frontend Deployment to Vercel

### Method 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend folder:**
   ```bash
   cd frontend
   vercel
   ```

3. **Update Environment Variables:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `REACT_APP_API_URL` with your backend URL

### Method 2: GitHub Integration

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `frontend`
   - Vercel will auto-detect it's a React app

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   - `REACT_APP_API_URL`: Your backend API URL

5. **Deploy:** Click "Deploy"

## 5. Update CORS Configuration

After deploying your backend, update the CORS configuration in `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

Replace `your-frontend-domain.vercel.app` with your actual Vercel domain.

## 6. Update Frontend API URL

Update the `REACT_APP_API_URL` in your frontend environment variables to point to your deployed backend:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## 7. Testing Your Deployment

1. **Test Backend:**
   - Visit `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"message": "API is running!"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try registering a new user
   - Create a blog post
   - Test all functionality

## 8. Domain Configuration (Optional)

### Custom Domain for Frontend (Vercel)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Custom Domain for Backend (Render/Railway)

1. **Render:** Go to your service settings > Custom Domains
2. **Railway:** Go to your project settings > Domains

## 9. Monitoring and Maintenance

### Backend Monitoring

- **Render:** Built-in metrics and logs
- **Railway:** Built-in metrics and logs
- **Vercel:** Built-in analytics

### Frontend Monitoring

- **Vercel:** Built-in analytics and performance monitoring

## 10. Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure your frontend URL is added to the backend CORS configuration
   - Check that credentials are enabled

2. **Environment Variables:**
   - Verify all environment variables are set correctly
   - Check that variable names match exactly

3. **Build Failures:**
   - Check the build logs in your deployment platform
   - Ensure all dependencies are in package.json

4. **Database Connection:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

### Getting Help

- Check the deployment platform's documentation
- Review the build logs for specific error messages
- Test locally first to ensure everything works

## 11. Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Database connection working
- [ ] User registration/login working
- [ ] Blog CRUD operations working
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates active
- [ ] Performance monitoring set up

## 12. Continuous Deployment

Both Vercel and Render/Railway support automatic deployments:

- **Vercel:** Automatically deploys on every push to main branch
- **Render/Railway:** Automatically deploys on every push to main branch

Make sure to test your changes locally before pushing to production!

---

## Quick Commands Summary

```bash
# Install dependencies
npm run install-all

# Run locally
npm run dev

# Build for production
npm run build

# Deploy backend to Vercel
cd backend && vercel

# Deploy frontend to Vercel
cd frontend && vercel
```

Your MERN blog application should now be fully deployed and accessible to users worldwide! 🚀
