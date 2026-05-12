export default function debugRouter(message){
    return async function (req,res,next){
        console.log(`[debugger]: ${message}`);
        next()
    }
}