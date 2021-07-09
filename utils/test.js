let test = require('./webhook.util');
(async () => {
    
 console.log(test.parseOrderId(true,'DH','dh523145'));
    
// let awaita  = await test.create({  "webhook": "https://ten-mien-cua-ban.com/wc/handler-bank-transfer.php",
// "secure_token": "@123#abc",
// "income_only": true},'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTQwIiwiZXhwIjoxNjI1ODU3OTM5LCJpYXQiOjE2MjU4MzYzMzl9.J_OzYun-RWeDk9GIJEcXxpCgRCzl-cOEhfBP8Mu63TNhSL0F5V9Kr3bgUMW8DPPQTyOlCtDurkNPQnElb-P1Cw')
// console.log(awaita);
})()