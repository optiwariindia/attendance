import React from "react";
import {
    Grid,
    Drawer,
    IconButton,
    Box,
    List,
    ListItemButton,
    Collapse,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useLocation, Link } from "react-router-dom";
import { User } from "../context";
const { useUser } = User
function NavGroup({
    navitem,
    isOpen,
    onClick,
    collapsed,
    isUpToMd,
    setCollapsed,
}) {
    const { pathname } = useLocation();
    const hasSubmenu =
        Array.isArray(navitem.submenu) && navitem.submenu.length > 0;

    return (
        <>
            <ListItemButton
                component={ !hasSubmenu ? Link : "button" }
                to={ !hasSubmenu ? navitem.link || "" : "#" }
                onClick={ () => {
                    if (hasSubmenu) {
                        onClick();
                    } else if (!isUpToMd) {
                        setCollapsed(true);
                    }
                } }
                selected={ pathname === navitem.link }
                sx={ {
                    px: 1.6,
                    width: "100%",
                    "&.Mui-selected": {
                        backgroundColor: !hasSubmenu ? "primary.main" : "",
                    },
                    "&:hover": {
                        backgroundColor: "hsla(208, 66%, 54%, 0.30)",
                        color: "#fff",
                    },
                } }
            >
                <ListItemIcon
                    sx={ {
                        minWidth: 0,
                        mr: 1.8,
                        justifyContent: "center",
                        display: !collapsed ? "flex" : "none",
                        alignItems: "center",
                        color: "white",
                    } }
                >
                    <i
                        className={ navitem.icon }
                        style={ {
                            fontSize: "16px",
                            width: "20px",
                            textAlign: "center",
                            filter: "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.8))",
                        } }
                    />
                </ListItemIcon>

                { !collapsed && (
                    <ListItemText
                        primary={ navitem.name }
                        primaryTypographyProps={ {
                            sx: {
                                whiteSpace: "nowrap",
                                transition: "opacity 0.2s ease",
                                fontSize: "14px",
                            },
                        } }
                    />
                ) }

                { !collapsed && hasSubmenu && (
                    <ExpandMore
                        style={ {
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            marginLeft: "auto",
                        } }
                    />
                ) }
            </ListItemButton>

            { hasSubmenu && (
                <Collapse in={ isOpen && !collapsed } timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        { navitem.submenu.map((item) => (
                            <ListItemButton
                                key={ item.name }
                                component={ Link }
                                to={ item?.link }
                                onClick={ () => {
                                    if (!isUpToMd) setCollapsed(true);
                                } }
                                selected={ pathname === item.link }
                                sx={ {
                                    pl: collapsed ? 2 : 6,
                                    backgroundColor: "#1A4F80",
                                    "&.Mui-selected": {
                                        backgroundColor: "primary.main",
                                        color: "#fff",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#3D90D7",
                                        color: "#fff",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#3D90D7",
                                        color: "#fff",
                                    },
                                } }
                            >
                                <ListItemText
                                    primary={ item.name }
                                    primaryTypographyProps={ {
                                        sx: {
                                            fontSize: "13px",
                                            color: "whitesmoke",
                                            fontWeight: pathname === item.link ? "500" : "normal",
                                        },
                                    } }
                                />
                            </ListItemButton>
                        )) }
                    </List>
                </Collapse>
            ) }
        </>
    );
}

