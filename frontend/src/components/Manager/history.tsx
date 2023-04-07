import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridFilterChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveListByDepIDnSNWait } from '../../services/HttpClientService';
import React from 'react';
import moment from 'moment-timezone';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

const initialFilter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [{ field: "EmpName", operator: "contains", value: "" }],
  };
function ManagerHistory(){
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null){
            _export.current.save();
        }
    }
    
    const [leavelist, setLeavelist] = useState<Leave1Interface[]>([])
    const [leavelist1, setLeavelist1] = useState<LeaveInterface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(Array(res))
        }
    };
    const convertTime = (i: Date) => {
        moment(i).format("DD/MM/YYYY hh:mm A")
        return i
    }
    
    const stt = leavelist
    console.log(stt)
    useEffect(() => {
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
    }, []);
    const bor = "2px solid red"
    const rowRender = (trElement: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
        const red = { backgroundColor: "rgb(250, 219, 216)" };
        const trProps: any = { style: red };
        return React.cloneElement(trElement, { ...trProps });
    }
    const [filter, setFilter] = React.useState(initialFilter);
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
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                        >
                            ประวัติการลางาน
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ borderRadius: 20 }}>
                    <Button 
                            color="secondary" onClick={excelExport} variant="contained"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                            >
                                Export to Excel
                        </Button>
                    <ExcelExport data={leavelist} ref={_export}>

                    <Grid data={leavelist} style={{ height: "auto"}} rowRender={rowRender} filterable={true} filter={filter} onFilterChange={(e: GridFilterChangeEvent) => setFilter(e.filter)}>
                        <GridColumn field="EmpName" title="ชื่อ-นามสกุล"  width="120px" />
                        <GridColumn field="TypeName" title="ประเภทการลา" width="150px" />
                        <GridColumn field="StartTime" title="ลาวันที่เวลา" width="250px" filter='date' format='{0:d}'/>
                        <GridColumn field="StopTime" title="ถึงวันที่เวลา" width="250px"/>
                        <GridColumn field="ManName" title="ผู้จัดการ" width="150px"/>
                        <GridColumn field="Status" title="สถานะ" width="150px"/>
                    </Grid>
                    </ExcelExport>
                    </Box>
                    <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ mt: 3 }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            component={RouterLink}
                            to="/show"
                            sx={{'&:hover': {color: '#1543EE', backgroundColor: '#e3f2fd'}}}
                        >
                            ถอยกลับ
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </div>
    )
}
export default ManagerHistory