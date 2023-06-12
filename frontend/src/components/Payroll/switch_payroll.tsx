import { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs';
import { SwitchsInterface } from '../../models/ISwitch';
import { ListDepartments, ListSwitch, ListSwitchByDepIDnSNWait, ListSwitchP } from '../../services/HttpClientService';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { DepartmentInterface } from '../../models/ILeave';
function SwitchPayrollShow(){
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
  const [dep, setDep] = useState<DepartmentInterface[]>([]);
  const getDepartment = async () => {
    let res = await ListDepartments();
    if (res.data) {
      setDep(res.data);
    }
    console.log(res.data)
};
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60); // หารเพื่อหาจำนวนชั่วโมง
      const mins = minutes % 60; // หาเศษนาทีที่เหลือ
    
      const formattedHours = String(hours).padStart(2, '0'); // แปลงชั่วโมงให้มี 2 หลัก
      const formattedMins = String(mins).padStart(2, '0'); // แปลงนาทีให้มี 2 หลัก
    
      return `${formattedHours}:${formattedMins}`; // ส่งค่าเวลาในรูปแบบ "HH:mm น."
    };
    const [switchs, setSwitch] = useState<SwitchsInterface[]>([])
      const getSwitch = async () => {
          let res = await ListSwitchP();
          if (res.data) {
              setSwitch(res.data);
              console.log(res.data)
          }
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
          getDepartment()
          getSwitch()
          
      }, []);
    const handleExportExcel = () => {
      // สร้าง workbook ใหม่
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('My Worksheet');
      const filteredSwitchs = switchs.filter((row) => {
        if (filterDate) {
          return (
            reverseDate(row.LeaveDay) === filterDate && row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase()) && row.DepName.toLowerCase().includes(filterDepName.toLowerCase())
          );
        }
        // กรองข้อมูลด้วย UserLname
        if (filterUserLname) {
          return row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase());
        }
        if (filterDepName) {
          return row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
        return true;
      });
      // เพิ่มหัวข้อตาราง
      worksheet.columns = [
        { header: 'พนักงาน', key: 'UserLname', width: 15 },
        { header: 'วันที่สลับ', key: 'LeaveDay', width: 20 },
        { header: 'จากเวลา', key: 'FromTime', width: 20 },
        { header: 'ถึงเวลา', key: 'ToTime', width: 20 },
        { header: 'วันที่มาทำงาน', key: 'WorkDay', width: 20 },
        { header: 'แผนก/ฝ่าย', key: 'DepName', width: 15 },
        { header: 'สถานะ', key: 'Status', width: 20 }
      ];
  
      // เพิ่มข้อมูลลงในตาราง
      filteredSwitchs.forEach(row => {
        console.log(row);
        const { UserLname, LeaveDay, FromTime, ToTime, WorkDay, DepName, Status } = row;
        worksheet.addRow({
          UserLname,
          LeaveDay,
          FromTime: FromTime ? formatTime(FromTime):null,
          ToTime: ToTime ? formatTime(ToTime): null,
          WorkDay,
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
          link.download = 'switch-list.xlsx';
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
                    height: '80vh',
                  padding: 2,
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
                              ประวัติอนุมัติสลับวันลา
                          </Typography>
                      </Box></Box>
      <Box sx={{ borderRadius: 20 }}>
                
                    <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
                      <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
                      <input type="text" value={filterUserLname} onChange={handleFilterUserLnameChange} placeholder="ค้นหาชื่อ-นามสกุล"/>
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
                <button onClick={handleExportExcel}>Export to Excel</button>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell width="">
                      ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell>
                      วันที่สลับ
                    </TableCell>
                    <TableCell>
                      จากเวลา
                    </TableCell>
                    <TableCell>
                      ถึงเวลา
                    </TableCell>
                    <TableCell>
                      วันที่มาทำงาน
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
                {switchs.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            reverseDate(row.LeaveDay) === filterDate && row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase()) && row.DepName.toLowerCase().includes(filterDepName.toLowerCase())
          );
        }
        // กรองข้อมูลด้วย UserLname
        if (filterUserLname) {
          return row.UserLname.toLowerCase().includes(filterUserLname.toLowerCase());
        }
        if (filterDepName) {
          return row.DepName.toLowerCase().includes(filterDepName.toLowerCase());
        }
        return true;
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: SwitchsInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.LeaveDay}</TableCell>
                      <TableCell>{formatMinutesToTime(item.FromTime)}</TableCell>
                      <TableCell>{formatMinutesToTime(item.ToTime)}</TableCell>
                      <TableCell>{item.WorkDay}</TableCell>
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
                count={switchs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
                </Box></Paper></Container>
    );
}
export default SwitchPayrollShow
