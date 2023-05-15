import { Button, Grid, Paper, Typography, createTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from "react-router-dom";
import './index.css'

import { blueGrey } from '@mui/material/colors';
import { GetEmployeeID1, GetManagerID1 } from '../../services/HttpClientService';
import { User1Interface } from '../../models/ISignin';
let theme = createTheme();
export default function Home({role} : any) {
  const [user ,setUser] = useState<User1Interface>();
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
                    <p> in <a>{role}</a> role.</p>
                    
                </h2>

                
            </Grid>
        </Grid>
        
      <Grid container spacing={2} sx={{bgcolor:'#FFF'}}>
      
        {/* <Grid item xs={8} textAlign="center"> */}
          <div id='left' className='left'>
            <Paper elevation={3} sx={{bgcolor:'#FFF', height: '40vh'}} >
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
        
        <Grid item xs={4} >
          
          <Paper elevation={3} sx={{bgcolor:'#FFF', height: '60vh'}} >
            
              <h1>Profile</h1>
              <h3 className='h3'>ชื่อ: {user?.Name}</h3>
              <h3 >email: {user?.Email}</h3>
              <h3 className='h3'>User name: {user?.User}</h3>
              <h3 className='h3'>role: {user?.Role}</h3>
              <h3 className='h3'>แผนก: {user?.Department}</h3>
         </Paper>
        </Grid>    
      </Grid>
      {/* </Box> */}
    </Container>
    
  )
}