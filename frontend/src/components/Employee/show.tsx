import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';

import { Box, Button, Container, Paper, TablePagination, Typography } from '@mui/material';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { LeaveTypeInterface, LeavesInterface } from '../../models/ILeave';

import { ListLeaveListByEmpID, ListLeaveType } from '../../services/HttpClientService';


function EmployeeShow(){
  const [ltype, setLType] = useState<LeaveTypeInterface[]>([]);
  const getLeaveType = async () => {
    let res = await ListLeaveType();
    if (res.data) {
      setLType(res.data);
    }
    console.log(res.data)
  };

  const [filterDate, setFilterDate] = useState("");
  const handleFilterDateChange = (event:any) => {
    const selectedDate = event.target.value;
    if(selectedDate == ""){
      setFilterDate("")
    }else{
      const formattedDate = moment(selectedDate).format('YYYY-MM');
      setFilterDate(formattedDate);
    }
  };

  const reverseDate = (str: any) => {
    let strParts = str.split('/');
    const reversedDate = `${strParts[2]}-${strParts[1]}`;
    return reversedDate
  }

  const [filterType, setFilterType] = useState("");
  const handleFilterTypeChange = (event: any) => {
    const value = event.target.value;
    setFilterType(value);
  };

  const [filterStatus, setFilterStatus] = useState("");
  const handleFilterStatusChange = (event: any) => {
    const value = event.target.value;
    setFilterStatus(value);
  };
  
  const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
  const getLeaveList = async (id:any) => {
    let res = await ListLeaveListByEmpID(id);
    if (res) {
      setLeavelist(res.data);
      console.log(res)
    }
  };

  function formatMinutesToTime(minutes: any) {
    const hours = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutesPart).padStart(2, '0');
    return `${hoursStr}:${minutesStr} น.`;
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
    getLeaveType()
  }, []);
  
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
                <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
                  <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
                  <select
                   value={filterType}
                   onChange={handleFilterTypeChange}
                  >
                    <option aria-label="None" value="">
                                        ค้นหาการลา
                                </option>
                                {ltype.map((item: LeaveTypeInterface) => (
                                    <option value={item.Mc} key={item.Bh}>
                                        {item.Mc}
                                    </option>
                                ))}
                  </select>
                  <select
                   value={filterStatus}
                   onChange={handleFilterStatusChange}
                  >
                    <option aria-label="None" value="">
                                        สถานะอนุมัติ
                                </option>
                    <option value="approved">approved</option>
                    <option value="pending approval">pending approval</option>
                  </select>
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
                            reverseDate(row.StartDate) === filterDate && row.Mc.toLowerCase().includes(filterType.toLowerCase()) && row.Status.toLowerCase().includes(filterStatus.toLowerCase())
                          );
                        }
                        if (filterDate) {
                          return (
                            row.Mc.toLowerCase().includes(filterType.toLowerCase()) && row.Status.toLowerCase().includes(filterStatus.toLowerCase())
                          );
                        }
                        if (filterType) {
                          return row.Mc.toLowerCase().includes(filterType.toLowerCase());
                        }
                        if (filterStatus) {
                          return row.Status.toLowerCase().includes(filterStatus.toLowerCase());
                        }
                        return true;
                      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: LeavesInterface) => (
                        <TableRow>
                          <TableCell>{item.UserLname}</TableCell>
                          <TableCell>{item.Mc}</TableCell>
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
                  rowsPerPageOptions={[2, 10, 25]}
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
