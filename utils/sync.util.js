const api = require('./api');
module.exports = {
    syncTransaction: async (bankNumber, accessToken) => {
        console.log(bankNumber);
        api.defaults.headers.Authorization = accessToken;
        let res = await api.post('/sync', { bank_acc_id: bankNumber });
        return res;
    }
}
