import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();


// Create a new employee
router.post('/', EmployeeController.create);

// Get employee by ID
router.get('/:id', EmployeeController.getById);

// List all employees 
router.get('/', EmployeeController.list);

export default router;
