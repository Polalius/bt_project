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
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';


import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";
import { EmployeeInterface } from "../../models/IEmployee";
import { ManagerInterface } from "../../models/IManager";
import { DepartmentInterface } from "../../models/IDepartmemt";

import { CreateLeavaList, CreateSwitchLeave, GetDepartmentID, GetEmployeeID, GetManagerID, ListLeaveType } from "../../services/HttpClientService";
import { SwitchInterface } from "../../models/ISwitch";
import axios from "axios";


dayjs.extend(utc);
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Form2() {
    interface FromTime {
        fromtime: string;
    }
    const [leavelist, setLeavelist] = useState<Partial<SwitchInterface>>({});
    const [emp, setEmp] = useState<EmployeeInterface>();
    const [man, setMan] = useState<ManagerInterface>();
    const [depart, setDepart] = useState<DepartmentInterface>();
    const [leave, setLeave] = useState<string>('');
    const [work, setWork] = useState<string>('');
    const [ftime, setFtime] = React.useState<number | null>(null);
    const [ttime, setTtime] = React.useState<number | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLeave(event.target.value);
  };
  const handleDateChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWork(event.target.value);
  };
    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = event.target.value;
        const [hours, minutes] = timeString.split(":").map(Number);
        const time = hours * 60 + minutes;
        setFtime(time);
      };
      const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = event.target.value;
        const [hours, minutes] = timeString.split(":").map(Number);
        const time = hours * 60 + minutes;
        setTtime(time);
      };
    function formatTime(time: number): string {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const hoursStr = hours.toString().padStart(2, "0");
        const minutesStr = minutes.toString().padStart(2, "0");
        return `${hoursStr}:${minutesStr}`;
      }
      
    const getEmployeeID = async (id:any) => {
        let res = await GetEmployeeID(id);
        if (res){
            setEmp(res)
        }
    }

    const getManagerID = async (id:any) => {
        let res = await GetManagerID(id);
        if (res){
            setMan(res)
        }
    }
    const getDepartmentID = async (id:any) => {
        let res = await GetDepartmentID(id);
        if (res){
            setDepart(res)
            console.log(res)
        }
    }


    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    

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

    useEffect(()=>{
        getEmployeeID(JSON.parse(localStorage.getItem("uid") || ""));
        getManagerID(JSON.parse(localStorage.getItem("did") || ""));
        getDepartmentID(JSON.parse(localStorage.getItem("did") || ""))
    }, []);
    async function mail() {
        let data = {
            email:  emp?.Email,
            password: "utsbbxeslywlnzdn",
            manemail: man?.Email
        };
        console.log(data)
        axios.post('http://localhost:8080/mail', data)
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
            EmployeeID: convertType(emp?.ID) ?? 0,
            LeaveDay: leave,
            FromTime: ftime,
            ToTime: ttime,
            WorkDay: work,
            ManagerID: convertType(man?.ID) ?? 0,
            DepartmentID: convertType(depart?.ID) ?? 0,
            Status: "pending approval",
            select: selectedDate
        }
        console.log(data)
        let res = await CreateSwitchLeave(data);
        
        if (res.status) {
            setTimeout(() => {
                window.location.href = "/switchshow";
              }, 1200);
            setAlertMessage("บันทึกข้อมูลสำเร็จ");
            setSuccess(true);
            mail();
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
                            color="primary"
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
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">ชื่อ-นามสกุล:{" "+emp?.EmpName}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">Email:{" "+ emp?.Email}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">แผนก:{" "+depart?.DepName}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">ผู้จัดการแผนก:{man?.ManName}</Typography></Grid>
                    
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    
                        <Grid item xs={2}><Typography align="left">วันที่สลับ</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            {/* <DatePicker
                                label="วันที่"
                                
                                value={leave}
                                onChange={(newValue) => {
                                    setLeave(newValue);
                                    console.log(newValue)
                                  }}
                                 
                                  
                            /> */}
                            <input
                        type="date"
                        id="datepicker"
                        value={leave}
                        onChange={handleDateChange}
                    />
                        </FormControl>
                        </Grid>
                        <Grid item xs={2.5}>
                        <FormControl fullWidth variant="outlined">
                        <input
                        type="time"
                        id="timepicker"
                        name="FromTime"
                        value={ftime !== null ? formatTime(ftime) : ""}
                        onChange={handleChange1}
                        />
                        </FormControl>
                        </Grid>
                        <Grid item xs={2.5}>
                        <FormControl fullWidth variant="outlined">
                        <input
                        type="time"
                        name="ToTime"
                        value={ttime !== null ? formatTime(ttime) : ""}
                        onChange={handleChange2}
                        />
                        </FormControl>
                        </Grid>
                        <Grid item xs={2}><Typography>วันที่มาทำงาน</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                        <input
                        type="date"
                        id="datepicker"
                        value={work}
                        onChange={handleDateChange1}
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
                        to="/switchshow"
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                        // onSubmit={mail}
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