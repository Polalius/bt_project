import dayjs, { Dayjs } from "dayjs";
import { EmployeeInterface } from "./IEmployee";
import { ManagerInterface } from "./IManager";
import { DepartmentInterface } from "./IDepartmemt";

export interface LeaveTypeInterface{
    ID?: number;
    TypeName?: string;
    Information?: string;
}
export interface LeaveInterface{
    ID?: number;
    EmployeeID?: number;
    EmployeeInterface?: EmployeeInterface;
    LeaveTypeID?: number;
    LeaveTypeInterface?: LeaveTypeInterface;
    StartTime?:  Date | null;
	StopTime?:    Date | null;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    Status?: string;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}

export interface Leave1Interface{
    ID?: number;
    DepID: number;
    EmpEmail: string;
    ManEmail: string;
    TypeName?: string;
    EmpName?: string;
    ManName?: string;
    StartTime?:  Date | null;
	StopTime?:    Date | null;
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