# Expense Sharing Application

A full-stack expense sharing application (similar to Splitwise) built with MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Management**: Create users.
- **Group Management**: Create groups and add members.
- **Expense Tracking**: Add expenses with flexible split options:
  - **Equal**: Split equally among all members.
  - **Exact**: Specify exact amounts for each person.
  - **Percentage**: Split based on percentage shares.
- **Balance Simplification**: Automatically tracks who owes whom.
- **Settlement**: Settle debts easily.

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React (Vite), Vanilla CSS (Modern Dark Theme)

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or URI provided in .env)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - Ensure MongoDB is running locally on default port `27017`.
   - Or update `.env` file with your `MONGO_URI`.
4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Usage Guide
1. **Create Users**: Start by creating a few users using the form on the dashboard.
2. **Create a Group**: Create a group (e.g., "Trip") and select the members.
3. **Add Expense**:
   - Select the group.
   - Select who paid.
   - Enter amount and description.
   - Choose split type (Equal, Exact, Percentage) and fill details.
4. **View Balances**: Select a user in the "Your Balances" section to see what they owe or are owed.
5. **Settle Up**: Click "Settle" next to a balance to clear the debt.

## API Endpoints

### Users
- `POST /api/users`: Create user
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user details

### Groups
- `POST /api/groups`: Create group
- `POST /api/groups/:id/members`: Add member
- `GET /api/groups`: Get all groups

### Expenses
- `POST /api/expenses`: Add expense (handles splits)
- `GET /api/expenses/group/:groupId`: Get group expenses

### Balances
- `GET /api/balances/:userId`: Get user balances
- `POST /api/balances/settle`: Settle dues
