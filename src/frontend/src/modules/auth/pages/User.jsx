import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Avatar,
  Autocomplete,
} from "@mui/material";
import * as Shared from "../../../shared";

const { Datatable, SideDrawer } = Shared.Components;
const { PhoneField } = Shared.Components.Fields;
const { api, loadData } = Shared.Utils;

export default function Users() {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [reload, setReload] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    loadData(
      api.get(`/api/v1/auth/users`),
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
            onClick={ () => setSelectedUser(info) }
            title="Edit User"
            color="primary"
            sx={ { fontSize: 18 } }
          >
            <i className="fas fa-edit"></i>
          </IconButton>
          <IconButton
            onClick={ async () => {
              if (
                window.confirm(
                  `Are you sure you want to ${info.isActive ? "deactivate" : "activate"} this user?`,
                )
              ) {
                await api.patch(
                  `/api/v1/auth/users/${info._id}/${info.isActive ? "deactivate" : "activate"}`,
                );
                setReload((prev) => prev + 1);
              }
            } }
            title={ info.isActive ? "Deactivate User" : "Activate User" }
            color={ info.isActive ? "warning" : "success" }
            sx={ { fontSize: 18 } }
          >
            <i
              className={ `fas fa-user-${info.isActive ? "slash" : "check"}` }
            ></i>
          </IconButton>
        </>
      ),
    },
    {
      id: "employeeID",
      label: "Emp ID",
      data: "employeeID",
      width: 120,
      feature: ["sortable", "searchable"],
    },
    {
      id: "shift",
      label: "Shift",
      render: info => <div className="flex-apart"><span className="name">{ info?.shift?.name }</span> <span className="time">{ info?.shift?.startTime } - { info?.shift?.endTime }</span></div>,
    },
    {
      id: "reportingTo",
      label: "Reporting To",
      width:230,
      render: info => <>{ info?.reportingTo?.name?.first } { info?.reportingTo?.name?.last } ({ info?.reportingTo?.designation } - { info?.reportingTo?.department }  )</>,
    },
    {
      id: "name",
      label: "Name",
      render: (info) => (
        <Box sx={ { display: "flex", alignItems: "center", gap: 1 } }>
          <Avatar sx={ { width: 24, height: 24, fontSize: "0.8rem" } }>
            { info.name.first[0] }
            { info.name.last[0] }
          </Avatar>
          <Typography variant="body2">
            { [info.name.first, info.name.middle, info.name.last]
              .filter(Boolean)
              .join(" ") }
          </Typography>
        </Box>
      ),
      feature: ["sortable", "searchable"],
    },
    {
      id: "email",
      label: "Email",
      data: "email",
      feature: ["sortable", "searchable"],
      width: 275,
    },
    {
      id: "department",
      label: "Department",
      data: "department",
    },
    {
      id: "designation",
      label: "Designation",
      data: "designation",
    },
    {
      id: "role",
      label: "Role",
      data: "role",
    },
    {
      id: "workStatus",
      label: "Status",
      data: "workStatus",
    },
  ];

  return (
    <Box mt={ -1 } px={ { xs: 0.5, sm: 2 } }>
      <Datatable
        add={ () => setSelectedUser({}) }
        title="Employee Management"
        columns={ columns }
        data={ data }
        isLoading={ isLoading }
        rowSelectable={ true }
        pageSize={ 25 }
      />
      <AddUser
        open={ Boolean(selectedUser) }
        user={ selectedUser }
        onClose={ () => {
          setSelectedUser(null);
          setReload((prev) => prev + 1);
        } }
      />
    </Box>
  );
}

