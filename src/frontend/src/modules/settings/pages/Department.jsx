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

export default function Departments() {
    const [selectedDept, setSelectedDept] = React.useState(null);
    const [reload, setReload] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true)
        loadData(
            api.get(`/api/v1/organization/department`),
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
                        onClick={ () => setSelectedDept(info) }
                        title="Edit Department"
                        color="primary"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-edit"></i>
                    </IconButton>
                    <IconButton
                        onClick={ async () => {
                            if (window.confirm("Are you sure?")) {
                                await api.delete(`/api/v1/organization/department/${info._id}`);
                                setReload(prev => prev + 1);
                            }
                        } }
                        title="Delete Department"
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
            label: "Department Name",
            data: "name",
            feature: ["sortable", "searchable"],
        },
        {
            id: "description",
            label: "Description",
            data: "description",
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0, sm: 1 } }>
            <Datatable
                add={ () => setSelectedDept({}) }
                title="Departments"
                columns={ columns }
                data={ data }
                isLoading={ isLoading }
            />
            <AddDepartment
                open={ Boolean(selectedDept) }
                department={ selectedDept }
                onClose={ () => {
                    setSelectedDept(null);
                    setReload((prev) => prev + 1);
                } }
            />
        </Box>
    );
}

function AddDepartment({ open, department, onClose }) {
    const [form, setForm] = React.useState({});

    React.useEffect(() => {
        setForm({
            name: department?.name ?? "",
            description: department?.description ?? "",
            _id: department?._id
        });
    }, [department]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ onClose }
            width={ 400 }
            title={ `${department?._id ? "Edit" : "Add"} Department` }
        >
            <Grid
                component="form"
                container
                spacing={ 2 }
                onSubmit={ async (e) => {
                    e.preventDefault();
                    if (form._id) {
                        await api.put(`/api/v1/organization/department/${form._id}`, form);
                    } else {
                        await api.put(`/api/v1/organization/department`, form);
                    }
                    onClose();
                } }
                sx={ { p: 2 } }
            >
                <Grid size={ 12 }>
                    <TextField label="Department Name" name="name" value={ form.name || "" } onChange={ handleChange } fullWidth size="small" required />
                </Grid>
                <Grid size={ 12 }>
                    <TextField label="Description" name="description" value={ form.description || "" } onChange={ handleChange } fullWidth size="small" multiline rows={ 3 } />
                </Grid>
                <Grid size={ 12 } sx={ { display: 'flex', justifyContent: 'flex-end', mt: 2 } }>
                    <Button type="submit" variant="contained" color="primary" size="small">Save</Button>
                </Grid>
            </Grid>
        </SideDrawer>
    );
}
