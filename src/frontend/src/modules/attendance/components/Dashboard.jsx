import React from "react";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { Clock, Calendar } from "./index";

import { api } from "../../../shared/utils";
// import { useGPS } from "../../hooks";
import { User } from "../../../shared/context";
const { useUser } = User;

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
  let { getLocation } = {}; //useGPS();
  const [activeBtns, setActiveBtns] = React.useState({
    in: true,
    out: false,
  });
  const [clockHistory, setClockHistory] = React.useState([]);
  async function UpdateClockHistory() {
    let resp = await api.get(`/api/v1/attendance`);
    if (resp?.status === "success") {
      setClockHistory(resp.data);
    }
  }
  async function clockAttendance(type) {
    let gps = await getLocation();

    let resp = await api.put(`/api/v1/attendance`, {
      type,
      gps,
    });
    if ("status" in resp && resp.status === "error") {
      alert(resp.message);
      return;
    }
    if (resp.status === "success") {
      UpdateClockHistory();
    }
  }
  React.useEffect(() => {
    if (!me) return;
    UpdateClockHistory();
  }, [me, activeBtns.in]);
  document.addEventListener("in", () => {
    if (activeBtns.in === false) return;
    setActiveBtns({
      in: false,
      out: true,
    });
    // UpdateClockHistory();
  });
  document.addEventListener("out", () => {
    if (activeBtns.out === false) return;
    setActiveBtns({
      in: true,
      out: false,
    });
    // UpdateClockHistory();
  });
  return (
    <Grid container spacing={3} px={3} spacing={1.5}>
      <Grid
        size={{ xs: 12, md: 12 }}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Typography
          component={"div"}
          fontSize={18}
          sx={{ bgcolor: "#5297d9", color: "white", px: 2, py: 1.5 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Clock />
          <Grid
            container
            alignItems={"center"}
            justifyContent={"flex-end"}
            container
            spacing={2}
          >
            <Button
              variant="contained"
              disabled={!activeBtns.in}
              sx={{ textTransform: "none", bgcolor: "white", color: "black" }}
              onClick={(e) => {
                clockAttendance("in");
              }}
            >
              Clock In
            </Button>
            <Button
              disabled={!activeBtns.out}
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={(e) => {
                clockAttendance("out");
              }}
            >
              Clock Out
            </Button>
          </Grid>
        </Typography>
        <Grid
          size={12}
          sx={{
            bgcolor: "#e3f2fd",
          }}
        >
          {clockHistory.map((clockInfo) => (
            <Grid
              key={clockInfo._id}
              container
              alignItems="center"
              py={1}
              spacing={2}
              px={3}
              justifyContent={"center"}
              borderBottom="1px solid #fff"
            >
              <Typography
                fontSize={14}
                py={1}
                sx={{ width: "50%", textAlign: "center" }}
              >
                Clock {clockInfo.action}
              </Typography>
              <Chip
                color={clockInfo.action === "in" ? "success" : "error"}
                label={new Date(clockInfo.createdAt).showTime(
                  "hh-mm-ss",
                  "en-IN",
                )}
                sx={{ py: 1, borderRadius: 2, fontWeight: 600 }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid
        size={{ xs: 12, md: 9 }}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Calendar />
      </Grid>
      <Grid
        size={{ xs: 12, md: 3 }}
        sx={{ borderRadius: 2, bgcolor: "#e3f2fd", overflow: "hidden" }}
      >
        <Typography
          fontSize={18}
          sx={{ bgcolor: "#5297d9", color: "white", px: 2, py: 1.5 }}
          fontWeight={600}
        >
          Announcements
        </Typography>
        <Grid
          size={12}
          container
          spacing={1}
          p={1}
          direction="column"
          sx={{
            maxHeight: 700,
            overflowY: "auto",
            overflowX: "hidden",
            flexWrap: "nowrap",
          }}
        >
          {announcements.length === 0 ? (
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{
                minHeight: 200,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                No announcements available
              </Typography>
            </Grid>
          ) : (
            [...announcements]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((announcement) => (
                <Grid
                  key={announcement.id}
                  sx={{
                    p: 1.5,
                    borderBottom: "1px solid #ffffff",
                    bgcolor: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600} fontSize={13}>
                    {announcement.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      fontSize: 12,
                      color: "text.secondary",
                      lineHeight: 1,
                    }}
                  >
                    {announcement.message}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      fontSize: 11,
                      color: "text.disabled",
                    }}
                  >
                    {new Date(announcement.createdAt).toLocaleString("en-IN")}
                  </Typography>
                </Grid>
              ))
          )}
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
