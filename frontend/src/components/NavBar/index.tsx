import React, { useEffect, useState } from "react";
import { EmployeeInterface } from "../../models/IEmployee";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {createTheme, styled, ThemeProvider, useTheme} from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Toolbar, Typography, Button, Box, Badge, CssBaseline, MenuItem, Drawer, Divider } from "@mui/material";
import { ManagerInterface } from "../../models/IManager";
import { orange, blueGrey } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { GetUserID } from "../../services/HttpClientService";
import { SigninInterface, UserInterface } from "../../models/ISignin";
let theme = createTheme();
  
  const drawerWidth = 320; //ความยาวของ แถบเมนู
  
  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));
  
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));
  
export default function Navbar() {
  const themep = useTheme();
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [user, setUser] = React.useState<UserInterface>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const SignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  const menuemployee = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "รายการคำขอลา", icon: <EventNoteIcon />, path: "/show", },
    { name: "แบบฟอร์มการลา", icon: <EventNoteIcon />, path: "/form", },
    { name: "รายการคำขอสลับวันลา", icon: <EventNoteIcon />, path: "/switchshow", },
    { name: "แบบฟอร์มสลับวันลา", icon: <EventNoteIcon />, path: "/switch", },
  ]
  const menumanager = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "รายการคำร้องขอลา", icon: <EventNoteIcon />, path: "/show", },
    { name: "ประวัติการอนุมัติการลา", icon: <EventNoteIcon />, path: "/history", },
    { name: "รายการคำร้องขอสลับวันลา", icon: <EventNoteIcon />, path: "/switchshow", },
    { name: "ประวัติการอนุมัติสลับวันลา", icon: <EventNoteIcon />, path: "/switchhistory",},
  ]
  const menupayroll = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "ประวัติการอนุมัติ", icon: <EventNoteIcon />, path: "/show", },
    { name: "ประวัติการอนุมัติ", icon: <EventNoteIcon />, path: "/pay", },
    
  ]

  var menu: any[];
  switch (role) {
    case "employee":
      menu = menuemployee;
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
      menu = menumanager;
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
      menu = menupayroll;
      break;
    
    default:
      menu = [];
      break;
  }
  const getUserID = async (id:any) => {
    let res = await GetUserID(id);
    if (res) {
        setUser(res);
        console.log(res)
    }
  }

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setRole(localStorage.getItem("role") || "");
      getUserID(localStorage.getItem("uid"))
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }} >
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="secondary"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant="h6" color="secondary" noWrap component="div" fontFamily= 'Gloock'>
                โปรแกรมการลางาน
              </Typography>
              <Typography color="secondary" >User:{user?.UserName}</Typography>
              <MenuItem  onClick={SignOut}><LogoutIcon style={{ marginRight: ".5rem" }} />Log out</MenuItem>
            </Box>

          </Toolbar>

        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            {/* ปุ่มกด < */}
            <IconButton onClick={handleDrawerClose}>
              {themep.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton> {/* ปุ่มกด < */}
          </DrawerHeader>

          <Divider />

          {menu.map((item, index) => (
            <ListItem key={index} button component={RouterLink} onClick={handleDrawerClose}
              to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.name}</ListItemText>

            </ListItem>
          ))}

          <Divider />
        </Drawer>

        <Main open={open}>
          <DrawerHeader />
        </Main>

      </Box>
    </ThemeProvider>
    )
}