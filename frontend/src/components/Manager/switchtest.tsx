import React, { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs';
import { Switch1Interface } from '../../models/ISwitch';
import { ListSwitchByDepIDnSNWait, ListSwitchWait } from '../../services/HttpClientService';
import './test.css';
import * as XLSX from 'xlsx';
import moment from 'moment';
const MyTable = () => {
  const ToTimeFormat1 = 'DD/MM/YYYY';
  const ToTimeFormat2 = 'DD/MM/YYYY';
  const TimeFilter = 'YYYY-MM';
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
  const [switchs, setSwitch] = useState<Switch1Interface[]>([])
    const getSwitch = async (id:any) => {
        let res = await ListSwitchByDepIDnSNWait(id);
        if (res.data) {
            setSwitch(res.data);
            console.log(res.data)
        }
    };
    useEffect(() => {    
        
        getSwitch(JSON.parse(localStorage.getItem("did") || ""))
        
    }, []);
  const handleExportExcel = () => {
    // สร้าง workbook ใหม่
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Worksheet');
    const filteredSwitchs = switchs.filter((row) => {
      if (filterDate) {
        return (
          moment(row.WorkDay).format(TimeFilter) === filterDate
        );
      }
      return true;
    });
    // เพิ่มหัวข้อตาราง
    worksheet.columns = [
      { header: 'พนักงาน', key: 'EmpName', width: 15 },
      { header: 'วันที่สลับ', key: 'LeaveDay', width: 20 },
      { header: 'จากเวลา', key: 'FromTime', width: 20 },
      { header: 'ถึงเวลา', key: 'ToTime', width: 20 },
      { header: 'วันที่มาทำงาน', key: 'WorkDay', width: 20 },
      { header: 'ผู้จัดการ', key: 'ManName', width: 15 },
      { header: 'สถานะ', key: 'Status', width: 20 }
    ];

    // เพิ่มข้อมูลลงในตาราง
    filteredSwitchs.forEach(row => {
      console.log(row);
      const { EmpName, LeaveDay, FromTime, ToTime, WorkDay, ManName, Status } = row;
      worksheet.addRow({
        EmpName,
        LeaveDay: LeaveDay ? moment(LeaveDay).format(ToTimeFormat1): null,
        FromTime: FromTime ? formatTime(FromTime):null,
        ToTime: ToTime ? formatTime(ToTime): null,
        WorkDay: WorkDay ? moment(WorkDay).format(ToTimeFormat2) : null,
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
  // function handleExportExcel() {
  //   // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
  //   const filteredSwitchs = switchs.filter((row) => {
  //     if (filterDate) {
  //       return (
  //         moment(row.WorkDay).format(TimeFilter) === filterDate
  //       );
  //     }
  //     return true;
  //   });
  
  //   // สร้าง worksheet ของไฟล์ Excel
  //   const ws = XLSX.utils.json_to_sheet(filteredSwitchs);
  
  //   // สร้าง workbook ของไฟล์ Excel
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Switchs');
  
  //   // สร้างไฟล์ Excel จาก workbook
  //   XLSX.writeFile(wb, 'Switchs.xlsx');
  // }
  
  return (
    
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
            <th>ผู้จัดการ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {switchs.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            moment(row.WorkDay).format(TimeFilter) === filterDate
          );
        }
        return true;
      }).map((row, index) => (
            <tr key={index}>
              <td>{row.EmpName}</td>
              <td>{row.LeaveDay ? new Date(row.LeaveDay).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit'}) : ""}</td>
              <td>{row.FromTime ? formatTime(row.FromTime) : ''}</td>
              <td>{row.ToTime ? formatTime(row.ToTime) : ''}</td>
              <td>{row.WorkDay ? new Date(row.WorkDay).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ""}</td>
              <td>{row.ManName}</td>
              <td>{row.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default MyTable;
