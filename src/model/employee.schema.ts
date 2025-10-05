import { DataTypes, Model } from 'sequelize'
import sequelize from './db'


class EmployeeModel extends Model {
	public id!: string;
	public name!: string;
	public email!: string;
	public departmentId!: string;
	public createdAt!: Date;
}


EmployeeModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        departmentId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Departments',
				key: 'id'
			}
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Employee',
		tableName: 'Employees',
		 indexes: [
			{ fields: ['departmentId'] },
			{ fields: ['email'], unique: true },
  ],
	
 
	},
)

export default EmployeeModel
