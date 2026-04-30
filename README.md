# 🔨 Online Auction System

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![React](https://img.shields.io/badge/React-Vite-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-informational)

A full-stack, real-time web application that allows users to participate in online auctions. The platform provides a seamless marketplace for listing items, placing real-time bids, and managing secure transactions.

## ✨ Key Features

- **Real-Time Bidding**: Powered by `Socket.io`, bids are updated instantaneously for all participating users without needing to refresh the page.
- **Automated Auction Lifecycle**: Integrates `node-cron` to automatically open and close auctions precisely at their scheduled times.
- **Secure Authentication**: Robust role-based access control (RBAC) and JWT authentication.
- **Media Management**: Direct and optimized image uploads using `Multer` and `Cloudinary`.
- **Admin Dashboard**: Comprehensive tools for administrators to manage users, items, and oversee transactions.
- **Modern UI**: Fully responsive, accessible, and highly interactive user interface built with `React`, `Tailwind CSS`, and `Shadcn UI`.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, Shadcn UI
- **State Management**: Zustand
- **Routing**: React Router
- **Real-Time Client**: Socket.io-client
- **Form Handling & Validation**: React Hook Form, Zod

### Backend
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL with Sequelize ORM
- **Real-Time Server**: Socket.io
- **Security**: bcrypt, jsonwebtoken, cors
- **Cloud Storage**: Cloudinary (via multer-storage-cloudinary)
- **Task Scheduling**: node-cron

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**: `v18.0.0` or higher
- **PostgreSQL**: Installed and running locally or in the cloud.
- **Cloudinary Account**: For item image upload capabilities.

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/OnlineAuctionSystem.git
cd OnlineAuctionSystem
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` root by copying the example file:
```bash
cp .env.example .env
```

Update `.env` with your actual configuration:
```env
IP=localhost
PORT=5000
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database Configuration
DATABASE_URL=postgres://user:password@localhost:5432/your_database_name

# Security
SECRET_KEY=your_super_secret_jwt_key
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install dependencies, and configure environment variables.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` root by copying the example file:
```bash
cp .env.example .env
```

Ensure your `.env` matches the backend API configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

To run the application locally, you will need to start both the backend and frontend development servers.

**Start the Backend server:**
```bash
# From the backend directory
npm run dev
```
*(Server will start on `http://localhost:5000`)*

**Start the Frontend development server:**
```bash
# From the frontend directory
npm run dev
```
*(Client will be accessible at `http://localhost:5173`)*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
