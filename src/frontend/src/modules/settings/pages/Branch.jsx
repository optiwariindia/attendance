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
import AddLocationIcon from "@mui/icons-material/AddLocation";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Map from "../components/Map";

const { Datatable, SideDrawer, SelectedActions } = Shared.Components;
const { PhoneField } = Shared.Components.Fields;
const { api, loadData } = Shared.Utils;

export default function Branches() {
    const [selectedBranch, setSelectedBranch] = React.useState(null);
    const [reload, setReload] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        setIsLoading(true);
        loadData(
            api.get(`/api/v1/organization/branch`),
            (resp) => {
                setData(resp.data);
            },
            () => {
                setIsLoading(false);
            },
        );
    }, [reload]);
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
                            onClick={ async () => {
                                if (
                                    window.confirm("Are you sure you want to delete this branch?")
                                ) {
                                    await api.delete(`/api/v1/organization/branch/${info._id}`);
                                    setReload((prev) => prev + 1);
                                }
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
            render: (info) => {
                const addr = info.address || {};
                return (
                    [addr.addressLine1, addr.city, addr.state]
                        .filter(Boolean)
                        .join(", ") || "N/A"
                );
            },
        },
        {
            id: "email",
            label: "Email ID",
            render: (info) => info.contact?.email || "N/A",
        },
        {
            id: "phone",
            label: "Contact Number",
            render: (info) => info.contact?.phone || "N/A",
        },
        {
            id: "location",
            label: "Location",
            render: (info) =>
                info.location ? (
                    <span>
                        ({ info.location.coordinates.join(",") }) [{ info.radius }m]
                    </span>
                ) : (
                    "N/A"
                ),
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0, sm: 1 } }>
            <Datatable
                add={ () => setSelectedBranch({}) }
                title="Branches"
                isLoading={ isLoading }
                pagination={ [10, 20, 50, 100] }
                pageSize={ 20 }
                columns={ columns }
                data={ data }
                // rowSelectable={ true }
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
    const gps = Shared.Hook.useGPS();
    const [showMap, setShowMap] = React.useState(false);

    React.useEffect(() => {
        const addr = branch?.address || {};
        const contact = branch?.contact || {};
        let temp = {
            name: branch?.name ?? "",
            addressLine1: addr.addressLine1 ?? "",
            addressLine2: addr.addressLine2 ?? "",
            city: addr.city ?? "",
            state: addr.state ?? "",
            country: addr.country ?? "",
            zipCode: addr.zipCode ?? "",
            email: contact.email ?? "",
            phone: contact.phone ?? "",
            lat: branch?.location?.coordinates?.[1] ?? "",
            lng: branch?.location?.coordinates?.[0] ?? "",
            radius: branch?.radius ?? 200,
        };
        if (!!branch && typeof branch === "object" && "_id" in branch) {
            temp._id = branch._id;
        }
        setForm(temp);
    }, [branch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ () => { showMap ? setShowMap(false) : onClose() } }
            width={ 580 }
            title={ `${branch?._id ? "Edit" : "Add"} Branch ${branch?.name ? `(${branch.name})` : ""
                }` }
        >
            <Grid
                component="form"
                container
                spacing={ 1.5 }
                onSubmit={ async (e) => {
                    e.preventDefault();
                    // Construct payload in accordance with the Branch model
                    const payload = {
                        name: form.name,
                        address: {
                            addressLine1: form.addressLine1,
                            addressLine2: form.addressLine2,
                            city: form.city,
                            state: form.state,
                            country: form.country,
                            zipCode: form.zipCode,
                        },
                        contact: {
                            phone: form.phone,
                            email: form.email,
                        },
                        location: {
                            type: "Point",
                            coordinates: [
                                parseFloat(form.lng) || 0,
                                parseFloat(form.lat) || 0,
                            ],
                        },
                        radius: parseInt(form.radius) || 200,
                    };

                    if (form._id) {
                        await api.put(`/api/v1/organization/branch/${form._id}`, payload);
                    } else {
                        await api.put(`/api/v1/organization/branch`, payload);
                    }
                    onClose();
                } }
                sx={ { p: 2 } }
            >
                { showMap ? (
                    <Map setCoordinates={ (d) => {
                        setForm({
                            ...form,
                            ...d
                        });
                        setShowMap(false)
                    } } />
                ) : (
                    <>
                        <Grid size={ 12 }>
                            <TextField
                                label="Branch Name"
                                name="name"
                                value={ form.name || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                                required
                            />
                        </Grid>

                        <Grid size={ 12 }>
                            <Typography
                                variant="subtitle2"
                                sx={ { color: "secondary.main", fontWeight: "bold" } }
                            >
                                Address Details
                            </Typography>
                        </Grid>
                        <Grid size={ 12 }>
                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={ form.addressLine1 || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 12 }>
                            <TextField
                                label="Address Line 2"
                                name="addressLine2"
                                value={ form.addressLine2 || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="City"
                                name="city"
                                value={ form.city || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="State"
                                name="state"
                                value={ form.state || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="Country"
                                name="country"
                                value={ form.country || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="Zip Code"
                                name="zipCode"
                                value={ form.zipCode || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        <Grid size={ 12 }>
                            <Typography
                                variant="subtitle2"
                                sx={ { color: "secondary.main", fontWeight: "bold" } }
                            >
                                Contact Information
                            </Typography>
                        </Grid>
                        <Grid size={ 12 }>
                            <TextField
                                label="Email ID"
                                name="email"
                                type="email"
                                value={ form.email || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 12 }>
                            <PhoneField
                                label="Contact Number"
                                defaultCountry="IN"
                                value={ form.phone }
                                onChange={ (val) =>
                                    handleChange({ target: { name: "phone", value: val } })
                                }
                            />
                        </Grid>

                        <Grid
                            size={ 12 }
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="subtitle2"
                                sx={ { color: "secondary.main", fontWeight: "bold" } }
                            >
                                Geofencing (GPS)
                            </Typography>

                            <Box sx={ { display: "flex", gap: 1 } }>
                                <IconButton
                                    color="primary"
                                    onClick={ async () => {
                                        try {
                                            let temp = await gps.getLocation();
                                            setForm({
                                                ...form,
                                                lat: temp.coordinates[1],
                                                lng: temp.coordinates[0],
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    } }
                                    title="Use Current Location"
                                >
                                    <MyLocationIcon />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    onClick={ () => { setShowMap(true) } }
                                    title="Add Location"
                                >
                                    <AddLocationIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="Latitude"
                                name="lat"
                                type="number"
                                value={ form.lat || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 6 }>
                            <TextField
                                label="Longitude"
                                name="lng"
                                type="number"
                                value={ form.lng || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={ 12 }>
                            <TextField
                                label="Radius (meters)"
                                name="radius"
                                type="number"
                                value={ form.radius || "" }
                                onChange={ handleChange }
                                fullWidth
                                size="small"
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
                            sx={ { display: "flex", justifyContent: "flex-end", mt: 2 } }
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Save Branch
                            </Button>
                        </Grid>
                    </>
                ) }
            </Grid>
        </SideDrawer>
    );
}
