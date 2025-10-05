import { Response } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeAttributes, EmployeeCreationAttributes } from '../helpers/types';
import { successResponse, errorResponse } from '../helpers/response';

export class EmployeeService {
  private employeeRepo: EmployeeRepository;

  constructor() {
    this.employeeRepo = new EmployeeRepository();
  }

 
  private async validateEmployeeData(data: EmployeeCreationAttributes, isUpdate = false, currentId?: string) {
    if (!isUpdate) {
      if (!data.name) throw new Error('Name is required');
      if (!data.email) throw new Error('Email is required');
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }

      const existing = await this.employeeRepo.findByEmail(data.email);
      if (existing && existing.id !== currentId) {
        throw new Error('Employee with this email already exists');
      }
    }
  }


  async createEmployee(res: Response, data: EmployeeCreationAttributes) {
    try {
      await this.validateEmployeeData(data);

      const employee = await this.employeeRepo.create(data);
      return successResponse(res, 'Employee created successfully', employee);
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }

 
  async getEmployeeById(res: Response, id: string) {
    try {
      if (!id) throw new Error('Employee ID is required');

      const employee = await this.employeeRepo.findById(id);
      if (!employee) throw new Error('Employee not found');

      return successResponse(res, 'Employee fetched successfully', employee);
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }

 
  async listEmployees(res: Response, departmentId?: string) {
    try {
      const employees = await this.employeeRepo.findAll(departmentId);
      return successResponse(res, 'Employees fetched successfully', employees);
    } catch (err: any) {
      return errorResponse(res, err.message, null);
    }
  }




}