function AddUser({ open, user, onClose }) {
  const [form, setForm] = React.useState({});
  const [roles, setRoles] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [designations, setDesignations] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      loadData(api.get("/api/v1/organization/department"), (resp) =>
        setDepartments(resp.data),
      );
      loadData(api.get("/api/v1/auth/role"), (resp) => setRoles(resp.data));
      loadData(api.get("/api/v1/organization/branch"), (resp) =>
        setBranches(resp.data),
      );
      loadData(api.get("/api/v1/attendance/shift"), (resp) =>
        setShifts(resp.data),
      );
      loadData(api.get("/api/v1/auth/users"), (resp) => setUsers(resp.data));
    }
  }, [open]);

  React.useEffect(() => {
    const routing = user?.routing || {};
    setForm({
      firstName: user?.name?.first ?? "",
      middleName: user?.name?.middle ?? "",
      lastName: user?.name?.last ?? "",
      email: user?.email ?? "",
      employeeID: user?.employeeID ?? "",
      phone: user?.phone?.[0] ?? "",
      gender: user?.gender ?? "male",
      role: user?.role ?? "user",
      workStatus: user?.workStatus ?? "Permanent",
      branch: user?.branch?._id ?? user?.branch ?? "",
      department: user?.department ?? "",
      designation: user?.designation ?? "",
      allowOutsideLogin: user?.workPolicy?.allowOutsideLogin ?? false,
      isWFH: user?.workPolicy?.isWFH ?? false,
      weeklyOff: user?.workPolicy?.weeklyOff ?? [0],
      shift: user?.shift?._id ?? user?.shift ?? "",
      reportingTo: user?.reportingTo?._id ?? user?.reportingTo ?? "",
      leave_to: routing.leave?.to?.join(", ") ?? "",
      leave_cc: routing.leave?.cc?.join(", ") ?? "",
      leave_bcc: routing.leave?.bcc?.join(", ") ?? "",
      finance_to: routing.finance?.to?.join(", ") ?? "",
      finance_cc: routing.finance?.cc?.join(", ") ?? "",
      finance_bcc: routing.finance?.bcc?.join(", ") ?? "",
      it_to: routing.it?.to?.join(", ") ?? "",
      it_cc: routing.it?.cc?.join(", ") ?? "",
      it_bcc: routing.it?.bcc?.join(", ") ?? "",
      _id: user?._id,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const splitEmails = (str) =>
    str
      ? str
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
      : [];
  console.log(form);
  return (
    <SideDrawer
      open={ open }
      onClose={ onClose }
      width={ 650 }
      title={ `${user?._id ? "Edit" : "Add"} Employee` }
    >
      <Grid
        component="form"
        container
        spacing={ 2 }
        onSubmit={ async (e) => {
          e.preventDefault();
          const payload = {
            name: {
              first: form.firstName,
              middle: form.middleName,
              last: form.lastName,
            },
            email: form.email,
            employeeID: form.employeeID,
            phone: [form.phone],
            gender: form.gender,
            role: form.role,
            workStatus: form.workStatus,
            branch: form.branch,
            department: form.department,
            designation: form.designation,
            workPolicy: {
              allowOutsideLogin: !!form.allowOutsideLogin,
              isWFH: !!form.isWFH,
              weeklyOff: form.weeklyOff,
            },
            shift: form.shift || null,
            reportingTo: form.reportingTo || null,
            routing: {
              leave: {
                to: splitEmails(form.leave_to),
                cc: splitEmails(form.leave_cc),
                bcc: splitEmails(form.leave_bcc),
              },
              finance: {
                to: splitEmails(form.finance_to),
                cc: splitEmails(form.finance_cc),
                bcc: splitEmails(form.finance_bcc),
              },
              it: {
                to: splitEmails(form.it_to),
                cc: splitEmails(form.it_cc),
                bcc: splitEmails(form.it_bcc),
              },
            },
          };

          if (form._id) {
            await api.patch(`/api/v1/auth/users/${form._id}`, payload);
          } else {
            await api.patch(`/api/v1/auth/users`, payload);
          }
          onClose();
        } }
        sx={ { p: 2 } }
      >
        {/* Section: Basic Information */ }
        <Grid size={ 12 }>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={ {
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
              pb: 0.5,
              mb: 1,
            } }
          >
            Basic Information
          </Typography>
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="First Name"
            name="firstName"
            value={ form.firstName || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            required
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="Middle Name"
            name="middleName"
            value={ form.middleName || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="Last Name"
            name="lastName"
            value={ form.lastName || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            required
          />
        </Grid>
        <Grid size={ 6 }>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={ form.email || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            required
          />
        </Grid>
        <Grid size={ 6 }>
          <TextField
            label="Employee ID"
            name="employeeID"
            value={ form.employeeID || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            required
          />
        </Grid>
        <Grid size={ 6 }>
          <PhoneField
            label="Phone Number"
            defaultCountry="IN"
            value={ form.phone }
            onChange={ (val) =>
              handleChange({ target: { name: "phone", value: val } })
            }
          />
        </Grid>
        <Grid size={ 6 }>
          <TextField
            select
            label="Gender"
            name="gender"
            value={ form.gender || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            SelectProps={ {
              MenuProps: {
                disablePortal: false,
                sx: {
                  zIndex: 99999,
                },
                slotProps: {
                  paper: {
                    sx: {
                      minWidth: 200,
                      maxWidth: 200,
                      zIndex: 99999,
                      position: "relative",
                    },
                  },
                },
              },
            } }
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        {/* Section: Employment Details */ }
        <Grid size={ 12 }>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={ {
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
              pb: 0.5,
              mt: 2,
              mb: 1,
            } }
          >
            Employment & Work Policy
          </Typography>
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ roles }
            value={ roles.find((r) => r.name === form.role) || null }
            isOptionEqualToValue={ (option, value) => option._id === value._id }
            getOptionLabel={ (r) => r.name || "" }
            onChange={ (e, d) => {
              setForm({
                ...form,
                role: d?.name || "",
              });
            } }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 99999,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                { ...params }
                label="Role"
                name="role"
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ branches }
            value={ branches.find((b) => b._id === form.branch) || null }
            isOptionEqualToValue={ (option, value) => option._id === value._id }
            getOptionLabel={ (b) => b.name || "" }
            onChange={ (e, d) => {
              setForm({
                ...form,
                branch: d?._id || "",
              });
            } }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 99999,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                { ...params }
                label="Branch"
                name="branch"
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>
        <Grid size={ 6 }>
          <TextField
            select
            label="Work Status"
            name="workStatus"
            value={ form.workStatus || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            SelectProps={ {
              MenuProps: {
                disablePortal: false,
                sx: {
                  zIndex: 99999,
                },
                slotProps: {
                  paper: {
                    sx: {
                      minWidth: 200,
                      maxWidth: 200,
                      zIndex: 99999,
                      position: "relative",
                    },
                  },
                },
              },
            } }
          >
            { [
              "Draft",
              "Probation",
              "Permanent",
              "Terminated",
              "Abscond",
              "Resigned",
            ].map((s) => (
              <MenuItem key={ s } value={ s }>
                { s }
              </MenuItem>
            )) }
          </TextField>
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ users }
            value={ users.find((u) => u._id === form.reportingTo) || null }
            isOptionEqualToValue={ (option, value) => option._id === value._id }
            getOptionLabel={ (u) =>
              `${[u.name.first, u.name.last].filter(Boolean).join(" ")} (${u.employeeID || ""})`
            }
            onChange={ (e, d) => {
              setForm({
                ...form,
                reportingTo: d?._id || "",
              });
            } }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 99999,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                { ...params }
                label="Reporting Manager"
                name="reportingTo"
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ departments }
            onChange={ async (e, d) => {
              setForm({
                ...form,
                department: d?.name ?? "-",
              });
              loadData(
                api.post("/api/v1/organization/designation", {
                  department: d?._id,
                }),
                (resp) => setDesignations(resp.data),
              );
            } }
            getOptionLabel={ (option) => option.name || "" }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 15000,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                label="Department"
                name="department"
                value={ params.name }
                { ...params }
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ designations }
            onChange={ async (e, d) => {
              setForm({
                ...form,
                designation: d?.name ?? "-",
              });
            } }
            getOptionLabel={ (option) => option.name || "" }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 15000,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                label="Designation"
                name="Designation"
                { ...params }
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>
        <Grid size={ 6 }>
          <Autocomplete
            options={ shifts }
            value={ shifts.find((s) => s._id === form.shift) || null }
            isOptionEqualToValue={ (option, value) => option._id === value._id }
            getOptionLabel={ (s) => `${s.name} (${s.startTime}-${s.endTime})` }
            onChange={ (e, d) => {
              setForm({
                ...form,
                shift: d?._id || "",
              });
            } }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 99999,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                { ...params }
                label="Assigned Shift"
                name="shift"
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>

        <Grid size={ 6 }>
          <Autocomplete
            multiple
            options={ [
              { label: "Sunday", value: 0 },
              { label: "Monday", value: 1 },
              { label: "Tuesday", value: 2 },
              { label: "Wednesday", value: 3 },
              { label: "Thursday", value: 4 },
              { label: "Friday", value: 5 },
              { label: "Saturday", value: 6 },
            ] }
            value={ [
              { label: "Sunday", value: 0 },
              { label: "Monday", value: 1 },
              { label: "Tuesday", value: 2 },
              { label: "Wednesday", value: 3 },
              { label: "Thursday", value: 4 },
              { label: "Friday", value: 5 },
              { label: "Saturday", value: 6 },
            ].filter((d) => form.weeklyOff?.includes(d.value)) }
            isOptionEqualToValue={ (option, value) => option.value === value.value }
            getOptionLabel={ (option) => option.label }
            onChange={ (e, d) => {
              setForm({
                ...form,
                weeklyOff: d.map((x) => x.value),
              });
            } }
            slotProps={ {
              popper: {
                sx: {
                  zIndex: 99999,
                },
              },
            } }
            renderInput={ (params) => (
              <TextField
                { ...params }
                label="Weekly Off"
                name="weeklyOff"
                fullWidth
                size="small"
              />
            ) }
          />
        </Grid>

        <Grid size={ 3 } sx={ { display: "flex", alignItems: "center" } }>
          <label style={ { fontSize: "0.85rem" } }>
            <input
              type="checkbox"
              name="allowOutsideLogin"
              checked={ form.allowOutsideLogin }
              onChange={ handleChange }
              style={ { marginRight: "8px" } }
            />
            Outside Login
          </label>
        </Grid>
        <Grid size={ 3 } sx={ { display: "flex", alignItems: "center" } }>
          <label style={ { fontSize: "0.85rem" } }>
            <input
              type="checkbox"
              name="isWFH"
              checked={ form.isWFH }
              onChange={ handleChange }
              style={ { marginRight: "8px" } }
            />
            Work From Home
          </label>
        </Grid>

        {/* Section: Routing Settings */ }
        <Grid size={ 12 }>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={ {
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
              pb: 0.5,
              mt: 2,
              mb: 1,
            } }
          >
            Workflow Routing (Comma separated emails)
          </Typography>
        </Grid>

        {/* Leave Routing */ }
        <Grid size={ 12 }>
          <Typography variant="caption" sx={ { fontWeight: "bold" } }>
            LEAVE APPLICATIONS
          </Typography>
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="To"
            name="leave_to"
            value={ form.leave_to || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
            placeholder="email1, email2"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="CC"
            name="leave_cc"
            value={ form.leave_cc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="BCC"
            name="leave_bcc"
            value={ form.leave_bcc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>

        {/* Finance Routing */ }
        <Grid size={ 12 } sx={ { mt: 1 } }>
          <Typography variant="caption" sx={ { fontWeight: "bold" } }>
            FINANCE ENQUIRIES
          </Typography>
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="To"
            name="finance_to"
            value={ form.finance_to || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="CC"
            name="finance_cc"
            value={ form.finance_cc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="BCC"
            name="finance_bcc"
            value={ form.finance_bcc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>

        {/* IT Routing */ }
        <Grid size={ 12 } sx={ { mt: 1 } }>
          <Typography variant="caption" sx={ { fontWeight: "bold" } }>
            IT ENQUIRIES
          </Typography>
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="To"
            name="it_to"
            value={ form.it_to || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="CC"
            name="it_cc"
            value={ form.it_cc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={ 4 }>
          <TextField
            label="BCC"
            name="it_bcc"
            value={ form.it_bcc || "" }
            onChange={ handleChange }
            fullWidth
            size="small"
          />
        </Grid>

        <Grid
          size={ 12 }
          sx={ { display: "flex", justifyContent: "flex-end", mt: 3, mb: 4 } }
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Save Employee Configuration
          </Button>
        </Grid>
      </Grid>
    </SideDrawer>
  );
}
