// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Dhruv@1406",
//     database: "LibraryManagementSystem"
// });

// db.connect((err) => {

//     if (err) {
//         console.log("MySQL connection failed:");
//         console.log(err.message);
//     }
//     else {
//         console.log("MySQL connected successfully!");
//     }

// });

// module.exports = db;
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
