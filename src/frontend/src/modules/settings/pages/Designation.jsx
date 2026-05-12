import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
} from "@mui/material";
import * as Shared from "../../../shared";

const { Datatable, SideDrawer } = Shared.Components;
const { api, loadData } = Shared.Utils;

export default function Designations() {
  const [selectedDesig, setSelectedDesig] = React.useState(null);
  const [reload, setReload] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    loadData(
      api.get(`/api/v1/organization/designation`),
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
      render: (info) => (
        <>
          <IconButton
            onClick={() => setSelectedDesig(info)}
            title="Edit Designation"
            color="primary"
            sx={{ fontSize: 18 }}
          >
            <i className="fas fa-edit"></i>
          </IconButton>
          <IconButton
            onClick={async () => {
              if (window.confirm("Are you sure?")) {
                await api.delete(
                  `/api/v1/organization/designation/${info._id}`,
                );
                setReload((prev) => prev + 1);
              }
            }}
            title="Delete Designation"
            color="error"
            sx={{ fontSize: 18 }}
          >
            <i className="fas fa-trash"></i>
          </IconButton>
        </>
      ),
    },
    {
      id: "name",
      label: "Designation Name",
      data: "name",
      feature: ["sortable", "searchable"],
    },
    {
      id: "department",
      label: "Department",
      render: (info) => info.department?.name || "N/A",
    },
    {
      id: "description",
      label: "Description",
      data: "description",
    },
  ];

  return (
    <Box mt={-1} px={{ xs: 0, sm: 1 }}>
      <Datatable
        add={() => setSelectedDesig({})}
        title="Designations"
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
      <AddDesignation
        open={Boolean(selectedDesig)}
        designation={selectedDesig}
        onClose={() => {
          setSelectedDesig(null);
          setReload((prev) => prev + 1);
        }}
      />
    </Box>
  );
}

function AddDesignation({ open, designation, onClose }) {
  const [form, setForm] = React.useState({});
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      loadData(api.get("/api/v1/organization/department"), (resp) =>
        setDepartments(resp.data),
      );
    }
  }, [open]);

  React.useEffect(() => {
    setForm({
      name: designation?.name ?? "",
      description: designation?.description ?? "",
      department: designation?.department?._id ?? designation?.department ?? "",
      _id: designation?._id,
    });
  }, [designation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  console.log(departments);

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      width={400}
      title={`${designation?._id ? "Edit" : "Add"} Designation`}
    >
      <Grid
        component="form"
        container
        spacing={2}
        onSubmit={async (e) => {
          e.preventDefault();
          if (form._id) {
            await api.put(`/api/v1/organization/designation/${form._id}`, form);
          } else {
            await api.put(`/api/v1/organization/designation`, form);
          }
          onClose();
        }}
        sx={{ p: 2 }}
      >
        <Grid size={12}>
          <TextField
            label="Designation Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            select
            label="Department"
            name="department"
            value={form.department || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            SelectProps={{
              MenuProps: {
                disablePortal: false,
                sx: {
                  zIndex: 99999,
                },
                slotProps: {
                  paper: {
                    sx: {
                      minWidth: 300,
                      maxWidth: 300,
                      zIndex: 99999,
                      position: "relative",
                    },
                  },
                },
              },
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id} sx={{ zIndex: 9999 }}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={12}>
          <TextField
            label="Description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            multiline
            rows={3}
          />
        </Grid>
        <Grid
          size={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </SideDrawer>
  );
}
