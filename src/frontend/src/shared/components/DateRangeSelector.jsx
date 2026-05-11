import React, { useState } from "react";
import {
    Box,
    Button,
    Popover,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import dayjs from "dayjs";

const ranges = {
    today: [dayjs().startOf("day"), dayjs().endOf("day")],
    yesterday: [
        dayjs().subtract(1, "day").startOf("day"),
        dayjs().subtract(1, "day").endOf("day"),
    ],
    thisWeek: [dayjs().startOf("week"), dayjs().endOf("day")],
    lastWeek: [
        dayjs().subtract(1, "week").startOf("week"),
        dayjs().subtract(1, "week").endOf("week"),
    ],
    thisMonth: [dayjs().startOf("month"), dayjs().endOf("day")],
    lastMonth: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
    ],
    thisYear: [dayjs().startOf("year"), dayjs().endOf("day")],
    lastYear: [
        dayjs().subtract(1, "year").startOf("year"),
        dayjs().subtract(1, "year").endOf("year"),
    ],
};
const DateRangeSelector = ({ onUpdate, defaultValue, ...attr }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dateRange, setDateRange] = useState(ranges.thisMonth);
    const [rangeType, setRangeType] = useState(defaultValue ?? "thisMonth");
    React.useEffect(() => {
        if (!onUpdate) return;
        onUpdate(dateRange.map((d) => d.toDate()));
    }, [dateRange]);

    React.useEffect(() => {
        if (rangeType === "custom") {
            setDateRange(dateRange ?? [dayjs(), dayjs()]);
        } else {
            setDateRange(ranges[rangeType]);
        }
    }, [rangeType]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleRangeTypeChange = (event, newRangeType) => {
        if (newRangeType) {
            setRangeType(newRangeType);
            if (newRangeType !== "custom") {
                const newRange = ranges[newRangeType];
                setDateRange(newRange);
                handleClose();
            }
        }
    };

    const handleDateRangeChange = (index) => (newValue) => {
        const newRange = [...dateRange];
        newRange[index] = newValue;

        if (index === 0 && newValue.isAfter(newRange[1])) {
            newRange[1] = newValue;
        } else if (index === 1 && newValue.isBefore(newRange[0])) {
            newRange[0] = newValue;
        }

        setDateRange(newRange);
    };

    const handleApply = () => {
        handleClose();
    };

    const formatDate = (date) => {
        if (!date) return "Not set";
        return dayjs(date).format("MMM D, YYYY");
    };

    const buttonLabel =
        Array.isArray(dateRange) && dateRange[0] && dateRange[1]
            ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
            : "Select Date Range";

    return (
        <LocalizationProvider dateAdapter={ AdapterDayjs }>
            <Box>
                <Button
                    variant="outlined"
                    color="black"
                    onClick={ handleClick }
                    sx={ {
                        minWidth: 240,

                        borderColor: "grey.500",
                        color: "grey.900",
                        fontWeight: "bold",
                        height: "30px",
                        "&:hover": {
                            borderColor: "grey.700",
                            backgroundColor: "grey.50",
                        },
                        ...attr?.sx,
                    } }
                    startIcon={ <CalendarTodayIcon sx={ { fontSize: "12px !important" } } /> }
                    endIcon={ <ArrowDropDownIcon /> }
                >
                    { buttonLabel }
                </Button>
                <Popover
                    open={ open }
                    anchorEl={ anchorEl }
                    onClose={ handleClose }
                    anchorOrigin={ {
                        vertical: "bottom",
                        horizontal: "left",
                    } }
                >
                    <Box sx={ { maxWidth: 350 } }>
                        <ToggleButtonGroup
                            value={ rangeType }
                            exclusive
                            onChange={ handleRangeTypeChange }
                            aria-label="date range options"
                            sx={ {
                                display: "flex",
                                flexDirection: "column",
                                "& .MuiToggleButton-root": {
                                    color: "black",
                                    py: 1,
                                    px: 2,
                                    "&.Mui-selected": {
                                        color: "black",
                                    },
                                },
                            } }
                        >
                            { [
                                { name: "Today", value: "today" },
                                { name: "Yesterday", value: "yesterday" },
                                { name: "This Week", value: "thisWeek" },
                                { name: "Last Week", value: "lastWeek" },
                                { name: "This Month", value: "thisMonth" },
                                { name: "Last Month", value: "lastMonth" },
                                { name: "This Year", value: "thisYear" },
                                { name: "Last Year", value: "lastYear" },
                                { name: "Custom", value: "custom" },
                            ].map((range) => (
                                <ToggleButton key={ range.value } value={ range.value }>
                                    { range.name }
                                </ToggleButton>
                            )) }
                        </ToggleButtonGroup>
                        { rangeType === "custom" && (
                            <Box sx={ { p: 2 } }>
                                <Box sx={ { display: "flex", gap: 2, mb: 2 } }>
                                    <DatePicker
                                        label="Start Date"
                                        value={ dateRange[0] }
                                        maxDate={ dateRange[1] }
                                        onChange={ handleDateRangeChange(0) }
                                        slotProps={ {
                                            textField: {
                                                size: "small",
                                            },
                                            day: {
                                                sx: {
                                                    "&.Mui-selected": {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                            yearButton: {
                                                sx: {
                                                    "&.Mui-selected": {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                            popper: {
                                                modifiers: [
                                                    {
                                                        name: "zIndex",
                                                        enabled: true,
                                                        phase: "beforeWrite",
                                                        fn: ({ state }) => {
                                                            state.styles.popper.zIndex = "15000";
                                                        },
                                                    },
                                                ],
                                            },
                                        } }
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={ dateRange[1] }
                                        disableFuture
                                        onChange={ handleDateRangeChange(1) }
                                        slotProps={ {
                                            textField: {
                                                size: "small",
                                            },
                                            day: {
                                                sx: {
                                                    "&.Mui-selected": {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                            yearButton: {
                                                sx: {
                                                    "&.Mui-selected": {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                            popper: {
                                                modifiers: [
                                                    {
                                                        name: "zIndex",
                                                        enabled: true,
                                                        phase: "beforeWrite",
                                                        fn: ({ state }) => {
                                                            state.styles.popper.zIndex = "15000";
                                                        },
                                                    },
                                                ],
                                            },
                                        } }
                                    />
                                </Box>
                                <Box
                                    sx={ { display: "flex", justifyContent: "flex-end", mb: 2 } }
                                >
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={ handleClose }
                                        sx={ {
                                            mr: 1,
                                            fontWeight: "bold",
                                        } }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={ {
                                            fontWeight: "bold",
                                            color: "#fff",
                                        } }
                                        onClick={ handleApply }
                                        disabled={ !dateRange[0] || !dateRange[1] }
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Box>
                        ) }
                    </Box>
                </Popover>
            </Box>
        </LocalizationProvider>
    );
};

export default DateRangeSelector;
