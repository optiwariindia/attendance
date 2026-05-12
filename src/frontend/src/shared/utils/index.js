export { default as api, API } from "./Api";
export { eventStream } from "./EventStream";

export function loadData(
    promise,
    callback,
    finalCallback
) {
    promise.then(resp => {
        callback(resp);
    }).catch(error => {
        console.log(error);
    }).finally(() => {
        if (finalCallback) finalCallback()
    })
}