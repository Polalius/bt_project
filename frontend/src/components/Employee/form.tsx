import { AlertProps, Box, Button, Container, CssBaseline, Divider, FormControl, Grid, Paper, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { LeaveInterface, LeaveTypeInterface } from "../../models/ILeave";
import { EmployeeInterface } from "../../models/IEmployee";
import { ManagerInterface } from "../../models/IManager";
import { CreateLeavaList, GetEmployeeByUID, GetEmployeeID, GetManagerID, ListEmployee, ListLeaveType } from "../../services/HttpClientService";
import { Link as RouterLink } from "react-router-dom";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Form() {
    const [leavelist, setLeavelist] = useState<Partial<LeaveInterface>>({});
    const [emp, setEmp] = useState<EmployeeInterface>();
    const [man, setMan] = useState<ManagerInterface>();
    const [ltype, setLType] = useState<LeaveTypeInterface[]>([]);
    const [start, setStart] = useState<Date | null>(
        new Date()
    );
    const [stop, setStop] = useState<Date | null>(
        new Date()
    );
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setAlertMessage] = useState("");
    const getEmployeeID = async (id:any) => {
        let res = await GetEmployeeID(id);
        if (res){
            setEmp(res)
            console.log(res)
        }
    }
    const getManagerID = async (id:any) => {
        let res = await GetManagerID(id);
        if (res){
            setMan(res)
            console.log(res)
        }
    }

    const getLeaveType = async () => {
        let res = await ListLeaveType();
        if (res.data) {
          setLType(res.data);
          
        }
    };
    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };
    const handleClose = (event?: React.SyntheticEvent | Event,reason?: string) => {
        if (reason === "clickaway") {
            return;
          }
          setSuccess(false);
          setError(false);
      };
      const handleChange = (
        event: SelectChangeEvent<number>
    ) => {
        const name = event.target.name as keyof typeof leavelist;
        setLeavelist({
            ...leavelist,
            [name]: event.target.value,
        });
    };

  
    useEffect(()=>{
        getLeaveType();
        getEmployeeID(JSON.parse(localStorage.getItem("eid") || ""));
        getManagerID(emp?.ManagerID)
    }, []);
    // async function submit(){
    //     let data = {
    //         EmployeeID: emp?.ID,
    //         LeaveTypeID: convertType(leavelist?.LeaveTypeID) ?? 0,
    //         StartTime: start,
    //         StopTime: stop,
    //         ManagerID: emp?.ManagerID,
    //         Status: leavelist.Status
    //     }
    //     let res = await CreateLeavaList(data);
    //     if (res.status) {
    //         setAlertMessage("บันทึกข้อมูลสำเร็จ");
    //         setSuccess(true);
    //     } else {
    //         setAlertMessage(res.message);
    //         setError(true);
    //     }
    // }
    return (
        <div>
            <Snackbar
                id="success"
                open={success}
                autoHideDuration={8000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar
                id="error"
                open={error}
                autoHideDuration={8000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    marginTop: 2,
                    
                }}>
                <CssBaseline />
                <Paper
                    className="paper"
                    elevation={6}
                    sx={{
                    padding: 2,
                    borderRadius: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            color="primary"
                            sx={{ padding: 2, fontWeight: "bold", marginTop: 1 }}
                        >
                            แบบฟอร์มลางาน
                        </Typography>
                    </Box>
                    <Divider />
                
                <Grid container spacing={1} sx={{ padding: 1 }}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={2.5}></Grid>
                <Grid container spacing={{ xs: 12, md: 5 }}>
                    <Grid item xs={8} sx={{ mt: 1 }}>
                        
                        <Typography>เรื่อง</Typography>
                        <FormControl variant="outlined"  >
                            <Select
                                size='small'
                                sx={{ borderRadius: 3, bgcolor: '#fff', width: 200}}
                                onChange={handleChange}
                                inputProps={{
                                    name: "LeaveType",
                                }}
                                native
                            >
                                <option aria-label="None" value="">
                                    ----ประเภทการลา----
                                </option>
                                {ltype.map((item: LeaveTypeInterface) => (
                                    <option value={Number(item.ID)} key={item.ID}>
                                        {item.TypeName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        
                    </Grid>
                    <Grid item xs={12}><Typography>เรียน:{man?.FirstName +" "+ man?.LastName}</Typography></Grid>
                    <Grid item xs={2}><Typography>ชื่อ:{" "+emp?.FirstName}</Typography></Grid>
                    <Grid item xs={6}><Typography>นามสกุล:{" "+ emp?.LastName}</Typography></Grid>
                    <Grid item xs={6}><Typography>Email:{" "+ emp?.Email}</Typography></Grid>
                    </Grid>
                    
          </Grid>
          <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/show"
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                       
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        บันทึกข้อมูล
                    </Button>

            </Stack>
            </Paper></Container>
        </div>
    )


}
export default Form