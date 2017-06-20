export function loadAll()  {
    return fetch('/api/scheduled-cards/mine', {credentials: "same-origin"}).then(_ => _.json());
}
