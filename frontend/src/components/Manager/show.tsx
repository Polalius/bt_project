import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarFilterButton} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveWait } from '../../services/HttpClientService';
import Approve from './approve';
import moment from 'moment';

function ManagerShow(){
    
    const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };
    function formatMinutesToTime(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutesPart = minutes % 60;
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutesPart).padStart(2, '0');
        return `${hoursStr}:${minutesStr} น.`;
      }
    function parseDateString(dateString: string) {
        const dateParts = dateString.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // ลดค่าเดือนลง 1 เพื่อใช้ในการสร้างวัตถุ Date (เนื่องจากเดือนใน JavaScript เริ่มจาก 0)
        const year = parseInt(dateParts[2], 10);
        const newDate = new Date(year, month, day);
        return newDate;
      }
    useEffect(() => {    
        
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""))
    }, []);

    const columns: GridColDef[] = [
        { field: "EmpName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.EmpName}</>},
        },
        { field: "TypeName", headerName: "ประเภทการลา",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.TypeName}</>;
          },},
        { field: "StartDate", headerName: "ลาวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => moment(parseDateString(params?.value)).format("MM/DD/YYYY")},
        { field: "StartTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "StopDate", headerName: "ถึงวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value },
        { field: "StopTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
          { field: "ManName", headerName: "ผู้จัดการ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.ManName}</>;
          }, },
          {
            field: "Status",
            align: "center",
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <Approve params={params.row.ID} EmpEmail={params.row.EmpEmail} ManEmail={params.row.ManEmail}/>;
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
                        >
                            รายการคำร้องขอลา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/รายการอนุมัติการลา"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            ประวัติอนุมัติการลา
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
export default ManagerShow