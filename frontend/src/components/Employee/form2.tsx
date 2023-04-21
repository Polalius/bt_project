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
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';


import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";
import { EmployeeInterface } from "../../models/IEmployee";
import { ManagerInterface } from "../../models/IManager";
import { DepartmentInterface } from "../../models/IDepartmemt";

import { CreateLeavaList, CreateSwitchLeave, GetDepartmentID, GetEmployeeID, GetManagerID, ListLeaveType } from "../../services/HttpClientService";
import { SwitchInterface } from "../../models/ISwitch";


dayjs.extend(utc);
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Form2() {

    const [leavelist, setLeavelist] = useState<Partial<SwitchInterface>>({});
    const [emp, setEmp] = useState<EmployeeInterface>();
    const [man, setMan] = useState<ManagerInterface>();
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

    async function submit(){
        let data = {
            EmployeeID: convertType(emp?.ID) ?? 0,
            WorkTime: start,
            LeaveTime: stop,
            ManagerID: convertType(man?.ID) ?? 0,
            DepartmentID: convertType(depart?.ID) ?? 0,
            Status: "pending approval",
        }
        console.log(data)
        let res = await CreateSwitchLeave(data);
        
        if (res.status) {
            // setTimeout(() => {
            //     window.location.href = `mailto:${man?.Email}?subject=คำร้องขอลา&body=ข้าพเจ้า${emp?.EmpName} ขอลาตั้งแต่ ${start} ถึง ${stop} `;
            //   }, 800);
            setAlertMessage("บันทึกข้อมูลสำเร็จ");
            setSuccess(true);
        } else {
            setAlertMessage(res.message);
            setError(true);
        }
    }
    
    // async function mail() {
    //     // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
    //     let transporter = nodemailer.createTransport({
    //       host: 'smtp.gmail.com',
    //       port: 587,
    //       secure: false, // true for 465, false for other ports
    //       auth: {
    //         user: 'b6217112@g.sut.ac.th',
    //         pass: '1301601167887',
    //       },
    //     });
      
    //     let info = await transporter.sendMail({
    //       from: 'b6217112@g.sut.ac.th',
    //       to: 'napakant1235@gmail.com',
    //       subject: 'hello world',
    //       html: "emailHtml",
    //     });
    //     console.log('Message sent: %s', info.messageId);
    //   }

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
                    <Grid item xs={12}><Typography>เรียน:{man?.ManName}</Typography></Grid>
                    <Grid item xs={6}><Typography>ข้าพเจ้า:{" "+emp?.EmpName}</Typography></Grid>
                    <Grid item xs={6}><Typography>แผนก:{" "+depart?.DepName}</Typography></Grid>
                    <Grid item xs={12}><Typography>Email:{" "+ emp?.Email}</Typography></Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={1.8}><Typography>วันที่สลับ</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <DateTimePicker
                                label="วันที่และเวลา"
                                
                                value={start}
                                onChange={(newValue) => {
                                    setStart(newValue);
                                    console.log(newValue)
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                  
                            />
                        </FormControl>
                        </Grid>
                        <Grid item xs={1}><Typography>วันที่มาทำงาน</Typography></Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <DatePicker
                                
                                label="วันที่"
                                value={stop}
                                onChange={(newValue) => {
                                    setStop(newValue);
                                  
                                }}
                                renderInput={(params) => <TextField {...params} />}
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
                        to="/show2"
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