

export interface SigninInterface {
    username: string,
    userpass: string,
}
export interface UserInterface {
    ID?: number,
    UserName?: string,
    Name?: string,
    Email?: string,
    JobPosition?:		string,			
	ManagerName?: 		string,
	ManagerEmail?:	string,
	DepartmentName?:	string,
	DepartmentEmail?:	string,
    
}
export interface User1Interface {
    UserSerial: number;
    UserName: string;
    UserLname: string;
    DepName: string;
    DepMail: string;
    ManagerMail: string;  
}
