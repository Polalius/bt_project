import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import './signin.css';
import { SigninInterface } from "../../models/ISignin";
import Frame1 from './../image/Frame1.svg';
import logo from './../image/logo.png'
export default function Signin(){
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const [signin, setSignin] = useState<Partial<SigninInterface>>({})


    const handleClose: any = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof signin; 
        const { value } = event.target;

        setSignin({ ...signin, [id]: value })
        console.log(signin)
    }
    

    const login = () => {
        const apiUrl = "http://localhost:8080/signin";
        const requestOptions: any = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signin)
        }
        console.log(signin)
        fetch(apiUrl, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    setSuccess(true);
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("user_pass", res.data.user_pass)
                    localStorage.setItem("user_serial", res.data.user_serial)
                    localStorage.setItem("position", res.data.user_position)
                    localStorage.setItem("dep_id", res.data.dep_id)
                    console.log(res.data)
                    window.location.reload()
                } else {
                    setError(true)
                }
            })
    }
    return (
        <Box sx={{ display: "flex" }}>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    เข้าสู่ระบบสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
                </Alert>
            </Snackbar>

            <div className='from-box' >
                <img
                    style={{ maxHeight: "100vh" }}
                    className="img-box"
                    alt="Banner"
                    src={Frame1}

                />

                <div id='from-page' className='form-page'>
                    <div id='from-frame' className='from-frame'>
                        <div id="logo" className='logo'>
                            <img className="img" alt="logo" src={logo}/>
                        </div>
                        <form noValidate className='form-in'>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={signin.username || ""}
                                onChange={handleInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                       login();
                                    }
                                 }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="userpass"
                                type="password"
                                id="userpass"
                                autoComplete="current-password"
                                value={signin.userpass || ""}
                                onChange={handleInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                       login();
                                    }
                                 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: "#7484AD", color: "#F4F6F6" }}
                                className='submit'
                                onClick={login}
                                >
                                Sign In
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </Box>
    )
}