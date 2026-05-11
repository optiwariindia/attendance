import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import pureIP from "express-pureip";
import cookieParser from "cookie-parser";
import fs from "fs";
import { ExpressServer } from "express-web-tools";

import moduleRouter from "../modules/index.js";

const currentDir = process.env.PWD
const publicDir = currentDir + "/public";

(async () => {
    try {
        checkEnvironment(["PORT", "DB", "JWT_SECRET", "PWD"])
        createDirIfNotExist(publicDir);
        await mongoose.connect(process.env.DB);
        const app = new ExpressServer();
        app.addMiddleware([
            express.static(publicDir),
            cookieParser(),
            cors({}),
            express.json(),
            express.urlencoded({
                extended: true
            }),
            pureIP,
            setOrigin,
            moduleRouter,
            errorRoute,
            fallbackRoute
        ])
        app.start(process.env.PORT)
    } catch (error) {
        console.log(`[error] ${error.message}`)
    }
})();
function checkEnvironment(env = ["PORT", "DB"]) {
    let missingVariables = env.filter(e => !(e in process.env));
    if (missingVariables.length > 0) {
        throw new Error(`Missing environment varialbe${missingVariables.length > 1 ? "s:" : ":"} ${missingVariables.join(",")}`)
    }
}
function createDirIfNotExist(dirPath) {
    if (fs.existsSync(dirPath)) return;
    fs.mkdirSync(dirPath, { recursive: true });
}
function setOrigin(req, res, next) {
    req.origin = req.headers.host //todo: if header has origin or referer keep referer domain as origin, otherwise set header.host as origin.
    next();
}
function errorRoute(error, req, res, next) {
    const { code, message } = error;
    return res.status(code ?? 400).json({
        status: "error",
        message
    })
}
function fallbackRoute(req, res) {
    if (!fs.existsSync(`${publicDir}/index.html`)) {
        fs.writeFileSync(`${publicDir}/index.html`, "", "utf-8");
    }
    return res.sendFile(`${publicDir}/index.html`);
}