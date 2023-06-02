import React from "react";
import { forwardRef, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MuiAlert from "@mui/material/Alert";
import { AlertProps, Box, Button, Container, 
    CssBaseline, Divider, FormControl, Grid, 
    Paper, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, DateTimePicker, LocalizationProvider, TimeField, TimePicker } from '@mui/x-date-pickers';


import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";

import { CreateLeavaList, CreateSwitchLeave, GetDepartmentID, GetEmployeeID, GetEmployeeID1, GetManagerID, ListLeaveType } from "../../services/HttpClientService";
import { SwitchInterface } from "../../models/ISwitch";
import axios from "axios";
import { User1Interface } from "../../models/ISignin";


dayjs.extend(utc);
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Form2() {
    const [leavelist, setLeavelist] = useState<Partial<SwitchInterface>>({});
    const [leave, setLeave] = useState<string>('');
    const [work, setWork] = useState<string>('');
    const [ftime, setFtime] = React.useState<number | null>(null);
    const [ttime, setTtime] = React.useState<number | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const [user ,setUser] = useState<User1Interface>();

    const handleDateChange = (newValue: Date | null) => {
        if (newValue !== null) {
            const year = newValue.getFullYear();
            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
            const day = newValue.getDate().toString().padStart(2, '0');
            const dateString = `${month}/${day}/${year}`;
            setLeave(dateString);
          } else {
            setLeave('');
          }
      };
      const handleDateChange2 = (newValue: Date | null) => {
        if (newValue !== null) {
            const year = newValue.getFullYear();
            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
            const day = newValue.getDate().toString().padStart(2, '0');
            const dateString = `${month}/${day}/${year}`;
          setWork(dateString);
        } else {
          setWork('');
        }
      };
    const reverseDate = (str: string) => {
        let strParts = str.split('/');
        const reversedDate = `${strParts[1]}/${strParts[0]}/${strParts[2]}`;
        return reversedDate
    }
  const handleChange1 = (newValue: Date | null) => {
    if (newValue !== null) {
      const hours = newValue.getHours();
      const minutes = newValue.getMinutes();
      const time = hours * 60 + minutes;
      setFtime(time);
    } else {
      setFtime(null);
    }
  };
  const handleChange2 = (newValue: Date | null) => {
    if (newValue !== null) {
      const hours = newValue.getHours();
      const minutes = newValue.getMinutes();
      const time = hours * 60 + minutes;
      setTtime(time);
    } else {
      setTtime(null);
    }
  };
      


    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };
    
    const Count = (f: any, t: any) => {
        if (t - f > 300) {
            const val = t - f - 60
          return val;
        } else {
            const val = t - f
          return val;
        }
      }
    

    const handleClose = (event?: React.SyntheticEvent | Event,reason?: string) => {
        if (reason === "clickaway") {
            return;
          }
          setSuccess(false);
          setError(false);
      };

      const handleChange = (event: SelectChangeEvent<number>) => {
        const name = event.target.name as keyof typeof leavelist;
        setLeavelist({
            ...leavelist,
            [name]: event.target.value,
        });
    };
    const getEmployeeID = async (id:any) => {
        let res = await GetEmployeeID1(id);
        if (res){
            setUser(res)
        }
    }
    const uid = localStorage.getItem("user_serial") || "";
    const dep_id = localStorage.getItem("dep_id") || "";
    useEffect(()=>{
        getEmployeeID(JSON.parse(uid));
    }, []);
    async function mail() {
        let data = {
            email:  user?.DepMail,
            password: "utsbbxeslywlnzdn",
            manemail: user?.ManagerMail
        };
        console.log(data)
        axios.post('http://localhost:8080/mail2', data)
      .then(response => {
        console.log(response.data);
        // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
      })
      .catch(error => {
        console.error(error);
        // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
      });
    }
    async function submit(){
        let data = {
            UserSerial: convertType(user?.UserSerial) ?? 0,
            LeaveDay: reverseDate(leave),
            FromTime: ftime,
            ToTime: ttime,
            Count: Count(ftime,ttime),
            WorkDay: reverseDate(work),
            DepID: convertType(dep_id) ?? 0,
            Status: "pending approval",
        }
        console.log(data)
        let res = await CreateSwitchLeave(data);
        
        if (res.status) {
            setTimeout(() => {
                window.location.href = "/รายการสลับวันลา";
              }, 1200);
            setAlertMessage("บันทึกข้อมูลสำเร็จ");
            setSuccess(true);
            // mail();
        } else {
            setAlertMessage(res.message);
            setError(true);
        }
    }

    return (
        <div>
            <Snackbar
                id="success"
                open={success}
                autoHideDuration={8000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar
                id="error"
                open={error}
                autoHideDuration={8000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    marginTop: 2,
                    
                }}>
                <CssBaseline />
                <Paper
                    className="paper"
                    elevation={6}
                    sx={{
                    padding: 2,
                    borderRadius: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            color="secondary"
                            align="center"
                            sx={{ padding: 2, fontWeight: "bold", marginTop: 1 }}
                        >
                            แบบฟอร์มสลับวันลา
                        </Typography>
                    </Box>
                    <Divider />
                
                <Grid container spacing={1} sx={{ padding: 1 }}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={2.5}></Grid>
                <Grid container spacing={{ xs: 12, md: 5 }}>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">ชื่อ-นามสกุล:{" "+user?.UserLname}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">Email:{" "+ user?.DepMail}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">แผนก:{" "+user?.DepName}</Typography></Grid>
                    
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    
                        
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <DatePicker
                                label="วันที่สลับวันลา"
                                value={leave !== '' ? new Date(leave) : null}
                                onChange={handleDateChange}
                                format="dd/MM/yyyy"
                            />
                        </FormControl>
                        </Grid>
                        <Grid item xs={2.5}>
                        <FormControl fullWidth variant="outlined">
                        <TimePicker
                            label="เวลา"
                            ampm={false}
                            value={ftime !== null ? new Date(0, 0, 0, Math.floor(ftime / 60), ftime % 60) : null}
                            onChange={handleChange1}
                            format="HH:mm"
                        />
                        </FormControl>
                        </Grid>
                        <Grid item xs={2.5}>
                        <FormControl fullWidth variant="outlined">
                        <TimePicker
                            label="ถึงเวลา"
                            ampm={false}
                            value={ttime !== null ? new Date(0, 0, 0, Math.floor(ttime / 60), ttime % 60) : null}
                            onChange={handleChange2}
                            format="HH:mm"
                        />
                        </FormControl>
                        </Grid>
                        
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                        <DatePicker
                                label="วันที่มาทำงาน"
                                value={work !== '' ? new Date(work) : null}
                                onChange={handleDateChange2}
                                format="dd/MM/yyyy"
                            />
                        </FormControl>
                        </Grid>
                    </LocalizationProvider>
                </Grid>
                    
          </Grid>
          <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                            to="/รายการสลับวันลา"
                        
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        บันทึกข้อมูล
                    </Button>

            </Stack>
            </Paper>
            </Container>
        </div>
    )
}
export default Form2