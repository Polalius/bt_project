import React, { useEffect } from 'react';
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material';

import Signin from './components/Signin';
import RouterEmployee from './router/router_employee';
import RouterManager from './router/router_manager';
import RouterAdmin from './router/router_admin';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#D6DBDF",
      },
      secondary: {
        main: "#535353"
      },
      text: {
        primary: "#1B2420",
        secondary: "#1B2420"
      }
    },
    
  })

  const [token, setToken] = React.useState<String>("");
  const [role, setRole] = React.useState<String>("")

  useEffect(() => {
    const token = localStorage.getItem("token")  
    if (token) {
      setToken(token)
      setRole(localStorage.getItem("position") || "")
    }

  }, [])

  return (
    <div>
        <ThemeProvider theme={theme}>
          <>
            {token && role === "0" ? (
              <RouterEmployee />
            ) : token && role === "1" ? (
              <RouterManager/>
            ) : token && role === "2" ? (
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
