import { Alert, Button, Container, CssBaseline, Dialog, DialogActions, DialogTitle, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LeaveInterface } from "../../models/ILeave";
import { GetLeaveListByID, UpdateLeaveList } from "../../services/HttpClientService";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
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
            EmployeeID: leavelist?.EmployeeID,
            LeaveTypeID: leavelist?.LeaveTypeID,
            ManagerID: leavelist?.ManagerID,
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "approved"
        };
        console.log(data)
        let res = await UpdateLeaveList(data);
        setSuccess(true);
      
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
            LeaveTypeID: leavelist?.LeaveTypeID,
            ManagerID: leavelist?.ManagerID,
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "not approved"
        };
        console.log(data)
        let res = await UpdateLeaveList(data);
        setSuccess(true);
      
    } catch (err) {
      setError(true);
      console.log(err);
    }   
    }
    useEffect(() => {
            getLeaveListByID(params);
        }, []);
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