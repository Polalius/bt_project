import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveWait } from '../../services/HttpClientService';
import Approve from './approve';

function ManagerShow(){
    
    const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };

    useEffect(() => {    
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""))
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
          {
            field: "Status",
            align: "center",
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <Approve params={params.row.ID} />;
            },
            sortable: false,
            description: "Status",
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
                            รายการคำร้องขอลา
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
                    <DataGrid
                        rows={leavelist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                    />
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ManagerShow