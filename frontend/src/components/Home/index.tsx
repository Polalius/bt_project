import { Box, Button, Card, CardActionArea, CardActions, CardMedia, Grid, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import logo from "./../image/logo.png"
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
          <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
            component="img"
            height="140"
            image={logo}
            alt="green iguana"
            >
            </CardMedia>
          </CardActionArea>
          <CardActions>
            <Button component={RouterLink}
            to="/show"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
          >
           ระบบลางาน
            </Button>
          </CardActions>
        </Card>
          </Grid>
          <Grid item xs={4} textAlign="center">
          <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
            component="img"
            height="140"
            image={logo}
            alt="green iguana"
            >
            </CardMedia>
          </CardActionArea>
          <CardActions>
            <Button component={RouterLink}
            to="/switchshow"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
          >
           ระบบสลับวันลา
            </Button>

          </CardActions>
        </Card>
          </Grid>
        </Grid>
    </Container>
    
  )
}