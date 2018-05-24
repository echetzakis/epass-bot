const rp = require('request-promise-native');

async function notify(url, results) {
    const body = message(results);
    // console.log(body);
    const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url,
        body
    };
    const response = await rp(options);
    return response;
}

function message(results) {
    const color = {red: '#E74C3C', green: '#27AE60', yellow:'#F4D03F', orange: '#E67E22', unknown: '#85929E'};
    return JSON.stringify({
        "username": "Αττική Οδός",
        "icon_url": "http://media.interactive.netuse.gr/pegasus/Multimedia/png/logo_aodos_id5911144.png",
        "attachments": [
            {
                "fallback": `Ενημέρωση Υπολοίπου: \n Nεο υπόλοιπο: ${results.balance} \n Τελευταία Ενημερωση: ${results.last_update}`,
                "color": color[results.level],
                // "pretext": "--------------------",
                "author_name": "Αττική Οδός",
                "author_link": "http://www.aodos.gr/",
                // "author_icon": "http://media.interactive.netuse.gr/pegasus/Multimedia/png/logo_aodos_id5911144.png",
                // "title": "Ενημέρωση Υπολοίπου",
                "text": "Ενημέρωση Υπολοίπου",
                "fields": [
                    {
                        "title": "Νεο υπόλοιπο",
                        "value": results.balance.toString().replace('.', ',') + '€',
                        "short": true
                    },
                    {
                        "title": "Τελευταία Ενημερωση",
                        "value": results.last_update,
                        "short": true
                    }
                ]
            }
        ]
    });
}

module.exports = { notify };
