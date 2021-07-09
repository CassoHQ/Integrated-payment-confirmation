const api = require('./api');
module.exports = {
    getDetailUser: async (accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.get(`/userInfo`);
        return res;
    },
}
