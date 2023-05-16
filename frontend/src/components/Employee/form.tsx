import React from "react";
import { forwardRef, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MuiAlert from "@mui/material/Alert";
import { AlertProps, Box, Button, Container, 
    CssBaseline, Divider, FormControl, Grid, 
    Paper, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';


import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";
import { EmployeeInterface } from "../../models/IEmployee";
import { ManagerInterface } from "../../models/IManager";
import { DepartmentInterface } from "../../models/IDepartmemt";

import { CreateLeavaList, GetDepartmentID, GetEmployeeID, GetManagerID, ListLeaveType } from "../../services/HttpClientService";


dayjs.extend(utc);
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Form() {

    const [leavelist, setLeavelist] = useState<Partial<LeaveInterface>>({});
    const [emp, setEmp] = useState<EmployeeInterface>();
    const [man, setMan] = useState<ManagerInterface>();
    const [ltype, setLType] = useState<LeaveTypeInterface[]>([]);
    const [depart, setDepart] = useState<DepartmentInterface>();
    const [start, setStart] = React.useState<Date | null>(new Date());
    const [stop, setStop] = React.useState<Date | null>(new Date());
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");

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

    const getLeaveType = async () => {
        let res = await ListLeaveType();
        if (res.data) {
          setLType(res.data);
        }
    };


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
    const uid = localStorage.getItem("uid") || "";
    const did = localStorage.getItem("did") || "";
    useEffect(()=>{
        getLeaveType();
        getEmployeeID(JSON.parse(uid));
        getManagerID(JSON.parse(did));
        getDepartmentID(JSON.parse(did))
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
            LeaveTypeID: convertType(leavelist?.LeaveTypeID) ?? 0,
            StartTime: start,
            StopTime: stop,
            ManagerID: convertType(man?.ID) ?? 0,
            DepartmentID: convertType(depart?.ID) ?? 0,
            Status: "pending approval",
        }
        console.log(data)
        let res = await CreateLeavaList(data);
        
        if (res.status) {
            setTimeout(() => {
                window.location.href = "/show";
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
                            แบบฟอร์มลางาน
                        </Typography>
                    </Box>
                    <Divider />
                
                <Grid container spacing={1} sx={{ padding: 1 }}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={2.5}></Grid>
                <Grid container spacing={{ xs: 12, md: 5 }}>
                    <Grid item xs={0.5}><Typography>เรื่อง:</Typography></Grid>
                    <Grid item xs={8} sx={{ mt: 1 }}>
                        <FormControl variant="outlined"  >
                            <Select
                                required
                                size='small'
                                sx={{ borderRadius: 3, bgcolor: '#fff', width: 200}}
                                value={leavelist.LeaveTypeID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "LeaveTypeID",
                                }}
                                native
                            >
                                <option aria-label="None" value="">
                                        หัวข้อการลา
                                </option>
                                {ltype.map((item: LeaveTypeInterface) => (
                                    <option value={Number(item.ID)} key={item.ID}>
                                        {item.TypeName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        
                    </Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">ชื่อ-นามสกุล:{" "+emp?.EmpName}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">Email:{" "+ emp?.Email}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">แผนก:{" "+depart?.DepName}</Typography></Grid>
                    <Grid item xs={12}><Typography align="left" textTransform="capitalize">ผู้จัดการแผนก:{man?.ManName}</Typography></Grid>
                    
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={1.8}><Typography>ขอลาตั้งแต่</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <DateTimePicker
                                label="วันที่และเวลา"
                                ampm={false}
                                value={start}
                                onChange={(newValue) => {
                                    setStart(newValue);
                                    console.log(newValue)
                                  }}
                                  
                                  
                            />
                        </FormControl>
                        </Grid>
                        <Grid item xs={1}><Typography>ถึง</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <DateTimePicker
                                
                                label="วันที่และเวลา"
                                ampm={false}
                                value={stop}
                                onChange={(newValue) => {
                                    setStop(newValue);
                                  
                                }}
                                
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
                        to="/show"
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
export default Form