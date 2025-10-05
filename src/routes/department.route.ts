import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';


const router = Router();


// Create a new department
router.post('/', 
 DepartmentController.create
);


// Get all employees in a department with pagination
router.get('/:id/employees',
 DepartmentController.listEmployees
);


export default router;