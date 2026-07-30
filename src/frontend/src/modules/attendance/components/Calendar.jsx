import React, { useMemo, useState, useEffect } from "react";
import {
  Grid,
  Box,
  Chip,
  Divider,
  GlobalStyles,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useUser } from "../../../shared/context/User";
import { api, loadData } from "../../../shared/utils";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const STATUS_LABELS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  EARLY: "Early Leaving",
  OVERTIME: "Overtime",
  HOLIDAY: "Holiday",
  WEEKLY_OFF: "Weekly Off",
  LEAVE: "Leave",
  OFFICIAL_TRIP: "Official Trip",
  MISSING_OUT: "Missing Out",
  IN_OFFICE: "In Office",
  HALF_DAY: "Half Day",
  COMP_OFF: "Comp Off",
};

const STATUS_COLORS = {
  PRESENT: "#4caf50",
  ABSENT: "#f44336",
  LATE: "#ff9800",
  EARLY: "#fbc02d",
  OVERTIME: "#8e24aa",
  HOLIDAY: "#d81b60",
  WEEKLY_OFF: "#2196f3",
  LEAVE: "#9c27b0",
  OFFICIAL_TRIP: "#00acc1",
  MISSING_OUT: "#212121",
  IN_OFFICE: "#4caf50",
  HALF_DAY: "#fb8c00",
  COMP_OFF: "#5e35b1",
};

function minutesToHours(minutes = 0) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export default function Calendar() {
  const me = useUser();
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(new Date());

  const fetchReport = (d) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    loadData(
      api.get(`/api/v1/attendance/my/report?year=${year}&month=${month}`),
      (resp) => {
        setReport(resp.data);
      }
    );
  };

  useEffect(() => {
    fetchReport(date);

    const handleClockEvent = () => {
      fetchReport(date);
    };

    me.addEventListener("clock-in", handleClockEvent);
    me.addEventListener("clock-out", handleClockEvent);

    return () => {
      me.removeEventListener("clock-in", handleClockEvent);
      me.removeEventListener("clock-out", handleClockEvent);
    };
  }, [date, me]);

  const events = useMemo(() => {
    if (!report) return [];
    return report.attendance.map((entry, index) => ({
      id: index,
      title: entry.title,
      start: new Date(entry.date),
      end: new Date(entry.date),
      allDay: true,
      resource: entry,
    }));
  }, [report]);

  const eventStyleGetter = (event) => {
    const entry = event.resource;
    return {
      style: {
        backgroundColor: entry.color || "#2196f3",
        borderRadius: 8,
        border: "none",
        color: "#fff",
        padding: "2px 6px",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1.2,
        whiteSpace: "normal",
        minHeight: "unset",
        display: "block",
      },
    };
  };

  const EventCard = ({ event }) => {
    const entry = event.resource;
    return (
      <Box>
        <Typography fontSize={11} fontWeight={700}>
          {entry.title}
        </Typography>
        {entry.inTime && entry.outTime && (
          <Typography fontSize={10}>
            {entry.inTime} → {entry.outTime}
          </Typography>
        )}
        {entry.breakMinutes > 0 && (
          <Typography fontSize={10}>
            Break: {minutesToHours(entry.breakMinutes)}
          </Typography>
        )}
        {entry.netMinutes > 0 && (
          <Typography fontSize={10}>
            Work: {minutesToHours(entry.netMinutes)}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <GlobalStyles
        styles={{
          ".rbc-calendar": {
            fontFamily: '"Inter", sans-serif',
          },
          ".rbc-toolbar": {
            backgroundColor: "#1565c0",
            color: "#fff",
            borderRadius: "10px 10px 0 0",
            padding: "12px",
            marginBottom: 0,
          },
          ".rbc-toolbar button": {
            backgroundColor: "#fff",
            color: "#1565c0",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: 700,
          },
          ".rbc-toolbar button:hover": {
            backgroundColor: "#0d47a1",
            color: "#fff",
          },
          ".rbc-toolbar button.rbc-active": {
            backgroundColor: "#0d47a1",
            color: "#fff",
          },
          ".rbc-toolbar-label": {
            fontWeight: 700,
            fontSize: 20,
          },
          ".rbc-header": {
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "10px",
            fontWeight: 700,
          },
          ".rbc-month-view": {
            border: "1px solid #dbe7f3",
          },
          ".rbc-day-bg": {
            backgroundColor: "#f8fbff",
          },
          ".rbc-today": {
            backgroundColor: "#e3f2fd !important",
          },
          ".rbc-off-range-bg": {
            backgroundColor: "#f3f3f3",
          },
          ".rbc-event": {
            border: "none",
          },
          ".rbc-event-content": {
            whiteSpace: "normal",
          },
          ".rbc-date-cell": {
            padding: 4,
          },
          ".rbc-date-cell button": {
            cursor: "default",
            fontWeight: 700,
          },
        }}
      />
      <Box>
        <Accordion sx={{ mb: 1 }} >
          <AccordionSummary
            sx={{ width: "100%" }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Grid
              container
              size={12}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={"18px !important"} fontWeight={700}>
                {report?.employee?.name || me?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" pr={3}>
                {report?.employee?.shift?.name || me?.shift?.name} [
                {report?.employee?.shift?.inTime || me?.shift?.startTime}-
                {report?.employee?.shift?.outTime || me?.shift?.endTime}]
              </Typography>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  size="small"
                  sx={{
                    backgroundColor: STATUS_COLORS[key] || "#e0e0e0",
                    color: "#fff",
                    fontWeight: 700,
                    px: 0.6
                  }}
                />
              ))}
            </Stack> */}

            {report && (
              <Box
                sx={{
                  px: 2,
                  py:1,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #dbe7f3",
                  mb: 1,
                }}
              >
                <Typography fontWeight={700} mb={1}>
                  Monthly Summary: {report.summary.month}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Present: <span style={{ color: "#4caf50" }}>{report.summary.present}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Late: <span style={{ color: "#ff9800" }}>{report.summary.late}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Early: <span style={{ color: "#fbc02d" }}>{report.summary.early}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Absent: <span style={{ color: "#f44336" }}>{report.summary.absent}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Holidays: <span style={{ color: "#d81b60" }}>{report.summary.holiday}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Weekly Off: <span style={{ color: "#2196f3" }}>{report.summary.weeklyOff}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Work Hours: <span style={{ color: "#1565c0" }}>{minutesToHours(report.summary.totalWorkingHours)}</span>
                  </Typography>
                </Stack>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          popup
          selectable={false}
          style={{
            height: 650,
            width: "100%",
          }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventCard,
          }}
        />
      </Box>
    </>
  );
}
