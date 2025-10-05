import {
  DepartmentAttributes,
  DepartmentCreationAttributes,
} from "../helpers/types";
import DepartmentModel from "../model/department.schema";

export class DepartmentRepository {
  async create(
    data: DepartmentCreationAttributes
  ): Promise<DepartmentAttributes> {
    const department = await DepartmentModel.create(data);
    return department.get({ plain: true }) as DepartmentAttributes;
  }

  async findById(id: string): Promise<DepartmentAttributes | null> {
    try {
      const department = await DepartmentModel.findByPk(id);
      return department
        ? (department.get({ plain: true }) as DepartmentAttributes)
        : null;
    } catch (error) {
      console.error(`Error finding department by id (${id}):`, error);
      throw new Error("Failed to find department");
    }
  }

  async findByName(name: string): Promise<DepartmentAttributes | null> {
    const department = await DepartmentModel.findOne({ where: { name } });
    return department
      ? (department.get({ plain: true }) as DepartmentAttributes)
      : null;
  }

  async findAll(): Promise<DepartmentAttributes[]> {
    const departments = await DepartmentModel.findAll();
    return departments.map(
      (d) => d.get({ plain: true }) as DepartmentAttributes
    );
  }
}
