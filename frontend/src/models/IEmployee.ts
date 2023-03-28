import { ManagerInterface } from "./IManager";
import { RoleInterface } from "./IRole";

export interface EmployeeInterface {
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    ManagerID?: string;
    ManagerInterface?: ManagerInterface
    RoleID?: string;
    RoleInterface?: RoleInterface;
}
