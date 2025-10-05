import { Response } from 'express';
import { DepartmentRepository } from '../repositories/department.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { DepartmentCreationAttributes } from '../helpers/types';
import { successResponse, errorResponse } from '../helpers/response';

export class DepartmentService {
  private departmentRepo: DepartmentRepository;
  private employeeRepo: EmployeeRepository;

  constructor() {
    this.departmentRepo = new DepartmentRepository();
    this.employeeRepo = new EmployeeRepository();
  }

  async createDepartment(res: Response, data: DepartmentCreationAttributes) {
    try {
      if (!data.name) throw new Error('Department name is required');

      const exists = await this.departmentRepo.findByName(data.name);
      if (exists) throw new Error('Department already exists');

      const department = await this.departmentRepo.create(data);
      return successResponse(res, 'Department created successfully', department);
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }

  async listEmployeesInDepartment(
    res: Response,
    departmentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      if (!departmentId) throw new Error('Department ID is required');

      const department = await this.departmentRepo.findById(departmentId);
      if (!department) throw new Error('Department not found');

      const offset = (page - 1) * limit;
      const { rows, count } = await this.employeeRepo.findPaginatedByDepartment(departmentId, limit, offset);

      return successResponse(res, 'Employees fetched successfully', {
        total: count,
        page,
        limit,
        employees: rows,
      });
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }
}
