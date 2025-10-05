import { DataTypes, Model } from 'sequelize'
import sequelize from './db'
import { Status } from '../helpers/types'


class LeaveRequestModel extends Model {
	public id!:  string  | null;
    public employeeId!: string  | null;
    public startDate!: Date;
    public endDate!: Date;
    public status!: Status;
}


LeaveRequestModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		employeeId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Employees',
				key: 'id'
			}
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        endDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM,
			values: Object.values(Status),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'LeaveRequest',
		tableName: 'leaveRequests',
		indexes: [
		{ fields: ['employeeId'] },
		{ fields: ['status'] },
  ],
	},
)

export default LeaveRequestModel
