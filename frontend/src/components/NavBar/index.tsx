import React, { useEffect, useState } from "react";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {createTheme, styled, ThemeProvider, useTheme} from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Toolbar, Typography, Button, Box, Badge, CssBaseline, MenuItem, Drawer, Divider, Tooltip, Avatar, Menu } from "@mui/material";
import { orange, blueGrey } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";
import HailIcon from '@mui/icons-material/Hail';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
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
    padding: theme.spacing(1),
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
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
export default function Navbar() {
  const themep = useTheme();
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [user, setUser] = React.useState<UserInterface>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
    { name: "รายการคำขอลา", icon: <EventNoteIcon />, path: "/รายการลางาน", },
    { name: "แบบฟอร์มการลา", icon: <HailIcon />, path: "/แบบฟอร์มขอลา", },
    { name: "รายการคำขอสลับวันลา", icon: <EventNoteIcon />, path: "/รายการสลับวันลา", },
    { name: "แบบฟอร์มสลับวันลา", icon: <TransferWithinAStationIcon />, path: "/แบบฟอร์มสลับวันลา", },
  ]
  const menumanager = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "รายการคำร้องขอลา", icon: <EventNoteIcon />, path: "/รายการคำร้องขอลา", },
    { name: "ประวัติการอนุมัติการลา", icon: <EventNoteIcon />, path: "/รายการอนุมัติการลา", },
    { name: "รายการคำร้องขอสลับวันลา", icon: <EventNoteIcon />, path: "/รายการคำร้องขอสลับวันลา", },
    { name: "ประวัติการอนุมัติสลับวันลา", icon: <EventNoteIcon />, path: "/รายการอนุมัติสลับวันลา",},
  ]
  const menupayroll = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "ประวัติการอนุมัติ", icon: <EventNoteIcon />, path: "/show", },
    { name: "ประวัติการอนุมัติ", icon: <EventNoteIcon />, path: "/pay", },
    
  ]

  var menu: any[];
  switch (role) {
    case "0":
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
    case "1":
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
      setRole(localStorage.getItem("position") || "");
      getUserID(localStorage.getItem("user_serial"))
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
                โปรแกรมการลา
              </Typography>
              {/* <Typography color="secondary" >User:{user?.UserName}</Typography> */}
              
              <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge 
            overlap="rectangular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"> 
              
              <Avatar sx={{ width: 32, height: 32 }} >{user?.UserName?.charAt(0).toUpperCase()}</Avatar>
            </StyledBadge>
            
          </IconButton>
        </Tooltip>
            </Box>
            <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open1}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem  onClick={SignOut}><LogoutIcon style={{ marginRight: ".5rem" }} />Log out</MenuItem>
      </Menu>

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