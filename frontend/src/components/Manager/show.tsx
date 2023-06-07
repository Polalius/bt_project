import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, TablePagination, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarFilterButton} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Leave1Interface, LeaveInterface, LeavesInterface } from '../../models/ILeave';
import { ListLeaveWait } from '../../services/HttpClientService';
import Approve from './approve';
import moment from 'moment';

function ManagerShow(){
    
    const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };
    function formatMinutesToTime(minutes: any) {
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
      const [filterDate, setFilterDate] = useState("");
      const handleFilterDateChange = (event:any) => {
        const selectedDate = event.target.value;
        const formattedDate = moment(selectedDate).format('YYYY-MM');
      console.log(formattedDate);
      setFilterDate(formattedDate);
      };
      const reverseDate = (str: any) => {
          let strParts = str.split('/');
          const reversedDate = `${strParts[2]}-${strParts[1]}`;
          return reversedDate
      }
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
    
      const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    useEffect(() => {    
        
        getLeaveList(JSON.parse(localStorage.getItem("dep_id") || ""))
    }, []);

    const columns: GridColDef[] = [
        { field: "EmpName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.UserLname}</>},
        },
        { field: "TypeName", headerName: "ประเภทการลา",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.LeaveType}</>;
          },},
        { field: "StartDate", headerName: "ลาวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => moment(parseDateString(params?.value)).format("MM/DD/YYYY")},
        { field: "StartTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "StopDate", headerName: "ถึงวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value },
        { field: "StopTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
          { field: "ManName", headerName: "แผนก/ฝ่าย",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.DepName}</>;
          }, },
          {
            field: "Status",
            align: "center",
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <Approve params={params.row.ID}/>;
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
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                            align='center'
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
                    
                <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
                    {/* <DataGrid
                        rows={leavelist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        slots={{toolbar: GridToolbarFilterButton}}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                        
                    /> */}
                    <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell width="">
                      ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell>
                      การลา
                    </TableCell>
                    <TableCell>
                      ลาวันที่
                    </TableCell>
                    <TableCell>
                      เวลา
                    </TableCell>
                    <TableCell>
                      ถึงวันที่
                    </TableCell>
                    <TableCell>
                      เวลา
                    </TableCell>
                    <TableCell>
                      สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leavelist.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            reverseDate(row.StartDate) === filterDate
          );
        }
        return true;
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: LeavesInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.LeaveType}</TableCell>
                      <TableCell>{item.StartDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StartTime)}</TableCell>
                      <TableCell>{item.StopDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StopTime)}</TableCell>
                      <TableCell><Approve params={item.ID}/></TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={leavelist.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ManagerShow