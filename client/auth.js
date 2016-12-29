function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = script.onreadystatechange = function () {
            let resolved = false;
            if (!resolved && (!this.readyState || this.readyState == 'complete')) {
                resolved = true;
                resolve();
            }
        };
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(script);
    });
}

function authorizeOnTrello() {
    return new Promise((resolve, reject) => {
        console.log("Authenticating on Trello...");
        Trello.authorize({
            type: "popup",
            scope: { read: true, write: true },
            expiration: "never",
            name: "schedule-board",
            persist: false,
            success: () => {
                if (Trello.authorized()) {
                    console.log("Successfully authenticated on Trello.");
                    resolve(Trello.token());
                } else {
                    console.log("Unable to authorize on Trello.")
                    reject();
                }
            },
            error: () => {
                console.log("Authorization failed.");
                reject();
            }
        });
    });
}

// TODO wrap fetch in a function that enables sending/receiving cookies and resolving/rejecting promises based on
// status code.

function reportTokenToServer(token) {
    console.log("Reporting authentication token to the server...");

    return fetch('/api/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({token: token})
    });
}

export default {

    status: () => 
        fetch("/api/authentication-status", {
            credentials: "same-origin",
        })
        .then(_ => _.json()),

    authenticate: key => loadScript("https://trello.com/1/client.js?key=" + key)
        .then(authorizeOnTrello)
        .then(reportTokenToServer)
}