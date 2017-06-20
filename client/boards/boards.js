export function load(){
    return fetch('/api/boards', {credentials: "same-origin"}).then(_ => _.json());
}