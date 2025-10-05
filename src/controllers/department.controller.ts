import { Request, Response } from 'express';
import { DepartmentService } from '../services/department.service';

const departmentService = new DepartmentService();

export class DepartmentController {
  static create(req: Request, res: Response) {
    return departmentService.createDepartment(res, req.body);
  }

  static listEmployees(req: Request, res: Response) {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!id) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    return departmentService.listEmployeesInDepartment(res, id, page, limit);
  }
}
