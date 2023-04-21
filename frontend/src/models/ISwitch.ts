import { DepartmentInterface } from "./IDepartmemt";
import { EmployeeInterface } from "./IEmployee";
import { ManagerInterface } from "./IManager";

export interface SwitchInterface{
    ID?: number;
    EmployeeID?: number;
    EmployeeInterface?: EmployeeInterface;
    WorkTime?:  Date | null;
	LeaveTime?:    Date | null;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    Status?: string;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}
