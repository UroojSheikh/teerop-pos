# Teerop POS & Inventory Management System

This is the final capstone project for the Teerop Web Development Internship. It is a full-stack web application featuring role-based access, multi-category inventory management, and a functional POS terminal.

## Features Built
- **Admin Dashboard**: Store-wide analytics and User Management with role assignment.
- **Inventory Dashboard**: Full CRUD for products with category-specific fields (Fragile, Cold, Tech, Cleaning) and low-stock alerts.
- **POS Cashier Terminal**: Real-time product search, cart logic, total calculation, and checkout transaction logging.
- **Auth**: Secure JWT and bcrypt authentication with strict role-based route protection.
- **Modern UI**: Fully responsive, glassmorphic UI built with Tailwind CSS v4 and Google Fonts.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, React Router, Axios, Lucide React
- **Backend**: Node.js, Express, Sequelize, PostgreSQL, JWT, bcrypt

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 1. Database Setup
Create a PostgreSQL database named `teerop_pos`.

### 2. Backend Setup
1. Open terminal in the `server` directory.
2. Run `npm install`
3. Check the `.env` file and ensure the `DATABASE_URL` matches your local postgres credentials (e.g. `postgres://postgres:yourpassword@localhost:5432/teerop_pos`).
4. Run `npm run dev` to start the server. The database tables will be automatically created on the first run.

### 3. Frontend Setup
1. Open terminal in the `client` directory.
2. Run `npm install`
3. Run `npm run dev` to start the React application.
4. Access the app at `http://localhost:5173`.

## Test Accounts
You can register new accounts directly from the UI by clicking the "Register Here" link on the login page.
Suggested roles to create:
1. `admin` (Role: Admin) - Full access.
2. `manager` (Role: Inventory Manager) - Access to inventory CRUD.
3. `cashier` (Role: Cashier) - Access to POS checkout.

## Submitting Requirements
As per the capstone guidelines, remember to:
- Push this repository to GitHub.
- Deploy the frontend to Vercel and the backend to Render.
- Record a short demo video walking through the Admin, Inventory Manager, and Cashier views, including a checkout transaction.
- Export the chat log with Antigravity to submit as your prompt log.
