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
} from "@mui/material";
import * as Shared from "../../../shared";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Map from "../components/Map";

const { Datatable, SideDrawer, SelectedActions } = Shared.Components;
const { PhoneField } = Shared.Components.Fields;
const { api, loadData } = Shared.Utils;

export default function WorkStatus() {
  const [selectedWorkStatus, setSelectedWorkStatus] = React.useState(null);
  const [reload, setReload] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setIsLoading(true);
    loadData(
      api.get(`/api/v1/auth/work-status`),
      (resp) => {
        setData(resp.data.map((d, i) => ({ ...d, index: i })));
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
      width: 150,
      render: (info) => {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{ p: 0 }}
              title="Move Up in Sort Order"
              disabled={info.sortOrder === data.length}
              onClick={async () => {
                let temp = await api.patch(
                  `/api/v1/auth/work-status/${info._id}`,
                  { action: "move-up" },
                );
                setReload(reload + 1);
              }}
            >
              <KeyboardArrowUpIcon
                fontSize="small"
                sx={{
                  color:
                    info.sortOrder === data.length ? "#CFCFCF" : "primary.main",
                }}
              />
            </IconButton>

            <IconButton
              sx={{ p: 0 }}
              title="Move Down in Sort Order"
              disabled={info.sortOrder <= 1}
              onClick={async () => {
                let temp = await api.patch(
                  `/api/v1/auth/work-status/${info._id}`,
                  { action: "move-down" },
                );
                setReload(reload + 1);
              }}
            >
              <KeyboardArrowDownIcon
                fontSize="small"
                sx={{
                  color: info.sortOrder <= 1 ? "#CFCFCF" : "primary.main",
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => setSelectedWorkStatus(info)}
              title="Edit Work Status"
              color="primary"
              sx={{ fontSize: 18 }}
            >
              <i className="fas fa-edit"></i>
            </IconButton>

            <IconButton
              onClick={async () => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this Work Status?",
                  )
                ) {
                  await api.delete(`/api/v1/auth/work-status/${info._id}`);
                  setReload((prev) => prev + 1);
                }
              }}
              title="Delete Work Status"
              color="error"
              sx={{ fontSize: 18 }}
            >
              <i className="fas fa-trash"></i>
            </IconButton>
          </Box>
        );
      },
    },
    {
      id: "name",
      label: "Work Status Name",
      data: "name",
      feature: ["sortable", "searchable"],
    },
    {
      id: "canMarkAttendance",
      label: "Can Mark Attendance",
      render: (info) => (info.canMarkAttendance ? "Yes" : "No"),
    },
  ];

  return (
    <Box mt={-1} px={{ xs: 0, sm: 1 }}>
      <Datatable
        add={() => setSelectedWorkStatus({})}
        title="Work Status"
        isLoading={isLoading}
        pagination={[10, 20, 50, 100]}
        pageSize={20}
        columns={columns}
        data={data}
        // rowSelectable={true}
      />

      <AddWorkStatus
        open={Boolean(selectedWorkStatus)}
        WorkStatus={selectedWorkStatus}
        onClose={() => {
          setSelectedWorkStatus(null);
          setReload((prev) => prev + 1);
        }}
      />
    </Box>
  );
}

function AddWorkStatus({ open, WorkStatus, onClose }) {
  const [form, setForm] = React.useState({});
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let temp = {
      name: WorkStatus?.name ?? "",
      canMarkAttendance: WorkStatus?.canMarkAttendance ?? false,
      description: WorkStatus?.description ?? "",
    };
    if (!!WorkStatus && typeof WorkStatus === "object" && "_id" in WorkStatus) {
      temp._id = WorkStatus._id;
    }
    setForm(temp);
  }, [WorkStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SideDrawer
      open={open}
      onClose={() => {
        onClose();
      }}
      width={580}
      title={`${WorkStatus?._id ? "Edit" : "Add"} Work Status ${
        WorkStatus?.name ? `(${WorkStatus.name})` : ""
      }`}
    >
      <Grid
        component="form"
        container
        spacing={1.5}
        onSubmit={async (e) => {
          e.preventDefault();
          // Construct payload in accordance with the WorkStatus model
          const payload = {
            name: form.name,
            canMarkAttendance: form.canMarkAttendance,
            description: form.description,
          };

          if (form._id) {
            await api.put(`/api/v1/auth/work-status/${form._id}`, payload);
          } else {
            await api.put(`/api/v1/auth/work-status`, payload);
          }
          onClose();
        }}
        sx={{ p: 2 }}
      >
        <Grid size={12}>
          <TextField
            label="Work Status Name"
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

        <FormControlLabel
          labelPlacement="end"
          control={
            <Checkbox
              checked={form.canMarkAttendance}
              onChange={(e) =>
                setForm({
                  ...form,
                  canMarkAttendance: e.target.checked,
                })
              }
            />
          }
          label="Allow to Mark Attendance"
        />

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
            Save Work Status
          </Button>
        </Grid>
      </Grid>
    </SideDrawer>
  );
}
