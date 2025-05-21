# Hashnect 3D Social Network - Deployment Guide

## Overview
This guide provides instructions for deploying and running the Hashnect 3D social network platform. The platform consists of a NestJS backend and a React frontend with Three.js visualization.

## Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL database (Neon PostgreSQL is configured)

## Project Structure
```
hashnect/
├── backend/           # NestJS backend application
├── frontend/          # React frontend application
│   ├── dist/          # Built frontend files
│   └── src/           # Frontend source code
├── project-report.md  # Project documentation
└── todo.md            # Development checklist
```

## Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with the following content:
```
DATABASE_URL="postgresql://hashnect_owner:npg_4b5ucwaMDrEq@ep-patient-firefly-a5kj9ant-pooler.us-east-2.aws.neon.tech/hashnect?sslmode=require"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
JWT_SECRET="your-jwt-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

3. Start the backend:
```bash
npm run start:dev  # For development
# or
npm run build
npm run start:prod  # For production
```

The backend will run on http://localhost:3001 by default.

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. For development:
```bash
npm run dev
```

3. For production:
The frontend is already built and available in the `frontend/dist` directory. You can serve it using any static file server:

```bash
# Using a simple http server
npx serve -s dist
```

The frontend will run on http://localhost:3000 by default.

## Accessing the Application

1. Open your browser and navigate to http://localhost:3000
2. Log in using Google OAuth
3. Explore the 3D visualization and features

## API Documentation

The backend API endpoints are organized as follows:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/connections` - Connection management
- `/api/hashtags` - Hashtag and interest system
- `/api/subdomains` - Subdomain management
- `/api/subscriptions` - Subscription and payment

## Troubleshooting

- If you encounter CORS issues, ensure the backend is properly configured to allow requests from the frontend origin
- For database connection issues, verify the DATABASE_URL in the .env file
- For authentication issues, check the Google OAuth configuration

## Next Steps

- Set up continuous deployment
- Implement additional social platform integrations
- Add Swagger documentation for the API
- Enhance the 3D visualization with more interactive features
