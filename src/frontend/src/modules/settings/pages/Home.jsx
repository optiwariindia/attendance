import React from "react";

import { Grid, Fade, Box, Tabs, Tab } from "@mui/material";
import { Branch, Department, Designation, Shift, Holiday, LeaveCategory } from "./";

function TabPanel({ children, value, index }) {
    return (
        <Fade in={ value === index } timeout={ 1000 } unmountOnExit>
            <Box hidden={ value !== index }>{ value === index && children }</Box>
        </Fade>
    );
}

export default function Settings() {
    const tabs = [
        {
            label: "Branches",
            render: <Branch />,
        },
        {
            label: "Departments",
            render: <Department />,
        },
        {
            label: "Designations",
            render: <Designation />,
        },
        {
            label: "Shift Policies",
            render: <Shift />,
        },
        {
            label: "Holidays",
            render: <Holiday />,
        },
        {
            label: "Leave Categories",
            render: <LeaveCategory />,
        },
    ];
    return <TabbedPanel tabs={ tabs } defaultOpen={ 0 } />;
}

function TabbedPanel({ tabs, defaultOpen, open, tabVariant = "scrollable" }) {
    const [activeTab, setActiveTab] = React.useState(defaultOpen ?? 0);
    React.useEffect(() => {
        if (!open) return;
        setActiveTab(open);
    }, [open]);

    return (
        <Grid
            sx={ {
                px: 1,
                bgcolor: "white",
            } }
        >
            <Tabs
                value={ activeTab }
                onChange={ (e, v) => {
                    setActiveTab(v);
                } }
                variant={ tabVariant }
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={ {
                    width: "100%",
                    borderBottom: "3px solid whitesmoke",
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#0f5f9e",
                        height: "3px",
                    },
                } }
            >
                { tabs.map((tab) => (
                    <Tab label={ tab.label } key={ tab.label } sx={ { display: "flex" } } />
                )) }
            </Tabs>
            { tabs.map((tab, index) => (
                <TabPanel key={ tab.label } value={ activeTab } index={ index }>
                    { tab.render }
                </TabPanel>
            )) }
        </Grid>
    );
}
