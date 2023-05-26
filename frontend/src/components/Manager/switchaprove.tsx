import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { LeaveInterface } from "../../models/ILeave";
import { GetEmployeeID, GetLeaveListByID, GetManagerID, GetSwitchByID, UpdateLeaveList, UpdateSwitch } from "../../services/HttpClientService";
import React from "react";
import { SwitchInterface } from "../../models/ISwitch";
import { EmployeeInterface } from "../../models/IEmployee";
import { ManagerInterface } from "../../models/IManager";
import axios from "axios";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function SwitchApprove(props: any){
    const { params, EmpEmail, ManEmail } = props;
    const [open, setOpen] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
      };
     
      const handleClose1 = () => {
        setOpen(false);
        setSuccess(false);
        setError(false)
      };
    const [leavelist, setLeavelist] = useState<SwitchInterface>();
    const getSwitchByID = async (id:any) => {
        let res = await GetSwitchByID(id);
        if (res) {
            setLeavelist(res);
            console.log(res)
        }
    }
    const navigator = useNavigate();
    async function approve() {
        try {let data = {
            ID: params,
            EmployeeID: leavelist?.EmployeeID,
            ManagerID: leavelist?.ManagerID,
            LeaveDay: leavelist?.LeaveDay,
            ToTime: leavelist?.ToTime,
            WorkDay: leavelist?.WorkDay,
            Status: "approved"
        };
        console.log(data)
        let res = await UpdateSwitch(data);
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
        // mail();
    } catch (err) {
      setError(true);
      console.log(err);
    }
    }
    async function notapprove() {
        try {
        let data = {
            ID: params,
            EmployeeID: leavelist?.EmployeeID,
            ManagerID: leavelist?.ManagerID,
            LeaveDay: leavelist?.LeaveDay,
            ToTime: leavelist?.ToTime,
            WorkDay: leavelist?.WorkDay,
            Status: "not approved"
        };
        console.log(data)
        let res = await UpdateSwitch(data);
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
        // mail();
    } catch (err) {
      setError(true);
      console.log(err);
    }   
    }
    useEffect(() => {
            getSwitchByID(params);
        }, []);
        async function mail() {
          let data = {
              email:  ManEmail,
              password: "gplilgnlhvmsiedr",
              empemail: EmpEmail
          };
          console.log(data)
          axios.post('http://localhost:8080/mail4', data)
        .then(response => {
          console.log(response.data);
          // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
        })
        .catch(error => {
          console.error(error);
          // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
        });
      }
    return (
        <div>
      <IconButton
        color="inherit"
        size="small"
        aria-label="delete"
        onClick={handleClickOpen}
      >
        <PendingActionsIcon/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ต้องการอนุมัติรายการนี้ ?
        </DialogTitle>
        <DialogActions>
          <Button color="inherit" onClick={handleClose1}>ยกเลิก</Button>
          <Button color="success" onClick={approve} autoFocus>
            อนุมัติ
          </Button>
          <Button color="error" onClick={notapprove} autoFocus>
          ไม่อนุมัติ
          </Button>
        </DialogActions>
        <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          ยืนยันสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          ยืนยันไม่สำเร็จ
        </Alert>
      </Snackbar>
      </Dialog>
      
    </div>
  );
}