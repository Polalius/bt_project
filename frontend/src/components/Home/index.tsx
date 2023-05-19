import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, createTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from "react-router-dom";
import './index.css'

import { blueGrey } from '@mui/material/colors';
import { CountSW, GetEmployeeID1, GetManagerID1, ListLeaveByEID, ListSwitchByEmpID } from '../../services/HttpClientService';
import { User1Interface } from '../../models/ISignin';
import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
let theme = createTheme();
export default function Home({role} : any) {
  const [user ,setUser] = useState<User1Interface>();
  const [co, setCo] = useState<number | null>(0);
  const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
  const getLeaveList = async (id:any) => {
    let res = await ListLeaveByEID(id);
    if (res.data) {
        setLeavelist(res.data);
    }
    
    console.log(res.data)
};
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
  const getManagerID = async (id:any) => {
    let res = await GetManagerID1(id);
    if (res){
        setUser(res)
        console.log(res)
    }
}
  const uid = localStorage.getItem("uid") || "";
  switch (role) {
    case "employee":
      theme = createTheme({
        palette: {
          primary: {
            main: '#A46C42',
          },
          secondary: {
            main: '#F4F6F6',
          },
        },
      });
      break;
    case "manager":
      theme = createTheme({
        palette: {
          primary: {
            main: blueGrey[400],
          },
          secondary: {
            main: '#F4F6F6',
          },
          
        },
      });
      break;
    case "payroll":
      break;
    default:
      break;
  }
  useEffect(() => {
    const fetchData = async () => {
      if (role === "employee") {
        await getEmployeeID(uid);
        await getCount(uid);
        await getLeaveList(JSON.parse(localStorage.getItem("pid") || ""))
      } else if (role === "manager") {
        await getManagerID(uid);
        console.log(uid)
      }
    };

    fetchData();
  }, [role, uid]);
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
          <div id='left' className='left'>
            <Paper elevation={3} sx={{bgcolor:'#FFF', height: '60vh'}} >
              <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                    ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell>
                    ประเภทการลา
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              <div id='bt' className='bt'>
            <Button component={RouterLink}
                to="/show"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
              >
              ระบบลางาน
              </Button>
              <Button component={RouterLink}
              to="/switchshow"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
            >
            ระบบสลับวันลา
              </Button>
              </div>
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