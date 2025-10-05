import LeaveRequestModel from '../model/leaveRequest.schema';
import { LeaveRequestAttributes, LeaveRquestCreationAttributes, Status } from '../helpers/types';

export class LeaveRequestRepository {
  async create(data: LeaveRquestCreationAttributes): Promise<LeaveRequestAttributes> {
    const request = await LeaveRequestModel.create(data);
    return request.get({ plain: true }) as LeaveRequestAttributes;
  }

  async findById(id: string): Promise<LeaveRequestAttributes | null> {
    const request = await LeaveRequestModel.findByPk(id);
    return request ? (request.get({ plain: true }) as LeaveRequestAttributes) : null;
  }

  async findByEmployeeId(employeeId: string): Promise<LeaveRequestAttributes[]> {
    const requests = await LeaveRequestModel.findAll({ where: { employeeId } });
    return requests.map(r => r.get({ plain: true }) as LeaveRequestAttributes);
  }

  async update(id: string, data: Partial<LeaveRquestCreationAttributes>): Promise<[affectedCount: number]> {
    return await LeaveRequestModel.update(data, { where: { id } });
  }

  async updateStatus(id: string, status: Status): Promise<[affectedCount: number]> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<number> {
    return await LeaveRequestModel.destroy({ where: { id } });
  }
}
