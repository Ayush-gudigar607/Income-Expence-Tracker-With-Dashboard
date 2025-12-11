# 💰 Expense Tracker Frontend

A modern React + Vite application for managing personal finances. Track income and expenses, visualize spending patterns, and download financial reports.

---

## 🏗️ Project Architecture

```
src/
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx (User login)
│   │   └── SignUp.jsx (User registration)
│   └── Dashboard/
│       ├── Home.jsx (Main dashboard)
│       ├── Income.jsx (Income management)
│       └── Expence.jsx (Expense management)
├── components/
│   ├── Charts/ (Recharts visualizations)
│   │   ├── CustomBarChart.jsx
│   │   ├── CustomPieChart.jsx
│   │   ├── CustomLineChart.jsx
│   │   └── CustomLegend.jsx
│   ├── Income/
│   │   ├── AddIncomeForm.jsx
│   │   ├── IncomeOverview.jsx
│   │   └── IncomeList.jsx
│   ├── Expense/
│   │   ├── AddExpenseForm.jsx
│   │   ├── ExpenseOverview.jsx
│   │   └── ExpenseList.jsx
│   ├── Cards/
│   │   ├── TransactionInfoCard.jsx
│   │   ├── InfoCard.jsx
│   │   └── CharAvatar.jsx
│   ├── Dashboard/
│   │   ├── RecentTransactions.jsx
│   │   ├── RecentIncome.jsx
│   │   └── Last30DaysExpences.jsx
│   ├── Layouts/
│   │   ├── DashboardLayout.jsx (Main layout)
│   │   ├── AuthLayout.jsx (Auth layout)
│   │   ├── Navbar.jsx
│   │   └── SideMenu.jsx
│   ├── Modal.jsx
│   ├── DeleteAlert.jsx
│   └── EmojiPickerPopup.jsx
├── context/
│   └── UserContext.jsx (Global user state)
├── hooks/
│   └── UseUserAuth.jsx (Auth hook)
├── utils/
│   ├── apiPath.js (API endpoints)
│   ├── axiosInstance.js (HTTP client)
│   ├── helper.js (Utility functions)
│   └── uploadImage.js (Image upload)
├── App.jsx (Main app routing)
└── main.jsx (Entry point)
```

---

## 🔄 How It Works

### 1. **Application Flow**
```
App.jsx (Router & Routes)
    ↓
UserContext (Global State)
    ↓
Pages (Auth or Dashboard)
    ↓
Components (UI & Logic)
    ↓
Utils (API & Helpers)
    ↓
Backend API
```

### 2. **Routing Structure**
| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Root | - | Redirects to dashboard/login |
| `/login` | Login.jsx | ❌ | User login page |
| `/signup` | SignUp.jsx | ❌ | User registration page |
| `/dashboard` | Home.jsx | ✅ | Main dashboard with overview |
| `/income` | Income.jsx | ✅ | Income management page |
| `/expence` | Expence.jsx | ✅ | Expense management page |

Protected routes redirect to login if no authentication token exists.

### 3. **Authentication Flow**

```
1. User visits "/" → Checks localStorage for token
   ├── Token exists → Redirects to "/dashboard"
   └── No token → Redirects to "/login"

2. User logs in at "/login"
   └── Submits credentials → Backend validates → Returns JWT token

3. Frontend stores token in localStorage
   └── Token attached to all subsequent API requests via axiosInstance

4. UserContext loads user data on mount
   └── Stores user profile globally accessible to all components

5. Protected routes checked via useUserAuth() hook
   └── Validates token exists before rendering dashboard
```

### 4. **State Management**

**UserContext** (`context/UserContext.jsx`)
- Global state for authenticated user
- Methods: `updateUser()`, `clearUser()`
- Available throughout app via `useContext(UserContext)`

**Component State** (`useState`)
- Local state for modals, forms, lists
- Example: `openAddIncomeModal`, `incomeData`, `loading`

