import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components"
// import { UserProvider } from "../context";

// export { default as Login } from "./visitor/Login";
// export * as User from "./user";

export default function MemberZone() {

    return (<>
        <Header />
        <Sidebar>
            <Outlet />
        </Sidebar>
    </>)
}