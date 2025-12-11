# 💰 Expense Tracker Backend

A Node.js/Express REST API backend for the Expense Tracker application. Manages user authentication, income tracking, expense tracking, and generates financial reports.

---

## 🏗️ Architecture Overview

```
server.js (Main entry point)
    ├── routes/
    │   ├── authRoutes.js (User auth)
    │   ├── incomeRoutes.js (Income CRUD)
    │   ├── ExpenceRoute.js (Expense CRUD)
    │   └── DashboardRoute.js (Analytics)
    ├── controllers/
    │   ├── authController.js (Auth logic)
    │   ├── incomeController.js (Income logic)
    │   ├── expenceController.js (Expense logic)
    │   └── dashboardController.js (Dashboard logic)
    ├── models/
    │   ├── User.js (User schema)
    │   ├── Income.js (Income schema)
    │   └── Expence.js (Expense schema)
    ├── middleware/
    │   └── authMiddleware.js (JWT authentication)
    └── config/
        └── db.js (MongoDB connection)
```

---

## 🔄 How It Works

### 1. **Request Flow**
```
Client Request → Router → Middleware (Auth Check) → Controller Logic → Database → Response
```

### 2. **Server Setup** (`server.js`)
- Initializes Express app with CORS and JSON middleware
- Registers routes for `/api/v1/auth`, `/api/v1/income`, `/api/v1/expence`, `/api/v1/dashboard`
- Connects to MongoDB via `connectDB()`
- Listens on port 5000 (configurable via `.env`)

### 3. **Authentication Flow**
- User registers or logs in via `/api/v1/auth/register` or `/api/v1/auth/login`
- Backend hashes password with `bcryptjs` and stores in MongoDB
- On success, JWT token is generated and sent to frontend
- Token is stored in localStorage on client
- Subsequent requests include token in `Authorization: Bearer <token>` header
- `protect` middleware validates token on every protected route

### 4. **Protected Routes**
All routes except registration/login require the `protect` middleware:
```javascript
router.get("/get", protect, getAllIncome);  // Only authenticated users
```

The middleware:
- Extracts JWT from Authorization header
- Verifies token using `JWT_SECRET` from `.env`
- Fetches user from database and attaches to `req.user`
- Blocks request if token is invalid or expired

---

## 📡 API Endpoints

### **Authentication** (`/api/v1/auth`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login user |
| GET | `/getUser` | ✅ | Get logged-in user info |
| POST | `/upload-image` | ✅ | Upload profile picture |

### **Income** (`/api/v1/income`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/add` | ✅ | Add income entry |
| GET | `/get` | ✅ | Get all user incomes |
| DELETE | `/:id` | ✅ | Delete income by ID |
| GET | `/downloadExcel` | ✅ | Download income as Excel |

### **Expense** (`/api/v1/expence`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/add` | ✅ | Add expense entry |
| GET | `/get` | ✅ | Get all user expenses |
| DELETE | `/:id` | ✅ | Delete expense by ID |
| GET | `/downloadExcel` | ✅ | Download expenses as Excel |

### **Dashboard** (`/api/v1/dashboard`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/` | ✅ | Get dashboard analytics |

---

## 📊 Data Models

### **User Schema** (`models/User.js`)
```javascript
{
  fullname: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  profileImageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Income Schema** (`models/Income.js`)
```javascript
{
  userId: ObjectId (reference to User),
  source: String (e.g., "Salary", "Freelance"),
  amount: Number,
  icon: String (emoji),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Expense Schema** (`models/Expence.js`)
```javascript
{
  userId: ObjectId (reference to User),
  category: String (e.g., "Food", "Transport"),
  amount: Number,
  icon: String (emoji),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

1. **Password Hashing**: Uses `bcryptjs` with 10 salt rounds
2. **JWT Authentication**: Secure token-based auth with configurable expiry
3. **Data Isolation**: Queries filter by `userId` to prevent cross-user data access
4. **CORS**: Only allows requests from configured client URL
5. **Input Validation**: Server-side validation on all inputs

---

## 🔧 Key Functions

### **Authentication Controller** (`authController.js`)
- `registerUser()`: Creates new user with hashed password
- `loginUser()`: Validates credentials and returns JWT
- `getUserInfo()`: Returns logged-in user profile
- `uploadImage()`: Saves profile picture to `/uploads` directory

### **Income Controller** (`incomeController.js`)
- `addIncome()`: Creates income record linked to user
- `getAllIncome()`: Retrieves all incomes for logged-in user (sorted by date)
- `deleteIncome()`: Deletes specific income by ID
- `downloadIncomeExcel()`: Generates and downloads Excel file with income data

### **Expense Controller** (`expenceController.js`)
- `addExpence()`: Creates expense record linked to user
- `getAllExpence()`: Retrieves all expenses for logged-in user (sorted by date)
- `deleteExpence()`: Deletes specific expense by ID
- `dowloadExpenceExcel()`: Generates and downloads Excel file with expense data

### **Dashboard Controller** (`dashboardController.js`)
- Aggregates income and expense data for analytics
- Calculates totals, trends, and categories breakdown

---

## 🗄️ Database Queries

### Example: Get User's Incomes
```javascript
const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
```

### Example: Filter by Date Range
```javascript
const thisMonth = await Income.find({
  userId: req.user._id,
  date: { $gte: startDate, $lte: endDate }
});
```

---

## 📦 Dependencies

Here are the main packages used in this project:

- 🚀 **[Express](https://www.npmjs.com/package/express)**  
  Fast, minimalist web framework for Node.js to build APIs and web apps.

- 🔑 **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**  
  Implementation of JSON Web Tokens (JWT) for authentication and authorization.

- 🗄️ **[mongoose](https://www.npmjs.com/package/mongoose)**  
  Elegant MongoDB object modeling for Node.js, with schema validation and query helpers.

- ⚙️ **[dotenv](https://www.npmjs.com/package/dotenv)**  
  Loads environment variables from a `.env` file into `process.env`.

- 🌐 **[cors](https://www.npmjs.com/package/cors)**  
  Middleware to enable Cross-Origin Resource Sharing in Express apps.

- 🔒 **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**  
  Library to hash and compare passwords securely using bcrypt.

- 📤 **[multer](https://www.npmjs.com/package/multer)**  
  Middleware for handling `multipart/form-data`, primarily used for file uploads.

- 📊 **[xlsx](https://www.npmjs.com/package/xlsx)**  
  Parser and writer for Excel spreadsheets (`.xlsx`), useful for importing/exporting data.

---

## 🚀 Getting Started

### Setup
```bash
npm install
```

### Environment Variables (`.env`)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expenseTracker
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Run Server
```bash
node server.js
```

---

## 📋 Request/Response Examples

### Register User
**Request:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response:**
```json
{
  "_id": "66f...",
  "fullname": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGc..."
}
```

### Add Income
**Request:**
```http
POST /api/v1/income/add
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "source": "Salary",
  "amount": 5000,
  "date": "2024-12-11",
  "icon": "💰"
}
```

**Response:**
```json
{
  "_id": "66f...",
  "userId": "66f...",
  "source": "Salary",
  "amount": 5000,
  "date": "2024-12-11T00:00:00.000Z",
  "icon": "💰"
}
```

---

## ⚡ Performance Considerations

1. **Indexing**: MongoDB indexes on `userId` and `date` for fast queries
2. **Sorting**: Income/Expense endpoints return data sorted by date (latest first)
3. **Pagination**: Can be added for large datasets in future
4. **Caching**: Dashboard data could be cached for better performance

