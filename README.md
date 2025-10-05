# Workforce Management System - Server

A scalable workforce management system built with Node.js, TypeScript, Express.js, MySQL, and RabbitMQ. This server provides APIs for employee management, department organization, and automated leave request processing.

## 🌟 Features

- **Employee Management**: Complete CRUD operations for employees with department associations
- **Department Management**: Organize employees by departments with statistics and analytics  
- **Leave Request Processing**: Automated leave approval with business rules and queue processing
- **Scalable Architecture**: Clean architecture with Repository and Service patterns
- **Message Queue**: RabbitMQ for asynchronous leave request processing
- **API Security**: Rate limiting, request validation, and comprehensive error handling
- **Production Ready**: Docker support, health checks, and monitoring

## 🏗️ Architecture

### Design Patterns
- **Repository Pattern**: Database abstraction layer
- **Service Layer Pattern**: Business logic separation
- **Singleton Pattern**: RabbitMQ connection management
- **Middleware Pattern**: Request processing pipeline

### Technology Stack
- **Backend**: Node.js 18+, TypeScript, Express.js
- **Database**: MySQL 8.0 with Sequelize ORM
- **Message Queue**: RabbitMQ 3.12
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi schema validation
- **Testing**: Jest with Supertest

## 📋 Prerequisites

- Node.js 18 or higher
- MySQL 8.0
- RabbitMQ 3.12
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=9001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=workforce_management
DB_DIALECT=mysql

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# CORS Configuration
CORS_ORIGIN=*
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start MySQL and RabbitMQ
docker-compose up -d
```

#### Option B: Local Installation

1. Install and start MySQL
2. Create database:
   ```sql
   CREATE DATABASE workforce_management;
   ```
3. Install and start RabbitMQ

### 4. Run Database Migrations

```bash
# The application will automatically sync the database schema
npm run dev
```

### 5. Start the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:9001`

## 📖 API Documentation

### Base URL
```
http://localhost:9001
```

### Health Check
```bash
GET /health
```

### Endpoints

#### Departments
```bash
# Create department
POST /api/department
Content-Type: application/json
{
  "name": "Engineering"
}

# Get department employees
GET /api/department/{id}/employees?page=1&limit=10
```

#### Employees
```bash
# Create employee
POST /api/employee
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@company.com",
  "departmentId": "uuid-here"
}

# Get employee by ID
GET /api/employee/{id}

# List employees
GET /api/employee?page=1&limit=10
```

#### Leave Requests
```bash
# Create leave request
POST /api/leave-request
Content-Type: application/json
{
  "employeeId": "uuid-here",
  "startDate": "2024-12-01",
  "endDate": "2024-12-03",
  "reason": "Personal leave"
}

# Get employee leave history
GET /api/leave-request/employee/{id}/history?page=1&limit=10
```



## 🧪 Testing

The project includes basic API testing using Jest and Supertest.

### Run Tests
```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Test with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Coverage

The test suite covers:
- ✅ API endpoints (Departments, Employees, Leave Requests)
- ✅ Request/response validation
- ✅ Error handling scenarios
## 🐳 Docker Support

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Docker Services
- **App**: Node.js application (port 9001)
- **MySQL 8.0**: Database (port 3306)
- **RabbitMQ 3.13**: Message queue (ports 5672, 15672)

### Docker Features
- ✅ **Multi-stage build** with Node.js 18 Alpine
- ✅ **Health checks** for all services
- ✅ **Persistent volumes** for data
- ✅ **Service dependencies** with health checks
- ✅ **Security** with non-root user
- ✅ **Production optimized** with minimal image size

### Access Points
- **API**: http://localhost:9001
- **MySQL**: localhost:3306 (root/password)
- **RabbitMQ Management**: http://localhost:15672 (admin/password)

## 📊 Monitoring

### Health Checks
```bash
# Application health
GET /health

# Response format
{
  "status": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Logs
- **Request Logging**: All HTTP requests with timing
- **Error Logging**: Detailed error information
- **Performance Monitoring**: Response time tracking

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `9001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `workforce_management` |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://localhost:5672` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |



## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   ├── helpers/             # Utility functions
│   ├── middlewares/         # Express middleware
│   ├── model/              # Database models
│   ├── queue/              # RabbitMQ integration
│   ├── repositories/       # Data access layer
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── app.ts              # Application entry point
├── tests/                  # Test files
├── docker-compose.yml      # Docker services
├── package.json           # Dependencies
└── README.md              # This file
```



