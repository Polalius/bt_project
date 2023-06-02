import { Box, Button, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Link as RouterLink } from "react-router-dom";
export default function Home({role} : any) {
  return (
    <Container>
        <Grid container spacing={3}>
            <Grid item xs={12} textAlign="center">
                <h1>
                    ยินดีต้อนรับเข้าสู่ระบบในฐานะ {role}

                </h1>

                
            </Grid>
        </Grid>
        
        <Grid container spacing={3}>
        <Grid item xs={2} textAlign="center"></Grid>
        <Grid item xs={4} textAlign="center">
          <Button
            component={RouterLink}
            to="/show"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
          >
           รายการคำร้องขออนุมัติ
          </Button>
          </Grid>
          <Grid item xs={4} textAlign="center">
          <Button
            component={RouterLink}
            to="/history"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
          >
           ประวัติการอนุมัติ
          </Button>
          </Grid>
        </Grid>
    </Container>
    
  )
}