import { Router } from 'express';
import { LeaveRequestController } from '../controllers/leaveRequest.controller';

const router = Router();

// Create a new leave request
router.post('/', LeaveRequestController.create);


// Get employee with leave history
router.get('/employee/:id/history', LeaveRequestController.getEmployeeWithHistory);


export default router;