import React, { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs';
import { Switch1Interface } from '../../models/ISwitch';
import { ListSwitchWait } from '../../services/HttpClientService';

const MyTable = () => {
  const [switchs, setSwitch] = useState<Switch1Interface[]>([])
    const getSwitch = async (id:any) => {
        let res = await ListSwitchWait(id);
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

    // เพิ่มหัวข้อตาราง
    worksheet.columns = [
      { header: 'Column 1', key: 'EmpName', width: 10 },
      { header: 'Column 2', key: 'ManName', width: 10 },
      { header: 'Column 3', key: 'DepName', width: 10 }
    ];

    // เพิ่มข้อมูลลงในตาราง
    switchs.forEach(row => {
      worksheet.addRow(row);
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
    <div>
      <table>
        <thead>
          <tr>
            <th>พนักงาน</th>
            <th></th>
            <th>Column 3</th>
            <th>Column 3</th>
            <th>Column 3</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {switchs.map((row, index) => (
            <tr key={index}>
              <td>{row.EmpName}</td>
              <td>{row.ManName}</td>
              <td>{row.Status}</td>
              <td>{row.DepName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExportExcel}>Export to Excel</button>
    </div>
  );
};

export default MyTable;
