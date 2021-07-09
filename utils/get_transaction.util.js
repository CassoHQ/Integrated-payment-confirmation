const api = require('./api');
module.exports = {
    getTransactions: async (params, accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.get('/transactions', { params });
        return res;
    },
    getDetailTransaction: async (transactionId, accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.get(`/transactions/${transactionId}`);
        return res;
    },
}
