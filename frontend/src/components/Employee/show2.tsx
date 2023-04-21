import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams,  GridToolbarFilterButton } from '@mui/x-data-grid';

import { EmployeeInterface } from '../../models/IEmployee';
import { LeaveInterface } from '../../models/ILeave';

import { GetEmployeeID, ListLeaveListByEmpID, ListSwitchByEmpID } from '../../services/HttpClientService';
import { SwitchInterface } from '../../models/ISwitch';

function EmployeeShow2(){

    const [leavelist, setLeavelist] = useState<SwitchInterface[]>([])
    const [emp, setEmp] = useState<EmployeeInterface>();

    const getLeaveList = async (id:any) => {
        let res = await ListSwitchByEmpID(id);
        if (res.data) {
            setLeavelist(res.data);
        }
    };

    const getEmployeeID = async (id:any) => {
        let res = await GetEmployeeID(id);
        if (res){
            setEmp(res)
            localStorage.setItem("did", res.DepartmentID)
        }
    }

    useEffect(() => {    
        setLeavelist(JSON.parse(localStorage.getItem("pid") || ""));
        
        getLeaveList(JSON.parse(localStorage.getItem("pid") || ""));
        getEmployeeID(JSON.parse(localStorage.getItem("pid") || ""))
    }, []);

    const columns: GridColDef[] = [
        { field: "Employee.FirstName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Employee.EmpName}</>},
        },
        { field: "WorkTime", headerName: "วันที่สลับ",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("MM/DD/YYYY hh:mm A")},
        { field: "LeaveTime", headerName: "วันที่มาทำงาน",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("MM/DD/YYYY ") },
        { field: "Manager.FirstName", headerName: "ผู้จัดการ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Manager.ManName}</>;
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
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                        >
                            ประวัติสลับวันลา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/switch"
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