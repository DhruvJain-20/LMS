const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Library Management System Backend is Running");
});

// GET all authors
app.get("/api/authors", (req, res) => {

    const sql = "SELECT * FROM Author";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch authors"
            });
        }

        res.json(results);
    });

});
// ADD author
app.post("/api/authors", (req, res) => {

    const { Name, Email } = req.body;

    if (!Name || !Email) {
        return res.status(400).json({
            error: "Name and Email are required"
        });
    }

    const sql = "INSERT INTO Author (Name, Email) VALUES (?, ?)";

    db.query(sql, [Name, Email], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to add author"
            });
        }

        res.json({
            message: "Author added successfully",
            AuthorID: result.insertId
        });

    });

});

app.get("/api/publishers", (req, res) => {

    const sql = "SELECT * FROM Publisher";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch publishers"
            });
        }

        res.json(results);
    });

});

app.post("/api/publishers", (req, res) => {

    const { Name, Email } = req.body;

    if (!Name || !Email) {
        return res.status(400).json({
            error: "Name and Email are required"
        });
    }

    const sql = "INSERT INTO Publisher (Name, Email) VALUES (?, ?)";

    db.query(sql, [Name, Email], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to add publisher"
            });
        }

        res.json({
            message: "Publisher added successfully",
            PublisherID: result.insertId
        });

    });

});

app.get("/api/books", (req, res) => {

    const sql = `
        SELECT
            Book.BookID,
            Book.Title,
            Author.Name AS AuthorName,
            Publisher.Name AS PublisherName
        FROM Book
        JOIN Author
            ON Book.AuthorID = Author.AuthorID
        JOIN Publisher
            ON Book.PublisherID = Publisher.PublisherID
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch books"
            });

        }

        res.json(results);

    });

});

app.post("/api/books", (req, res) => {

    const { Title, AuthorID, PublisherID } = req.body;

    if (!Title || !AuthorID || !PublisherID) {

        return res.status(400).json({
            error: "Title, Author and Publisher are required"
        });

    }

    const sql = `
        INSERT INTO Book
        (Title, AuthorID, PublisherID)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [Title, AuthorID, PublisherID],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to add book"
                });

            }

            res.json({
                message: "Book added successfully",
                BookID: result.insertId
            });

        }
    );

});

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM Student";

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch students"
            });

        }

        res.json(results);

    });

});

app.post("/api/students", (req, res) => {

    const { Name, Email, Department, Yeat } = req.body;

    if (!Name || !Email || !Department || !Yeat) {

        return res.status(400).json({
            error: "All fields are required"
        });

    }

    const sql = `
        INSERT INTO Student
        (Name, Email, Department, Yeat)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [Name, Email, Department, Yeat],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to add student"
                });

            }

            res.json({
                message: "Student added successfully",
                StudentID: result.insertId
            });

        }
    );

});

app.get("/api/faculty", (req, res) => {

    const sql = "SELECT * FROM Faculty";

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch faculty"
            });

        }

        res.json(results);

    });

});

app.post("/api/faculty", (req, res) => {

    const { Name, Email, Department } = req.body;

    if (!Name || !Email || !Department) {

        return res.status(400).json({
            error: "All fields are required"
        });

    }

    const sql = `
        INSERT INTO Faculty
        (Name, Email, Department)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [Name, Email, Department],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to add faculty"
                });

            }

            res.json({
                message: "Faculty added successfully",
                FacultyID: result.insertId
            });

        }
    );

});

app.get("/api/transactions", (req, res) => {

    const sql = `
        SELECT
            IT.IssueID,
            B.Title AS BookTitle,
            S.Name AS StudentName,
            F.Name AS FacultyName,
            IT.IssueDate,
            IT.DueDate,
            IT.Fine
        FROM Issue_Transaction IT

        JOIN Book B
            ON IT.BookID = B.BookID

        LEFT JOIN Student S
            ON IT.StudentID = S.StudentID

        LEFT JOIN Faculty F
            ON IT.FacultyID = F.FacultyID

        ORDER BY IT.IssueID;
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch transactions"
            });

        }

        res.json(results);

    });

});

app.post("/api/transactions", (req, res) => {

    const {
        BookID,
        StudentID,
        FacultyID,
        IssueDate,
        DueDate,
        Fine
    } = req.body;


    if (!BookID ||
        !IssueDate ||
        !DueDate) {

        return res.status(400).json({
            error: "Book, Issue Date and Due Date are required"
        });

    }


    // Exactly one borrower must be selected

    if (!StudentID && !FacultyID) {

        return res.status(400).json({
            error: "Please select a student or faculty member"
        });

    }


    if (StudentID && FacultyID) {

        return res.status(400).json({
            error: "Select either Student or Faculty, not both"
        });

    }


    const sql = `
        INSERT INTO Issue_Transaction
        (BookID, StudentID, FacultyID, IssueDate, DueDate, Fine)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            BookID,
            StudentID || null,
            FacultyID || null,
            IssueDate,
            DueDate,
            Fine || 0
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to create transaction"
                });

            }


            res.json({

                message: "Book issued successfully",

                IssueID: result.insertId

            });

        }
    );

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
