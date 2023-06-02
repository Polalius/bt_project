import { Badge, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, createTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from "react-router-dom";


import { blueGrey } from '@mui/material/colors';
<<<<<<< HEAD
import { CountL1, CountL2, CountL3, CountL4, CountSW, CountSW2, GetEmployeeID1, GetManagerID1, ListLeaveByEID, ListSwitchByEID, ListSwitchByEmpID, ListSwitchByEmpID1 } from '../../services/HttpClientService';
=======
import { CountL1, CountL2, CountL3, CountL4, CountSW, CountSW2, GetEmployeeID1, GetManagerID1, ListLeaveByEID, ListLeaveWait, ListSwitchByEID, ListSwitchByEmpID, ListSwitchWait } from '../../services/HttpClientService';
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
import { User1Interface } from '../../models/ISignin';
import { Leave1Interface, LeaveInterface, LeavesInterface } from '../../models/ILeave';
import moment from 'moment';
import { Switch1Interface, SwitchsInterface } from '../../models/ISwitch';
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';
import Approve from './approve';
let theme = createTheme();
export default function HomeMan() {
  const [user ,setUser] = useState<User1Interface>();
  const [co1, setCo1] = useState<number | null>(0);
  const [co2, setCo2] = useState<number | null>(0);
<<<<<<< HEAD
  const [co3, setCo3] = useState<number | null>(0);
  const [co4, setCo4] = useState<number | null>(0);
  const [co5, setCo5] = useState<number | null>(0);
  const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
  const [switcht, setSwitch] = useState<SwitchsInterface[]>([])
  const [isApproved, setIsApproved] = useState(false);

  const handleApproveClick = () => {
    setIsApproved(true);
  };
=======
  const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
  const [switcht, setSwitch] = useState<Switch1Interface[]>([])
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
  const getLeaveList = async (id:any) => {
    let res = await ListLeaveWait(id);
    if (res.data) {
        setLeavelist(res.data);
        console.log(res.data)
    }
};
const getSwitch = async (id:any) => {
<<<<<<< HEAD
    let res = await ListSwitchByEmpID1(id);
    if (res.data) {
        setSwitch(res.data);
    }
    
    console.log(res.data)
=======
  let res = await ListSwitchWait(id);
  if (res.data) {
      setSwitch(res.data);
      console.log(res.data)
  }
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
};
function formatMinutesToTime(minutes: any) {
    const hours = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutesPart).padStart(2, '0');
    return `${hoursStr}:${minutesStr} น.`;
  }
  function formatMinutesToDate(minutes: any) {
    const days = Math.floor(minutes / (24 * 60));
  const remainingMinutes = minutes % (24 * 60);
  const hours = Math.floor(remainingMinutes / 60);
  const minutesPart = remainingMinutes % 60;
  const daysStr = String(days).padStart(2, '0');
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutesPart).padStart(2, '0');
  return `${daysStr} วัน ${hoursStr} ชม. ${minutesStr} น.`;
  }
  const getCount1 =async (id:any) => {
    let res = await CountL4(id);
    if (res){
      console.log(res)
      setCo1(res)
      
    }
  }
  const getCount2 =async (id:any) => {
    let res = await CountSW2(id);
    if (res){
      console.log(res)
      setCo2(res)
      
    }
  }
