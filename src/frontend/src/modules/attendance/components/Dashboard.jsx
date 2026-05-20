import React from "react";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { Clock, Calendar } from "./index";
import * as Shared from "../../../shared";
import { loadData } from "../../../shared/utils";
const { api, eventStream } = Shared.Utils;
const { useUser } = Shared.Context.User;
const { useGPS } = Shared.Hook;

const announcements = [
  // {
  //   id: 1,
  //   title: "Office Maintenance",
  //   message: "Server maintenance scheduled tonight from 11 PM to 1 AM.",
  //   createdAt: "2026-05-08T09:30:00",
  // },
  // {
  //   id: 2,
  //   title: "Holiday Notice",
  //   message: "Office will remain closed on Friday due to public holiday.",
  //   createdAt: "2026-05-09T15:45:00",
  // },
  // {
  //   id: 3,
  //   title: "Team Meeting",
  //   message: "Monthly team sync scheduled tomorrow at 10:00 AM.",
  //   createdAt: "2026-05-10T18:15:00",
  // },
  // {
  //   id: 4,
  //   title: "Attendance Reminder",
  //   message: "Please ensure clock-in before 9:30 AM daily.",
  //   createdAt: "2026-05-11T08:10:00",
  // },
];

export default function Dashboard() {
  const me = useUser();
  let { getLocation } = useGPS();
  const [isLoading, setIsLoading] = React.useState(false);
  const [attendance, setAttendance] = React.useState({});
  const [activeBtns, setActiveBtns] = React.useState({
    in: true,
    out: false,
  });
  React.useEffect(() => {
    loadData(
      api.get(`/api/v1/attendance/my/today`),
      (resp) => {
        setAttendance(resp?.data);
      },
      () => {
        setIsLoading(false);
      },
    );
    me.addEventListener("clock-out", (e) => {
      setIsLoading(true);
      loadData(
        api.get(`/api/v1/attendance/my/today`),
        (resp) => {
          setAttendance(resp?.data);
        },
        () => {
          setIsLoading(false);
        },
      );
    });
    me.addEventListener("clock-in", (e) => {
      setIsLoading(true);
      loadData(
        api.get(`/api/v1/attendance/my/today`),
        (resp) => {
          setAttendance(resp?.data);
        },
        () => {
          setIsLoading(false);
        },
      );
    });
  }, [me]);
  React.useEffect(() => {
    let temp =
      attendance?.in?.time === null
        ? { in: true, out: false }
        : attendance?.out?.time === null
          ? { out: true, in: false }
          : { in: true, out: false };
    setActiveBtns(temp);
  }, [attendance]);
  async function clockAttendance(action) {
    let gps = await getLocation();

    let resp = await api.post(`/api/v1/attendance/clock`, {
      action,
      gps,
    });

    if (resp?.status === "error") {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            status: "error",
            message: resp.message || "Error",
          },
        }),
      );
      return;
    }
  }
  const currentInTime = attendance?.in?.time;
  const currentOutTime = attendance?.out?.time;
  return (
    <Grid container spacing={3} px={3}>
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
          <Grid container alignItems="center" spacing={2}>
            <Grid>
              <Clock />
            </Grid>
            {currentInTime && (
              <Grid>
                <Chip
                  label={`In: ${new Date(currentInTime).showTime("hh-mm-ss", "en-IN")}`}
                  color="success"
                  variant="outlined"
                  sx={{
                    bgcolor: "white",
                    fontWeight: 700,
                  }}
                />
              </Grid>
            )}
            {currentOutTime && (
              <Grid>
                <Chip
                  label={`Out: ${new Date(currentOutTime).showTime("hh-mm-ss", "en-IN")}`}
                  color="error"
                  variant="outlined"
                  sx={{
                    bgcolor: "white",
                    fontWeight: 700,
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Grid
            container
            size={6}
            alignItems={"center"}
            justifyContent={"flex-end"}
            spacing={2}
          >
            <Grid>
              <Button
                variant="contained"
                disabled={!activeBtns.in}
                sx={{
                  textTransform: "none",
                  bgcolor: "#b6f0b6",
                  color: "#184e18ff",
                  fontWeight: 600,
                  "&:disabled": { bgcolor: "#C0C0C0", color: "#aaa" },
                }}
                onClick={(e) => {
                  clockAttendance("in");
                }}
              >
                Clock In
              </Button>
            </Grid>
            <Grid>
              <Button
                disabled={!activeBtns.out}
                variant="contained"
                color="error"
                sx={{
                  textTransform: "none",
                  bgcolor: "#f4b6b6",
                  color: "#4e0e0eff",
                  fontWeight: 600,
                  "&:disabled": { bgcolor: "#C0C0C0", color: "#aaa" },
                }}
                onClick={(e) => {
                  clockAttendance("out");
                }}
              >
                Clock Out
              </Button>
            </Grid>
          </Grid>
        </Typography>
        <Grid
          container
          sx={{
            bgcolor: "#e3f2fd",
          }}
        >
          {/* <pre>{JSON.stringify(attendance, null, 2)}</pre> */}
        </Grid>
      </Grid>

      <Grid
        size={{ xs: 12, md: 9 }}
        sx={{ borderRadius: 2, overflow: "hidden"}}
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
    </Grid>
  );
}
