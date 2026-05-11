import React, { createContext, useContext, useEffect } from "react"
import { useLocation } from "react-router-dom";

import { api, eventStream } from "../utils";

const UserContext = createContext();

export function UserProvider({
    children
}) {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    async function logout() {
        try {
            setIsLoading(true);
            let resp = await api.delete(`/api/v1/auth/me`, {});
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
            let resp = await api.patch(`/api/v1/auth/me`, info);
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
            let resp = await api.get(`/api/v1/auth/me`);
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

    // Manage SSE Connection Lifecycle
    useEffect(() => {
        if (user) {
            eventStream.connect();

            const handleLogoutEvent = () => {
                console.log("Received logout event from server");
                setUser(null);
            };
            
            eventStream.addEventListener('logout', handleLogoutEvent);

            return () => {
                eventStream.removeEventListener('logout', handleLogoutEvent);
                eventStream.disconnect();
            };
        } else {
            eventStream.disconnect();
        }
    }, [user]);

    const me = {
        ...user,
        isLoading,
        logout,
        update,
        reload,
        isLoggedIn: Boolean(user),
        addEventListener: (type, cb) => eventStream.addEventListener(type, cb),
        removeEventListener: (type, cb) => eventStream.removeEventListener(type, cb),
        getServerTime: () => eventStream.time
    }
    return <UserContext.Provider value={ me }>{ children }</UserContext.Provider>
}

export function useUser() {
    return useContext(UserContext);
}