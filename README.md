# Teerop POS & Inventory Management System

This is the final capstone project for the Teerop Web Development Internship. It is a full-stack Point-of-Sale (POS) and Inventory Management System built with React, Node.js, Express, and PostgreSQL.

## Live Deployment Links
- **Frontend (Vercel)**: https://teerop-pos.vercel.app
- **Backend (Vercel Serverless)**: https://teerop-pos-u37l.vercel.app

## Test Login Credentials
You can use the following credentials to test the role-based access control. (Note: You may need to register these on the live site first if they don't exist yet).

**1. Admin**
- Username: `admin_test`
- Password: `password123`
- Role: Admin

**2. Inventory Manager**
- Username: `manager_test`
- Password: `password123`
- Role: Inventory Manager

**3. Cashier**
- Username: `cashier_test`
- Password: `password123`
- Role: Cashier

## Environment Variables Needed
To run this project locally, create a `.env` file in the `server` directory with the following variables:
```
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
```

In the `client` directory, you can set the backend API URL (if running in production):
```
VITE_API_URL=https://teerop-pos-u37l.vercel.app
```

## Setup Instructions (Local Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/UroojSheikh/teerop-pos.git
   cd teerop-pos
   ```

2. Install backend dependencies and start the server:
   ```bash
   cd server
   npm install
   npm start
   ```

3. Install frontend dependencies and start the React app:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon) + Sequelize ORM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer (configured for /tmp on Vercel)
