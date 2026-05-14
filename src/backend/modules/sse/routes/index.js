import { Router } from "express";
import { auth as authGuard } from "../../auth/guards/index.js";
import eventStream from "../../../core/events.js";

class SSE {
    constructor() {
        // Map<origin, Map<employeeID, Set<res>>>
        this.origins = new Map();
        this.initEventListeners();
    }

    initEventListeners() {
        // Listen for generic broadcasts from the event stream
        eventStream.on("sse.publish", ({ event, data, filters }) => {
            this.publish(event, data, filters);
        });

        // Listen for specific attendance events
        eventStream.on("attendance.clock", (data) => {
            const { employeeID, origin, action, record, serverTime } = data;
            this.publish("attendance_update", {
                action,
                serverTime: serverTime || new Date().toISOString(),
                record
            }, { origin, employeeID });
        });

        // Listen for user status/role changes
        eventStream.on("user.status_change", ({ employeeID, origin, status }) => {
            this.publish("user_status", { status }, { origin, employeeID });
        });

        eventStream.on("user.role_change", ({ employeeID, origin, role }) => {
            this.publish("user_role", { role }, { origin, employeeID });
        });

        // Proactively close connections on logout
        eventStream.on("auth.logout", ({ employeeID, origin }) => {
            const connections = this.origins.get(origin)?.get(employeeID);
            if (connections) {
                for (const client of connections) {
                    client.write(`event: logout\ndata: ${JSON.stringify({ message: "Logged out" })}\n\n`);
                    client.end();
                }
            }
        });
    }

    subscribe(req, res) {
        const { user, origin } = req;
        const employeeID = user.employeeID;

        res.set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no"
        });
        res.flushHeaders?.();

        if (!this.origins.has(origin)) {
            this.origins.set(origin, new Map());
        }
        const users = this.origins.get(origin);
        if (!users.has(employeeID)) {
            users.set(employeeID, new Set());
        }
        const connections = users.get(employeeID);
        connections.add(res);

        // Send initial connection state and server time
        this.sendToClient(res, "connected", {
            connected: true,
            serverTime: new Date().toISOString()
        });

        req.on("close", () => {
            connections.delete(res);
            if (connections.size === 0) {
                users.delete(employeeID);
            }
            if (users.size === 0) {
                this.origins.delete(origin);
            }
            res.end();
        });
    }

    sendToClient(client, event, data) {
        const payload = typeof data === "string" ? data : JSON.stringify(data);
        client.write(`event: ${event}\ndata: ${payload}\n\n`);
    }

    publish(event, data, filters = {}) {
        const { origin, employeeID } = filters;

        if (origin && employeeID) {
            const connections = this.origins.get(origin)?.get(employeeID);
            if (connections) {
                for (const client of connections) {
                    this.sendToClient(client, event, data);
                }
            }
        } else if (origin) {
            const users = this.origins.get(origin);
            if (users) {
                for (const connections of users.values()) {
                    for (const client of connections) {
                        this.sendToClient(client, event, data);
                    }
                }
            }
        } else {
            // Global publish
            for (const users of this.origins.values()) {
                for (const connections of users.values()) {
                    for (const client of connections) {
                        this.sendToClient(client, event, data);
                    }
                }
            }
        }
    }
}

const router = Router();
const sse = new SSE();

// Heartbeat / Time sync interval
setInterval(() => {
    sse.publish("tick", { serverTime: new Date().toISOString() });
}, 1000); // Every second

router.get("/", authGuard, (req, res) => sse.subscribe(req, res));


eventStream.addListener("marked-in", (e) => {
    sse.publish("clock-in", e.attendance, e);
})
eventStream.addListener("marked-out", (e) => {
    sse.publish("clock-out", e.attendance, e);
})
export { sse };
export default router;
