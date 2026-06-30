import { mail } from "./utils/index.js";
import eventStream from "/app/core/events.js";
import twig from "twig";

function loadEmailTemplate(path, data) {
    return new Promise(
        (resolve, reject) => {
            twig.renderFile(path, data, (error, response) => {
                if (error) return reject(error);
                resolve(response)
            })
        }
    )
}
eventStream.addListener("marked-in", async (e) => {
    try {
        if (!("name" in (e._doc ?? e))) return;
        let resp = await loadEmailTemplate(
            "/app/modules/email/templates/toHR/clock/in.twig",
            {
                user: e._doc ?? e, attendance: e.attendance
            }
        )
        await mail.send(
            "support@frequentresearch.com", "om.tiwari@frequentresearch.com", `[${e?._doc?.employeeID}] ${e?._doc?.name?.first} ${e?._doc?.name?.last} : Clock-In`, { html: resp }
        )
    } catch (error) {
        console.log(error)
    }
})
eventStream.addListener("marked-out", async (e) => {
    try {
        if (!("name" in (e._doc ?? e))) return;
        let resp = await loadEmailTemplate(
            "/app/modules/email/templates/toHR/clock/out.twig",
            {
                user: e._doc ?? e, attendance: e.attendance
            }
        )
        await mail.send(
            "support@frequentresearch.com", "om.tiwari@frequentresearch.com", `[${e?._doc?.employeeID}] ${e?._doc?.name?.first} ${e?._doc?.name?.last} : Clock-Out`, { html: resp }
        )
    } catch (error) {
        console.log(error)
    }
})