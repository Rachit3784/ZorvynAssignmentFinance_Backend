# Zorvyn Finance Dashboard API Documentation

Our API endpoints accept and return JSON format requests and responses. All protected endpoints require a valid JWT token sent in the `Authorization` header.

## Base URL
`/api` (e.g. `http://localhost:7000/api` or `https://zorvynassignmentfinance-backend.onrender.com/api`)

## Authorization Header Format
`Authorization: Bearer <Your_JWT_Token>`

---

## 1. Authentication
Endpoints responsible for user identity and authorization.

### `POST /auth/signup`
Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "strongPassword123",
  "role": "analyst" // Options: viewer, analyst, admin
}
```

**Responses:**
- `201 Created`: Returns `user` object and `token`.
- `400 Bad Request`: "User already exists".

---

### `POST /auth/login`
Authenticates a user and returns a session token.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "strongPassword123"
}
```

**Responses:**
- `200 OK`: Returns `user` object and `token`.
- `401 Unauthorized`: Invalid credentials.
- `404 Not Found`: User not found.

---

### `POST /auth/forget-password`
Checks if an email exists for password recovery.

**Request Body:**
```json
{
  "email": "johndoe@example.com"
}
```

**Responses:**
- `200 OK`: `{"success": true, "message": "User found"}`

---

### `POST /auth/reset-password`
Changes the password for a given email.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "newStrongPassword456"
}
```

**Responses:**
- `200 OK`: `{"success": true, "message": "Password reset successfully"}`

---

## 2. Users
Endpoints responsible for retrieving and managing system users.

### `GET /users/me`
Fetches the currently authenticated user details.
- **Headers:** `Authorization` required
- **Roles:** All

**Responses:**
- `200 OK`: Returns the `user` document (password omitted).

---

### `GET /users/`
Fetches a list of all active users.
- **Headers:** `Authorization` required
- **Roles:** `admin`

**Responses:**
- `200 OK`: Returns an array of `users`.

---

### `DELETE /users/:id`
Soft deletes a user from the platform.
- **Headers:** `Authorization` required
- **Roles:** `admin`
- **Params:** `id` (MongoDB ObjectId)

**Responses:**
- `200 OK`: `{"success": true, "message": "User deleted successfully"}`

---

## 3. Transactions
Endpoints responsible for financial transaction management.

### `POST /transactions/`
Creates a new financial transaction instance.
- **Headers:** `Authorization` required
- **Roles:** `admin`, `analyst`

**Request Body:**
```json
{
  "amount": 1250,
  "type": "expense", // "income" or "expense"
  "category": "Marketing",
  "description": "Facebook Ad Spend Q2"
}
```

**Responses:**
- `201 Created`: Returns the created `transaction`.

---

### `GET /transactions/`
Fetches all active transactions with optional querying.
- **Headers:** `Authorization` required
- **Roles:** All
- **Query Parameters:**
  - `type` (optional): Filter by 'income' or 'expense'.
  - `category` (optional): Filter by specific category.
  - `startDate`, `endDate` (optional): ISO date strings to filter by timeframe.
  - `search` (optional): Regex matching against the description field.

**Responses:**
- `200 OK`: Returns an array of `transactions`.

---

### `PUT /transactions/:id`
Updates fields of an existing transaction.
- **Headers:** `Authorization` required
- **Roles:** `admin`
- **Params:** `id` (Transaction ObjectId)

**Request Body:** (Any valid transaction parameters to update)
```json
{
  "amount": 1500
}
```

**Responses:**
- `200 OK`: Returns the updated `transaction`.

---

### `DELETE /transactions/:id`
Soft-deletes an existing transaction.
- **Headers:** `Authorization` required
- **Roles:** `admin`
- **Params:** `id` (Transaction ObjectId)

**Responses:**
- `200 OK`: `{"success": true, "message": "Transaction deleted successfully"}`

---

## 4. Dashboard Analytics
Aggregate APIs specifically built for dashboard widgets and KPI readouts.

### `GET /dashboard/summary`
Calculates total high-level system balances.
- **Headers:** `Authorization` required

**Responses:**
- `200 OK`: 
```json
{
  "success": true,
  "totalIncome": 54000,
  "totalExpense": 12000,
  "netBalance": 42000
}
```

---

### `GET /dashboard/categories`
Provides a breakdown of total spending amounts grouped by category.
- **Headers:** `Authorization` required

**Responses:**
- `200 OK`:
```json
{
  "success": true,
  "categories": [
    { "name": "Marketing", "value": 5000 },
    { "name": "Software", "value": 3000 }
  ]
}
```

---

### `GET /dashboard/monthly-trend`
Provides the grouped income vs. expense metrics for the **past 6 months**.
- **Headers:** `Authorization` required

**Responses:**
- `200 OK`:
```json
{
  "success": true,
  "trend": [
    { "name": "Feb 2026", "income": 12000, "expense": 3000 },
    { "name": "Mar 2026", "income": 15000, "expense": 4500 }
  ]
}
```

---

### `GET /dashboard/recent`
Quickly fetches the 5 most recently created legitimate transactions.
- **Headers:** `Authorization` required

**Responses:**
- `200 OK`: Returns an array of `transactions` (max length 5).
