import DepartmentModel from './department.schema';
import EmployeeModel from './employee.schema';
import LeaveRequestModel from './leaveRequest.schema';

// Department and Employee associations
DepartmentModel.hasMany(EmployeeModel, { 
    foreignKey: 'departmentId', 
    onDelete: 'CASCADE' 
});

EmployeeModel.belongsTo(DepartmentModel, { 
    foreignKey: 'departmentId' 
});

// Employee and LeaveRequest associations
EmployeeModel.hasMany(LeaveRequestModel, { 
    foreignKey: 'employeeId', 
    onDelete: 'CASCADE' 
});

LeaveRequestModel.belongsTo(EmployeeModel, { 
    foreignKey: 'employeeId' 
});

export {
    DepartmentModel,
    EmployeeModel,
    LeaveRequestModel
};