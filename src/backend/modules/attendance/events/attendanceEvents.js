import eventStream from "../../../core/events";
import fs from "fs";
eventStream.addListener("marked-out",d=>{
    console.log(d);
})
eventStream.addListener("marked-in",(e)=>{
    fs.writeFileSync("/app/core/test",JSON.stringify({date:new Date()}),"utf-8")
})
console.log(eventStream)