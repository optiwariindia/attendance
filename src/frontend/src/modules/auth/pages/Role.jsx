import React from "react";
import {
    Box,
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

export default function Roles() {
    const [selectedRole, setSelectedRole] = React.useState(null);
    const [reload, setReload] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true)
        loadData(
            api.get(`/api/v1/auth/role`),
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
                        onClick={ () => setSelectedRole(info) }
                        title="Edit Role"
                        color="primary"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-edit"></i>
                    </IconButton>
                    <IconButton
                        onClick={ async () => {
                            if (window.confirm("Are you sure?")) {
                                await api.delete(`/api/v1/auth/role/${info._id}`);
                                setReload(prev => prev + 1);
                            }
                        } }
                        title="Delete Role"
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
            label: "Role Name",
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
                add={ () => setSelectedRole({}) }
                title="User Roles"
                columns={ columns }
                data={ data }
                isLoading={ isLoading }
            />
            <AddRole
                open={ Boolean(selectedRole) }
                role={ selectedRole }
                onClose={ () => {
                    setSelectedRole(null);
                    setReload((prev) => prev + 1);
                } }
            />
        </Box>
    );
}

function AddRole({ open, role, onClose }) {
    const [form, setForm] = React.useState({});

    React.useEffect(() => {
        setForm({
            name: role?.name ?? "",
            description: role?.description ?? "",
            _id: role?._id
        });
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ onClose }
            width={ 400 }
            title={ `${role?._id ? "Edit" : "Add"} Role` }
        >
            <Grid
                component="form"
                container
                spacing={ 2 }
                onSubmit={ async (e) => {
                    e.preventDefault();
                    if (form._id) {
                        await api.put(`/api/v1/auth/role/${form._id}`, form);
                    } else {
                        await api.put(`/api/v1/auth/role`, form);
                    }
                    onClose();
                } }
                sx={ { p: 2 } }
            >
                <Grid size={ 12 }>
                    <TextField label="Role Name" name="name" value={ form.name || "" } onChange={ handleChange } fullWidth size="small" required />
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
