import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';

import './App.css';

import { createTheme, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';

import Signin from './components/Signin';
import Navbar from './components/NavBar';
import Home from './components/Home';
import Form from './components/Employee/form';
import EmployeeShow from './components/Employee/show';
import ManagerShow from './components/Manager/show';
import Approve from './components/Manager/approve';
import ManagerHistory from './components/Manager/history';
import PayrollShow from './components/Payroll/payroll';
import Form2 from './components/Employee/form2';
import EmployeeShow2 from './components/Employee/show2';
import ManagerSwitchShow from './components/Manager/switchshow';
import MyTable from './components/Manager/switchtest';
import HomeEmp from './components/Employee/home_emp';
import RouterEmployee from './router/router_employee';
import RouterManager from './router/router_manager';
import RouterAdmin from './router/router_admin';
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
    
  
    const token = localStorage.getItem("token")
    
    if (token) {
      setToken(token)
      setRole(localStorage.getItem("role") || "")
      // validToken()
    }

  }, [])

  return (
    <div>
        <ThemeProvider theme={theme}>
          <>
            {token && role === "employee" ? (
              <RouterEmployee />
            ) : token && role === "manager" ? (
              <RouterManager/>
            ) : token && role === "payroll" ? (
              <RouterAdmin/>
            ) : (
              <Signin/>
            )}
          </>
        </ThemeProvider>
    </div>
  );
}

export default App;
