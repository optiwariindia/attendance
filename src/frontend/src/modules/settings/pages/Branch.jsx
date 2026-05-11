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
    SelectedActions
} = Shared.Components;
// import Datatable from "../Datatable.jsx";
// import SideDrawer from "../SideDrawer.jsx";
// import SelectedActions from "../SelectedActions.jsx";

import { api, submitWithAjax } from "../../utils";
import PhoneField from "../Phone.jsx";

export default function Branches() {
    const [selectedBranch, setSelectedBranch] = React.useState(null);
    const [reload, setReload] = React.useState(0);

    const [data, setData] = React.useState([
        {
            name: "Branch Name",
            address: "Address",
            email: "email",
            phone: "",
        },
    ]);

    const columns = [
        {
            id: "actions",
            label: "Actions",
            width: 100,
            render: (info) => {
                return (
                    <>
                        <IconButton
                            onClick={ () => setSelectedBranch(info) }
                            title="Edit Branch"
                            color="primary"
                            sx={ { fontSize: 18 } }
                        >
                            <i className="fas fa-edit"></i>
                        </IconButton>

                        <IconButton
                            onClick={ () => {
                                // delete branch
                            } }
                            title="Delete Branch"
                            color="error"
                            sx={ { fontSize: 18 } }
                        >
                            <i className="fas fa-trash"></i>
                        </IconButton>
                    </>
                );
            },
        },
        {
            id: "name",
            label: "Branch Name",
            data: "name",
            feature: ["sortable", "searchable"],
        },
        {
            id: "address",
            label: "Address",
            data: "address",
        },
        {
            id: "email",
            label: "Email ID",
            data: "email",
        },
        {
            id: "phone",
            label: "Contact Number",
            data: "phone",
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0, sm: 1 } }>
            <Datatable
                add={ () => setSelectedBranch({}) }
                title="Branches"
                isLoading={ false }
                pagination={ [10, 20, 50, 100] }
                pageSize={ 20 }
                columns={ columns }
                data={ data }
                rowSelectable={ true }
            />

            <AddBranch
                open={ Boolean(selectedBranch) }
                branch={ selectedBranch }
                onClose={ () => {
                    setSelectedBranch(null);
                    setReload((prev) => prev + 1);
                } }
            />
        </Box>
    );
}

function AddBranch({ open, branch, onClose }) {
    const [form, setForm] = React.useState({});
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        setForm({ ...(branch || {}) });
    }, [branch]);

    console.log(form);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ onClose }
            width={ 400 }
            title={ `${branch?.name ? "Edit" : "Add"} Branch ${branch?.name ? `(${branch.name})` : ""
                }` }
        >
            <Grid
                component="form"
                action={ `/api/v1/branch${branch?._id ? `/${branch._id}` : ""}` }
                method="put"
                container
                spacing={ 1.5 }
                size={ 12 }
                onSubmit={ async (e) => {
                    let resp = await submitWithAjax(e);

                    if (resp.status === "error") {
                        setError(resp.message);
                        return;
                    }

                    onClose();
                } }
            >
                <Grid size={ 12 }>
                    <TextField
                        label="Branch Name"
                        name="name"
                        value={ form.name || "" }
                        onChange={ handleChange }
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid>

                <Grid size={ 12 }>
                    <TextField
                        label="Address"
                        name="address"
                        value={ form.address || "" }
                        onChange={ handleChange }
                        variant="outlined"
                        fullWidth
                        rows={ 6 }
                        multiline
                        size="small"
                    />
                </Grid>

                <Grid size={ 12 }>
                    <TextField
                        label="Email ID"
                        name="email"
                        type="email"
                        value={ form.email || "" }
                        onChange={ handleChange }
                        variant="outlined"
                        fullWidth
                        size="small"
                    />
                </Grid>

                <Grid size={ 12 }>
                    <PhoneField
                        label="Contact Number"
                        defaultCountry="IN"
                        onChange={ (val) =>
                            handleChange({
                                target: { name: "phone", value: val },
                            })
                        }
                    />
                </Grid>

                { error && (
                    <Grid size={ 12 }>
                        <Typography variant="body2" color="error">
                            { error }
                        </Typography>
                    </Grid>
                ) }

                <Grid
                    size={ 12 }
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={ 2 }
                >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={ { mt: 3, mb: 5, fontWeight: 600 } }
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </SideDrawer>
    );
}
