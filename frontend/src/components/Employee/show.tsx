import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';
import { Box, Button, Container, Paper, TablePagination, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams,  GridToolbarFilterButton } from '@mui/x-data-grid';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { LeaveInterface, LeavesInterface } from '../../models/ILeave';

import { GetEmployeeID, ListLeaveListByEmpID } from '../../services/HttpClientService';
import { UserInterface } from '../../models/ISignin';

function EmployeeShow(){
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
    const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
    const [user, setUser] = useState<UserInterface>();

    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByEmpID(id);
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
      function formatDate(value: string) {
        const [day, month, year] = value.split('/');
        const newdate = `${month}/${day}/${year}`
        const date = new Date(newdate);
        
        return date;
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
        getLeaveList(JSON.parse(localStorage.getItem("user_serial") || ""));
    }, []);

    const columns: GridColDef[] = [
        { field: "User.UserName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.UserLname}</>},
        },
        { field: "LeaveType.TypeName", headerName: "ประเภทการลา",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.LeaveType}</>;
          },},
        { field: "StartDate", headerName: "ลาวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value},
        { field: "StartTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "StopDate", headerName: "ถึงวันที่",type:"date", width: 120, headerAlign: "center", align: "center", valueFormatter: (params) => params?.value },
        { field: "StopTime", headerName: "เวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
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
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                            align='center'
                        >
                            ประวัติการลางาน
                        </Typography>
                    </Box>
                    <Button
                            component={RouterLink}
                            to="/แบบฟอร์มขอลา"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            กรอกแบบฟอร์ม
                        </Button>
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
                      <TableCell>{item.Status}</TableCell>
                      
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
export default EmployeeShow