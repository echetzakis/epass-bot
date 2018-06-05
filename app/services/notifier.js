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
    const balanceAsMoney = results.balance.toString().replace('.', ',') + '€';
    const color = { red: '#E74C3C', green: '#27AE60', yellow: '#F4D03F', orange: '#E67E22', unknown: '#85929E' };
    const json = {
        "username": "Αττική Οδός",
        "icon_url": "http://media.interactive.netuse.gr/pegasus/Multimedia/png/logo_aodos_id5911144.png",
        "attachments": [
            {
                "fallback": `Ενημέρωση Υπολοίπου: \n Nέο υπόλοιπο: ${balanceAsMoney} \n Τελευταία Ενημέρωση: ${results.last_update}`,
                "color": color[results.level],
                // "pretext": "--------------------",
                "author_name": "Αττική Οδός",
                "author_link": "http://www.aodos.gr/",
                // "author_icon": "http://media.interactive.netuse.gr/pegasus/Multimedia/png/logo_aodos_id5911144.png",
                "title": "Ενημέρωση Υπολοίπου",
                "text": `Για τον _${results.package}_ λογαριασμό _${results.account}_`,
                "fields": [
                    {
                        "title": "Νέο υπόλοιπο",
                        "value": balanceAsMoney,
                        "short": true
                    },
                    {
                        "title": "Τελευταία Ενημέρωση",
                        "value": results.last_update,
                        "short": true
                    }
                ]
            }
        ]
    };
    if ('remaining_trips' in results) {
        json.attachments[0].fields.push({
            "title": "Διαδρομές που απομένουν",
            "value": results.remaining_trips,
            "short": true
        });
    }
    return JSON.stringify(json);
}

module.exports = { notify };
