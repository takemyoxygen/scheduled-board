const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports = {
    run: () => {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
        request.post({
                url: config.host + "/api/scheduled-cards/create",
                headers: {
                    "secret-code": config.secretAuthCode
                }
            },
            (error, response, body) => {
                if (error) console.error(error);
                else console.log(`Created ${JSON.parse(body).count} card(s)`);
            });
    }
};