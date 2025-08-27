# Task Management API with React Frontend

A full-stack task management application built with Node.js, Express, MongoDB, and React. Features user authentication, task CRUD operations, filtering, pagination, and a modern responsive UI.

## 🚀 Features

### Backend (Node.js + Express)
- **RESTful API** with proper HTTP status codes
- **JWT Authentication** with bcrypt password hashing
- **MongoDB Integration** without Mongoose (native driver)
- **Input Validation** and error handling
- **Request Logging** and performance monitoring
- **Pagination** and filtering support
- **CORS** enabled for frontend integration
- **Clean Architecture** with static model methods

### Frontend (React + Vite)
- **Modern UI** with responsive design
- **React Router** for navigation
- **Protected Routes** with authentication
- **Real-time Form Validation**
- **Task Management** with CRUD operations
- **Advanced Filtering** (status, due date, search)
- **Pagination** for large task lists

## 📋 Requirements

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd seiasia
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017 copy the mongodb connection string to your device
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🧪 Testing

### Running Tests

```bash
cd server
npm test
```

### Test Coverage

The application includes comprehensive test suites for both authentication and task management:

#### Authentication Tests (`server/test/auth.test.js`)
- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ Duplicate email/username handling
- ✅ Input validation (email format, password length)
- ✅ Error handling for invalid credentials

#### Task Management Tests (`server/test/task.test.js`)
- ✅ **CRUD Operations**
  - Create tasks with validation
  - Read tasks with pagination and filtering
  - Update task details
  - Delete tasks
- ✅ **Authentication & Authorization**
  - Protected routes require valid JWT token
  - Users can only access their own tasks
- ✅ **Validation & Error Handling**
  - Required field validation
  - Status enum validation
  - Invalid task ID handling
- ✅ **Advanced Features**
  - Pagination (page, limit)
  - Status filtering
  - Search functionality
  - Due date filtering

### Test Structure

```javascript
// Example test structure
describe('Task Endpoints', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      // Test implementation
    });
    
    it('should return error for missing title', async () => {
      // Validation test
    });
  });
});
```

### Running Specific Tests

```bash
# Run only authentication tests
npm test -- --testNamePattern="Authentication"

# Run only task tests
npm test -- --testNamePattern="Task Endpoints"

# Run with coverage
npm test -- --coverage
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "status": "pending",
  "due_date": "2024-01-15"
}
```

#### GET /api/tasks
Get all tasks with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending, in_progress, completed, cancelled)
- `due_date` (string): Filter by due date (overdue, today, upcoming)
- `search` (string): Search in title and description

**Example:**
```
GET /api/tasks?page=1&limit=5&status=pending&search=documentation
```

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "_id": "...",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "status": "pending",
      "due_date": "2024-01-15T00:00:00.000Z",
      "userId": "...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

#### GET /api/tasks/:id
Get a specific task by ID.

#### PUT /api/tasks/:id
Update a task.

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "in_progress"
}
```

#### DELETE /api/tasks/:id
Delete a task.

### Health Check

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max 100 chars),
  description: String (max 500 chars),
  status: String (enum: pending, in_progress, completed, cancelled),
  due_date: Date,
  userId: ObjectId (required, ref: users),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Project Structure

```
seiasia/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── helpers/
│   │   ├── bcrypt.js          # Password hashing
│   │   └── jwt.js             # JWT token management
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   ├── validation.js      # Input validation
│   │   ├── errorHandler.js    # Error handling
│   │   └── logger.js          # Request logging
│   ├── models/
│   │   ├── user.js            # User model with static methods
│   │   └── task.js            # Task model with static methods
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task routes
│   ├── test/
│   │   ├── auth.test.js       # Authentication tests
│   │   └── task.test.js       # Task management tests
│   ├── app.js                 # Express app setup
│   ├── package.json
│   └── env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx     # Navigation component
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   ├── TaskList.jsx   # Task list page
│   │   │   └── TaskForm.jsx   # Task form page
│   │   ├── services/
│   │   │   └── api.js         # API service
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── Dockerfile                 # Backend Docker configuration
├── docker-compose.yml         # Full stack Docker setup
└── README.md
```

## 🎨 Frontend Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Auto-login after registration

### Task Management
- Create, read, update, delete tasks
- Real-time form validation
- Status management (pending, in_progress, completed, cancelled)
- Due date tracking

### Advanced Features
- Search tasks by title and description
- Filter by status and due date
- Pagination for large datasets
- Responsive design for mobile devices

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for frontend
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API URL

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker-compose up mongodb
docker-compose up server
docker-compose up client
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
