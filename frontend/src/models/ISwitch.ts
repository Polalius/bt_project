import { DepartmentInterface } from "./IDepartmemt";
import { EmployeeInterface } from "./IEmployee";
import { ManagerInterface } from "./IManager";

export interface SwitchInterface{
    ID?: number;
    EmployeeID?: number;
    EmployeeInterface?: EmployeeInterface;
    LeaveDay?:    string | null;
    FromTime?: number | null;
    ToTime?: number | null;
    Count?: number | null;
    WorkDay?: string | null;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    Status?: string;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}
export interface Switch1Interface{
    ID?: number;
    DepID: number;
    EmpEmail: string;
    ManEmail: string;
    EmpName?: number;
    LeaveDay?:    string | null;
    FromTime?:number | null;
    ToTime?: number | null;
    Count?: number | null;
    WorkDay?:  string | null;
    ManName?: string;
    Status?: string;
    DepName?: number;
}