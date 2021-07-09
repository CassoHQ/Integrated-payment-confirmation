require('dotenv').config({ path: '.env' });
let app = require('./app');
async function main() {
    app
    console.log(`Server on port ${process.env.PORT || 4300}`);
};
main();
