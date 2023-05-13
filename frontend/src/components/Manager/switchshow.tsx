import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarFilterButton} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveWait, ListSwitchWait } from '../../services/HttpClientService';
import Approve from './approve';
import moment from 'moment';
import { Switch1Interface } from '../../models/ISwitch';
import SwitchApprove from './switchaprove';

function ManagerSwitchShow(){
    
    const [switchs, setSwitch] = useState<Switch1Interface[]>([])
    const getSwitch = async (id:any) => {
        let res = await ListSwitchWait(id);
        if (res.data) {
            setSwitch(res.data);
            console.log(res.data)
        }
    };
    function formatMinutesToTime(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutesPart = minutes % 60;
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutesPart).padStart(2, '0');
        return `${hoursStr}:${minutesStr}`;
      }
    useEffect(() => {    
        
        getSwitch(JSON.parse(localStorage.getItem("did") || ""))
    }, []);

    const columns: GridColDef[] = [
        { field: "EmpName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.EmpName}</>},
        },
        { field: "LeaveDay", headerName: "วันที่สลับ",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY")},
        { field: "FromTime", headerName: "จากเวลา",type:"string", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "ToTime", headerName: "ถึงเวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "WorkDay", headerName: "วันที่มาทำงาน",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY ") },
          { field: "ManName", headerName: "ผู้จัดการ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.ManName}</>;
          }, },
          {
            field: "อนุมัติ",
            align: "center",
            
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <SwitchApprove params={params.row.ID} />;
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
                            รายการคำร้องขอสลับวันลา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/switchhistory"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            ประวัติอนุมัติสลับวันลา
                        </Button>
                    </Box>
                </Box>
                
                <Box sx={{ borderRadius: 20 }}>
                    <DataGrid
                        rows={switchs}
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
export default ManagerSwitchShow