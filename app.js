
let express = require("express");
var cors = require('cors');
let app = express();
// Tạo cors
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./routes'));
// Endpoint not found
app.use(function (req, res, next) {
    res.status(404).json({
        code: 404,
        message: 'Endpoint not found'
    });
})
// Xử lí khi lỗi ở phía server
app.use(function (err, req, res, next) {
    res.status(500).json({
        code: 500, error: 'Something went wrong, please try again!'
    })
})

app.listen(process.env.PORT || 4300);
module.exports = app;