import { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs';
import { SwitchsInterface } from '../../models/ISwitch';
import { ListSwitch, ListSwitchByDepIDnSNWait } from '../../services/HttpClientService';

import { Link as RouterLink } from "react-router-dom";
import moment from 'moment';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
function SwitchPayrollShow(){
    const [filterDate, setFilterDate] = useState("");
  
    const handleFilterDateChange = (event:any) => {
      const selectedDate = event.target.value;
      const formattedDate = moment(selectedDate).format('YYYY-MM');
      console.log(formattedDate);
      setFilterDate(formattedDate);
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
          let res = await ListSwitch();
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
      useEffect(() => {    
          
          getSwitch()
          
      }, []);
    const handleExportExcel = () => {
      // สร้าง workbook ใหม่
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('My Worksheet');
      const filteredSwitchs = switchs.filter((row) => {
        if (filterDate) {
          return (
            reverseDate(row.WorkDay) === filterDate
          );
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
      <div className='div'>
        <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
        <button onClick={handleExportExcel}>Export to Excel</button>
        <table>
          <thead>
            <tr>
              <th>พนักงาน</th>
              <th>วันที่สลับ</th>
              <th>จากเวลา</th>
              <th>ถึงเวลา</th>
              <th>วันที่มาทำงาน</th>
              <th>แผนก/ฝ่าย</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {switchs.filter((row) => {
          // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
          if (filterDate) {
            return (
              reverseDate(row.WorkDay) === filterDate
            );
          }
          return true;
        }).map((row, index) => (
              <tr key={index}>
                <td>{row.UserLname}</td>
                <td>{row.LeaveDay}</td>
                <td>{row.FromTime ? formatTime(row.FromTime) : ''}</td>
                <td>{row.ToTime ? formatTime(row.ToTime) : ''}</td>
                <td>{row.WorkDay }</td>
                <td>{row.DepName}</td>
                <td>{row.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div></Paper></Container>
    );
}
export default SwitchPayrollShow
