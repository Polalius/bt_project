import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import * as ExcelJS from 'exceljs';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
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
    const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(Array(res))
        }
    };
    useEffect(() => {
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
    }, []);

    const handleExportExcel = () => {
    // สร้าง workbook ใหม่
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Worksheet');
      const filteredSwitchs = leavelist.filter((row) => {
      if (filterDate) {
        return (
          moment(row.StartTime).format(TimeFilter) === filterDate
        );
      }
      return true;
    });
    // เพิ่มหัวข้อตาราง
    worksheet.columns = [
      { header: 'พนักงาน', key: 'EmpName', width: 15 },
      { header: 'ประเภทการลา', key: 'TypeName', width: 15 },
      { header: 'ลาวันที่เวลา', key: 'StartTime', width: 20 },
      { header: 'ถึงวันที่เวลา', key: 'StopTime', width: 20 },
      { header: 'ผู้จัดการ', key: 'ManName', width: 15 },
      { header: 'สถานะ', key: 'Status', width: 20 }
    ];

    // เพิ่มข้อมูลลงในตาราง
    filteredSwitchs.forEach(row => {
      console.log(row);
      const { EmpName, TypeName, StartTime,StopTime, ManName, Status } = row;
      worksheet.addRow({
        EmpName,
        TypeName,
        StartTime: StartTime ? moment(StartTime).format(ToTimeFormat1): null,
        StopTime: StopTime ? moment(StopTime).format(ToTimeFormat1) : null,
        ManName,
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
        link.download = 'my-workbook.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
      });
  };
    return (
        <div className='div'>
        <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
      <button onClick={handleExportExcel}>Export to Excel</button>
      <table>
        <thead>
          <tr>
            <th>พนักงาน</th>
            <th>ประเภทการลา</th>
            <th>วันที่ลา</th>
            <th>ถึงวันที่</th>
            <th>ผู้จัดการ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {leavelist.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            moment(row.StartTime).format(TimeFilter) === filterDate
          );
        }
        return true;
      }).map((row, index) => (
            <tr key={index}>
              <td>{row.EmpName}</td>
              <td>{row.TypeName}</td>
              <td>{row.StartTime ? new Date(row.StartTime).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit', minute: '2-digit' }) : ""}</td>
              <td>{row.StopTime ? new Date(row.StopTime).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit', minute: '2-digit' }) : ""}</td>
              <td>{row.ManName}</td>
              <td>{row.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export default ManagerHistory