<<<<<<< HEAD
  const getCount3 =async (id:any) => {
    let res = await CountL3(id);
    if (res){
      console.log(res)
      setCo3(res)
      
    }
  }
  const getCount4 =async (id:any) => {
    let res = await CountL4(id);
    if (res){
      console.log(res)
      setCo4(res)
      
    }
  }
  const getCount5 =async (id:any) => {
    let res = await CountSW2(id);
    if (res){
      console.log(res)
      setCo5(res)
      
    }
  }
  const getEmployeeID = async (id:any) => {
    let res = await GetEmployeeID1(id);
=======
  const getManagerID = async (id:any) => {
    let res = await GetManagerID1(id);
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
    if (res){
        setUser(res)
        console.log(res)
    }
  }
<<<<<<< HEAD
  const uid = localStorage.getItem("user_serial") || "";
  const dep_id = localStorage.getItem("dep_id") || "";
  useEffect(() => {
        getEmployeeID(uid);
        getCount(uid);
        getCount1(uid)
        getCount2(uid)
        getCount3(uid)
        getCount4(dep_id)
        getCount5(dep_id)
        getLeaveList(JSON.parse(uid))
        getSwitch(JSON.parse(uid))
=======
  const uid = localStorage.getItem("uid") || "";
  const did = localStorage.getItem("did") || ""
  useEffect(() => {
        getManagerID(uid);
        getCount1(did)
        getCount2(did)
        getLeaveList(did)
        getSwitch(JSON.parse(localStorage.getItem("pid") || ""))
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
  }, []);
  return (
    <Container maxWidth='xl' sx={{bgcolor:'#FFF', height: '91vh'}} >
      <Grid container spacing={2}>
        <Grid item xs={12} textAlign="center">
          <h2>
            welcome to leave system
          </h2>    
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{bgcolor:'#FFF'}}>
        <Grid item xs={8}>
          <Paper elevation={3} sx={{bgcolor:'#FFF', height: '74vh'}} className='lefte'>
<<<<<<< HEAD
            <Grid container>
                <Grid item xs={8}>
            <Button 
              variant="contained"
              className='bte'
              color="primary"
              sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              component={RouterLink}
              to="/รายการลางาน"
            >
              ระบบลางาน
            </Button>
            <Typography marginTop={1}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={3.5}>
                  ลาป่วย :  <TextField  value={formatMinutesToDate(co2)} size='small' color='warning' sx={{width:165}}/>
                </Grid>
                <Grid item xs={4}>
                  ลากิจ :<TextField  value={formatMinutesToDate(co3)} size='small' color='warning' sx={{width:165}}/>
                </Grid>
  </Grid>
                
              </Typography>
            
            <Typography marginTop={1}>พนักงานลาทั้งหมด: {formatMinutesToDate(co1)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Badge badgeContent={co4} color="warning">
            <Button 
=======
                <Button 
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
              variant="contained"
              className='bte'
              color="primary"
              sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              component={RouterLink}
              to="/รายการคำร้องขอลา"
            >
              อนุมัติลางาน
<<<<<<< HEAD
            </Button></Badge>
            <Typography marginTop={1}>รายการรออนุมัติ: {co4} รายการ</Typography>    
            </Grid>
            </Grid>
=======
            </Button>
            <Typography marginTop={1}>คำร้องขอลารออนุมัติ: {co1} รายการ</Typography>
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
            <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell width="">
                      ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell>
                      การลา
                    </TableCell>
                    <TableCell>
                      ลาวันที่
                    </TableCell>
                    <TableCell>
                      เวลา
                    </TableCell>
                    <TableCell>
                      ถึงวันที่
                    </TableCell>
                    <TableCell>
                      เวลา
                    </TableCell>
                    <TableCell>
                      สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leavelist.map((item: LeavesInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.LeaveType}</TableCell>
                      <TableCell>{item.StartDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StartTime)}</TableCell>
                      <TableCell>{item.StopDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StopTime)}</TableCell>
                      <TableCell>{item.Status}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
<<<<<<< HEAD
            <Grid container>
                <Grid item xs={8}>
            <Button component={RouterLink}
              to="/รายการสลับวันลา"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
            >
              ระบบสลับวันลา
            </Button>
            <Typography marginTop={1}>พนักงานสลับวันลา: {co} ครั้ง</Typography></Grid>
            <Grid item xs={4}>
              <Badge badgeContent={co5} color="warning">
=======
            
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
            <Button 
              variant="contained"
              className='bte'
              color="primary"
              sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              component={RouterLink}
              to="/รายการคำร้องขอสลับวันลา"
            >
              อนุมัติสลับวันลา
<<<<<<< HEAD
            </Button></Badge>
            <Typography marginTop={1}>รายการรออนุมัติ: {co5} รายการ</Typography>
            </Grid></Grid>
=======
            </Button>
            <Typography marginTop={1}>คำร้องขอสลับวันลารออนุมัติ: {co2} รายการ</Typography>      
>>>>>>> 338cd53c0d6cc491f2fa5335ef4d32e8e8a81819
            <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell width="">
                      ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell>
                      วันที่สลับ
                    </TableCell>
                    <TableCell>
                      จากเวลา
                    </TableCell>
                    <TableCell>
                      ถึงเวลา
                    </TableCell>
                    <TableCell>
                      วันที่มาทำงาน
                    </TableCell>
                    <TableCell>
                      สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {switcht.map((item: SwitchsInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.LeaveDay}</TableCell>
                      <TableCell>{formatMinutesToTime(item.FromTime)}</TableCell>
                      <TableCell>{formatMinutesToTime(item.ToTime)}</TableCell>
                      <TableCell>{item.WorkDay}</TableCell>
                      <TableCell>{item.Status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{bgcolor:'#FFF', height: '60vh'}} className='righte' >
                <h1>Profile</h1>
                <h3 className='h3'>ชื่อ: {user?.UserLname}</h3>
                <h3 className='h3'>User name: {user?.UserName}</h3>
                
                <h3 className='h3'>แผนก: {user?.DepName}</h3>
            </Paper>
        </Grid>
      </Grid>
    </Container>   
  )
}