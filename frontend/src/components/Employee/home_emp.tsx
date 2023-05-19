import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, createTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from "react-router-dom";
import './home_emp.css'

import { blueGrey } from '@mui/material/colors';
import { CountSW, GetEmployeeID1, GetManagerID1, ListLeaveByEID, ListSwitchByEID, ListSwitchByEmpID } from '../../services/HttpClientService';
import { User1Interface } from '../../models/ISignin';
import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import moment from 'moment';
import { Switch1Interface } from '../../models/ISwitch';
let theme = createTheme();
export default function HomeEmp() {
  const [user ,setUser] = useState<User1Interface>();
  const [co, setCo] = useState<number | null>(0);
  const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
  const [switcht, setSwitch] = useState<Switch1Interface[]>([])
  const getLeaveList = async (id:any) => {
    let res = await ListLeaveByEID(id);
    if (res.data) {
        setLeavelist(res.data);
    }
    
    console.log(res.data)
};
const getSwitch = async (id:any) => {
    let res = await ListSwitchByEID(id);
    if (res.data) {
        setSwitch(res.data);
    }
    
    console.log(res.data)
};
function formatMinutesToTime(minutes: any) {
    const hours = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutesPart).padStart(2, '0');
    return `${hoursStr}:${minutesStr} น.`;
  }
  const getCount =async (id:any) => {
    let res = await CountSW(id);
    if (res){
      console.log(res)
      setCo(res)
      
    }
  }
  const getEmployeeID = async (id:any) => {
    let res = await GetEmployeeID1(id);
    if (res){
        setUser(res)
        console.log(res)
    }
  }
  const uid = localStorage.getItem("uid") || "";
  
  useEffect(() => {
        getEmployeeID(uid);
        getCount(uid);
        getLeaveList(JSON.parse(localStorage.getItem("pid") || ""))
        getSwitch(JSON.parse(localStorage.getItem("pid") || ""))
  }, []);
  return (
    <Container maxWidth='xl' sx={{bgcolor:'#FFF', height: '91vh'}} >
      {/* <Box sx={{ bgcolor: '#cfe8fc' }}> */}
        <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
                <h2>
                    welcome to leave system
                    
                    
                </h2>

                
            </Grid>
        </Grid>
        
      <Grid container spacing={2} sx={{bgcolor:'#FFF'}}>
        
        {/* <Grid item xs={8} textAlign="center"> */}
          <div id='lefte' className='lefte'>
            <Paper elevation={3} sx={{bgcolor:'#FFF', height: '60vh'}} >
            <div id='bte' className='bte'>
            <Button onClick={() => { window.location.href = "/show"; }}
                variant="contained"
                color="primary"
                
                sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              >
              ระบบลางาน
              </Button>
              </div>
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
                    ลาวันที่เวลา
                    </TableCell>
                    <TableCell>
                    ถึงวันที่เวลา
                    </TableCell>
                    <TableCell>
                    สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leavelist.map((item: Leave1Interface) => (
                    <TableRow>
                      <TableCell>{item.EmpName}</TableCell>
                      <TableCell>{item.TypeName}</TableCell>
                      <TableCell>{moment(item.StartTime).format("MM/DD/YYYY hh:mm A")}</TableCell>
                      <TableCell>{moment(item.StopTime).format("MM/DD/YYYY hh:mm A")}</TableCell>
                      <TableCell>{item.Status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              <div id='bte' className='bte'>
            <Button onClick={() => { window.location.href = "/switchshow"; }}
                variant="contained"
                color="primary"
                
                sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              >
              ระบบสลับวันลา
              </Button>
              </div>
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
                  {switcht.map((item: Switch1Interface) => (
                    <TableRow>
                      <TableCell>{item.EmpName}</TableCell>
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
         </div>
        
        <div id='right' className='right'>
          
          <Paper elevation={3} sx={{bgcolor:'#FFF', height: '60vh'}} >
            
              <h1>Profile</h1>
              <h3 className='h3'>ชื่อ: {user?.Name}</h3>
              <h3 >email: {user?.Email}</h3>
              <h3 className='h3'>User name: {user?.User}</h3>
              <h3 className='h3'>role: {user?.Role}</h3>
              <h3 className='h3'>แผนก: {user?.Department}</h3>
              <h3> co {co}</h3>
         </Paper>
        </div>  
      </Grid>
      {/* </Box> */}
    </Container>
    
  )
}