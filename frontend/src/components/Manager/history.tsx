import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';

import { LeaveInterface } from '../../models/ILeave';
import { ListLeaveListByDepIDnSNWait } from '../../services/HttpClientService';


function ManagerHistory(){
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null){
            _export.current.save();
        }
    }

    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListLeaveListByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
        }
    };

    useEffect(() => {
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
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
                    <ExcelExport data={leavelist} ref={_export}>
                    <Grid data={leavelist} style={{ height: "auto", borderBlockColor:'border-top-color'}}  >
                        <GridToolbar>
                            <Button 
                            color="secondary" onClick={excelExport} variant="contained"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                            >
                                Export to Excel
                            </Button>
                        </GridToolbar>
                        <GridColumn field="EmpName" title="ชื่อ-นามสกุล"  width="120px" />
                        <GridColumn field="TypeName" title="ประเภทการลา" width="150px" />
                        <GridColumn field="StartTime" title="ลาวันที่เวลา" width="250px"/>
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
                            to="/"
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