---

## 📡 API Integration

### **axiosInstance** (`utils/axiosInstance.js`)
- Pre-configured HTTP client with base URL
- Automatically adds JWT token to Authorization header
- Error handling with toast notifications
- Request/Response interceptors

### **API Paths** (`utils/apiPath.js`)
```javascript
API_PATHS = {
  AUTH: { LOGIN, REGISTER, GET_USER_INFO },
  INCOME: { ADD_INCOME, GET_ALL_INCOME, DELETE_INCOME, DOWNLOAD_INCOME },
  EXPENSE: { ADD_EXPENSE, GET_ALL_EXPENSE, DELETE_EXPENSE, DOWNLOAD_EXPENSE },
  DASHBOARD: { GET_DATA },
  IMAGE: { UPLOAD_IMAGE }
}
```

### **Request Flow Example**
```javascript
// Component calls API
const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

// axiosInstance intercepts:
// 1. Adds token: Authorization: Bearer <token>
// 2. Sets content-type: application/json
// 3. Sends request to http://localhost:5000/api/v1/income/get

// On response:
// 1. Checks for errors (401, 500, etc.)
// 2. Shows toast notifications for errors
// 3. Returns response or throws error
```

---

## 🎨 Component Hierarchy

### **Authentication Pages**
- **Login.jsx** → AuthLayout + form inputs + API call
- **SignUp.jsx** → AuthLayout + form validation + image upload

### **Dashboard Pages**
- **Home.jsx** → DashboardLayout + multiple overview cards
- **Income.jsx** → Income overview + income list + add/delete modals
- **Expence.jsx** → Expense overview + expense list + add/delete modals

### **Reusable Components**
- **TransactionInfoCard**: Displays single income/expense entry
- **Modal**: Generic modal wrapper for forms & alerts
- **EmojiPickerPopup**: Emoji selection for transactions
- **CustomBarChart**: Recharts bar visualization
- **CustomPieChart**: Recharts pie chart visualization
- **CustomLineChart**: Recharts line chart visualization
- **DashboardLayout**: Main layout with navbar & sidebar

---

## 🔑 Key Features

### **1. Authentication**
- User registration with email validation
- Secure login with JWT tokens
- Persistent login (token stored in localStorage)
- Auto-logout on token expiry (401 response)
- Profile image upload

### **2. Income Tracking**
- Add income with source, amount, date, emoji
- View all incomes in list and chart format
- Delete income entries
- Download income data as Excel file
- Real-time data updates

### **3. Expense Tracking**
- Add expenses with category, amount, date, emoji
- View all expenses in list and chart format
- Delete expense entries
- Download expense data as Excel file
- Category-based grouping

### **4. Data Visualization**
- Bar charts for income/expense overview
- Pie charts for category breakdown
- Line charts for trend analysis
- Responsive charts that adapt to window size
- Custom tooltips and legends

### **5. Dashboard Analytics**
- Total income and expenses
- Recent transactions
- 30-day spending trends
- Category-wise breakdown

---

## 📋 Important Hooks & Utilities

### **useUserAuth()** (`hooks/UseUserAuth.jsx`)
```javascript
// Validates user is authenticated
// Redirects to login if not
useUserAuth();
```

### **Helper Functions** (`utils/helper.js`)
```javascript
validateEmail(email)          // Email validation
getInitials(fullName)         // Extract initials from name
addThousandSeparators(num)    // Format numbers (1000 → 1,000)
prepareExpenseBarChartData()  // Transform data for charts
prepareIncomeBarChartData()   // Transform data for charts
```

### **Upload Image** (`utils/uploadImage.js`)
```javascript
// Handles profile image upload to backend
// Returns image URL or error
```

---

## 🎨 UI/UX Features

### **Modals**
- Add Income Modal
- Add Expense Modal
- Delete Confirmation Alert
- Responsive design

