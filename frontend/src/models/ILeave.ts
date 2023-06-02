import dayjs, { Dayjs } from "dayjs";

import { User1Interface, UserInterface } from "./ISignin";

export interface LeaveTypeInterface{
    ID?: number;
    TypeName?: string;
    Information?: string;
}
export interface LeaveInterface{
    ID?: number;
    UserSerial?: number;
    LeaveType?: string;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    CountL?: number | null
    Status?: string;
    DepID?: number;
    
}

export interface Leave1Interface{
    ID?: number;
    Name: string;
    Email: string; 
    TypeName?: string;
    ManEmail: string;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    DepName?: number;
    Status?: string;
    
}
export interface Leave2Interface{
    ID?: number;
    EmpName?: number;
    TypeName?: string;
    ManName?: string;
    Status?: string;
    DepName?: number;
}
export interface Leave3Interface{
    ID?: number;
    EmpName?: number;
    TypeName?: string;
    StartTime?:  Date;
	StopTime?:    Date;
    ManName?: string;
    Status?: string;
    DepName?: number;
}
export interface LeavesInterface{
    ID?: number;
    UserLname: string;
    DepName: string;
    DepMail: string; 
    LeaveType?: string;
    ManagerMail: string;
    StartDate?:  string | null;
    StartTime?:  number | null;
	StopDate?:    string | null;
	StopTime?:    number | null;
    Status?: string;
    
}