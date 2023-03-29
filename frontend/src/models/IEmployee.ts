import { ManagerInterface } from "./IManager";
import { RoleInterface } from "./IRole";
import { SigninInterface } from "./ISignin";

export interface EmployeeInterface {
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    ManagerID?: number;
    ManagerInterface?: ManagerInterface;
    UserID?: number;
    UserInterface?: SigninInterface;
    RoleID?: number;
    RoleInterface?: RoleInterface;
}
