import React from "react";
import { Box } from "@mui/material";
import * as Shared from "../../../shared";
const { Datatable, DateRangeSelector } = Shared.Components;
const { useUser } = Shared.Context.User;
const { api } = Shared.Utils
function List() {
    const [data, setData] = React.useState([]);
    const [dateRange, setDateRange] = React.useState([]);
    const me = useUser();
    React.useEffect(() => {
        if (!me?._id) return;

        api
            .post(`/api/v1/attendance`, {
                dateRange,
            })
            .then((resp) => {
                setData(resp.data);
            });
        // api
        //   .get(`/api/v1/attendance/all`)
        //   .then(resp=>{
        //     console.log(resp);
        //   })
    }, [me, dateRange]);

    const columns = [
        {
            id: "date",
            label: "Date",
            data: "date",
        },
        {
            id: "inTime",
            label: "In Time",
            data: "inTime",
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
                isLoading={ false }
                pagination={ [10, 20, 50, 100] }
                pageSize={ 20 }
                columns={ columns }
                data={ data }
            />
        </Box>
    );
}

export default List;
