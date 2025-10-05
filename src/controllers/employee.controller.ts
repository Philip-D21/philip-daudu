// controllers/EmployeeController.ts
import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
  static create(req: Request, res: Response) {
    return employeeService.createEmployee(res, req.body);
  }

  static getById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required', data: null });
    }
    return employeeService.getEmployeeById(res, id);
  }

  static list(req: Request, res: Response) {
    return employeeService.listEmployees(res, req.query.departmentId as string);
  }

}
