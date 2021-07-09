const api = require('./api');
module.exports = {
    create: async (data, accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.post('/webhooks', data);
        return res;
    },
    getDetailWebhookById: async (webhookId, accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.get(`/webhooks/${webhookId}`);
        return res;
    },
    updateWebhookById: async (webhookId, accessToken, data) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.put(`/webhooks/${webhookId}`, data);
        return res;
    },
    deleteWebhookById: async (webhookId, accessToken) => {
        api.defaults.headers.Authorization = accessToken;
        let res = await api.delete(`/webhooks/${webhookId}`);
        return res;
    },
    deleteWebhookByUrl: async (urlWebhook, accessToken) => {
        // Thêm url vào query để delete https://oauth.casso.vn/v1/webhooks?webhook=https://website-cua-ban.com/api/webhook
        let query = { params: { webhook: urlWebhook } };
        api.defaults.headers.Authorization = accessToken;
        var res = await api.delete(`/webhooks`, query);
        return res;
    },
    parseOrderId: (caseInsensitive, transactionPrefix, description) => {
        // Ở đây mình ở sử dụng regex để parse nội dung chuyển khoản có chứa orderId
        // CASSO101 => orderId = 101
        let re = new RegExp(transactionPrefix);
        if (!caseInsensitive)
            re = new RegExp(transactionPrefix, 'i');
        let matchPrefix = description.match(re);
        // Không tồn tại tiền tố giao dịch
        if (!matchPrefix) return null;
        let orderId = parseInt(description.substring(transactionPrefix.length, description.length));
        return orderId;
    }
}