# Deployment Guide for Expense Sharing App

This guide walks you through deploying your **Backend** (Node.js/Express) to Render and your **Frontend** (React/Vite) to Vercel.

## 1. MongoDB Atlas (Database) Setup
*Most deployment issues happen here because the database rejects the connection.*

1.  **Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create a Cluster** (The free tier is fine).
3.  **Database Access**: Create a database user. **Remember the username and password**.
4.  **Network Access** (CRITICAL):
    -   Go to "Network Access" in the sidebar.
    -   Click "Add IP Address".
    -   Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
    -   *If you skip this, your deployed backend will crash because it cannot reach the database.*
5.  **Get Connection String**:
    -   Go to "Database" -> "Connect" -> "Drivers".
    -   Copy the connection string. It looks like: `mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`.

## 2. Backend Deployment (Render)

1.  Push your code to **GitHub**.
2.  Log in to [Render](https://render.com/).
3.  Click **"New"** -> **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Settings**:
    -   **Root Directory**: `backend` (Important! Your backend code is in the subfolder).
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
6.  **Environment Variables** (Advanced / Environment Section):
    -   Key: `MONGO_URI`
    -   Value: Your MongoDB connection string (Replace `<password>` with your actual password).
7.  Click **Create Web Service**.
8.  **Wait for deployment**: Once live, copy the **Service URL** (e.g., `https://expense-app-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **"Add New"** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Vite (should be auto-detected).
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    -   Key: `VITE_API_BASE_URL`
    -   Value: Your Render Backend URL + `/api` (e.g., `https://expense-app-backend.onrender.com/api`).
    -   *Note: Make sure to include `/api` at the end if your backend routes are prefixed with it.*
7.  Click **Deploy**.

## 4. Common Troubleshooting

### "Build Failed" locally?
-   If you tried running `PORT=5001 npm start` on Windows, it fails because that syntax is for Linux/Mac.
-   **Fix**: On Windows PowerShell, use:
    ```powershell
    $env:PORT=5001; npm start
    ```
    Or just rely on `.env` files locally.

### "Deployment Failed" on Render?
-   Check the **Logs** tab in Render.
-   If you see `MongoTimeoutError` or `unauthorized`, it's 99% likely a **Network Access** issue (Step 1.4) or a wrong password in `MONGO_URI`.

### Frontend says "Network Error" or returns HTML?
-   Check your `VITE_API_BASE_URL` variable in Vercel.
-   Ensure your backend is actually running (visit the backend URL in a browser; it should say "Expense Sharing API is running...").
