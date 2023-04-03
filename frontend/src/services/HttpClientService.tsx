import { LeaveInterface } from "../models/ILeave";

const apiUrl = "http://localhost:8080";
async function ListLeaveList() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavelists`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveType() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavetypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListEmployee() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/employees`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveListByEmpID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavelistempid/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeave() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leave`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  async function ListLeaveWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavewait/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveListByDepID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavelist_depid/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveListByDepIDnSWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavelist_depwait/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveListByDepIDnSNWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leavelist_depnwait/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function GetEmployeeByUID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/employeeId/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function CreateLeavaList(data: LeaveInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/leavelists`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
  }
  async function UpdateLeaveList(data: Partial<LeaveInterface>) {
   
    const requestOptions = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
  
    let res = await fetch(`${apiUrl}/leavelists`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          return res
        })
    return res
  }
  async function GetEmployeeID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/employeeId/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function GetManagerID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/manager/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function GetDepartmentID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/department/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function GetLeaveListByID() {
    let l_id = localStorage.getItem("l_id");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/leavelist/${l_id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          return false;
        }
      });
  
    return res;
  }
  export{
    ListLeaveList,
    ListLeaveType,
    ListLeave,
    ListLeaveWait,
    ListLeaveListByEmpID,
    ListLeaveListByDepID,
    ListLeaveListByDepIDnSWait,
    ListLeaveListByDepIDnSNWait,
    GetLeaveListByID,
    UpdateLeaveList,
    GetEmployeeByUID,
    CreateLeavaList,
    ListEmployee,
    GetEmployeeID,
    GetManagerID,
    GetDepartmentID
  }
  