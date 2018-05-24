const store = require('./store');

function subscribe(user, password, webhook ) {
    // v1 store in data-store
    const data = {user, password, webhook, balance: 0, at: null };
    return store.save(user, data);
    //TODO: 
    // v2 verify, before storing
}

async function unsubscribe(user) {

}

module.exports = { subscribe, unsubscribe };
