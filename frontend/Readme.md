# 💰 Expense Tracker - Full Stack Architecture

Complete documentation for Frontend + Backend + Database interactions in the Expense Tracker application.

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages      │  │  Components  │  │   Context    │          │
│  │ - Login      │  │ - Charts     │  │ - UserContext│          │
│  │ - Dashboard  │  │ - Forms      │  │              │          │
│  │ - Income     │  │ - Cards      │  └──────────────┘          │
│  │ - Expense    │  │ - Modals     │                             │
│  └──────────────┘  └──────────────┘                             │
│         │                  │                                     │
│         └──────────────────┴─────────────────┐                  │
│                                               │                  │
│                                    ┌──────────▼────────┐         │
│                                    │  axiosInstance    │         │
│                                    │  (API Client)     │         │
│                                    └──────────┬────────┘         │
└────────────────────────────────────────────────┼─────────────────┘
                                                 │
                                    HTTP Requests (JSON + JWT)
                                                 │
┌────────────────────────────────────────────────▼─────────────────┐
│                      SERVER (Express.js)                          │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              Middleware Layer                         │        │
│  │  ┌────────┐  ┌──────────┐  ┌───────────────┐        │        │
│  │  │  CORS  │→ │   JSON   │→ │ Auth Protect  │        │        │
│  │  └────────┘  └──────────┘  └───────┬───────┘        │        │
│  └────────────────────────────────────┼────────────────┘        │
│                                        │                          │
│  ┌─────────────────────────────────────▼──────────────┐          │
│  │                  Routes Layer                       │          │
│  │  /auth  /income  /expence  /dashboard              │          │
│  └─────────────────────────────────────┬──────────────┘          │
│                                        │                          │
│  ┌─────────────────────────────────────▼──────────────┐          │
│  │              Controllers Layer                      │          │
│  │  authController  incomeController  etc.            │          │
│  └─────────────────────────────────────┬──────────────┘          │
└────────────────────────────────────────┼─────────────────────────┘
                                         │
                              MongoDB Queries (Mongoose)
                                         │
┌────────────────────────────────────────▼─────────────────────────┐
│                    DATABASE (MongoDB)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Users      │  │   Incomes    │  │   Expenses   │           │
│  │ Collection   │  │  Collection  │  │  Collection  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow Examples

### 1. **User Login Flow**

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ React   │                │ Express │                │ MongoDB │
│ Login   │                │ Server  │                │  Users  │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │ POST /auth/login         │                          │
     │ {email, password}        │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ User.findOne({email})    │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │<─────────────────────────┤
     │                          │    User document         │
     │                          │                          │
     │                          │ bcrypt.compare(password) │
     │                          │                          │
     │                          │ jwt.sign({id})          │
     │                          │                          │
     │ {user, token}            │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │ localStorage.setItem()   │                          │
     │ Navigate to /dashboard   │                          │
     │                          │                          │
```

**Frontend Code:**
```javascript
// pages/Auth/Login.jsx
const handleLogin = async (e) => {
  const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
    email, password
  });
  localStorage.setItem("token", response.data.token);
  setUser(response.data);
  navigate("/dashboard");
};
```

**Backend Code:**
```javascript
// controllers/authController.js
export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isMatch = await user.comparePassword(password);
  res.json({ 
    user, 
    token: generateToken(user._id) 
  });
}
```

---

### 2. **Add Income Flow**

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ React   │                │ Express │                │ MongoDB │
│ Income  │                │ Server  │                │ Incomes │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │ User fills form          │                          │
     │ {source, amount, date}   │                          │
     │                          │                          │
     │ POST /income/add         │                          │
     │ Authorization: Bearer    │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ Verify JWT Token         │
     │                          │ Extract userId           │
     │                          │                          │
     │                          │ new Income({             │
     │                          │   userId,                │
     │                          │   source,                │
     │                          │   amount,                │
     │                          │   date                   │
     │                          │ }).save()                │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │<─────────────────────────┤
     │                          │    Saved Income doc      │
     │                          │                          │
     │ {_id, source, amount}    │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │ toast.success()          │                          │
     │ fetchIncomeData()        │                          │
     │                          │                          │
     │ GET /income/get          │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ Income.find({userId})    │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │<─────────────────────────┤
     │                          │    Array of incomes      │
     │                          │                          │
     │ [{income1, income2}]     │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │ setIncomeData(response)  │                          │
     │ UI updates               │                          │
```

