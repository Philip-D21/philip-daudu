import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

// Import middleware
import { 
  generalLimiter, 
} from './middlewares/rateLimiting'

import { 
  handleNotFound, 
  handleErrors, 
} from './middlewares/errorMiddleware'

// Import routes
import departmentRoutes from './routes/department.route'
import employeeRoutes from './routes/employee.route';
import leaveRoutes from './routes/leave.route';

// Calling the database and sync
import './model/index'
import './model/sync'

// Create an Express app
const app = express()

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	})
)

// Request parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))



// Logging middleware
app.use(morgan('combined'))


// Rate limiting middleware
app.use('/api', generalLimiter)

// Health check endpoint (no rate limiting)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Set view engine
app.set('view engine', 'ejs')

// Define routes with specific rate limiting
app.use('/api/department', departmentRoutes)
app.use('/api/employee',  employeeRoutes)
app.use('/api/leave-request',  leaveRoutes)

// Home route
app.get('/', (req: Request, res: Response) => {
	res.json({
		status: true,
		message: 'Welcome to Workforce Management System API',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		endpoints: {
			health: '/health',
			departments: '/api/department',
			employees: '/api/employee',
			leaveRequests: '/api/leave-request'
		}
	})
})

// Error handling middleware (must be last)
app.use(handleNotFound)
app.use(handleErrors)

// Start the server
const port = process.env.PORT || 9001

app.listen(port, () => {
	console.log(`🚀 Server listening on port ${port}`)
	console.log(`📊 Health check: http://localhost:${port}/health`)
	console.log(`📖 API docs: http://localhost:${port}/`)
})