import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import * as ExcelJS from 'exceljs';
import { Box, Button, Container, Paper,TablePagination,Typography } from '@mui/material';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { DepartmentInterface, LeaveTypeInterface, LeavesInterface } from '../../models/ILeave';
import { ListDepartments, ListLeave, ListLeaveListByDepIDnSNWait, ListLeaveP, ListLeaveType } from '../../services/HttpClientService';
import moment from 'moment';
function PayrollShow(){

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
    const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
    const getLeaveList = async () => {
        let res = await ListLeaveP();
        if (res.data) {
            setLeavelist(res.data);
            console.log(Array(res))
        }
    };
    const [ltype, setLType] = useState<LeaveTypeInterface[]>([]);
  const getLeaveType = async () => {
    let res = await ListLeaveType();
    if (res.data) {
      setLType(res.data);
    }
    console.log(res.data)
};
  const [dep, setDep] = useState<DepartmentInterface[]>([]);
  const getDepartment = async () => {
    let res = await ListDepartments();
    if (res.data) {
      setDep(res.data);
    }
    console.log(res.data)
};
    const reverseDate = (str: any) => {
      let strParts = str.split('/');
      const reversedDate = `${strParts[2]}-${strParts[1]}`;
      return reversedDate
  }
  const [filterUserLname, setFilterUserLname] = useState("");
  const handleFilterUserLnameChange = (event: any) => {
    const value = event.target.value;
    setFilterUserLname(value);
  };
  const [filterDepName, setFilterDepName] = useState("");
  const handleFilterDepNameChange = (event: any) => {
    const value = event.target.value;
    setFilterDepName(value);
  };
  const [filterLeaveType, setFilterLeaveType] = useState("");
  const handleFilterLeaveTypeChange = (event: any) => {
    const value = event.target.value;
    setFilterLeaveType(value);
  };
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
        getLeaveList();
        getLeaveType()
        getDepartment()
    }, []);

    const handleExportExcel = () => {
    // สร้าง workbook ใหม่
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Worksheet');
      const filteredSwitchs = leavelist.filter((row) => {
        if (filterDate != "") {
          return reverseDate(row.StartDate) === filterDate && row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase()) && row.TypeName.toLowerCase().includes(filterLeaveType.toLowerCase()) && row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
        // กรองข้อมูลด้วย UserLname
        if (filterUserLname) {
          return row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase());
        }
        if (filterLeaveType) {
          return row.TypeName.toLowerCase().includes(filterLeaveType.toLowerCase());
        }
        if (filterDepName) {
          return row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
      return true;
    });
    // เพิ่มหัวข้อตาราง
    worksheet.columns = [
      { header: 'พนักงาน', key: 'UserLname', width: 15 },
      { header: 'ประเภทการลา', key: 'LeaveType', width: 15 },
      { header: 'ลาวันที่', key: 'StartDate', width: 20 },
      { header: 'เวลา', key: 'StartTime', width: 20 },
      { header: 'ถึงวันที่', key: 'StopDate', width: 20 },
      { header: 'เวลา', key: 'StopTime', width: 20 },
      { header: 'แผนก/ฝ่าย', key: 'DepName', width: 15 },
      { header: 'สถานะ', key: 'Status', width: 20 }
    ];

    // เพิ่มข้อมูลลงในตาราง
    filteredSwitchs.forEach(row => {
      console.log(row);
      const { UserLname, TypeName, StartDate,StartTime,StopDate,StopTime,DepName, Status } = row;
      worksheet.addRow({
        UserLname,
        TypeName,
        StartDate,
        StartTime: formatMinutesToTime(StartTime),
        StopDate,
        StopTime: formatMinutesToTime(StopTime),
        DepName,
        Status
      });
    });

    // สร้างไฟล์ Excel
    workbook.xlsx.writeBuffer()
      .then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'leave-list.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
      });
  };
  function formatMinutesToTime(minutes: any) {
    const hours = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutesPart).padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
  }
    return (
      <Container className="container" maxWidth="lg" >
      <Paper 
      className="paper"
      elevation={6}
      sx={{
      padding: 2.5,
      borderRadius: 3,
      }}>
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
                            ประวัติอนุมัติการลา
                        </Typography>
                    </Box>
                    </Box>
              <Box sx={{ borderRadius: 20 }}>
                
                    
                    <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
                      <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
                <input type="text" value={filterUserLname} onChange={handleFilterUserLnameChange} placeholder="ค้นหาชื่อ-นามสกุล"/>
                <select
                   value={filterLeaveType}
                   onChange={handleFilterLeaveTypeChange}
                  >
                    <option aria-label="None" value="">
                                        ค้นหาการลา
                                </option>
                                {ltype.map((item: LeaveTypeInterface) => (
                                    <option value={item.TypeName} key={item.TypeID}>
                                        {item.TypeName}
                                    </option>
                                ))}
                  </select>
                  <select
                   value={filterDepName}
                   onChange={handleFilterDepNameChange}
                  >
                    <option aria-label="None" value="">
                                        ค้นหาแผนก
                                </option>
                                {dep.map((item: DepartmentInterface) => (
                                    <option value={item.DepName} key={item.DepID}>
                                        {item.DepName}
                                    </option>
                                ))}
                  </select>
                <input type="text" value={filterDepName} onChange={handleFilterDepNameChange} placeholder="ค้นหาแผนก"/>
                <button onClick={handleExportExcel}>Export to Excel</button>
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
                    แผนก/ฝ่าย
                    </TableCell>
                    <TableCell>
                      สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leavelist.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate != "") {
          return reverseDate(row.StartDate) === filterDate && row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase()) && row.TypeName.toLowerCase().includes(filterLeaveType.toLowerCase()) && row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
        // กรองข้อมูลด้วย UserLname
        if (filterUserLname) {
          return row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase());
        }
        if (filterLeaveType) {
          return row.TypeName.toLowerCase().includes(filterLeaveType.toLowerCase());
        }
        if (filterDepName) {
          return row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
        return true;
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: LeavesInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.TypeName}</TableCell>
                      <TableCell>{item.StartDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StartTime)}</TableCell>
                      <TableCell>{item.StopDate}</TableCell>
                      <TableCell>{formatMinutesToTime(item.StopTime)}</TableCell>
                      <TableCell>{item.DepName}</TableCell>
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
                </Box></Paper></Container>
    )
}
export default PayrollShow