import { Alert, Button, Container, CssBaseline, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LeaveInterface } from "../../models/ILeave";
import { GetLeaveListByID, UpdateLeaveList } from "../../services/HttpClientService";
import { Link as RouterLink, useNavigate } from "react-router-dom";
export default function Approve(){
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
    const [leavelist, setLeavelist] = useState<LeaveInterface>();
    const getLeaveListByID = async () => {
        let res = await GetLeaveListByID();
        if (res) {
            setLeavelist(res);
            console.log(res)
        }
    }
    const navigator = useNavigate();
    async function approve() {
        let data = {
            ID: leavelist?.ID,
            EmployeeID: leavelist?.EmployeeID,
            LeaveTypeID: leavelist?.LeaveTypeID,
            ManagerID: leavelist?.ManagerID,
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "approved"
        };
        console.log(data)
        let res = await UpdateLeaveList(data);
        if (res.data) {
            setAlertMessage("ยืนยันสำเร็จ")
            setSuccess(true);
            setTimeout(() => {
                navigator("/")
            }, 3000)
        } else {
            setAlertMessage(res.error)
            setError(true);
        }
        
    }
    async function notapprove() {
        let data = {
            ID: leavelist?.ID,
            EmployeeID: leavelist?.EmployeeID,
            LeaveTypeID: leavelist?.LeaveTypeID,
            ManagerID: leavelist?.ManagerID,
            StartTime: leavelist?.StartTime,
            StopTime: leavelist?.StopTime,
            Status: "not approved"
        };
        console.log(data)
        let res = await UpdateLeaveList(data);
        if (res.data) {
            setAlertMessage("ยืนยันสำเร็จ")
            setSuccess(true);
            setTimeout(() => {
                navigator("/managershow")
            }, 3000)
        } else {
            setAlertMessage(res.error)
            setError(true);
        }   
    }
    useEffect(() => {
            getLeaveListByID();
        }, []);
    return (
        <div>
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ mt: 10 }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%', borderRadius: 3 }}
                >
                    {alertmessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={error}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ mt: 10 }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%', borderRadius: 3 }}
                >
                    {alertmessage}
                </Alert>
            </Snackbar>
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    mt: 5,
                    mb: 2,
                    p: 2,
                    boxShadow: 3,
                    bgcolor: '#F1F6F5',
                    borderRadius: 3
                }}
            >
                <CssBaseline />
                <Stack
                    sx={{ p: 0, m: 0, mb: 3 }}
                >
                    <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                    >
                        รายการขออนุมัติ
                    </Typography>
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        component={RouterLink}
                        to="/"
                        sx={{ borderRadius: 10, '&:hover': { color: '#FC0000', backgroundColor: '#F9EBEB' } }}
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={approve}
                        sx={{ borderRadius: 10, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                    >
                        อนุมัติ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={notapprove}
                        sx={{ borderRadius: 10, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                    >
                        ไม่อนุมัติ
                    </Button>

                </Stack>

            </Container>

        </div>
    )
}