### **Forms**
- Input component with validation
- Date picker for transactions
- Number input for amounts
- Emoji picker for transaction icons

### **Notifications**
- Success toasts (green)
- Error toasts (red)
- Auto-dismiss after 3 seconds
- Positioned at top-right

### **Charts**
- Responsive charts (adapt to screen size)
- Hover tooltips
- Click interactions
- Customizable colors and styles

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **react** | UI library |
| **react-router-dom** | Client-side routing |
| **axios** | HTTP client |
| **recharts** | Data visualization |
| **react-hot-toast** | Notifications |
| **emoji-picker-react** | Emoji selection |
| **moment** | Date formatting |
| **tailwindcss** | CSS framework |
| **vite** | Build tool & dev server |

---

## 🔒 Security Features

1. **Token Storage**: JWT stored in localStorage
2. **Token Injection**: Automatically added to API requests
3. **Error Handling**: 401 errors trigger logout & redirect
4. **CORS**: Requests only to configured backend URL
5. **Input Validation**: Client-side form validation
6. **Protected Routes**: Authentication checks before rendering

---

## 📊 Data Flow Examples

### **Adding Income**
```
User fills form → AddIncomeForm
  ↓
Validates input (amount > 0, date selected)
  ↓
Calls axiosInstance.post(/api/v1/income/add, {source, amount, date, icon})
  ↓
Backend creates record
  ↓
Frontend closes modal, refreshes income list
  ↓
Shows success toast
```

### **Fetching Income Data**
```
Income.jsx mounts
  ↓
useEffect calls fetchIncomeData()
  ↓
axiosInstance.get(/api/v1/income/get)
  ↓
Backend returns array of incomes
  ↓
Stores in incomeData state
  ↓
Components receive via props and render
```

### **Deleting Income**
```
User clicks delete button on transaction
  ↓
Opens DeleteAlert modal
  ↓
User confirms
  ↓
Calls axiosInstance.delete(/api/v1/income/{id})
  ↓
Backend deletes record
  ↓
Frontend closes modal, refreshes list
  ↓
Shows success toast
```

---

## 🎯 Component Props

### **TransactionInfoCard**
```javascript
{
  title: String,           // "Salary" | "Food"
  icon: String,            // "💰" | "🍔"
  date: String,            // "11 Dec, 2024"
  amount: Number,          // 5000
  type: "Income" | "Expense",
  onDelete: Function,
  hideDeleteBtn?: Boolean
}
```

### **CustomBarChart**
```javascript
{
  data: Array,             // [{category: "Food", amount: 100}, ...]
  color?: String,          // "#FF6B6B"
  strokeWidth?: Number     // 3
}
```

### **Modal**
```javascript
{
  isOpen: Boolean,
  onClose: Function,
  title: String,
  children: ReactNode
}
```

---

## 🚀 Performance Optimizations

1. **Code Splitting**: React Router lazy loading for pages
2. **Memoization**: useMemo for expensive computations
3. **Chart Optimization**: Responsive sizing prevents re-renders
4. **API Caching**: Avoid redundant requests
5. **Image Optimization**: Lazy loading for profile images

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on download | Route typo (dowload vs download) | Check API_PATHS spelling |
| Charts not showing | Empty data or wrong keys | Verify data shape & use xKey/yKey props |
| Token not persisting | localStorage issue | Check browser storage settings |
| CORS errors | Backend URL mismatch | Update VITE_API_BASE_URL |
| Modal not closing | onClose handler missing | Ensure onClose callback is passed |

---

## 📝 File Conventions

- **Pages**: Located in `pages/`, use PascalCase
- **Components**: Located in `components/`, use PascalCase
- **Utilities**: Located in `utils/`, use camelCase
- **Contexts**: Located in `context/`, end with `Context`
- **Hooks**: Located in `hooks/`, start with `use`

---

## 🔗 Related Documentation

See [Backend README](../../backend/Readme.md) for API documentation and server setup.
