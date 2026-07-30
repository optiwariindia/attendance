import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as Shared from "./shared";
// import PositionedSnackbar from "./componentsATD/Toast";

let rootElement = document.getElementById("root");
if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
}
const root = ReactDOM.createRoot(rootElement);
root.render(
    <>
        <ContextProvider>
            <App />
        </ContextProvider>
        <Shared.Components.Toast />
    </>
);
function ContextProvider({ children }) {
    return <>
        <Shared.Context.Query.QueryProvider>
            <Shared.Context.User.UserProvider>
                { children }
            </Shared.Context.User.UserProvider>
        </Shared.Context.Query.QueryProvider>
    </>
}