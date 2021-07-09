var express = require('express');
var router = express.Router();
let webhookUtil = require('../utils/webhook.util');
let getTokenUtil = require('../utils/get_token.util');
let syncUtil = require('../utils/sync.util');
let userUtil = require('../utils/get_user_info.util');
const monent = require('moment');
//DEMO Xây dựng webhook của bạn
//Router này sẽ là webhook nhận thông tin giao dịch từ casso gọi qua được bảo mật bằng secure_token trong header
// ============
//Tùy theo ứng dụng của bạn mà có thể thay đổi, ở đây mình mặc định một vài thông số
//Tiền tố giao dịch
const transaction_prefix = 'CASSO';
// Phân biệt chữ hoa/thường trong tiền tố giao dịch
const case_insensitive = false;
//Hạn của đơn hàng là 3 ngày. Quá 3 ngày thì không xử lý
const expiration_date = 3;
// API KEY lấy từ casso
const api_key = '45e40320-e0b7-11eb-a12c-35cc867f21a0'
// secure_token đăng kí khi tạo webhook
const secure_token = 'R5G4cbnN7uSAwfTd'
router.route('/webhook/handler-bank-transfer')
    .post(async (req, res, next) => {
        try {
            // B1: Ở đây mình sẽ thực hiện check secure-token. Bình thường phần này sẽ nằm trong middlewares
            // Mình sẽ code trực tiếp tại đây cho dễ hình dung luồng. Nếu không có secure-token hoặc sai đều trả về lỗi
            if (!req.header('secure-token') || req.header('secure-token') != secure_token) {
                return res.status(401).json({
                    code: 401,
                    message: 'Missing secure-token or wrong secure-token'
                })
            }
            // B2: Thực hiện lấy thông tin giao dịch 
            for (let item of req.body.data) {
                // Lấy thông orderId từ nội dung giao dịch
                let orderId = webhookUtil.parseOrderId(case_insensitive, transaction_prefix, item.description);
                // Nếu không có orderId phù hợp từ nội dung ra next giao dịch tiếp theo
                if (!orderId) continue;
                // Kiểm tra giao dịch còn hạn hay không? Nếu không qua giao dịch tiếp theo
                if ((((new Date()).getTime() - (new Date(item.when)).getTime()) / 86400000) >= expiration_date) continue;

                console.log(orderId);
                // Bước quan trọng đây.
                // Sau khi có orderId Thì thực hiện thay đổi các trang thái giao dịch
                // Ví dụ như kiểm tra orderId có tồn tại trong danh sách các đơn hàng của bạn?
                // Sau đó cập nhật trạng thái theo orderId và amount nhận được: đủ hay thiếu tiền...
                // Và một số chức năng khác có thể tùy biến
            }
            return res.status(200).json({
                code: 200,
                message: 'success',
                data: null
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    })

// Router này sẽ thực hiện tính năng đồng bộ giao dịch tức thì.
// Ví dụ: Khi người dùng chuyển khoản cho bạn và họ ấn nút tôi đã thanh toán thì nên xử lí gọi qua casso đề đồng bộ giao dịch vừa chuyển khoản
router.route('/users-paid')
    .post(async (req, res, next) => {
        try {
            console.log(req.body);
            // Để thực hiện tính năng đồng bộ cần có Số tài khoản, Bạn có thể validate bằng schema ở middlewares
            // Hoặc có thể kiểm tra trong đây luôn
            if (!req.body.accountNumber) {
                return res.status(404).json({
                    code: 404,
                    message: 'Not foung Account number'
                })
            }
            //Lấy token bằng hàm lấy token. Token có hạn 6h nên bạn có thể lưu lại khi nào hết thì gọi hàm lấy token lại
            let resToken = await getTokenUtil.getTokenByAPIKey(api_key);
            console.log(resToken);
            let accessToken = resToken.access_token;
            //Tiến hành gọi hàm đồng bộ qua casso
            await syncUtil.syncTransaction(req.body.accountNumber, accessToken);
            return res.status(200).json({
                code: 200,
                message: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }

    })
// Route này sẽ thực hiện đăng kí webhook dựa vào API KEY và lấy thông tin về business và banks
router.route('/register-webhook')
    .post(async (req, res, next) => {
        try {
            // Lấy token bằng hàm lấy token. Token có hạn 6h nên bạn có thể lưu lại khi nào hết thì gọi hàm lấy token lại
            // api_key có thể thay thế nhận từ nhiều user
            let resToken = await getTokenUtil.getTokenByAPIKey(api_key);
            let accessToken = resToken.access_token;
            //Delete Toàn bộ webhook đã đăng kí trước đó với https://ten-mien-cua-ban.com/webhook/handler-bank-transfer
            await webhookUtil.deleteWebhookByUrl('https://ten-mien-cua-ban.com/webhook/handler-bank-transfer', accessToken);
            //Tiến hành tạo webhook
            let data = {
                webhook: 'https://ten-mien-cua-ban.com/webhook/handler-bank-transfer',
                secure_token: secure_token,
                income_only: true
            }
            let newWebhook = await webhookUtil.create(data, accessToken);
            // Lấy thông tin về userInfo
            let userInfo = await userUtil.getDetailUser(accessToken);
            return res.status(200).json({
                code: 200,
                message: 'success',
                data: {
                    webhook: newWebhook.data,
                    userInfo: userInfo.data
                }
            })
        } catch (error) {
            next(error)
        }
    })

module.exports = router;