import React from "react";
import { Typography } from "@mui/material";
import { User } from "../../../shared/context";
export default function Clock() {
    const [time, setTime] = React.useState(new Date());
    const [count, setCount] = React.useState(0);
    let user = User.useUser();
    React.useEffect(() => {
        const listener = (e) => {
            if (e?.data?.serverTime)
                setTime((new Date(e.data.serverTime)))
        }
        user.addEventListener("tick", listener)
        return () => {
            user.removeEventListener("tick", listener);
        }
    }, [])
    return (
        <>
            {
                <Typography sx={ { fontSize: { xs: 12, md: 16 } } }>
                    { time.toFormat("dd-mm-yyyy - hh:mm:ss") }
                </Typography>
            }
        </>
    );
}
