import Mail from "./Mail.js";
import fs from "fs";
let creds = JSON.parse(fs.readFileSync("/app/creds/email.json", "utf-8"));

let mail = new Mail(creds)
export { mail };