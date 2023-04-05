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
import Payroll1 from './components/Payroll/payroll1';
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

  return (
    <div>
      <Router>
        <ThemeProvider theme={theme}>
      
            <Navbar  />
            <div className='container-router'>
              <Routes>{role === "employee" && (
                <>
                  
                  <Route path="/" element={<EmployeeShow  />} />
                  <Route path="/form" element={<Form  />} />
                  
                </>
              )}{role === "manager" && (
                <>
                  
                  <Route path="/" element={<ManagerShow  />} />
                  <Route path="/approve" element={<Approve  />} />
                  <Route path="/history" element={<ManagerHistory  />} />

                </>
              )}{role === "payroll" && (
                <>
                  
                  <Route path="/" element={<PayrollShow  />} />
                  <Route path="/pay" element={<Payroll1 />} />

                </>
              )}
              </Routes>
            
            </div>  
      
    </ThemeProvider>
    </Router>
    </div>
  );
}

export default App;
