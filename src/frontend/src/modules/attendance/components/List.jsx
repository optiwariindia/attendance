import React from "react";
import { Box } from "@mui/material";
import * as Shared from "../../../shared";
import { loadData } from "../../../shared/utils";
const { Datatable, DateRangeSelector } = Shared.Components;
const { useUser } = Shared.Context.User;
const { api } = Shared.Utils
function List({
    title,
    user
}) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState([]);
    const [dateRange, setDateRange] = React.useState([]);
    const me = useUser();
    React.useEffect(() => {
        loadData(
            api.get(user === "all" ? "/api/v1/attendance" : "/api/v1/attendance/my"),
            resp => {
                if ("data" in resp)
                    setData(resp.data);
            },
            () => {
                setIsLoading(false);
            }
        )
        // 
    }, [title,user]);

    const columns = [
        {
            id: "date",
            label: "Date",
            data: "date",
        },
        {
            id: "user",
            label: "Employee ID",
            render: info => info.user.employeeID
        },
        {
            id: "username",
            label: "Name",
            render: info => <>{ info?.user?.name?.first } { info?.user?.name?.last }</>
        },
        {
            id: "inTime",
            label: "In Time",
            // data: "inTime",
            align:"right",
            render: info => {
                if (!(info?.in?.time)) return <></>;
                let inTime = new Date(info.in.time);
                let date = inTime.toISOString().split("T")[0];
                let expectedInTime = new Date(`${date}T${info.shift.startTime}:00+05:30`);
                console.log(expectedInTime < inTime ? "Late" : "On Time")
                return <>{ inTime.showTime("hh-mm") }</>
            }
        },
        {
            id: "outTime",
            label: "Out Time",
            align:"right",
            render: info => {
                if (!(info?.out?.time)) return <></>;
                let outTime = new Date(info.out.time);
                let date = outTime.toISOString().split("T")[0];
                let expectedInTime = new Date(`${date}T${info.shift.endTime}:00+05:30`);
                console.log(expectedInTime > outTime ? "Late" : "On Time")
                return <>{ outTime.showTime("hh-mm") }</>
            }
        },
        {
            id: "status",
            label: "Attendance Status",
            data: "remarks",
        },
        {
            id: "workingHours",
            label: "Working Hours",
            // data: "workingHours"
            align:"right",
            render: (info) => {
                if (!(info?.in?.time)) return <></>;
                let inTime = new Date(info.in.time);

                if (!(info?.out?.time)) return <></>;
                let outTime = new Date(info.out.time);
                return (outTime - inTime).toTime()
            },
        },
    ].filter(c=>{
        if(!user){
            return ["user","username"].includes(c.id)?false:true;
        }
        return true
    });

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
                title={title??"My Attendance Records"}
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
