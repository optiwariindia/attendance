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

export default function Holidays() {
  const [selectedHoliday, setSelectedHoliday] = React.useState(null);
  const [reload, setReload] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    loadData(
      api.get(`/api/v1/leaves/holiday`),
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
            onClick={() => setSelectedHoliday(info)}
            title="Edit Holiday"
            color="primary"
            sx={{ fontSize: 18 }}
          >
            <i className="fas fa-edit"></i>
          </IconButton>
          <IconButton
            onClick={async () => {
              if (window.confirm("Are you sure?")) {
                await api.delete(`/api/v1/leaves/holiday/${info._id}`);
                setReload((prev) => prev + 1);
              }
            }}
            title="Delete Holiday"
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
      label: "Holiday Name",
      data: "name",
      feature: ["sortable", "searchable"],
    },
    {
      id: "date",
      label: "Date",
      render: (info) => new Date(info.date).toLocaleDateString(),
    },
    {
      id: "type",
      label: "Type",
      data: "type",
    },
  ];

  return (
    <Box mt={-1} px={{ xs: 0, sm: 1 }}>
      <Datatable
        add={() => setSelectedHoliday({})}
        title="Holidays"
        columns={columns}
        data={data}
        isLoading={isLoading}
      />
      <AddHoliday
        open={Boolean(selectedHoliday)}
        holiday={selectedHoliday}
        onClose={() => {
          setSelectedHoliday(null);
          setReload((prev) => prev + 1);
        }}
      />
    </Box>
  );
}

function AddHoliday({ open, holiday, onClose }) {
  const [form, setForm] = React.useState({});

  React.useEffect(() => {
    setForm({
      name: holiday?.name ?? "",
      date: holiday?.date
        ? new Date(holiday.date).toISOString().split("T")[0]
        : "",
      type: holiday?.type ?? "Public Holiday",
      _id: holiday?._id,
    });
  }, [holiday]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      width={400}
      title={`${holiday?._id ? "Edit" : "Add"} Holiday`}
    >
      <Grid
        component="form"
        container
        spacing={2}
        onSubmit={async (e) => {
          e.preventDefault();
          if (form._id) {
            await api.put(`/api/v1/leaves/holiday/${form._id}`, form);
          } else {
            await api.put(`/api/v1/leaves/holiday`, form);
          }
          onClose();
        }}
        sx={{ p: 2 }}
      >
        <Grid size={12}>
          <TextField
            label="Holiday Name"
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
            label="Date"
            name="date"
            type="date"
            value={form.date || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            select
            label="Type"
            name="type"
            value={form.type || ""}
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
            {["Public Holiday", "Company Holiday", "Personal Holiday"].map(
              (type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ),
            )}
          </TextField>
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
