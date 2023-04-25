import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridColumnProps, GridFilterChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';

import { Leave1Interface, LeaveInterface } from '../../models/ILeave';
import { ListLeaveListByDepIDnSNWait, ListSwitchByDepIDnSNWait } from '../../services/HttpClientService';
import React from 'react';
import { Switch1Interface, SwitchInterface } from '../../models/ISwitch';

function ManagerSwitchHistory(){
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null){
            _export.current.save();
        }
    }
    interface CustomGridColumnProps extends GridColumnProps {
        template?: (dataItem: any) => any;
      }
      
      const CustomGridColumn = (props: CustomGridColumnProps) => {
        const { template, ...rest } = props;
      
        if (template) {
          return (
            <GridColumn
              {...rest}
              cell={(props) => {
                return (
                  <td>
                    {template(props.dataItem)}
                  </td>
                );
              }}
            />
          );
        }
      
        return <GridColumn {...props} />;
      };
    const [leavelist, setLeavelist] = useState<Switch1Interface[]>([])
    const [leavelist1, setLeavelist1] = useState<SwitchInterface[]>([])
    const getLeaveList = async (id:any) => {
        let res = await ListSwitchByDepIDnSNWait(id);
        if (res.data) {
            setLeavelist(res.data);
            console.log(Array(res))
        }
    };
    useEffect(() => {
        getLeaveList(JSON.parse(localStorage.getItem("did") || ""));
    }, []);
    const rowRender = (trElement: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
        const red = { backgroundColor: "rgb(250, 219, 216)" };
        const trProps: any = { style: red };
        return React.cloneElement(trElement, { ...trProps });
    }
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

                    <Grid data={leavelist} style={{ height: "auto"}} rowRender={rowRender}>
                        <GridColumn field="EmpName" title="ชื่อ-นามสกุล"  width="120px" />
                        <GridColumn field="LeaveDay" title="วันที่สลับ" width="250px"/>
                        <GridColumn field="FromTime" title="ถึงวันที่เวลา" width="250px"/>
                        <GridColumn field="ToTime" title="ลาวันที่เวลา" width="250px" format='MM/DD/YYYY'/>
                        <GridColumn field="WorkDay" title="ถึงวันที่เวลา" width="250px"/>
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
export default ManagerSwitchHistory
