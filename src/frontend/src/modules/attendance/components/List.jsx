import React from "react";
import { Box } from "@mui/material";
import * as Shared from "../../../shared";
import { loadData } from "../../../shared/utils";
const { Datatable, DateRangeSelector } = Shared.Components;
const { useUser } = Shared.Context.User;
const { api } = Shared.Utils
function List() {
    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState([]);
    const [dateRange, setDateRange] = React.useState([]);
    const me = useUser();
    React.useEffect(() => {
        loadData(
            api.get("/api/v1/attendance/my"),
            resp => {
                if ("data" in resp)
                    setData(resp.data);
            },
            () => {
                setIsLoading(false);
            }
        )
        // 
    }, []);

    const columns = [
        {
            id: "date",
            label: "Date",
            data: "date",
        },
        {
            id: "inTime",
            label: "In Time",
            // data: "inTime",
            render: info => {
                if (!(info?.in?.time)) return <></>;
                let inTime=new Date(info.in.time);
                let date=inTime.toISOString().split("T")[0];
                let expectedInTime=new Date(`${date}T${info.shift.startTime}:00+05:30`);
                console.log(expectedInTime < inTime?"Late":"On Time")
                return <>{ inTime.showTime("hh-mm") }</>
            }
        },
        {
            id: "outTime",
            label: "Out Time",
            data: "outTime",
        },
        {
            id: "status",
            label: "Attendance Status",
            data: "status",
        },
        {
            id: "workingHours",
            label: "Working Hours",
            // data: "workingHours"
            render: (info) => {
                return !info.inTime || !info.outTime ? "-" : info.workingHours;
            },
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0.5, sm: 2 } }>
            <Datatable
                extra={
                    <Box px={ { xs: 0, md: 2 } } my={ { xs: 1, md: 0 } }>
                        <DateRangeSelector
                            onUpdate={ (e) => {
                                setDateRange(e.map((d) => d.toISOString()));
                            } }
                        />
                    </Box>
                }
                title="My Attendance Records"
                isLoading={ isLoading }
                pagination={ [10, 20, 50, 100] }
                pageSize={ 20 }
                columns={ columns }
                data={ data }
            />
        </Box>
    );
}

export default List;
