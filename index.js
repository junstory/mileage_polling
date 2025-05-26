//const polling = require('./src/polling');
const startSocketConnection = require('./src/socket/index.contracts');
const { sequelize } = require('./src/models');
const {createSchema} = require('./src/config/db');

// async function startPolling() {
//     console.log("Starting polling...");
//     console.log("Starting polling...");
//     let isRunning = false;

//     setInterval(async () => {
//     if (isRunning) return;
//     isRunning = true;

//     try {
//         await polling();
//     } catch (err) {
//         console.error("Polling error:", err);
//     }

//     isRunning = false;
//     }, 3*1000);
// };

(async () => {
    try {
        await createSchema();
        await sequelize.sync({alter:true});
        
        console.log("DB schema created successfully.");
    } catch (error) {
        console.error("Error creating DB schema:", error);
    }
})();


//startPolling();
startSocketConnection();


