const puppeteer = require('puppeteer')
    , lo = require('lodash')
    , url = 'https://cs.attiki-odos.gr/';

function level(balance) {
    let level = 'unknown';
    const intPart = balance.toFixed();
    if (intPart > 19) {
        level = 'green';
    } else if (intPart > 9) {
        level = 'yellow';
    } else if (intPart > 3) {
        level = 'orange';
    } else {
        level = 'red';
    }
    return level;
}

module.exports = async function (userName, password) {
    let results = { 'status': 'failure' };
    if (lo.isNil(userName) || lo.isNil(password)) {
        results.message = 'Missing credentials';
        return results;
    }
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1024, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitFor('input[name="login"]');
    await page.type('input[name="login"]', userName);
    await page.type('input[name="password"]', password);
    await page.click('input[name="submit"]');
    await page.waitForSelector('span.alert-ok>a');
    await page.click('span.alert-ok>a');
    await page.waitForSelector('span.account-status-inline');
    results = await page.$$eval('span.account-status-inline>b', details => {
        return {
            status: 'success',
            account: details[0].innerText,
            balance: details[1].innerText,
            last_update: details[2].innerText,
            package: details[3].innerText
        };
    });
    if ('balance' in results) {
        let balance = results.balance.replace(',', '.');
        if (!isNaN(balance)) {
            results.balance = Number.parseFloat(balance);
            results.level = level(results.balance);
            if (results.package === 'EXPRESS') {
                results.remaining_trips = Math.floor(results.balance / 2.55);
            }
        }
    }
    await browser.close();
    return results;
};

