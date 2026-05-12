import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
    FormControlLabel,
    Checkbox,
    Switch,
} from "@mui/material";
import * as Shared from "../../../shared";

const {
    Datatable,
    SideDrawer,
} = Shared.Components;
const { api, loadData } = Shared.Utils;

export default function LeaveCategories() {
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [reload, setReload] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true)
        loadData(
            api.get(`/api/v1/leaves/leave-category`),
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
                        onClick={ () => setSelectedCategory(info) }
                        title="Edit Category"
                        color="primary"
                        sx={ { fontSize: 18 } }
                    >
                        <i className="fas fa-edit"></i>
                    </IconButton>
                    <IconButton
                        onClick={ async () => {
                            if (window.confirm("Are you sure?")) {
                                await api.delete(`/api/v1/leaves/leave-category/${info._id}`);
                                setReload(prev => prev + 1);
                            }
                        } }
                        title="Delete Category"
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
            label: "Leave Name",
            data: "name",
            feature: ["sortable", "searchable"],
        },
        {
            id: "shortCode",
            label: "Code",
            data: "shortCode",
        },
        {
            id: "quota",
            label: "Annual Quota",
            data: "annualQuota",
        },
        {
            id: "status",
            label: "Status",
            render: info => info.isActive ? "Active" : "Inactive"
        },
    ];

    return (
        <Box mt={ -1 } px={ { xs: 0, sm: 1 } }>
            <Datatable
                add={ () => setSelectedCategory({}) }
                title="Leave Categories"
                columns={ columns }
                data={ data }
                isLoading={ isLoading }
            />
            <AddLeaveCategory
                open={ Boolean(selectedCategory) }
                category={ selectedCategory }
                onClose={ () => {
                    setSelectedCategory(null);
                    setReload((prev) => prev + 1);
                } }
            />
        </Box>
    );
}

function AddLeaveCategory({ open, category, onClose }) {
    const [form, setForm] = React.useState({});

    React.useEffect(() => {
        setForm({
            name: category?.name ?? "",
            shortCode: category?.shortCode ?? "",
            description: category?.description ?? "",
            color: category?.color ?? "#0c5adb",
            isActive: category?.isActive ?? true,
            sortOrder: category?.sortOrder ?? 0,
            isPaid: category?.isPaid ?? true,
            requiresApproval: category?.requiresApproval ?? true,
            allowHalfDay: category?.allowHalfDay ?? true,
            allowNegativeBalance: category?.allowNegativeBalance ?? false,
            allowedInProbation: category?.allowedInProbation ?? true,
            attachmentRequired: category?.attachmentRequired ?? false,
            eligibilityInterval: category?.eligibilityInterval ?? 1,
            annualQuota: category?.annualQuota ?? 12,
            isCarryForward: category?.isCarryForward ?? false,
            _id: category?._id
        });
    }, [category]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' || type === 'toggle' ? checked : value }));
    };

    return (
        <SideDrawer
            open={ open }
            onClose={ onClose }
            width={ 500 }
            title={ `${category?._id ? "Edit" : "Add"} Leave Category` }
        >
            <Grid
                component="form"
                container
                spacing={ 2 }
                onSubmit={ async (e) => {
                    e.preventDefault();
                    if (form._id) {
                        await api.put(`/api/v1/leaves/leave-category/${form._id}`, form);
                    } else {
                        await api.put(`/api/v1/leaves/leave-category`, form);
                    }
                    onClose();
                } }
                sx={ { p: 2 } }
            >
                <Grid size={ 8 }>
                    <TextField label="Leave Name" name="name" value={ form.name || "" } onChange={ handleChange } fullWidth size="small" required />
                </Grid>
                <Grid size={ 4 }>
                    <TextField label="Short Code" name="shortCode" value={ form.shortCode || "" } onChange={ handleChange } fullWidth size="small" required />
                </Grid>
                <Grid size={ 12 }>
                    <TextField label="Description" name="description" value={ form.description || "" } onChange={ handleChange } fullWidth size="small" multiline rows={ 2 } />
                </Grid>
                
                <Grid size={ 6 }>
                    <TextField label="Color" name="color" type="color" value={ form.color || "#0c5adb" } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Sort Priority" name="sortOrder" type="number" value={ form.sortOrder || 0 } onChange={ handleChange } fullWidth size="small" />
                </Grid>

                <Grid size={ 6 }>
                    <TextField label="Annual Quota" name="annualQuota" type="number" value={ form.annualQuota || 0 } onChange={ handleChange } fullWidth size="small" />
                </Grid>
                <Grid size={ 6 }>
                    <TextField label="Eligibility (Months)" name="eligibilityInterval" type="number" value={ form.eligibilityInterval || 1 } onChange={ handleChange } fullWidth size="small" helperText="1 leave per X months" />
                </Grid>

                <Grid size={ 12 }>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>Policies</Typography>
                </Grid>

                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="isPaid" checked={!!form.isPaid} onChange={handleChange} />} label="Paid Leave" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="requiresApproval" checked={!!form.requiresApproval} onChange={handleChange} />} label="Requires Approval" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="allowHalfDay" checked={!!form.allowHalfDay} onChange={handleChange} />} label="Allow Half Day" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="allowNegativeBalance" checked={!!form.allowNegativeBalance} onChange={handleChange} />} label="Allow Negative Balance" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="allowedInProbation" checked={!!form.allowedInProbation} onChange={handleChange} />} label="Allowed in Probation" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="attachmentRequired" checked={!!form.attachmentRequired} onChange={handleChange} />} label="Attachment Required" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="isCarryForward" checked={!!form.isCarryForward} onChange={handleChange} />} label="Carry Forward" />
                </Grid>
                <Grid size={ 6 }>
                    <FormControlLabel control={<Switch name="isActive" checked={!!form.isActive} onChange={handleChange} />} label="Active Status" />
                </Grid>

                <Grid size={ 12 } sx={ { display: 'flex', justifyContent: 'flex-end', mt: 2 } }>
                    <Button type="submit" variant="contained" color="primary" size="small">Save Category</Button>
                </Grid>
            </Grid>
        </SideDrawer>
    );
}
