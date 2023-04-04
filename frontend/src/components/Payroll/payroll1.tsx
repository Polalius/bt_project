import { ExcelExport } from "@progress/kendo-react-excel-export";
import { useEffect, useRef, useState } from "react";
import { LeaveInterface } from "../../models/ILeave";
import { ListLeave } from "../../services/HttpClientService";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Box, Button, Container, Paper, Typography } from "@mui/material";

export default function Payroll1(){
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null){
            _export.current.save();
        }
    }
    const [leavelist, setLeavelist] = useState<LeaveInterface[]>([]);
    const getLeaveList = async () => {
        let res = await ListLeave();
        if (res.data) {
            setLeavelist(res.data);
            console.log(res.data)
        }
    };
    useEffect(() => {    
        
        getLeaveList();
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
        
        <ExcelExport data={leavelist} ref={_export}>
            <Grid data={leavelist} style={{ height: "420px" }}>
                <GridToolbar>
                    <Button 
                    color="inherit" onClick={excelExport}
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
        </Paper>
        </Container>
    </div>
    )
}