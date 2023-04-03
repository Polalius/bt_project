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
    StartTime?:  Dayjs | null;
	StopTime?:    Dayjs | null;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    Status?: string;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}
export interface Leave1Interface{
    ID?: number;
    EmpName?: number;
    TypeName?: string;
    StartTime?:  Dayjs | null;
	StopTime?:    Dayjs | null;
    ManName?: string;
    Status?: string;
    DepName?: number;
}