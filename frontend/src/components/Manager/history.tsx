import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import * as ExcelJS from 'exceljs';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

import { LeavesInterface } from '../../models/ILeave';
import { ListLeaveListByDepIDnSNWait } from '../../services/HttpClientService';
import React from 'react';
import moment from 'moment';
function ManagerHistory(){
    const ToTimeFormat1 = 'DD/MM/YYYY HH:mm';
    const ToTimeFormat2 = 'DD/MM/YYYY';
    const TimeFilter = 'YYYY-MM';
  const [filterDate, setFilterDate] = useState("");
  const handleFilterDateChange = (event:any) => {
    const selectedDate = event.target.value;
    const formattedDate = moment(selectedDate).format('YYYY-MM');
  console.log(formattedDate);
  setFilterDate(formattedDate);
  };
    const [leavelist, setLeavelist] = useState<LeavesInterface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(Array(res))
        }
    };
    const reverseDate = (str: any) => {
      let strParts = str.split('/');
      const reversedDate = `${strParts[2]}-${strParts[1]}`;
      return reversedDate
  }
    useEffect(() => {
        getLeaveList(JSON.parse(localStorage.getItem("dep_id") || ""));
    }, []);

    const handleExportExcel = () => {
    // สร้าง workbook ใหม่
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Worksheet');
      const filteredSwitchs = leavelist.filter((row) => {
      if (filterDate) {
        return (
          reverseDate(row.StartDate) === filterDate
        );
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
      const { UserLname, Mc, StartDate,StartTime,StopDate,StopTime,DepName, Status } = row;
      worksheet.addRow({
        UserLname,
        Mc,
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
                            to="/รายการคำร้องขอลา"
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
                    </Box></Box>
        <div className='div'>
        <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
      <button onClick={handleExportExcel}>Export to Excel</button>
      <table>
        <thead>
          <tr>
            <th>พนักงาน</th>
            <th>ประเภทการลา</th>
            <th>วันที่ลา</th>
            <th>เวลา</th>
            <th>ถึงวันที่</th>
            <th>เวลา</th>
            <th>แผนก/ฝ่าย</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {leavelist.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            reverseDate(row.StartDate) === filterDate
          );
        }
        return true;
      }).map((row, index) => (
            <tr key={index}>
              <td>{row.UserLname}</td>
              <td>{row.Mc}</td>
              <td>{row.StartDate}</td>
              <td>{formatMinutesToTime(row.StartTime)}</td>
              <td>{row.StopDate}</td>
              <td>{formatMinutesToTime(row.StopTime)}</td>
              <td>{row.DepName}</td>
              <td>{row.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div></Paper></Container>
    )
}
export default ManagerHistory