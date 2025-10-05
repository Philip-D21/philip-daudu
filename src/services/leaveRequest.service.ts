import { Response } from 'express';
import { LeaveRequestRepository } from '../repositories/leaveRequest.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveRquestCreationAttributes, Status } from '../helpers/types';
import { successResponse, errorResponse } from '../helpers/response';
import { LeaveRequestProducer } from '../queue/producer';

export class LeaveRequestService {
  private leaveRepo: LeaveRequestRepository;
  private employeeRepo: EmployeeRepository;
  private leaveRequestProducer: LeaveRequestProducer;

  constructor() {
    this.leaveRepo = new LeaveRequestRepository();
    this.employeeRepo = new EmployeeRepository();
    this.leaveRequestProducer = LeaveRequestProducer.getInstance();
  }


  async createLeaveRequest(res: Response, data: LeaveRquestCreationAttributes) {
    try {
      if (!data.employeeId) throw new Error('Employee ID is required');
      if (!data.startDate || !data.endDate) throw new Error('Start and End dates are required');

      const employee = await this.employeeRepo.findById(data.employeeId);
      if (!employee) throw new Error('Employee not found');

      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new Error('End date must be after start date');
      }

      const leave = await this.leaveRepo.create({
        ...data,
        status: Status.Pending,
      });

      // Publish to message queue
      await this.leaveRequestProducer.publishLeaveRequest(leave);
     
      return successResponse(res, 'Leave request created successfully', leave);
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }

  
  async getEmployeeWithLeaveHistory(res: Response, employeeId: string) {
    try {
      if (!employeeId) throw new Error('Employee ID is required');

      const employee = await this.employeeRepo.findById(employeeId);
      if (!employee) throw new Error('Employee not found');

      const leaveHistory = await this.leaveRepo.findByEmployeeId(employeeId);

      return successResponse(res, 'Employee with leave history fetched successfully', {
        ...employee,
        leaveHistory,
      });
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }
}
