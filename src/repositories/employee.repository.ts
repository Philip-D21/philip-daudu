import {
  EmployeeAttributes,
  EmployeeCreationAttributes,
} from "../helpers/types";
import EmployeeModel from "../model/employee.schema";

export class EmployeeRepository {
  async create(data: EmployeeCreationAttributes): Promise<EmployeeAttributes> {
    const employee = await EmployeeModel.create(data);
    return employee.get({ plain: true }) as EmployeeAttributes;
  }

  async findById(id: string): Promise<EmployeeAttributes | null> {
    const employee = await EmployeeModel.findByPk(id);
    return employee
      ? (employee.get({ plain: true }) as EmployeeAttributes)
      : null;
  }

  async findByEmail(email: string): Promise<EmployeeAttributes | null> {
    const employee = await EmployeeModel.findOne({ where: { email } });
    return employee
      ? (employee.get({ plain: true }) as EmployeeAttributes)
      : null;
  }

  async findAll(departmentId?: string): Promise<EmployeeAttributes[]> {
    const where = departmentId ? { departmentId } : {};
    const employees = await EmployeeModel.findAll({ where });
    return employees.map((e) => e.get({ plain: true }) as EmployeeAttributes);
  }

  async findPaginatedByDepartment(
    departmentId: string,
    limit: number,
    offset: number
  ) {
    const { rows, count } = await EmployeeModel.findAndCountAll({
      where: { departmentId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      rows: rows.map((e) => e.get({ plain: true }) as EmployeeAttributes),
      count,
    };
  }
}
