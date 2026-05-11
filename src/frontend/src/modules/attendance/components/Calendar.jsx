import React, { useMemo } from "react";
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
import attendanceData from "./attendanceData.json";
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
  MISSING_OUT: "Missing OUT",
  HALF_DAY: "Half Day",
  COMP_OFF: "Comp Off",
};
function minutesToHours(minutes = 0) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}
export default function Calendar() {
  const events = useMemo(() => {
    return attendanceData.attendance.map((entry, index) => ({
      id: index + 1,
      title: entry.title,
      start: new Date(entry.date),
      end: new Date(entry.date),
      allDay: true,
      resource: entry,
    }));
  }, []);
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
        {entry.overtimeMinutes > 0 && (
          <Typography fontSize={10}>
            OT: {minutesToHours(entry.overtimeMinutes)}
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
        <Accordion sx={{ mb: 1 }}>
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
                Attendance Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary" pr={3}>
                {attendanceData.employee.name}
                {" • "}
                {attendanceData.employee.shift.name}
              </Typography>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Object.entries(STATUS_LABELS).map(([key, label]) => {
                const found = attendanceData.attendance.find(
                  (x) => x.status === key,
                );
                return (
                  <Chip
                    key={key}
                    label={label}
                    size="small"
                    sx={{
                      backgroundColor: found?.color || "#e0e0e0",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                );
              })}
            </Stack>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f8fbff",
                mb: 2,
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Monthly Summary
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Typography variant="body2">
                  Present: {attendanceData.summary.present}
                </Typography>
                <Typography variant="body2">
                  Absent: {attendanceData.summary.absent}
                </Typography>
                <Typography variant="body2">
                  Leave: {attendanceData.summary.leave}
                </Typography>
                <Typography variant="body2">
                  OT:{" "}
                  {minutesToHours(attendanceData.summary.totalOvertimeMinutes)}
                </Typography>
                <Typography variant="body2">
                  Work Hours:{" "}
                  {minutesToHours(attendanceData.summary.totalWorkingHours)}
                </Typography>
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>

        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          popup
          selectable={false}
          style={{
            height: 700,
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
