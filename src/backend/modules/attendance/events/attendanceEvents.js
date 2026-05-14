import eventStream from "../../../core/events";

eventStream.addListener("marked-in",(e)=>{
    console.log(e);
})