**Frontend Code:**
```javascript
// pages/Dashboard/Income.jsx
const handleAddIncome = async (income) => {
  await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
    source: income.source,
    amount: Number(income.amount),
    date: income.date,
    icon: income.icon
  });
  toast.success("Income added successfully!");
  fetchIncomeData(); // Refresh list
};
```

**Backend Code:**
```javascript
// controllers/incomeController.js
export async function addIncome(req, res) {
  const userId = req.user._id; // From JWT middleware
  const { icon, source, amount, date } = req.body;
  
  const newIncome = new Income({
    userId,
    icon,
    source,
    amount,
    date: new Date(date)
  });
  
  const savedIncome = await newIncome.save();
  res.status(201).json(savedIncome);
}
```

**MongoDB Document:**
```json
{
  "_id": "66f8e...",
  "userId": "66f1a...",
  "source": "Freelance",
  "amount": 2500,
  "icon": "💰",
  "date": "2024-12-11T00:00:00.000Z",
  "createdAt": "2024-12-11T10:30:00.000Z"
}
```

---

### 3. **Dashboard Analytics Flow**

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ React   │                │ Express │                │ MongoDB │
│Dashboard│                │ Server  │                │   DB    │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │ useEffect() runs         │                          │
     │                          │                          │
     │ GET /dashboard           │                          │
     │ Authorization: Bearer    │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ Verify JWT               │
     │                          │                          │
     │                          │ Income.find({userId})    │
     │                          ├─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │ Expence.find({userId})   │
     │                          ├─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │ Calculate totals         │
     │                          │ Group by category        │
     │                          │ Find top expenses        │
     │                          │                          │
     │ {                        │                          │
     │   totalIncome,           │                          │
     │   totalExpense,          │                          │
     │   balance,               │                          │
     │   recentTransactions,    │                          │
     │   categoryBreakdown      │                          │
     │ }                        │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │ Render charts            │                          │
     │ Display stats            │                          │
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **Login/Register** → Server generates JWT with user ID
2. **Token Storage** → Frontend stores in `localStorage`
3. **Axios Interceptor** → Automatically adds token to every request:
   ```javascript
   // utils/axiosInstance.js
   axiosInstance.interceptors.request.use((config) => {
     const token = localStorage.getItem("token");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```
4. **Backend Middleware** → Verifies token and attaches user:
   ```javascript
   // middleware/authMiddleware.js
   export async function protect(req, res, next) {
     const token = req.headers.authorization.split(" ")[1];
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id);
     next();
   }
   ```
5. **Protected Routes** → All income/expense routes use `protect` middleware

---

## 📊 Frontend Architecture

### **Technology Stack**
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Emoji Picker React** - Icon selection
- **Moment.js** - Date formatting

### **Folder Structure**
```
src/
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   └── Dashboard/
│       ├── Home.jsx
│       ├── Income.jsx
│       └── Expence.jsx
├── components/
│   ├── Charts/
│   │   ├── CustomBarChart.jsx
│   │   ├── CustomLineChart.jsx
│   │   └── CustomPieChart.jsx
│   ├── Income/
│   │   ├── AddIncomeForm.jsx
│   │   ├── IncomeList.jsx
│   │   └── IncomeOverview.jsx
│   ├── Expense/
│   │   ├── AddExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   └── ExpenseOverview.jsx
│   └── Layouts/
│       ├── DashboardLayout.jsx
│       ├── Navbar.jsx
│       └── SideMenu.jsx
├── context/
│   └── UserContext.jsx
├── utils/
│   ├── axiosInstance.js
│   ├── apiPath.js
│   └── helper.js
└── hooks/
    └── useUserAuth.jsx
```

### **State Management**
- **UserContext** - Global user state
- **Local State** - Component-level state with `useState`
- **Effects** - Data fetching with `useEffect`

### **API Communication**
```javascript
// utils/apiPath.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER_INFO: "/auth/getUser"
  },
  INCOME: {
    ADD_INCOME: "/income/add",
    GET_ALL_INCOME: "/income/get",
    DELETE_INCOME: (id) => `/income/${id}`,
    DOWNLOAD_INCOME: "/income/downloadExcel"
  },
  EXPENSE: {
    ADD_EXPENSE: "/expence/add",
    GET_ALL_EXPENSE: "/expence/get",
    DELETE_EXPENSE: (id) => `/expence/${id}`,
    DOWNLOAD_EXPENSE: "/expence/downloadExcel"
  }
};
```

