import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from "react-router-dom";

import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, createTheme } from '@mui/material'

import { ListLeaveP1, ListSwitchP1 } from '../../services/HttpClientService';

import { User1Interface } from '../../models/ISignin';
import { LeavesInterface } from '../../models/ILeave';
import { SwitchsInterface } from '../../models/ISwitch';

export default function Home({role} : any) {
  const [user ,setUser] = useState<User1Interface>();
  const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
  const [switcht, setSwitch] = useState<SwitchsInterface[]>([])
  const getLeaveList = async () => {
    let res = await ListLeaveP1();
    if (res.data) {
        setLeavelist(res.data);
    }
    console.log(res.data)
  };
  const getSwitch = async () => {
    let res = await ListSwitchP1();
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
  
  const getEmployeeID = async () => {
    let data ={
      UserSerial: 0,
      UserName: "Payroll111",
      UserLname: "payrolll",
      DepName: "payroll",
      DepMail: "string",
      ManagerMail: "string",
    }
    setUser(data)
  }

  useEffect(() => {
        getEmployeeID();
        getLeaveList()
        getSwitch()
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
            <Grid container>    
              <Grid item xs={4}>  
                <Button 
                  variant="contained"
                  className='bte'
                  color="primary"
                  sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                  component={RouterLink}
                  to="/รายการการลางาน"
                >
                  รายการลางาน
                </Button>
              </Grid>
            </Grid>
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
                      <TableCell>{item.Mc}</TableCell>
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
            <Grid container>
              <Grid item xs={8}>
                <Button 
                  variant="contained"
                  className='bte'
                  color="primary"
                  sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                  component={RouterLink}
                  to="/รายการการสลับวันลา"
                >
                  รายการสลับวันลา
                </Button>
              </Grid>
            </Grid>
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