const store = require('./store');
const notifier = require('./notifier');
const scrapper = require('./scrapper');

async function process() {
    const subscriptions = await store.findAll();
    //{user, password, webhook, balance: 0, at: null };
    const updates = [];
    subscriptions.forEach(subscription => {
        updates.push(
            scrapper(subscription.user, subscription.password)
                .then(result => {
                    if (result && result.status === 'success') {
                        console.info('...Scraped');
                        const notify = subscription.balance !== result.balance;
                        subscription.balance = result.balance;
                        subscription.at = new Date();
                        return store.save(subscription.user, subscription).then(() => {
                            console.info('....Stored');
                            if (notify) {
                                return notifier.notify(subscription.webhook, result).then(() => {
                                    console.info('.....Notified');
                                    return true;
                                });
                            }
                            console.info('.....No change');
                            return true;
                        });
                    }
                    console.info('...Failure');
                    return false;
                }).catch(error => console.log(error))
        );
    });

    return Promise.all(updates);
}

module.exports = { process };
