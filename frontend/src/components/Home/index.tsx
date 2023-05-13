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
    <Container maxWidth='xl' sx={{bgcolor:'#FFF4F0', height: '88vh'}} >
      {/* <Box sx={{ bgcolor: '#cfe8fc' }}> */}
        <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
                <h1>
                    ยินดีต้อนรับเข้าสู่ระบบในฐานะ {role}

                </h1>

                
            </Grid>
        </Grid>
        
      <Grid container spacing={2} sx={{bgcolor:'#FBF3EC'}}>
      
        {/* <Grid item xs={8} textAlign="center"> */}
          <div id='left' className='left'>
            <Paper elevation={3} sx={{bgcolor:'#FCF8F5', height: '40vh'}} >
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
        
        <Grid item xs={4} textAlign="center">
          <Paper elevation={3} sx={{bgcolor:'#FCF8F5', height: '70vh'}} >
            <Typography variant="h5"> Profile</Typography>
            <Typography variant="subtitle2" textAlign={"left"} marginLeft={5}> ชื่อ:{user?.Name} </Typography>
            <Typography variant="subtitle2" textAlign={"left"} marginLeft={5}> email:{user?.Email} </Typography>
            <Typography variant="subtitle2" textAlign={"left"} marginLeft={5}> username:{user?.User} </Typography>
            <Typography variant="subtitle2" textAlign={"left"} marginLeft={5}> role:{user?.Role} </Typography>
            <Typography variant="subtitle2" textAlign={"left"} marginLeft={5}> แผนก:{user?.Department} </Typography>
          </Paper>
        </Grid>    
      </Grid>
      {/* </Box> */}
    </Container>
    
  )
}