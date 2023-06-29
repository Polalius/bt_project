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
    Paper, Select, SelectChangeEvent, Snackbar, Stack, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";
import { User1Interface } from "../../models/ISignin";

import { CreateLeavaList, GetEmployeeID1, ListLeaveType } from "../../services/HttpClientService";

dayjs.extend(utc);
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Form1() {

    const [leavelist, setLeavelist] = useState<Partial<LeaveInterface>>({});
    const [ltype, setLType] = useState<LeaveTypeInterface[]>([]);
    const [start, setStart] = React.useState<Date | null>();
    const [stop, setStop] = React.useState<Date | null>();
    const [startdate, setStartDate] = useState<string>('');
    const [starttime, setStartTime] = useState<number | null>(null);
    const [stopdate, setStopDate] = useState<string>('');
    const [stoptime, setStopTime] = useState<number | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const [user ,setUser] = useState<User1Interface>();

    const handleDateTimeChange = (newValue: Date | null) => {
        if (newValue !== null) {
            const year = newValue.getFullYear();
            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
            const day = newValue.getDate().toString().padStart(2, '0');
            const dateString = `${day}/${month}/${year}`;
            const hours = newValue.getHours();
            const minutes = newValue.getMinutes();
            const time = hours * 60 + minutes;
            setStartDate(dateString);
            setStartTime(time);
          } else {
            setStartDate('');
            setStartTime(null)
          }
    };

    const handleDateTimeChange2 = (newValue: Date | null) => {
        if (newValue !== null) {
            const year = newValue.getFullYear();
            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
            const day = newValue.getDate().toString().padStart(2, '0');
            const dateString = `${day}/${month}/${year}`;
            const hours = newValue.getHours();
            const minutes = newValue.getMinutes();
            const time = hours * 60 + minutes;
            setStopDate(dateString);
            setStopTime(time);
          } else {
            setStopDate('');
            setStopTime(null)
          }
    };

    const compareDates = (start_date: string, stop_date: string) => {
        // แยกวันที่, เดือน, และปีจากสตริง
        const startParts = start_date.split('/');
        const stopParts = stop_date.split('/');
      
        // สร้างวัตถุ Date โดยใช้ปี, เดือน (ลบ 1 เนื่องจากเดือนใน Date เริ่มนับจาก 0), และวัน
        const start = new Date(+startParts[2], +startParts[1] - 1, +startParts[0]);
        const stop = new Date(+stopParts[2], +stopParts[1] - 1, +stopParts[0]);
      
        // เทียบว่าเป็นวันเดียวกันหรือไม่
        if (start.toDateString() === stop.toDateString()) {
          return 0;
        }
      
        // คำนวณจำนวนวันระหว่างวันที่
        const timeDiff = Math.abs(stop.getTime() - start.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }
    const Count = (st_d:string,st:any,sp_d:string,sp:any) => {
        const comp = compareDates(st_d,sp_d)
        if (comp >= 1) {
            console.log(comp)
            let val = 0
            for (let i = 0; i <= comp; i++) {
                if (i == 0) {
                    if (1020 - st > 300)  {
                        val += 1020 - st - 60
                        console.log("1" +val)
                    }else{
                        val += 1020 - st
                    }
                }else if (i == comp) {
                    if (sp - 480 > 300) {
                        val += sp - 480 - 60
                        console.log("end" +val)
                    }else{
                        val += sp - 480
                        console.log("c" +val)
                    }
                }else{
                    val += 480
                    console.log("o" +val)
                }
            }
            return val;
        } else {
           console.log(comp)
            if (sp - st > 300) {
                const val = sp - st - 60
                return val;
            }else {
                const val = sp - st
                return val;
            } 
        }
    }

    const getLeaveType = async () => {
        let res = await ListLeaveType();
        if (res.data) {
          setLType(res.data);
        }
        console.log(res.data)
    };

    const getEmployeeID = async (id:any) => {
        let res = await GetEmployeeID1(id);
        if (res){
            setUser(res)
        }
    }

    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    const eightAM = dayjs().set('hour', 8).startOf('hour');
    const fivePM = dayjs().set('hour', 17).set('minute', 0);

    const handleClose = (event?: React.SyntheticEvent | Event,reason?: string) => {
        if (reason === "clickaway") {
            return;
          }
          setSuccess(false);
          setError(false);
      };

      const handleChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof typeof leavelist;
        console.log(name)
        console.log(event.target.value)
        setLeavelist({
            ...leavelist,
            [name]: event.target.value,
        });
        
    };

    const uid = localStorage.getItem("user_serial") || "";
    const dep_id = localStorage.getItem("dep_id") || "";
    useEffect(()=>{
        getEmployeeID(JSON.parse(uid));
        getLeaveType()
    }, []);

    async function mail() {
        let data = {
            email:  user?.DepMail,
            password: "utsbbxeslywlnzdn",
            manemail: user?.ManagerMail
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
            UserSerial: convertType(user?.UserSerial) ?? 0,
            Bh: leavelist?.Bh,
            StartDate: startdate,
            StartTime: starttime,
            Stopdate: stopdate,
            StopTime: stoptime,
            CountL: Count(startdate,starttime,stopdate,stoptime),
            DepID: convertType(dep_id) ?? 0,
            Status: "pending approval",
        }
        console.log(data)
        let res = await CreateLeavaList(data);
        
        if (res.status) {
            // setTimeout(() => {
            //     window.location.href = "/รายการลางาน";
            //   }, 1200);
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
                                        value={leavelist.Bh}
                                        onChange={handleChange}
                                        inputProps={{
                                            name: "Bh",
                                        }}
                                        native
                                    >
                                        <option aria-label="None" value="">
                                                หัวข้อการลา
                                        </option>
                                        {ltype.map((item: LeaveTypeInterface) => (
                                            <option value={item.Bh} key={item.Bh}>
                                                {item.Mc} 
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                            </Grid>
                            <Grid item xs={12}><Typography align="left" textTransform="capitalize">ชื่อ-นามสกุล:{" "+user?.UserLname}</Typography></Grid>
                            <Grid item xs={12}><Typography align="left" textTransform="capitalize">Email:{" "+ user?.DepMail}</Typography></Grid>
                            <Grid item xs={12}><Typography align="left" textTransform="capitalize">แผนก:{" "+user?.DepName}</Typography></Grid>
                            <Grid item xs={12}><Typography align="left" textTransform="capitalize">ผู้จัดการแผนก:{user?.ManagerMail}</Typography></Grid>
                            
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={1.8}><Typography>ขอลาตั้งแต่</Typography></Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth variant="outlined">
                                        <DateTimePicker
                                            label="วันที่และเวลา"
                                            ampm={false}
                                            value={start}
                                            minTime={eightAM.toDate()}
                                            maxTime={fivePM.toDate()}
                                            onChange={handleDateTimeChange}
                                            format="dd/MM/yyyy HH:mm"
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
                                            minTime={eightAM.toDate()}
                                            maxTime={fivePM.toDate()}
                                            onChange={handleDateTimeChange2}
                                            format="dd/MM/yyyy HH:mm"
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
                                to="/รายการลางาน"
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
export default Form1