import dayjs, { Dayjs } from "dayjs";
import { EmployeeInterface } from "./IEmployee";
import { ManagerInterface } from "./IManager";

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
}