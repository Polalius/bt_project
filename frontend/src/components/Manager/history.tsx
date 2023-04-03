import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';

import { EmployeeInterface } from '../../models/IEmployee';
import { LeaveInterface } from '../../models/ILeave';
import EditIcon from '@mui/icons-material/Edit';
import { GetEmployeeID, ListLeaveListByDepID, ListLeaveListByDepIDnSNWait, ListLeaveListByDepIDnSWait } from '../../services/HttpClientService';

function ManagerHistory(){

    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([])

    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
        }
    };


    useEffect(() => {    
        setLeavelist(JSON.parse(localStorage.getItem("did") || ""));
        
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
    }, []);

    const columns: GridColDef[] = [
        { field: "Employee.FirstName", headerName: "ชื่อ-นามสกุล", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Employee.EmpName }</>},
        },
        { field: "LeaveType.TypeName", headerName: "ประเภทการลา", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.LeaveType.TypeName}</>;
          },},
        { field: "StartTime", headerName: "ลาวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StartTime}</>;
          }, },
        { field: "StopTime", headerName: "ถึงวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StopTime}</>;
          }, },
          { field: "Manager.FirstName", headerName: "ผู้จัดการ", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Manager.ManName}</>;
          }, },
          { field: "Status", headerName: "สถานะ", width: 150, headerAlign: "center", align: "center" },  
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
                            ประวัติการลางาน
                        </Typography>
                    </Box>
                    {/* <Box>
                        <Button
                            component={RouterLink}
                            to="/form"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            กรอกแบบฟอร์ม
                        </Button>
                    </Box> */}
                </Box>
                <Box sx={{ borderRadius: 20 }}>
                    <DataGrid
                        rows={leavelist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                    />
                </Box>
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
                        to="/"
                        sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                    >
                        ถอยกลับ
                    </Button>

            </Stack>
                </Paper>
            </Container>
        </div>
    )
}
export default ManagerHistory