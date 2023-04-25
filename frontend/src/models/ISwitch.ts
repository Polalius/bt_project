import { DepartmentInterface } from "./IDepartmemt";
import { EmployeeInterface } from "./IEmployee";
import { ManagerInterface } from "./IManager";

export interface SwitchInterface{
    ID?: number;
    EmployeeID?: number;
    EmployeeInterface?: EmployeeInterface;
    LeaveDay?:    Date | null;
    FromTime?: Date | null;
    ToTime?: Date | null;
    WorkDay?:  Date | null;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    Status?: string;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}
export interface Switch1Interface{
    ID?: number;
    EmpName?: number;
    LeaveDay?:    Date | null;
    FromTime?: Date | null;
    ToTime?: Date | null;
    WorkDay?:  Date | null;
    ManName?: string;
    Status?: string;
    DepName?: number;
}