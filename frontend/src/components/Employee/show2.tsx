import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams,  GridToolbarFilterButton } from '@mui/x-data-grid';

import { LeaveInterface } from '../../models/ILeave';

import { GetEmployeeID, ListLeaveListByEmpID, ListSwitchByEmpID } from '../../services/HttpClientService';
import { SwitchInterface, SwitchsInterface } from '../../models/ISwitch';

function EmployeeShow2(){

    const [leavelist, setLeavelist] = useState<SwitchsInterface[]>([])

    const getLeaveList = async (id:any) => {
        let res = await ListSwitchByEmpID(id);
        if (res.data) {
            setLeavelist(res.data);
        }
        
        console.log(res.data)
    };


    function formatMinutesToTime(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutesPart = minutes % 60;
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutesPart).padStart(2, '0');
        return `${hoursStr}:${minutesStr} น.`;
      }
    useEffect(() => {    
        getLeaveList(JSON.parse(localStorage.getItem("user_serial") || ""));
        
    }, []);

    
    const columns: GridColDef[] = [
        { field: "Employee.FirstName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.UserLname}</>},
        },
        { field: "LeaveDay", headerName: "วันที่สลับ",type:"date", width: 220, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value},
        { field: "FromTime", headerName: "จากเวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "ToTime", headerName: "ถึงเวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "WorkDay", headerName: "วันที่มาทำงาน",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value },
        { field: "Department.DepName", headerName: "แผนก",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.DepName}</>;
          }, },
        { field: "Status", headerName: "สถานะ",type:"string", width: 150, headerAlign: "center", align: "center" },  
    ];


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
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            กลับ
                        </Button>
                    </Box>
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                            align='center'
                        >
                            ประวัติสลับวันลา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/แบบฟอร์มสลับวันลา"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            กรอกแบบฟอร์ม
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ borderRadius: 20 }}>
                    <DataGrid
                        rows={leavelist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        slots={{toolbar: GridToolbarFilterButton}}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                    />
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default EmployeeShow2