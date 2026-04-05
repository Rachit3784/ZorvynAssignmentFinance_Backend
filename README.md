# Zorvyn Finance Dashboard Backend

The server-side application for the Finance Dashboard System, built on robust and scalable technologies like **Node.js**, **Express**, and **MongoDB**. It provides secure APIs for user authentication, role-based access control, transaction management, and real-time dashboard analytics.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing
- **Environment:** `dotenv`

## Key Features
- **Authentication:** Secure signup, login, password recovery (forget/reset password).
- **Role-Based Access Control (RBAC):** Restricts data access based on user roles (`viewer`, `analyst`, `admin`).
- **User Management:** APIs to fetch user profiles and allow administrators to manage platform users.
- **Transactions CRUD:** Centralized APIs for managing financial records securely.
- **Analytics Aggregation:** Dedicated dashboard routes to compute categorical breakdowns, monthly financial trends, and summary metrics.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rachit3784/ZorvynAssignmentFinance_Backend.git
   cd ZorvynAssignmentFinance_Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory with the appropriate keys:
   ```env
   PORT=5000
   MongoURI=mongodb://localhost:27017/zorvyn_finance  # example
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the server:**
   - For development (with nodemon):
     ```bash
     npm start
     ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate and receive a JWT.
- `POST /forget-password`: Initiate a password reset.
- `POST /reset-password`: Reset the user's password.

### User Management (`/api/users`)
- `GET /me`: Get authenticated user's details.
- `GET /`: List all users *(Admin only)*.
- `DELETE /:id`: Delete a specific user *(Admin only)*.

### Transactions (`/api/transactions`)
- `GET /`: Get all transactions *(Viewers, Analysts, Admins)*.
- `POST /`: Create a new transaction *(Analysts, Admins)*.
- `PUT /:id`: Update a transaction *(Admin only)*.
- `DELETE /:id`: Delete a transaction *(Admin only)*.

### Dashboard Analytics (`/api/dashboard`)
*Requires Authentication*
- `GET /summary`: Get high-level financial summary KPIs.
- `GET /categories`: Fetch transactions broken down by category.
- `GET /monthly-trend`: Fetch transaction trends grouped over months.
- `GET /recent`: Retrieve the most recent transactions for the real-time feed.

## Access Roles (RBAC)
- **Viewer:** Read-only access to transactions and analytical data.
- **Analyst:** Can view analytics and add new transactions.
- **Admin:** Unrestricted access. Can manage users, create, edit, or delete transactions.
