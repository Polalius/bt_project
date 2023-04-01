import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from "react-router-dom";
import { ListItem, ListItemButton, ListItemIcon, IconButton, Divider, List, Drawer } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; 
export default function DrawerBar({ role, drawerWidth, handleDrawerClose, open, theme}: any) {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),

        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));
    const Listitemlink = () => {
        var menu: any[] = [
            { "text": "หน้าแรก", "icon": <HomeIcon />, "link": "/"},
        ];
        if (role === "employee") {
            menu = [
                { "text": "A", "icon": <InboxIcon />, "link": "/"},
                { "text": "B", "icon": <InboxIcon />, "link": "/show"},
                { "text": "C", "icon": <InboxIcon />, "link": "/form"},
            ]
        } else if (role === "manager") {
            menu = [
                ...menu,
                { "text": "manager", "icon": <InboxIcon />, "link": "/managershow"},
            ]
        } else if (role === "payroll") {
            menu = [
                ...menu,
                { "text": "payroll", "icon": <InboxIcon />, "link": "/payrollshow"},
            ]
        } 
        const navigator = useNavigate();
        return (
            menu.map((data, index) => (
                <ListItem key={data.text} disablePadding>
                    <ListItemButton onClick={()=>{navigator(data.link)}}>
                        <ListItemIcon>
                            {data.icon}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            ))
        )
    }
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {Listitemlink()}
                </List>
            </Drawer>
    )
}