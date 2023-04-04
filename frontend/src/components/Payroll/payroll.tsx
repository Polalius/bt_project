import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { DataGridPremium, GridToolbarContainer,GridToolbarExport } from '@mui/x-data-grid-premium';
import { EmployeeInterface } from '../../models/IEmployee';
import { LeaveInterface } from '../../models/ILeave';
import EditIcon from '@mui/icons-material/Edit';
import { GetEmployeeID, ListLeave, ListLeaveList, ListLeaveListByDepID, ListLeaveListByDepIDnSNWait, ListLeaveListByDepIDnSWait, ListLeaveWait } from '../../services/HttpClientService';
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
        let res = await ListLeave();
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };


    useEffect(() => {    
        
        getLeaveList();
    }, []);

    const columns: GridColDef[] = [
        { field: "EmpName", headerName: "ชื่อ-นามสกุล", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.EmpName}</>},
        },
        { field: "TypeName", headerName: "ประเภทการลา", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.TypeName}</>;
          },},
        { field: "StartTime", headerName: "ลาวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StartTime}</>;
          }, },
        { field: "StopTime", headerName: "ถึงวันที่เวลา", width: 250, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.StopTime}</>;
          }, },
          { field: "ManName", headerName: "ผู้จัดการ", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.ManName}</>;
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
                    <DataGridPremium
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