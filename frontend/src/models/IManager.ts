import { RoleInterface } from "./IRole";
import { SigninInterface } from "./ISignin";

export interface ManagerInterface{
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    UserID?: number;
    UserInterface?: SigninInterface;
    RoleID?: number;
    RoleInterface?: RoleInterface;
}