---

## 🗄️ Database Schema & Relationships

### **User Collection**
```javascript
{
  _id: ObjectId,
  fullname: String,
  email: String (unique, indexed),
  password: String (hashed),
  profileImageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Income Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId → References User._id,
  source: String,
  amount: Number,
  icon: String,
  date: Date (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### **Expense Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId → References User._id,
  category: String,
  amount: Number,
  icon: String,
  date: Date (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes for Performance**
```javascript
// Automatically created by Mongoose
User: { email: 1 }
Income: { userId: 1, date: -1 }
Expense: { userId: 1, date: -1 }
```

---

## 🚀 Complete Request Examples

### **1. User Registration**

**Frontend:**
```javascript
const response = await axiosInstance.post('/auth/register', {
  fullname: "John Doe",
  email: "john@example.com",
  password: "secure123"
});
```

**Backend Processing:**
1. Validate input fields
2. Check if email already exists
3. Hash password with bcrypt (10 rounds)
4. Create user document in MongoDB
5. Generate JWT token
6. Return user + token

**Response:**
```json
{
  "_id": "66f...",
  "fullname": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **2. Fetch Dashboard Data**

**Frontend:**
```javascript
const response = await axiosInstance.get('/dashboard');
setDashboardData(response.data);
```

**Backend Processing:**
1. Verify JWT from Authorization header
2. Extract userId from decoded token
3. Query Income.find({ userId })
4. Query Expence.find({ userId })
5. Calculate:
   - Total income
   - Total expenses
   - Balance (income - expenses)
   - Category breakdown
   - Recent transactions
6. Return aggregated data

**Response:**
```json
{
  "totalIncome": 15000,
  "totalExpense": 8500,
  "balance": 6500,
  "recentIncomes": [...],
  "recentExpenses": [...],
  "categoryBreakdown": {
    "Food": 2000,
    "Transport": 1500,
    "Entertainment": 1000
  }
}
```

### **3. Delete Income**

**Frontend:**
```javascript
await axiosInstance.delete(`/income/${incomeId}`);
toast.success("Income deleted!");
fetchIncomeData(); // Refresh list
```

**Backend Processing:**
1. Verify JWT
2. Find income by _id
3. Verify income belongs to logged-in user (security)
4. Delete from MongoDB
5. Return success message

---

## 🔧 Error Handling Flow

### **Frontend → Backend → Frontend**

```
User Action → Request → Axios Interceptor
                            ↓
                    [Add JWT Token]
                            ↓
                      Backend Server
                            ↓
                   [Auth Middleware]
                            ↓
            ┌───────────────┴────────────────┐
            │                                 │
        ✅ Valid                          ❌ Invalid
            │                                 │
      [Controller Logic]              [Return 401]
            │                                 │
      [Database Query]                        │
            │                                 │
     ┌──────┴──────┐                         │
     │             │                         │
  ✅ Success    ❌ Error                     │
     │             │                         │
  [200/201]   [400/500]                      │
     │             │                         │
     └─────────────┴─────────────────────────┘
                    ↓
          [Axios Response Interceptor]
                    ↓
        ┌───────────┴───────────┐
        │                       │
    ✅ 2xx                   ❌ 4xx/5xx
        │                       │
  [Success Handler]      [Error Handler]
        │                       │
  toast.success()        toast.error()
  Update UI              Log error
```

**Frontend Error Interceptor:**
```javascript
// utils/axiosInstance.js
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired");
      window.location.href = "/login";
    } else if (error.response?.status === 500) {
      toast.error("Server error. Try again.");
    }
    return Promise.reject(error);
  }
);
```

---

## 🎯 Key Features & Implementation

### **1. Real-time Toast Notifications**
```javascript
import { toast } from 'react-hot-toast';

// Success
toast.success("Income added successfully!");

// Error
toast.error("Failed to add income");

// Loading
const loadingToast = toast.loading("Processing...");
toast.dismiss(loadingToast);
```

### **2. Protected Routes**
```javascript
// App.jsx
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? 
    <Navigate to="/dashboard" /> : 
    <Navigate to="/login" />;
};
```

### **3. Data Visualization**
- **Bar Chart** - Category-wise expenses/income
- **Pie Chart** - Income source distribution
- **Line Chart** - Trend over time
- **Info Cards** - Quick stats

### **4. File Upload**
```javascript
// Frontend
const formData = new FormData();
formData.append('image', file);
await axiosInstance.post('/auth/upload-image', formData);

// Backend (Multer)
const upload = multer({ dest: 'uploads/' });
router.post('/upload-image', upload.single('image'), uploadImage);
```

### **5. Excel Export**
```javascript
// Backend
const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(workbook, worksheet);
res.download("IncomeData.xlsx");

// Frontend
const response = await axiosInstance.get('/income/downloadExcel', {
  responseType: 'blob'
});
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.download = 'IncomeData.xlsx';
link.click();
```

---

## 🚀 Getting Started

### **Frontend Setup**
```bash
cd frontend/expense-tracker
npm install
npm run dev
```

### **Backend Setup**
```bash
cd backend
npm install
node server.js
```

### **Environment Variables**

**Backend (`.env`):**
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expenseTracker
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
PORT=5000
```

**Frontend:**
```javascript
// utils/apiPath.js
export const BASE_URL = "http://localhost:5000/api/v1";
```

---

## 📈 Performance Optimizations

1. **MongoDB Indexes** - Fast queries on userId and date
2. **JWT Caching** - Token stored in localStorage
3. **Axios Interceptors** - Automatic token injection
4. **React Memoization** - useMemo for expensive calculations
5. **Code Splitting** - Lazy loading routes
6. **Optimistic Updates** - UI updates before server confirmation

---

## 🔒 Security Best Practices

✅ **Passwords hashed** with bcrypt (10 rounds)  
✅ **JWT tokens** for stateless authentication  
✅ **CORS configured** to allow only frontend origin  
✅ **User data isolation** via userId in all queries  
✅ **Input validation** on both frontend and backend  
✅ **Protected routes** require valid JWT  
✅ **Error messages** don't leak sensitive info  

---

## 🎨 UI/UX Features

- **Responsive Design** - Works on mobile, tablet, desktop
- **Dark Mode Compatible** - Tailwind CSS theming
- **Toast Notifications** - Real-time feedback
- **Loading States** - Skeleton screens and spinners
- **Form Validation** - Client-side + server-side
- **Modal Dialogs** - Add/edit/delete confirmations
- **Emoji Picker** - Visual category/source icons
- **Charts & Graphs** - Interactive data visualization

---

## 📝 Development Workflow

1. **User interacts** with React component
2. **Component calls** API via axiosInstance
3. **Axios interceptor** adds JWT token
4. **Express receives** request at route
5. **Auth middleware** verifies JWT and extracts user
6. **Controller** processes business logic
7. **Mongoose** queries MongoDB
8. **Database** returns data
9. **Controller** formats response
10. **Express sends** JSON response
11. **Axios interceptor** handles errors
12. **Component** updates state
13. **React re-renders** with new data
14. **Toast notification** confirms action

---

## 🔮 Future Enhancements

- [ ] Pagination for large datasets
- [ ] Search and filter transactions
- [ ] Budget goals and alerts
- [ ] Recurring income/expenses
- [ ] Multi-currency support
- [ ] PDF reports generation
- [ ] Data backup/restore
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Real-time notifications via WebSocket

---

## 📞 API Endpoint Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Register user |
| `/auth/login` | POST | ❌ | Login user |
| `/auth/getUser` | GET | ✅ | Get user info |
| `/income/add` | POST | ✅ | Add income |
| `/income/get` | GET | ✅ | Get all incomes |
| `/income/:id` | DELETE | ✅ | Delete income |
| `/income/downloadExcel` | GET | ✅ | Export incomes |
| `/expence/add` | POST | ✅ | Add expense |
| `/expence/get` | GET | ✅ | Get all expenses |
| `/expence/:id` | DELETE | ✅ | Delete expense |
| `/expence/downloadExcel` | GET | ✅ | Export expenses |
| `/dashboard` | GET | ✅ | Get analytics |

---

## 🎓 Tech Stack Summary

**Frontend:**
- React 19 + Vite
- React Router DOM 7
- Tailwind CSS 4
- Axios
- Recharts
- React Hot Toast

**Backend:**
- Node.js + Express
- Mongoose (MongoDB ODM)
- JWT + bcryptjs
- Multer (File uploads)
- XLSX (Excel generation)

**Database:**
- MongoDB Atlas (Cloud)
- 3 Collections: Users, Incomes, Expenses

**Tools:**
- Git (Version control)
- npm (Package manager)
- VS Code (Editor)

---

**Built with ❤️ using the MERN Stack**
