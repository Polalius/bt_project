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
import Payroll1 from './components/Payroll/payroll1';
import Form2 from './components/Employee/form2';
import EmployeeShow2 from './components/Employee/show2';
import ManagerSwitchShow from './components/Manager/switchshow';
import ManagerSwitchHistory from './components/Manager/switchhistory';
import MyTable from './components/Manager/switchtest';
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
  const [login, setLogin] = React.useState<String>("");
  const [role, setRole] = React.useState<String>("")
  const [open, setOpen] = React.useState<boolean>(false)

  useEffect(() => {
    // const validToken = () => {
    //   fetch("http://localhost:8080/valid", {
    //     method: "GET",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       "Authorization": `Bearer ${token}`
    //     }
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       console.log(data)
    //       if (!data.error) {
    //         setStatustoken(true)
    //       } else {
    //         setStatustoken(false)
    //         localStorage.clear();
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       setStatustoken(false)
    //     })
    // }
    setLogin(localStorage.getItem("login") || "");
  
    const token = localStorage.getItem("token")
    
    if (token) {
      setToken(token)
      setRole(localStorage.getItem("role") || "")
      // validToken()
    }

  }, [])

  if ((!token) && login) {
    
    localStorage.clear();
    return <Signin />
  }

  return (
    <div>
      <Router>
        <ThemeProvider theme={theme}>
          { token && (
            <>
            <Navbar  />
            <div className='container-router'>
              <Routes>{role === "employee" && (
                <>
                  <Route path="/" element={<Home role={role} />} />
                  <Route path="/show" element={<EmployeeShow  />} />
                  <Route path="/form" element={<Form  />} />
                  <Route path="/switchshow" element={<EmployeeShow2  />} />
                  <Route path="/switch" element={<Form2/>} />
                  
                </>
              )}{role === "manager" && (
                <>
                  <Route path="/" element={<Home role={role} />} />
                  <Route path="/show" element={<ManagerShow  />} />
                  <Route path="/approve" element={<Approve  />} />
                  <Route path="/history" element={<ManagerHistory  />} />
                  <Route path="/switchshow" element={<ManagerSwitchShow  />} />
                  <Route path="/switchh" element={<ManagerSwitchHistory  />} />
                  <Route path='/switchhistory' element={<MyTable />}/>

                </>
              )}{role === "payroll" && (
                <>
                  
                  <Route path="/show" element={<PayrollShow  />} />
                  <Route path="/" element={<Payroll1 />} />

                </>
              )}
              </Routes>
            
            </div>  
          </>
      )}
      {!token && (
        <Fragment>
          <Routes>
            <Route path='/' element={<Signin/>}/>
          </Routes>
        </Fragment>
      )}
    </ThemeProvider>
    </Router>
    </div>
  );
}

export default App;
