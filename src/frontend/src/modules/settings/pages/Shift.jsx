import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
} from "@mui/material";
import * as Shared from "../../../shared";

const {
    Datatable,
    SideDrawer,
} = Shared.Components;
const { api, loadData } = Shared.Utils;

export default function Shifts() {
    const [selectedShift, setSelectedShift] = React.useState(null);
    const [reload, setReload] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true)
        loadData(
            api.get(`/api/v1/attendance/shift`),
            resp => {
                setData(resp.data);
            },
            () => { setIsLoading(false) }
        )
    }, [reload])

    const columns = [
        {
            id: "actions",
            label: "Actions",
            width: 100,
            render: (info) => (
                <>
                    <IconButton
                        onClick={ () => setSelectedShift(info) }
                        title="Edit Shift"
                        color="primary"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-edit"></i>
                    </IconButton>
                    <IconButton
                        onClick={ async () => {
                            if (window.confirm("Are you sure?")) {
                                await api.delete(`/api/v1/attendance/shift/${info._id}`);
                                setReload(prev => prev + 1);
                            }
                        } }
                        title="Delete Shift"
                        color="error"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-trash"></i>
                    </IconButton>
                </>
            ),
        },
        {
            id: "name",
            label: "Shift Name",
            data: "name",
            feature: ["sortable", "searchable"],
        },
        {
            id: "timing",
            label: "Timing",
            render: info => `${info.startTime} - ${info.endTime}`
        },
        {
            id: "grace",
            label: "Grace (In/Out)",
            render: info => `${info.gracePeriod?.in || 0}m / ${info.gracePeriod?.out || 0}m`
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0, sm: 1 } }>
            <Datatable
                add={ () => setSelectedShift({}) }
                title="Shift Policies"
                columns={ columns }
                data={ data }
                isLoading={ isLoading }
            />
            <AddShift
                open={ Boolean(selectedShift) }
                shift={ selectedShift }
                onClose={ () => {
                    setSelectedShift(null);
                    setReload((prev) => prev + 1);
                } }
            />
        </Box>
    );
}

function AddShift({ open, shift, onClose }) {
    const [form, setForm] = React.useState({});

    React.useEffect(() => {
        setForm({
            name: shift?.name ?? "",
            startTime: shift?.startTime ?? "09:00",
            endTime: shift?.endTime ?? "18:00",
            breakDuration: shift?.breakDuration ?? 60,
            graceIn: shift?.gracePeriod?.in ?? 0,
            graceOut: shift?.gracePeriod?.out ?? 0,
            minHours: shift?.presence?.minimumHours ?? 8,
            _id: shift?._id
        });
    }, [shift]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ onClose }
            width={ 450 }
            title={ `${shift?._id ? "Edit" : "Add"} Shift Policy` }
        >
            <Grid
                component="form"
                container
                spacing={ 2 }
                onSubmit={ async (e) => {
                    e.preventDefault();
                    const payload = {
                        name: form.name,
                        startTime: form.startTime,
                        endTime: form.endTime,
                        breakDuration: form.breakDuration,
                        gracePeriod: { in: form.graceIn, out: form.graceOut },
                        presence: { minimumHours: form.minHours }
                    };
                    if (form._id) {
                        await api.put(`/api/v1/attendance/shift/${form._id}`, payload);
                    } else {
                        await api.put(`/api/v1/attendance/shift`, payload);
                    }
                    onClose();
                } }
                sx={ { p: 2 } }
            >
                <Grid size={ 12 }>
                    <TextField label="Shift Name" name="name" value={ form.name || "" } onChange={ handleChange } fullWidth size="small" required />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Start Time" name="startTime" type="time" value={ form.startTime || "" } onChange={ handleChange } fullWidth size="small" required InputLabelProps={ { shrink: true } } />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="End Time" name="endTime" type="time" value={ form.endTime || "" } onChange={ handleChange } fullWidth size="small" required InputLabelProps={ { shrink: true } } />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Break Duration (mins)" name="breakDuration" type="number" value={ form.breakDuration || "" } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Min Working Hours" name="minHours" type="number" value={ form.minHours || "" } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Grace Period In (mins)" name="graceIn" type="number" value={ form.graceIn || "" } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Grace Period Out (mins)" name="graceOut" type="number" value={ form.graceOut || "" } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 12 } sx={ { display: 'flex', justifyContent: 'flex-end', mt: 2 } }>
                    <Button type="submit" variant="contained" color="primary" size="small">Save</Button>
                </Grid>
            </Grid>
        </SideDrawer>
    );
}