function Sidebar({ children }) {
    const [collapsed, setCollapsed] = React.useState(false);
    const [openItem, setOpenItem] = React.useState(null);
    const isUpToMd = useMediaQuery("(min-width:900px)");
    const me = useUser();
    React.useEffect(() => {
        if (!isUpToMd) {
            setCollapsed(true);
        }
    }, [isUpToMd]);

    const sidenav = [
        {
            name: "Dashboard",
            icon: "fas fa-tachometer-alt",
            link: "/user",
        },
        {
            name: "Attendance",
            icon: "fas fa-user-check",
            link: "/user/attendance",
        },
        {
            name: "Leaves",
            icon: "fas fa-plane-departure",
            link: "/user/leave",
        },
    ];
    if (me?.role === "admin") {
        sidenav.push({
            name: "Admin Dashboard",
            icon: "fas fa-gauge",
            link: "/admin/dashboard",
        });
        sidenav.push({
            name: "Users",
            icon: "fas fa-users",
            link: "/admin/user",
        });
        sidenav.push({
            name: "Manage Leaves",
            icon: "fas fa-umbrella-beach",
            link: "/admin/leave",
        });
        sidenav.push({
            name: "Reports",
            icon: "fas fa-chart-bar",
            link: "/admin/attendance",
            // submenu: [
            //   { name: "Daily Report", link: "/reports/daily" },
            //   { name: "Monthly Report", link: "/reports/monthly" },
            // ],
        });
        sidenav.push({
            name: "Settings",
            icon: "fas fa-cog",
            link: "/admin/settings",
        });
    }

    return (
        <Grid
            sx={ {
                marginTop: "56px",

                height: "calc(100vh - 56px)",
            } }
        >
            <>
                <Drawer
                    variant="permanent"
                    sx={ {
                        width: {
                            xs: collapsed ? 0 : "calc(100vw - 30px)",
                            md: collapsed ? 0 : 220,
                        },
                        bgcolor: "#3875d7",
                        color: "#fff",
                        flexShrink: 0,
                        transition: "width 0.3s ease",
                        overflowX: "hidden",
                        "& .MuiDrawer-paper": {
                            width: {
                                xs: collapsed ? 0 : "calc(100vw - 30px)",
                                md: collapsed ? 0 : 220,
                            },
                            transition: "width 0.3s ease",
                            bgcolor: "#0f5f9e",
                            color: "#fff",
                            maxHeight: "100vh",
                            overflowX: "hidden",
                        },
                    } }
                >
                    <List sx={ { pt: "64px" } } aria-label="main sidebar navigation">
                        { sidenav?.map((navitem, index) => (
                            <li key={ navitem.name } style={ { listStyle: "none" } }>
                                <NavGroup
                                    navitem={ navitem }
                                    isOpen={ openItem === index }
                                    isUpToMd={ isUpToMd }
                                    onClick={ () => {
                                        if (collapsed) {
                                            setCollapsed(false);
                                        } else {
                                            setOpenItem(openItem === index ? null : index);
                                        }
                                    } }
                                    collapsed={ collapsed }
                                    setCollapsed={ setCollapsed }
                                />
                            </li>
                        )) }
                    </List>
                </Drawer>

                <IconButton
                    aria-label="toggle sidebar"
                    onClick={ () => setCollapsed(!collapsed) }
                    sx={ {
                        position: "fixed",
                        left: {
                            xs: collapsed ? 0 : "calc(100vw - 30px)",
                            md: collapsed ? 0 : 220,
                        },
                        top: "56px",
                        color: collapsed ? "grey" : "white",
                        bgcolor: collapsed ? "white" : "#0f5f9e",
                        "&:hover": {
                            bgcolor: "#3D90D7",
                            color: "white",
                        },
                        width: 30,
                        height: 30,
                        borderRadius: 0,
                        borderBottomRightRadius: "10px",

                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "1px solid #e0e0e0",
                        zIndex: 1000,
                        transition:
                            "left 0.3s ease, color 0.3s ease, background-color 0.3s ease",
                    } }
                >
                    { collapsed ? (
                        <MenuIcon sx={ { fontSize: 20 } } />
                    ) : (
                        <KeyboardDoubleArrowLeftIcon sx={ { fontSize: 20 } } />
                    ) }
                </IconButton>

                <Box
                    component="main"
                    sx={ {
                        ml: {
                            xs: 0,
                            md: collapsed ? 0 : "220px",
                        },
                        flexGrow: 1,
                        overflow: "auto",
                        mt: 4,
                        position: "relative",
                    } }
                >
                    <Box sx={ { m: 1 } }>
                        { children }
                    </Box>
                </Box>
            </>
        </Grid>
    );
}

export default Sidebar;
