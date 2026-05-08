import React, { createContext, useContext } from "react"
import { useLocation } from "react-router-dom";

import { api } from "../utils";

const UserContext = createContext();

export function UserProvider({
    children
}) {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    async function logout() {
        try {
            setIsLoading(true);
            let resp = await api.delete(`/api/v1/me`, {});
            if ("status" in resp && resp.status === "error") {
                console.log(resp.message);
                return;
            }
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    async function update(info) {
        try {
            setIsLoading(true);
            let resp = await api.patch(`/api/v1/me`, info);
            if ("status" in resp && resp.status === "error") {
                console.log(resp.message);
                return;
            }
            await reload();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    async function reload() {
        try {
            setIsLoading(true);
            let resp = await api.get(`/api/v1/me`);
            if ("data" in resp) {
                setUser(resp.data);
            }
            if ("message" in resp && resp.message === "Token Expired") {
                setUser(null);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    React.useEffect(() => {
        reload();
    }, [])
    const me = {
        ...user,
        isLoading,
        logout,
        update,
        reload,
        isLogedIn: Boolean(user)
    }
    return <UserContext.Provider value={ me }>{ children }</UserContext.Provider>
}

export function useUser() {
    return useContext(UserContext);
}