import { ExcelExport } from "@progress/kendo-react-excel-export";
import { useEffect, useRef, useState } from "react";
import { LeaveInterface } from "../../models/ILeave";
import { ListLeaveStatus } from "../../services/HttpClientService";
import { Grid, GridColumn, GridRowProps} from "@progress/kendo-react-grid";
import { Box, Button, Container, FormControl, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function Payroll1(){
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null){
            _export.current.save();
        }
    }
    // const [start, setStart] = React.useState<Date | null>(new Date());
    // const [stop, setStop] = React.useState<Date | null>(new Date());
    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([]);
    const getLeaveList = async () => {
        let res = await ListLeaveStatus();
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };
    // async function submit(){
    //     let data = { 
    //         start: start?.toLocaleString,
    //         stop: stop?.toLocaleString,   
    //     }
    //     console.log(data)
    //     let res = await ListLeaveStatusDate(data);
        
    //     if (res.status) {
    //         console.log("Ok")
            
    //     } else {
    //         console.log("Error")
    //     }
    // }
    useEffect(() => {    
        
        getLeaveList();
        
    }, []);
    const rowRender = (trElement: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
            const red = { backgroundColor: "rgb(250, 219, 216)" };
            const trProps: any = { style: red };
            return React.cloneElement(trElement, { ...trProps });
    }
    return (
        <div>
            <Container className="container" maxWidth="lg">
            <Paper
                className="paper"
                elevation={6}
                sx={{
                padding: 2.5,
                borderRadius: 3,
                }}
            >
                <Box
                    display="flex"
                >
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                        >
                            ประวัติการลางาน
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ borderRadius: 20 }}>
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        
                        <FormControl fullWidth variant="outlined">
                            <DateTimePicker
                                label="วันที่และเวลา"
                                
                                value={start}
                                onChange={(newValue) => {
                                    setStart(newValue);
                                    console.log(newValue)
                                  }}
                                  renderInput={(params) => <TextField {...params} />}
                                  
                            />
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                            <DateTimePicker
                                
                                label="วันที่และเวลา"
                                value={stop}
                                onChange={(newValue) => {
                                    setStop(newValue);
                                  
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        
                    </LocalizationProvider>
                    <Button onClick={submit} >
                        Seach
                    </Button> */}
                <Button 
                    color="secondary" onClick={excelExport} variant="contained"
                    sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                    >
                        Export to Excel
                    </Button>
            <ExcelExport data={leavelist} ref={_export}>
            <Grid data={leavelist} style={{ height: "auto" }} rowRender={rowRender}>
                <GridColumn field="EmpName" title="ชื่อ-นามสกุล"  width="120px" />
                <GridColumn field="TypeName" title="ประเภทการลา" width="150px" />
                <GridColumn field="StartTime" title="ลาวันที่เวลา" width="250px"/>
                <GridColumn field="StopTime" title="ถึงวันที่เวลา" width="250px"/>
                <GridColumn field="ManName" title="ผู้จัดการ" width="150px"/>
                <GridColumn field="Status" title="สถานะ" width="150px"/>
            </Grid>
        </ExcelExport>
        </Box>
        </Paper>
        </Container>
    </div>
    )
}