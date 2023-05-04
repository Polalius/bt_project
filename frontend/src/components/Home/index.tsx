import { Box, Button, Card, CardActionArea, CardActions, CardMedia, Grid, Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import logo from "./../image/logo.png"
import './index.css'
export default function Home({role} : any) {
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
        
      <Grid container spacing={2}>
        
        {/* <Grid item xs={8} textAlign="center"> */}
          <div id='left' className='left'>
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
        
        <Grid item xs={4} textAlign="center">
          <Paper elevation={3} sx={{bgcolor:'#F588', height: '70vh'}} >
            dfsf
          </Paper>
        </Grid>    
      </Grid>
      {/* </Box> */}
    </Container>
    
  )
}