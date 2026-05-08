import React from "react";
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import { useUser } from "./shared/context/User";
import * as Modules from "./modules";
// import { User, Login, MemberZone } from "./pages";

export default function App() {
  const user = useUser()
  return (
    <BrowserRouter>
      { user.isLoading ? <>Loading</> : <RouteList user={ user } /> }
    </BrowserRouter>
  );
}

function RouteList({ user }) {
  const loginStatus = user.isLoggedIn;
  // return (user.isLoggedIn)
  //     ? <>User Login hai</>
  //     : <>Abhi login nahi hai</>
  /*
const [loginStatus, setLoginStatus] = React.useState(false);
React.useEffect(() => {
    let token = localStorage.getItem("token");
    setLoginStatus(Boolean(token))
}, [])
//*/
  return useRoutes([
    {
      path: "/",
      element: loginStatus ? <Navigate to="/user" /> : <Modules.Auth.Page.Login />,
    },
    /*
    {
      path: "/user",
      element: <MemberZone />,
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
