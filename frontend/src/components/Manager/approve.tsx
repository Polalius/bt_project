import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { LeaveInterface } from "../../models/ILeave";
import { GetEmployeeID, GetLeaveListByID, GetManagerID, UpdateLeaveList } from "../../services/HttpClientService";
import React from "react";

import axios from "axios";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Approve(props: any){
    const { params } = props;
    
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
    const [leavelist, setLeavelist] = useState<LeaveInterface>();
    const getLeaveListByID = async (id:any) => {
        let res = await GetLeaveListByID(id);
        if (res) {
            setLeavelist(res);
            console.log(res)
        }
    }
    const navigator = useNavigate();
    async function approve() {
        try {let data = {
            ID: params,
            UserSerial: leavelist?.UserSerial,
            LeaveType: leavelist?.LeaveType,
            
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "approved"
        };
        console.log(data)
        console.log(params)
        
        let res = await UpdateLeaveList(data);
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
    } catch (err) {
      setError(true);
      console.log(err);
    }
    }
    async function notapprove() {
        try {
        let data = {
            ID: params,
            UserSerial: leavelist?.UserSerial,
            LeaveType: leavelist?.LeaveType,
            
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "not approved"
        };
        console.log(data)
        let res = await UpdateLeaveList(data);
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
        
    } catch (err) {
      setError(true);
      console.log(err);
    }   
    }
    const uid = localStorage.getItem("uid") || "";
    const did = localStorage.getItem("did") || "";
    useEffect(() => {
            getLeaveListByID(params);
        }, []);
<<<<<<< HEAD
=======
        async function mail() {
          let data = {
              email:  ManEmail,
              password: "gplilgnlhvmsiedr",
              empemail: EmpEmail
          };
          console.log(data)
          axios.post('http://localhost:8080/mail3', data)
        .then(response => {
          console.log(response.data);
          // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
        })
        .catch(error => {
          console.error(error);
          // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
        });
      }
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819

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