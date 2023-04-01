import React, { useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';

import './App.css';

import { createTheme, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';

import Signin from './components/Signin';
import Navbar from './components/NavBar';
import DrawerBar from './components/DrawerBar';
import Home from './components/Home';
import Form from './components/Employee/form';
import EmployeeShow from './components/Employee/show';
import ManagerShow from './components/Manager/show';
import Approve from './components/Manager/approve';
import ManagerHistory from './components/Manager/history';
import PayrollShow from './components/Payroll/payroll';
const drawerWidth = 240;
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#C0C0C0",
      },
      secondary: {
        main: "#8FCCB6"
      },
      text: {
        primary: "#1B2420",
        secondary: "#1B2420"
      }
    },
    
  })
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [token, setToken] = React.useState<String>("");
  const [statustoken, setStatustoken] = React.useState<boolean>(false);

  const [role, setRole] = React.useState<String>("")
  const [open, setOpen] = React.useState<boolean>(false)

  useEffect(() => {
    const validToken = () => {
      fetch("http://localhost:8080/valid", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (!data.error) {
            setStatustoken(true)
          } else {
            setStatustoken(false)
            localStorage.clear();
          }
        })
        .catch((err) => {
          console.log(err)
          setStatustoken(false)
        })
    }

    const token: any = localStorage.getItem("token")
    const role: any = localStorage.getItem("role")
    if (token) {
      setToken(token)
      setRole(role)
      validToken()
    }

  }, [])

  if (!token || !statustoken) {
    console.log(statustoken)
    return <Signin />
  }

  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open'})<{ open?: Boolean; }>(({theme, open}) => ({
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
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  return (
      <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Box sx={{display: 'flex'}}>
            <CssBaseline />
            <Navbar open={open} onClick={handleDrawerOpen} />
            <DrawerBar open={open} drawerWidth={drawerWidth} handleDrawerClose={handleDrawerClose} role={role} theme={theme} />
            
            <Main open={open}>
              <DrawerHeader />
              <Routes>{role === "employee" && (
                <>
                  <Route path='/' element={<Home role={role}/>} />
                  <Route path="/show" element={<EmployeeShow  />} />
                  <Route path="/form" element={<Form  />} />
                  <Route path="/managershow" element={<ManagerShow  />} />
                  
                </>
              )}{role === "manager" && (
                <>
                  <Route path='/' element={<Home role={role}/>} />
                  <Route path="/managershow" element={<ManagerShow  />} />
                  <Route path="/approve" element={<Approve  />} />
                  <Route path="/history" element={<ManagerHistory  />} />

                </>
              )}{role === "payroll" && (
                <>
                  <Route path='/' element={<Home role={role}/>} />
                  <Route path="/payrollshow" element={<PayrollShow  />} />

                </>
              )}
              </Routes>
            </Main>

          </Box>
        </div>
        
      </Router>
      
    </ThemeProvider>
  );
}

export default App;
