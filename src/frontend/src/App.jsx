import React from "react";
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import { useUser } from "./shared/context/User";
import * as Modules from "./modules";
import * as Shared from "./shared";
import { ThemeProvider } from "@mui/material/styles";
// import { User, Login, MemberZone } from "./pages";

import { createTheme } from "@mui/material/styles";
import { Toast } from "./shared/components";


const theme = createTheme({
  palette: {
    primary: {
      main: "#0c5adb",
    },
    secondary: {
      main: "#063686",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '[role="presentation"].MuiPopover-root': {
          zIndex: 15000,
        },
      },
    },
  },
  defaultProps: {
    arrow: true,
    enterTouchDelay: 10,
    leaveTouchDelay: 3000,
    PopperProps: {
      modifiers: [
        {
          name: "zIndex",
          enabled: true,
          phase: "write",
          fn: ({ state }) => {
            state.styles.popper.zIndex = 9999;
          },
        },
      ],
    },
  },
});

export default function App() {
  const user = useUser();
  return (
    <ThemeProvider theme={ theme }>
      <BrowserRouter>
        { user.isLoading ? <>Loading</> : <RouteList user={ user } /> }
        <Toast />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RouteList({ user }) {
  const loginStatus = user.isLoggedIn;
  console.log({ loginStatus, user });
  return useRoutes([
    {
      path: "/",
      element: loginStatus ? (
        <Navigate to="/user" />
      ) : (
        <Modules.Auth.Page.Login />
      ),
    },
    {
      path: "/user",
      element: loginStatus ? <Shared.Layout.Member /> : <Navigate to="/" />,
      children: [
        {
          path: "/user",
          element: <Modules.Attendance.Component.Dashboard />,
        },
        {
          path: "/user/attendance",
          element: <Modules.Attendance.Component.List />,
        },
        {
          path: "/user/leave",
          element: <Modules.Leave.Page.Home />,
        },
        {
          path: "/user/settings",
          element: <Modules.Settings.Page.Home />,
        },
      ],
    },
    {
      path: "/admin",
      element: loginStatus ? <Shared.Layout.Member /> : <Navigate to="/" />,
      children: [
        {
          path: "/admin/user",
          element: <Modules.Auth.Page.Home />,
        },
        {
          path: "/admin/settings",
          element: <Modules.Settings.Page.Home />,
        },
        {
          path: "/admin/attendance",
          element: <Modules.Attendance.Component.List title="Attendance Record" user="all" />,
        },
      ],
    },
    {
      path:"*",
      element:<Navigate to="/"/>
    }
    /*
    {
      children: [
        {
          path: "/user/",
          element: <Navigate to="/user/dashboard" />,
        },
        {
          path: "/user/dashboard",
          element: <User.Dashboard />,
        },
        {
          path: "/user/attendance",
          element: <User.Attendance />,
        },
        {
          path: "/user/leave",
          element: <User.Leave />,
        },
      ],
    },
    {
      path: "/admin",
      element: <MemberZone />,
      children: [
        {
          path: "/admin/dashboard",
          element: <User.AdminDashboard />,
        }, {
          path: "/admin/user",
          element: <User.User />,
        },
        {
          path: "/admin/report",
          element: <User.Report />,
        },
        {
          path: "/admin/attendance-crud",
          element: <User.Clockins />,
        },
        {
          path: "/admin/check-marks",
          element: <User.CheckMarks />,
        },
        {
          path: "/admin/leave",
          element: <User.ManageLeave />,
        },
        {
          path: "/admin/settings",
          element: <User.Settings />,
        },
      ],
    },//*/
  ]);
  //*/
}
