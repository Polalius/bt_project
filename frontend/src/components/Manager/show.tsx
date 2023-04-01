import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { DataGridPremium, GridToolbarContainer,GridToolbarExport } from '@mui/x-data-grid-premium';
import { EmployeeInterface } from '../../models/IEmployee';
import { LeaveInterface } from '../../models/ILeave';
import EditIcon from '@mui/icons-material/Edit';
import { GetEmployeeID, ListLeave, ListLeaveListByDepID, ListLeaveListByDepIDnSNWait, ListLeaveListByDepIDnSWait } from '../../services/HttpClientService';
function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
function ManagerShow(){

    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([])
    const [leavelist1, setLeavelist1] = useState<LeaveInterface[]>([])

    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSWait(id);
        if (res.data) {
            setLeavelist(res.data);
        }
    };
    const getLeaveList1 = async () => {
        let res = await ListLeave();
        if (res) {
            setLeavelist1(res);
            console.log(res.data)
        }
    };



    useEffect(() => {    
        setLeavelist(JSON.parse(localStorage.getItem("did") || ""));
        
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
        getLeaveList1()
    }, []);

    const columns: GridColDef[] = [
        { field: "Employee.FirstName", headerName: "ชื่อ-นามสกุล", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Employee.FirstName +"  "+params.row.Employee.LastName}</>},
        },
        { field: "LeaveType.TypeName", headerName: "ประเภทการลา", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.LeaveType.ID}</>;
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
          {
            field: "Status",
            align: "center",
            headerAlign: "center",
            width: 85,
            renderCell: ({ row }: Partial<GridRowParams>) =>
              <IconButton  component={RouterLink}
              to="/approve"
                  size="small"
                  color="primary"
                  onClick={() => {
                      console.log("ID", row.ID)
                      localStorage.setItem("l_id", row.ID);
                  }}
              >
                <EditIcon />
              </IconButton >,
          },  
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
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/history"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            ประวัติอนุมัติ
                        </Button>
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
export default ManagerShow