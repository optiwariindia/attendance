import React from "react";
import {
    AppBar,
    IconButton,
    Grid,
    Avatar,
    Menu,
    MenuItem,
    InputAdornment,
    Tooltip,
    Typography,
    Button,
} from "@mui/material";
import { User } from "../context"

export default function Header() {
    const me = User.useUser()

    const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

    return (
        <AppBar
            position="fixed"
            sx={ {
                zIndex: 1201,
                minHeight: "56px",
                background: {
                    xs: "radial-gradient(circle at 20px center, #2196f3, #0f5f9e 20%)",
                    md: "radial-gradient(circle at 120px center, #2196f3, #0f5f9e 25%)",
                },
            } }
        >
            <Grid
                container
                size={ 12 }
                sx={ {
                    minHeight: "56px !important",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                } }
            >
                <Grid
                    container
                    size={ 8 }
                    sx={ {
                        justifyContent: "flex-start",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        pl: 4,
                    } }
                >
                    <img
                        src={ "/icon.png" }
                        alt="Logo"
                        height="44px"
                        width="44px"
                        style={ {
                            objectFit: "contain",
                            filter: "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5))",
                        } }
                    />

                    <Typography
                        sx={ {
                            fontSize: "22px",
                            pl: 1.5,
                            fontWeight: "bold",
                            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.8)",
                            display: { xs: "none", lg: "block" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        } }
                    >
                        Frequent Research Attendance Portal
                    </Typography>
                </Grid>

                <Grid
                    container
                    size={ 4 }
                    sx={ {
                        justifyContent: "flex-end",
                        alignItems: "center",
                    } }
                >
                    <Button
                        onClick={ (event) => setProfileAnchorEl(event.currentTarget) }
                        color="inherit"
                        sx={ { mx: { xs: 0, lg: 2 }, textTransform: "none" } }
                    >
                        { " " }
                        <Typography
                            sx={ {
                                display: { xs: "none", lg: "block" },
                                ml: 1,
                                fontSize: "14px",
                                color: "white",
                                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.8)",
                            } }
                        >
                            { me?.name?.first ?? "-" }
                        </Typography>
                        <Avatar
                            sx={ {
                                ml: 1,
                                width: "32px",
                                height: "32px",
                                filter: "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5))",
                            } }
                            src={ me?.profilePic || "" }
                            alt={ me?.fullName ?? "U" }
                        />
                    </Button>

                    <Menu
                        anchorEl={ profileAnchorEl }
                        open={ Boolean(profileAnchorEl) }
                        onClose={ () => setProfileAnchorEl(null) }
                        transformOrigin={ { horizontal: "right", vertical: "top" } }
                        anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                        PaperProps={ {
                            sx: {
                                bgcolor: "#0f5f9e",
                                color: "white",
                                boxShadow: 24,
                                mt: 1.5,
                                overflow: "visible",
                                "::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    width: 10,
                                    height: 10,
                                    bgcolor: "#0f5f9e",
                                    transform: "rotate(45deg)",
                                    top: -5,
                                    left: 16,
                                    zIndex: 0,
                                },
                            },
                        } }
                    >
                        <MenuItem
                            onClick={ me.logout }
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </AppBar>
    );
}
