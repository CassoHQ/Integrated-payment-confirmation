const api = require('./api');
module.exports = {
    getTokenByAPIKey: async (code) => {
            let token = await api.post('/token', { code: code });
        return token;
    }
}
