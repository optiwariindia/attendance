import React from "react";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { Clock, Calendar } from "./index";
import * as Shared from "../../../shared";
const { api, eventStream } = Shared.Utils;
const { useUser } = Shared.Context.User;
const { useGPS } = Shared.Hook

const announcements = [
  {
    id: 1,
    title: "Office Maintenance",
    message: "Server maintenance scheduled tonight from 11 PM to 1 AM.",
    createdAt: "2026-05-08T09:30:00",
  },
  {
    id: 2,
    title: "Holiday Notice",
    message: "Office will remain closed on Friday due to public holiday.",
    createdAt: "2026-05-09T15:45:00",
  },
  {
    id: 3,
    title: "Team Meeting",
    message: "Monthly team sync scheduled tomorrow at 10:00 AM.",
    createdAt: "2026-05-10T18:15:00",
  },
  {
    id: 4,
    title: "Attendance Reminder",
    message: "Please ensure clock-in before 9:30 AM daily.",
    createdAt: "2026-05-11T08:10:00",
  },
];

export default function Dashboard() {
  const me = useUser();
  let { getLocation } = useGPS();
  const [activeBtns, setActiveBtns] = React.useState({
    in: true,
    out: false,
  });
  const [clockHistory, setClockHistory] = React.useState([]);
  const [currentInTime, setCurrentInTime] = React.useState(null);

  async function UpdateClockHistory() {
    let resp = await api.get(`/api/v1/attendance/history`);
    if (resp?.status === "success") {
      setClockHistory(resp.data);
      
      // Determine button states and current in-time based on latest record
      const latest = resp.data[0];
      if (latest) {
        if (latest.in?.time) {
          setCurrentInTime(latest.in.time);
        } else {
          setCurrentInTime(null);
        }

        // If clocked in but not out
        if (latest.in?.time && !latest.out?.time) {
          setActiveBtns({ in: false, out: true });
        } else if (latest.in?.time && latest.out?.time) {
          // If both exist, allow punch-in (for breaks) and punch-out (to update final)
          setActiveBtns({ in: true, out: true });
        } else {
          setActiveBtns({ in: true, out: false });
        }
      } else {
        setCurrentInTime(null);
        setActiveBtns({ in: true, out: false });
      }
    }
  }

  async function clockAttendance(action) {
    let gps = await getLocation();

    let resp = await api.post(`/api/v1/attendance/clock`, {
      action,
      gps,
    });
    
    if (resp?.status === "error") {
      alert(resp.message);
      return;
    }
    
    // Refresh history immediately as fallback if SSE is delayed
    UpdateClockHistory();
  }

  React.useEffect(() => {
    if (!me) return;
    UpdateClockHistory();

    const handleAttendanceUpdate = (event) => {
      console.log("Real-time attendance update received:", event.data);
      UpdateClockHistory();
    };

    eventStream.addEventListener("attendance_update", handleAttendanceUpdate);

    return () => {
      eventStream.removeEventListener("attendance_update", handleAttendanceUpdate);
    };
  }, [me]);

  return (
    <Grid container spacing={ 3 } px={ 3 }>
      <Grid
        size={ { xs: 12, md: 12 } }
        sx={ { borderRadius: 2, overflow: "hidden" } }
      >
        <Typography
          component={ "div" }
          fontSize={ 18 }
          sx={ { bgcolor: "#5297d9", color: "white", px: 2, py: 1.5 } }
          style={ {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          } }
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item><Clock /></Grid>
            {currentInTime && (
              <Grid item>
                <Chip 
                  label={`In: ${new Date(currentInTime).showTime("hh-mm-ss", "en-IN")}`} 
                  sx={{ bgcolor: "white", color: "#5297d9", fontWeight: 700, borderRadius: 1 }}
                />
              </Grid>
            )}
          </Grid>
          <Grid
            container
            item
            xs={6}
            alignItems={ "center" }
            justifyContent={ "flex-end" }
            spacing={ 2 }
          >
            <Grid item>
              <Button
                variant="contained"
                disabled={ !activeBtns.in }
                sx={ { textTransform: "none", bgcolor: "white", color: "black", "&:disabled": { bgcolor: "#eee", color: "#aaa" } } }
                onClick={ (e) => {
                  clockAttendance("in");
                } }
              >
                Clock In
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={ !activeBtns.out }
                variant="contained"
                color="error"
                sx={ { textTransform: "none" } }
                onClick={ (e) => {
                  clockAttendance("out");
                } }
              >
                Clock Out
              </Button>
            </Grid>
          </Grid>
        </Typography>
        <Grid
          container
          sx={ {
            bgcolor: "#e3f2fd",
          } }
        >
          { clockHistory.slice(0, 5).map((record) => (
            <React.Fragment key={ record._id }>
              { record.in?.time && (
                <Grid
                  container
                  alignItems="center"
                  py={ 1 }
                  px={ 3 }
                  justifyContent={ "space-between" }
                  borderBottom="1px solid #fff"
                >
                  <Typography fontSize={ 14 }>Clock In</Typography>
                  <Chip
                    color="success"
                    label={ new Date(record.in.time).showTime("hh-mm-ss", "en-IN") }
                    sx={ { py: 1, borderRadius: 2, fontWeight: 600 } }
                  />
                </Grid>
              ) }
              { record.out?.time && (
                <Grid
                  container
                  alignItems="center"
                  py={ 1 }
                  px={ 3 }
                  justifyContent={ "space-between" }
                  borderBottom="1px solid #fff"
                >
                  <Typography fontSize={ 14 }>Clock Out</Typography>
                  <Chip
                    color="error"
                    label={ new Date(record.out.time).showTime("hh-mm-ss", "en-IN") }
                    sx={ { py: 1, borderRadius: 2, fontWeight: 600 } }
                  />
                </Grid>
              ) }
            </React.Fragment>
          )) }
        </Grid>
      </Grid>

      <Grid
        size={ { xs: 12, md: 9 } }
        sx={ { borderRadius: 2, overflow: "hidden", mt: 2 } }
      >
        <Calendar />
      </Grid>
      <Grid
        size={ { xs: 12, md: 3 } }
        sx={ { borderRadius: 2, bgcolor: "#e3f2fd", overflow: "hidden", mt: 2 } }
      >
        <Typography
          fontSize={ 18 }
          sx={ { bgcolor: "#5297d9", color: "white", px: 2, py: 1.5 } }
          fontWeight={ 600 }
        >
          Announcements
        </Typography>
        <Grid
          container
          spacing={ 1 }
          p={ 1 }
          direction="column"
          sx={ {
            maxHeight: 700,
            overflowY: "auto",
            overflowX: "hidden",
            flexWrap: "nowrap",
          } }
        >
          { announcements.length === 0 ? (
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={ {
                minHeight: 200,
                textAlign: "center",
              } }
            >
              <Typography
                variant="body2"
                sx={ {
                  color: "text.secondary",
                  fontWeight: 500,
                } }
              >
                No announcements available
              </Typography>
            </Grid>
          ) : (
            [...announcements]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((announcement) => (
                <Grid
                  item
                  key={ announcement.id }
                  sx={ {
                    p: 1.5,
                    borderBottom: "1px solid #ffffff",
                    bgcolor: "white",
                    borderRadius: 2,
                    mb: 1
                  } }
                >
                  <Typography fontWeight={ 600 } fontSize={ 13 }>
                    { announcement.title }
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={ {
                      mt: 1,
                      fontSize: 12,
                      color: "text.secondary",
                      lineHeight: 1,
                    } }
                  >
                    { announcement.message }
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={ {
                      display: "block",
                      mt: 0.5,
                      fontSize: 11,
                      color: "text.disabled",
                    } }
                  >
                    { new Date(announcement.createdAt).toLocaleString("en-IN") }
                  </Typography>
                </Grid>
              ))
          ) }
        </Grid>
      </Grid>

      {/*             <PopUp open={ false } onClose={ () => { } } hideTitle={ true } maxWidth={ "xs" }>
                <Grid
                    size={ 12 }
                    container
                    direction="column"
                    alignItems="center"
                    py={ 3 }
                    px={ 4 }
                >
                    <Typography color="primary" variant="h6" p={ 2 } fontWeight={ 600 }>
                        Connection Lost
                    </Typography>
                    <Typography textAlign="center">
                        Your connection to the server has been interrupted. Please refresh
                        the page or click <strong>Reload Page</strong> to reconnect.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={ () => { window.location.reload() } }
                        size="medium"
                        sx={ { my: 3, fontWeight: 600 } }
                    >
                        Reload Page
                    </Button>
                </Grid>
            </PopUp> */}
    </Grid>
  );
}
