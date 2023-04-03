import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { GridToolbarContainer,GridToolbarExport } from '@mui/x-data-grid-premium';
import { EmployeeInterface } from '../../models/IEmployee';
import { LeaveInterface } from '../../models/ILeave';
import EditIcon from '@mui/icons-material/Edit';
import { GetEmployeeID, ListLeaveList, ListLeaveListByDepID, ListLeaveListByDepIDnSNWait, ListLeaveListByDepIDnSWait } from '../../services/HttpClientService';
function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
function PayrollShow(){

    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([])

    const getLeaveList = async () => {
        let res = await ListLeaveList();
        if (res.data) {
            setLeavelist(res.data);
        }
    };


    useEffect(() => {    
        setLeavelist(JSON.parse(localStorage.getItem("pid") || ""));
        
        getLeaveList();
    }, []);

    const columns: GridColDef[] = [
        { field: "Employee.FirstName", headerName: "Name", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Employee.FirstName +"  "+params.row.Employee.LastName}</>},
        },
        { field: "LeaveType.TypeName", headerName: "Topic", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.LeaveType.TypeName}</>;
          },},
        { field: "StartTime", headerName: "ลาวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StartTime}</>;
          }, },
        { field: "StopTime", headerName: "ถึงวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StopTime}</>;
          }, },
          { field: "Manager.FirstName", headerName: "ผู้จัดการ", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Manager.FirstName+"    "+params.row.Manager.LastName}</>;
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
                </Box>
                <Box sx={{ borderRadius: 20 }}>
                    <DataGrid
                        rows={leavelist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        slots={{toolbar: CustomToolbar}}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                    />
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default PayrollShow