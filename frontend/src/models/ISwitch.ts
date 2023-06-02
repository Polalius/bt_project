import { UserInterface } from "./ISignin";

export interface SwitchInterface{
    ID?: number;
    UserSerial?: number;
    LeaveDay?:    string | null;
    FromTime?: number | null;
    ToTime?: number | null;
    Count?: number | null;
    WorkDay?: string | null;
    Status?: string;
    DepID?: number;

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
export interface SwitchsInterface{
    ID?: number;
    UserLname: string;
    DepName: string;
    DepMail: string;
    ManagerMail: string; 
    LeaveDay?:    string | null;
    FromTime?:number | null;
    ToTime?: number | null;
    Count?: number | null;
    WorkDay?:  string | null;
    Status?: string;   
}