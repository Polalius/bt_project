import React, { useEffect, useState } from "react";
import { EmployeeInterface } from "../../models/IEmployee";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Toolbar, Typography, Button, Box, Badge } from "@mui/material";
import { ManagerInterface } from "../../models/IManager";
const drawerWidth= 240;
export default function Navbar({ open, onClick}: any) {
    const [employee, setEmployee] = React.useState<Partial<EmployeeInterface>>({})
    const [manager, setManager] = React.useState<Partial<ManagerInterface>>({})
    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open', 
    })<AppBarProps>(({theme, open}) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `-${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
    }));
    const navigator = useNavigate();
    const handleSignOutClick = (e: any) => {
        localStorage.clear()
        navigator('/')
        window.location.reload()
    }
    const apiUrl = "http://localhost:8080"

    const reqOptGet = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        }
    }
    const getEmployee = () => {
            fetch(`${apiUrl}/employeeId/${localStorage.getItem("pid")}`, reqOptGet)
            .then((res) => res.json())
            .then((res) => {
                if (res.data){
                    setEmployee(res.data)
                } else {
                    console.log("else")
                }
            })
        }
        const getManager = () => {
            fetch(`${apiUrl}/manager/${localStorage.getItem("pid")}`, reqOptGet)
            .then((res) => res.json())
            .then((res) => {
                if (res.data){
                    setManager(res.data)
                    console.log(res.data.DepartmentID)
                    localStorage.setItem("did", res.data.DepartmentID)
                } else {
                    console.log("else")
                }
            })
        }
    useEffect(() => {
        const r = localStorage.getItem("role")
        if (r == "employee"){
            getEmployee()
            
        }else if (r == "manager"){
            getManager()
        }
        else if (r == "payroll"){
            getManager()
        }
    }, [])
    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={onClick}
                edge="start"
                sx={{ mr: 2, ...(open && {display: 'none'}) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                    color="primary"
                    >
                    Welcome to Leave Stytem
                    </Button>
                </Typography>
                <Box sx={{ flexGrow: 1}}/>
                <Box sx={{ display: 'flex'}}>
                    <Button size="large" color="inherit" onClick={handleSignOutClick} variant='outlined'>
                        <Badge color="error">
                            {/* <Typography>
                                {employee.FirstName +" "+ employee.LastName} 
                            </Typography> */}
                            <ExitToAppIcon />
                        </Badge>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>

    )
}