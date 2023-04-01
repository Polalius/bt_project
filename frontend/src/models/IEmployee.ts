import { DepartmentInterface } from "./IDepartmemt";
import { RoleInterface } from "./IRole";
import { SigninInterface } from "./ISignin";

export interface EmployeeInterface {
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;

    UserID?: number;
    UserInterface?: SigninInterface;
    RoleID?: number;
    RoleInterface?: RoleInterface;
    DepartmentID?: number;
    DepartmentInterface?: DepartmentInterface;
}
