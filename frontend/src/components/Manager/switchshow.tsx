import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, IconButton, Paper, TablePagination, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarFilterButton} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveWait, ListSwitchWait } from '../../services/HttpClientService';
import Approve from './approve';
import moment from 'moment';
import { Switch1Interface, SwitchsInterface } from '../../models/ISwitch';
import SwitchApprove from './switchaprove';

function ManagerSwitchShow(){
    
    const [switchs, setSwitch] = useState<SwitchsInterface[]>([])
    const getSwitch = async (id:any) => {
        let res = await ListSwitchWait(id);
        if (res.data) {
            setSwitch(res.data);
            console.log(res.data)
        }
    };
    function formatMinutesToTime(minutes: any) {
        const hours = Math.floor(minutes / 60);
        const minutesPart = minutes % 60;
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutesPart).padStart(2, '0');
        return `${hoursStr}:${minutesStr}`;
      }
    const reverseDate = (str: string) => {
        let strParts = str.split('/');
        const reversedDate = `${strParts[1]}/${strParts[0]}/${strParts[2]}`;
        return reversedDate
    }
    const [filterDate, setFilterDate] = useState("");
  const handleFilterDateChange = (event:any) => {
    const selectedDate = event.target.value;
    const formattedDate = moment(selectedDate).format('YYYY-MM');
  console.log(formattedDate);
  setFilterDate(formattedDate);
  };
  const reverseDate1 = (str: any) => {
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
        
        getSwitch(JSON.parse(localStorage.getItem("dep_id") || ""))
    }, []);

    const columns: GridColDef[] = [
        { field: "EmpName", headerName: "ชื่อ-นามสกุล",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.UserLname}</>},
        },
        { field: "LeaveDay", headerName: "วันที่สลับ",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => reverseDate(params?.value)},
        { field: "FromTime", headerName: "จากเวลา",type:"string", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "ToTime", headerName: "ถึงเวลา",type:"time", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => formatMinutesToTime(params?.value as number)},
        { field: "WorkDay", headerName: "วันที่มาทำงาน",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) =>reverseDate(params?.value) },
          { field: "ManName", headerName: "ผู้จัดการ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.DepName}</>;
          }, },
          {
            field: "อนุมัติ",
            align: "center",
            
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <SwitchApprove params={params.row.ID} />;
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
                            รายการคำร้องขอสลับวันลา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/รายการอนุมัติสลับวันลา"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            ประวัติอนุมัติสลับวันลา
                        </Button>
                    </Box>
                </Box>
                
                <Box sx={{ borderRadius: 20 }}>
                    {/* <DataGrid
                        rows={switchs}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        slots={{toolbar: GridToolbarFilterButton}}
                        sx={{ mt: 2, backgroundColor: '#fff' }}
                    /> */}
                    
                    <TableContainer component={Paper} sx={{width: 'auto', margin: 2}}>
                      <input type="month" value={filterDate} onChange={handleFilterDateChange}/>
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
                      สถานะ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {switchs.filter((row) => {
        // กรองข้อมูลด้วยวันที่ LeaveDay ถ้า filterDate ไม่เป็น null
        if (filterDate) {
          return (
            reverseDate1(row.LeaveDay) === filterDate
          );
        }
        return true;
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: SwitchsInterface) => (
                    <TableRow>
                      <TableCell>{item.UserLname}</TableCell>
                      <TableCell>{item.LeaveDay}</TableCell>
                      <TableCell>{formatMinutesToTime(item.FromTime)}</TableCell>
                      <TableCell>{formatMinutesToTime(item.ToTime)}</TableCell>
                      <TableCell>{item.WorkDay}</TableCell>
                      <TableCell><SwitchApprove params={item.ID}/></TableCell>
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
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ManagerSwitchShow