import { LeaveInterface } from "../models/ILeave";
import { SwitchInterface } from "../models/ISwitch";

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
  
    let res = await fetch(`${apiUrl}/leave_types`, requestOptions)
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
  
    let res = await fetch(`${apiUrl}/leavelist_uid/${id}`, requestOptions)
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
  async function ListLeaveP() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leave_pay`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  async function ListLeaveP1() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leave_pay1`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  // async function ListLeaveStatusDate(data:any) {
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       "Content-Type": "application/json",
  //     },
     
  //   };
  //   let qeury = `?start=${data.start}&stop=${data.stop}`
  //   let res = await fetch(`${apiUrl}/leavedate${qeury}`, requestOptions)
  //   .then((response) => response.json())
  //   .then((res) => {
  //     if (res) {
  //       return res;
  //     } 
  //   });

  // return res;
  // }
  async function ListLeaveWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leave_depwait/${id}`, requestOptions)
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
  async function GetEmployeeID1(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
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
  async function GetManagerID1(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/manager1/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function GetUserID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } 
      });
  
    return res;
  }
  async function ListDepartments() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/departments`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function GetLeaveListByID(l_id:any) {
    
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
  async function ListSwitchByEmpID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_id/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListSwitchByEmpID1(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_id1/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListLeaveByEID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/leave_eid/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function ListSwitchByEID(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_eid/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function CountL1(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/count_l1/${id}`, requestOptions)
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
  async function CountL2(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/count_l2/${id}`, requestOptions)
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
  async function CountL3(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/count_l3/${id}`, requestOptions)
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
  async function CountL4(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/count_l4/${id}`, requestOptions)
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
  async function GetSwitchByID(l_id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/switch/${l_id}`, requestOptions)
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
  async function CountSW(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/countsw/${id}`, requestOptions)
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
  async function CountSW2(id:any) {
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(`${apiUrl}/countsw2/${id}`, requestOptions)
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
  async function ListSwitchByDate(id:any, from:Date, to:Date) {
    const fromDate = from.toISOString().slice(0, 10);
    const toDate = to.toISOString().slice(0, 10);
    const queryParams = `?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    const res = await fetch(`${apiUrl}/switch_date/${id}${queryParams}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  
  async function ListSwitch() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switchs`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  async function ListSwitchP() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_pay`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  async function ListSwitchP1() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_pay1`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
  }
  async function ListSwitchWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_wait/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  async function CreateSwitchLeave(data: SwitchInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/switch_leaves`, requestOptions)
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
  async function UpdateSwitch(data: Partial<SwitchInterface>) {
   
    const requestOptions = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
  
    let res = await fetch(`${apiUrl}/switch_leaves`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          return res
        })
    return res
  }
  async function ListSwitchByDepIDnSNWait(id:any) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/switch_nwait/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          return res;
        } 
      });
  
    return res;
  }
  export{
    ListLeaveList,
    ListLeaveType,
    ListLeave,
    ListLeaveP,
    ListLeaveP1,
    // ListLeaveStatusDate,
    ListLeaveByEID,
    ListLeaveWait,
    ListLeaveListByEmpID,
    ListLeaveListByDepID,
    ListLeaveListByDepIDnSWait,
    ListLeaveListByDepIDnSNWait,
    GetLeaveListByID,
    UpdateLeaveList,
    CountL1,
    CountL2,
    CountL3,
    CountL4,
    GetEmployeeByUID,
    CreateLeavaList,
    ListEmployee,
    GetEmployeeID,
    GetEmployeeID1,
    GetManagerID,
    GetManagerID1,
    GetUserID,
    ListDepartments,
    CountSW,
    CountSW2,
    GetSwitchByID,
    ListSwitchByEID,
    ListSwitch,
    ListSwitchP,
    ListSwitchP1,
    ListSwitchWait,
    ListSwitchByEmpID,
    ListSwitchByEmpID1,
    ListSwitchByDepIDnSNWait,
    CreateSwitchLeave,
    UpdateSwitch
  }
  