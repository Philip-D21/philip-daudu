import { DataTypes, Model } from 'sequelize'
import sequelize from './db'

class DepartmentModel extends Model {
	public id!: string
	public name!:string
	public createdAt!: Date
}


DepartmentModel.init(
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
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Department',
		tableName: 'Departments',
			timestamps: true,
	},
)

export default DepartmentModel
