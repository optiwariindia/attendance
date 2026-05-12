"use client";
import React from "react";
import {
    Grid,
    Typography,
    Button,
    TextField,
    Autocomplete,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Popover,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Shared from "../../../shared";
const { Datatable, SectionTitle } = Shared.Components;

export default function Leave() {
    const [creatingLeave, setCreatingLeave] = React.useState(false);
    const [activeLeave, setActiveLeave] = React.useState(true);
    const [data, setData] = React.useState([
        {
            requestDate: "2026-01-01",
            type: "sick",
            from: "2026-01-10",
            to: "2026-01-12",
            duration: 3,
            status: "approved",
        },
    ]);

    const [confirm, setConfirm] = React.useState({
        anchorEl: null,
        index: null,
    });
    const openConfirm = Boolean(confirm.anchorEl);
    const closeConfirm = () => setConfirm({ anchorEl: null, index: null });

    const confirmDelete = async () => {
        if (confirm.index != null) {
            await handleDelete(confirm.index);
        }
        closeConfirm();
    };

    const handleDelete = async (index) => { };

    const columns = [
        {
            id: "requestDate",
            label: "Request Date",
            width: 140,
            render: (info) => new Date(info.requestDate).showDate(),
        },
        {
            id: "type",
            label: "Leave Type",
            width: 130,
            render: (d) => (d.type === "sick" ? "Sick Leave" : "Casual Leave"),
        },
        {
            id: "from",
            label: "Leave From",
            width: 130,
            render: (info) => new Date(info.from).showDate(),
        },
        {
            id: "to",
            label: "Leave Until",
            width: 130,
            render: (info) => new Date(info.to).showDate(),
        },
        {
            id: "duration",
            label: "Leave Duartion (in days)",
            data: "duration",
            width: 180,
        },
        {
            id: "status",
            label: "Approval Status",
            width: 130,
            render: (d) => (
                <Chip
                    label={ d.status }
                    color={
                        d.status === "approved"
                            ? "success"
                            : d.status === "declined"
                                ? "error"
                                : "default"
                    }
                    size="small"
                    sx={ { textTransform: "capitalize" } }
                />
            ),
        },
        {
            id: "actions",
            label: "Actions",
            width: 130,
            render: (d) => (
                <Box display={ "flex" } alignItems={ "center" } gap={ 0.5 }>
                    <IconButton
                        onClick={ (e) => { } }
                        title="Edit"
                        color="info"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-pen-to-square"></i>
                    </IconButton>
                    <IconButton
                        onClick={ (event) => {
                            event.stopPropagation();
                            setConfirm({
                                anchorEl: event.currentTarget,
                                d,
                            });
                        } }
                        title="Delete"
                        color="error"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-trash"></i>
                    </IconButton>
                </Box>
            ),
        },
    ];
    return (
        <>
            { creatingLeave ? (
                <CreateLeaveRequest
                    onBack={ () => {
                        setCreatingLeave(false);
                    } }
                />
            ) : (
                <>
                    { activeLeave ? (
                        <>
                            { " " }
                            <Box mt={ -1 } px={ { xs: 0, sm: 2 } }>
                                <Datatable
                                    extra={
                                        <Box px={ { xs: 0, md: 2 } } my={ { xs: 1, md: 0 } }>
                                            <Button
                                                onClick={ () => {
                                                    setCreatingLeave(true);
                                                } }
                                                variant="contained"
                                                color="primary"
                                                sx={ { textTransform: "none", py: 0.4 } }
                                            >
                                                <i
                                                    className="fa-solid fa-plus"
                                                    style={ { marginRight: 8 } }
                                                />
                                                Apply
                                            </Button>
                                        </Box>
                                    }
                                    title="My Leaves"
                                    isLoading={ false }
                                    pagination={ [10, 20, 50, 100] }
                                    pageSize={ 20 }
                                    columns={ columns }
                                    data={ data }
                                />
                            </Box>
                            <Popover
                                open={ openConfirm }
                                anchorEl={ confirm.anchorEl }
                                onClose={ closeConfirm }
                                anchorOrigin={ { vertical: "bottom", horizontal: "bottom" } }
                                transformOrigin={ { vertical: "top", horizontal: "center" } }
                                PaperProps={ {
                                    sx: {
                                        px: 2,
                                        py: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        borderRadius: "10px",
                                    },
                                } }
                            >
                                <Box sx={ { mr: 1.5, fontWeight: 600 } }>Confirm Delete?</Box>

                                <IconButton
                                    color="success"
                                    size="small"
                                    onClick={ confirmDelete }
                                    sx={ {
                                        "&:hover": { bgcolor: "success.light", color: "white" },
                                    } }
                                >
                                    <CheckIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={ closeConfirm }
                                    sx={ {
                                        ml: 0.5,
                                        "&:hover": { bgcolor: "error.light", color: "white" },
                                    } }
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </Popover>
                        </>
                    ) : (
                        <Grid size={ 12 } container spacing={ 2 } px={ 2 }>
                            { " " }
                            <Grid
                                size={ 12 }
                                container
                                justifyContent={ "space-between" }
                                alignItems={ "center" }
                            >
                                <Typography fontSize={ 20 } fontWeight={ 600 }>
                                    Manage Leave
                                </Typography>
                                <Button
                                    onClick={ () => {
                                        setCreatingLeave(true);
                                    } }
                                    variant="contained"
                                    color="primary"
                                    sx={ { borderRadius: 12, textTransform: "none" } }
                                >
                                    <i className="fa-solid fa-plus" style={ { marginRight: 8 } } />
                                    Create Leave Request
                                </Button>
                            </Grid>
                            <Grid
                                size={ 12 }
                                container
                                justifyContent={ "center" }
                                alignItems={ "center" }
                                sx={ {
                                    height: 200,
                                    bgcolor: "#f4f4f4",
                                    borderRadius: 2,
                                    border: "1px solid #cecece",
                                    color: "#777",
                                } }
                            >
                                No Active or Past Leave Request
                            </Grid>
                        </Grid>
                    ) }
                </>
            ) }
        </>
    );
}

function CreateLeaveRequest({ onBack }) {
    const [inputs, setInputs] = React.useState({
        to: [],
        type: "",
        description: "",
        reason: "",
        period: {
            from: null,
            to: null,
        },
        attachments: [],
    });
    const sendToOptions = [
        { label: "Manager", value: "manager" },
        { label: "HR", value: "hr" },
    ];
    const leaveOptions = [
        { label: "Casual Leave", value: "casual" },
        { label: "Sick Leave", value: "sick" },
    ];

    const durationInDays =
        inputs.period.from && inputs.period.to
            ? inputs.period.to.diff(inputs.period.from, "day") + 1
            : null;

    const addAttachment = (e) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        setInputs((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...files],
        }));

        e.target.value = "";
    };

    const deleteAttachment = (index) => {
        setInputs((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("type", inputs.type);
        formData.append("description", inputs.description);
        formData.append("reason", inputs.reason);

        inputs.to.forEach((value) => {
            formData.append("sendTo", value);
        });

        if (inputs.period.from) {
            formData.append("from", inputs.period.from.toISOString());
        }

        if (inputs.period.to) {
            formData.append("to", inputs.period.to.toISOString());
        }

        inputs.attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        console.log([...formData.entries()]);
    };

    return (
        <LocalizationProvider dateAdapter={ AdapterDayjs }>
            <Grid size={ 12 } px={ 2 }>
                <Grid
                    size={ 12 }
                    sx={ { borderRadius: 3, boxShadow: 2, bgcolor: "white" } }
                >
                    <SectionTitle
                        sx={ {
                            justifyContent: { xs: "flex-start", sm: "center" },
                            alignItems: "center",
                            height: { sm: 50 },
                            flexWrap: "wrap",
                            gap: { xs: 3, sm: 0 },
                            p: 1,
                            px: { md: 2 },
                        } }
                    >
                        <IconButton
                            onClick={ onBack }
                            sx={ { display: { xs: "flex", sm: "none" }, p: 0 } }
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box sx={ { display: { xs: "none", sm: "inline" } } }>
                            <Button
                                aria-label="Back Button"
                                startIcon={ <ArrowBackIcon /> }
                                sx={ {
                                    bgcolor: "whitesmoke",
                                    color: "black",
                                    borderRadius: 2,
                                    border: "1px solid #c8c8c8ff",
                                    px: 2,
                                    height: 30,
                                    "&:hover": {
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                    },
                                } }
                                onClick={ onBack }
                            >
                                Back
                            </Button>
                        </Box>
                        <Typography
                            fontSize={ { xs: 16, md: 18 } }
                            fontWeight={ 600 }
                            sx={ {
                                flex: { sm: 1 },
                                textAlign: "center",
                                marginLeft: { xs: "15px", md: "-110px" },
                            } }
                        >
                            Leave Application Form
                        </Typography>
                    </SectionTitle>

                    <Grid container size={ 12 } spacing={ { xs: 1, md: 2 } } p={ 2 }>
                        <Grid
                            size={ { xs: 12, md: 6 } }
                            container
                            direction="column"
                            spacing={ 0 }
                        >
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                Send Application To<span style={ { color: "red" } }>*</span>
                            </Typography>
                            <Autocomplete
                                size="small"
                                multiple
                                options={ sendToOptions }
                                value={ sendToOptions.filter((opt) =>
                                    inputs.to.includes(opt.value)
                                ) }
                                onChange={ (event, newValue) => {
                                    setInputs((prev) => ({
                                        ...prev,
                                        to: newValue.map((opt) => opt.value),
                                    }));
                                } }
                                getOptionLabel={ (option) => option.label }
                                renderInput={ (params) => (
                                    <TextField { ...params } placeholder="Select recipient" />
                                ) }
                            />
                        </Grid>{ " " }
                        <Grid
                            size={ { xs: 12, md: 6 } }
                            container
                            direction="column"
                            spacing={ 0 }
                        >
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                Leave Type<span style={ { color: "red" } }>*</span>
                            </Typography>
                            <Autocomplete
                                size="small"
                                options={ leaveOptions }
                                value={
                                    leaveOptions.find((opt) => opt.value === inputs.type) || null
                                }
                                onChange={ (event, newValue) => {
                                    setInputs((prev) => ({
                                        ...prev,
                                        type: newValue ? newValue.value : "",
                                    }));
                                } }
                                getOptionLabel={ (option) => option.label }
                                renderInput={ (params) => (
                                    <TextField { ...params } placeholder="Select Leave Type" />
                                ) }
                            />
                        </Grid>
                        <Grid
                            size={ { xs: 12, md: 4 } }
                            container
                            direction="column"
                            spacing={ 0 }
                            sx={ { maxWidth: 170 } }
                        >
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                From<span style={ { color: "red" } }>*</span>
                            </Typography>
                            <DatePicker
                                disablePast
                                value={ inputs.period.from }
                                onChange={ (newValue) => {
                                    setInputs((prev) => ({
                                        ...prev,
                                        period: {
                                            ...prev.period,
                                            from: newValue,
                                            to:
                                                prev.period.to &&
                                                    newValue &&
                                                    prev.period.to.isBefore(newValue)
                                                    ? null
                                                    : prev.period.to,
                                        },
                                    }));
                                } }
                                slotProps={ {
                                    textField: {
                                        size: "small",
                                    },
                                } }
                            />
                        </Grid>
                        <Grid
                            size={ { xs: 12, md: 4 } }
                            container
                            direction="column"
                            spacing={ 0 }
                            sx={ { maxWidth: 170 } }
                        >
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                Until<span style={ { color: "red" } }>*</span>
                            </Typography>
                            <DatePicker
                                size="small"
                                value={ inputs.period.to }
                                minDate={ inputs.period.from }
                                onChange={ (newValue) => {
                                    setInputs((prev) => ({
                                        ...prev,
                                        period: {
                                            ...prev.period,
                                            to: newValue,
                                        },
                                    }));
                                } }
                                slotProps={ {
                                    textField: {
                                        size: "small",
                                    },
                                } }
                            />
                        </Grid>
                        <Grid
                            size={ { xs: 12, md: 4 } }
                            container
                            direction="column"
                            spacing={ 0 }
                            justifyContent={ "center" }
                        >
                            <Typography
                                fontSize={ 16 }
                                pl={ 0.5 }
                                mt={ { md: "21px" } }
                                color="primary"
                            >
                                Duration:{ " " }
                                <Typography component={ "span" }>
                                    { durationInDays ? (
                                        <b>
                                            { durationInDays } day{ durationInDays > 1 ? "s" : "" }
                                        </b>
                                    ) : (
                                        <em>select from and until date</em>
                                    ) }
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid size={ 12 } container direction="column" spacing={ 0 }>
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                Short Description<span style={ { color: "red" } }>*</span>
                            </Typography>
                            <TextField
                                size="small"
                                value={ inputs.description }
                                onChange={ (e) =>
                                    setInputs((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Give a short description"
                            />
                        </Grid>
                        <Grid size={ 12 } container direction="column" spacing={ 0 }>
                            <Typography
                                fontSize={ 14 }
                                fontWeight={ 600 }
                                pl={ 0.5 }
                                color="#063686"
                            >
                                Reason
                            </Typography>
                            <TextField
                                size="small"
                                value={ inputs.reason }
                                multiline
                                rows={ 6 }
                                onChange={ (e) =>
                                    setInputs((prev) => ({
                                        ...prev,
                                        reason: e.target.value,
                                    }))
                                }
                                placeholder="Explain reason for leave in detail"
                            />
                        </Grid>
                        <Grid size={ 12 } container justifyContent="space-between">
                            <Grid
                                size={ { xs: 12, md: 6 } }
                                gap={ 2 }
                                container
                                sx={ {
                                    overflowY: "auto",
                                } }
                            >
                                { inputs.attachments.length === 0 ? (
                                    <Grid container size={ 12 }>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            component="label"
                                            sx={ { textTransform: "none" } }
                                            startIcon={ <AttachFileIcon /> }
                                        >
                                            Add Attachment
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                onChange={ addAttachment }
                                            />
                                        </Button>
                                    </Grid>
                                ) : (
                                    <Grid
                                        container
                                        size={ 12 }
                                        direction="column"
                                        spacing={ 0 }
                                        sx={ { ml: 0.5 } }
                                    >
                                        <Grid
                                            container
                                            size={ 12 }
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Typography
                                                fontSize={ 14 }
                                                fontWeight={ 600 }
                                                color="#063686"
                                            >
                                                Attached Files
                                            </Typography>
                                            <IconButton component="label">
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    onChange={ addAttachment }
                                                />
                                                <AddIcon />
                                            </IconButton>
                                        </Grid>

                                        <List disablePadding>
                                            { inputs.attachments.map((file, i) => (
                                                <ListItem
                                                    key={ i }
                                                    divider
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            onClick={ () => deleteAttachment(i) }
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    }
                                                    sx={ {
                                                        border: `1px solid transparent`,
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                                                            border: `1px solid #e0e0e0`,
                                                            borderRadius: 2,
                                                        },
                                                    } }
                                                >
                                                    <ListItemText primary={ file.name } />
                                                </ListItem>
                                            )) }
                                        </List>
                                    </Grid>
                                ) }
                            </Grid>
                            <Grid
                                size={ { xs: 12, md: 6 } }
                                container
                                alignSelf={ "flex-end" }
                                justifyContent={ "flex-end" }
                                gap={ 1 }
                            >
                                <Button
                                    variant="outlined"
                                    onClick={ onBack }
                                    size="small"
                                    sx={ { px: 2, textTransform: "none" } }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={ { px: 2, textTransform: "none" } }
                                    onClick={ handleSubmit }
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>{ " " }
        </LocalizationProvider>
    );
}
