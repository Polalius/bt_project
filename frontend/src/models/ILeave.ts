export interface LeaveInterface{
    ID?: number;
    UserSerial?: number;
    Bh?: string | undefined;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    CountL?: number | null
    Status?: string;
    DepID?: number;
    
}

export interface Leave1Interface{
    ID?: number;
    Name: string;
    Email: string; 
    TypeName?: string;
    ManEmail: string;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    DepName?: number;
    Status?: string;
    
}
export interface Leave2Interface{
    ID?: number;
    EmpName?: number;
    TypeName?: string;
    ManName?: string;
    Status?: string;
    DepName?: number;
}
export interface Leave3Interface{
    ID?: number;
    EmpName?: number;
    TypeName?: string;
    StartTime?:  Date;
	StopTime?:    Date;
    ManName?: string;
    Status?: string;
    DepName?: number;
}
export interface LeavesInterface{
    ID?: number;
    UserLname: string;
    DepName: string;
    DepMail: string; 
    Mc: string;
    ManagerMail: string;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    Status: string;
    
}
export interface LeaveTypeInterface{
    Bh?: string;
    Mc?: string;   
}
export interface DepartmentInterface{
    DepID?: number;
    DepName?: string;   
    DepMail:     string;
	ManagerMail: string;
}