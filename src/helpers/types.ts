export interface DatabaseConfig {
	username: string
	password: string
	database: string
	host: string
	dialect: string
	port: string
  rabbitmq_url: string
}



export interface ConfigTypes {
	development: DatabaseConfig
	production: DatabaseConfig
}


export enum Status {
	Pending = 'pending',
	PendingApproval = 'pending_approval',
	Approved = 'approved',
	Rejected = 'rejected'
}



export interface LeaveRequestAttributes {
  id?: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;   
  status: Status;
  createdAt: Date;
}

export interface LeaveRquestCreationAttributes
  extends Omit<LeaveRequestAttributes, 'id' | 'createdAt'> {}


export interface DepartmentAttributes {
  id?: string;
  name: string;
  createdAt: Date;
}


export interface DepartmentCreationAttributes
  extends Omit<DepartmentAttributes, 'id' | 'createdAt'> {}


export interface EmployeeAttributes {
  id?: string;
  name: string;
  email: string;       
  departmentId: string;
  createdAt: Date;
}

export interface EmployeeCreationAttributes
  extends Omit<EmployeeAttributes, 'id' | 'createdAt'> {}