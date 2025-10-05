
import { Request, Response } from 'express';
import { LeaveRequestService } from '../services/leaveRequest.service';

const leaveService = new LeaveRequestService();

export class LeaveRequestController {
  static create(req: Request, res: Response) {
    return leaveService.createLeaveRequest(res, req.body);
  }

  static getEmployeeWithHistory(req: Request, res: Response) {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }
    return leaveService.getEmployeeWithLeaveHistory(res, employeeId);
  }
}
