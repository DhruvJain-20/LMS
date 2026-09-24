const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dhruv@1406",
    database: "LibraryManagementSystem"
});

db.connect((err) => {

    if (err) {
        console.log("MySQL connection failed:");
        console.log(err.message);
    }
    else {
        console.log("MySQL connected successfully!");
    }

});

module.exports = db;
