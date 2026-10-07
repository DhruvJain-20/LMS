const API_URL = "http://localhost:3000/api";

let editingTransactionId = null;


// Load all data when page opens
window.onload = function () {
    loadBooks();
    loadStudents();
    loadFaculty();
    loadTransactions();
};


// =============================
// LOAD BOOKS
// =============================

function loadBooks() {

    fetch(`${API_URL}/books`)
        .then(response => response.json())
        .then(books => {

            const bookSelect = document.getElementById("book");

            bookSelect.innerHTML =
                '<option value="">Select Book</option>';

            books.forEach(book => {

                const option = document.createElement("option");

                option.value = book.BookID;

                option.textContent =
                    `${book.Title} - ${book.AuthorName}`;

                bookSelect.appendChild(option);

            });

        })
        .catch(error => {
            console.error("Error loading books:", error);
        });
}


// =============================
// LOAD STUDENTS
// =============================

function loadStudents() {

    fetch(`${API_URL}/students`)
        .then(response => response.json())
        .then(students => {

            const studentSelect =
                document.getElementById("student");

            studentSelect.innerHTML =
                '<option value="">Select Student</option>';

            students.forEach(student => {

                const option = document.createElement("option");

                option.value = student.StudentID;

                option.textContent =
                    `${student.Name} - ${student.Department}`;

                studentSelect.appendChild(option);

            });

        })
        .catch(error => {
            console.error("Error loading students:", error);
        });
}


// =============================
// LOAD FACULTY
// =============================

function loadFaculty() {

    fetch(`${API_URL}/faculty`)
        .then(response => response.json())
        .then(faculty => {

            const facultySelect =
                document.getElementById("faculty");

            facultySelect.innerHTML =
                '<option value="">Select Faculty</option>';

            faculty.forEach(member => {

                const option = document.createElement("option");

                option.value = member.FacultyID;

                option.textContent =
                    `${member.Name} - ${member.Department}`;

                facultySelect.appendChild(option);

            });

        })
        .catch(error => {
            console.error("Error loading faculty:", error);
        });
}


// =============================
// LOAD TRANSACTIONS
// =============================

function loadTransactions() {

    fetch(`${API_URL}/transactions`)
        .then(response => response.json())
        .then(transactions => {

            const tableBody =
                document.getElementById("transactionTableBody");

            tableBody.innerHTML = "";

            transactions.forEach(transaction => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${transaction.IssueID}</td>
                    <td>${transaction.BookTitle}</td>
                    <td>${transaction.StudentName || "-"}</td>
                    <td>${transaction.FacultyName || "-"}</td>
                    <td>${transaction.IssueDate}</td>
                    <td>${transaction.DueDate}</td>
                    <td>${transaction.Fine}</td>

                    <td>
                        <button class="edit-btn"
                            onclick="editTransaction(
                                ${transaction.IssueID},
                                ${transaction.BookID},
                                ${transaction.StudentID || "null"},
                                ${transaction.FacultyID || "null"},
                                '${transaction.IssueDate}',
                                '${transaction.DueDate}',
                                ${transaction.Fine || 0}
                            )">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteTransaction(${transaction.IssueID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading transactions:", error);
        });
}


// =============================
// ISSUE / UPDATE BOOK
// =============================

document.getElementById("issueBookBtn")
    .addEventListener("click", function () {

        const bookID =
            document.getElementById("book").value;

        const borrowerType =
            document.getElementById("borrowerType").value;

        const studentID =
            document.getElementById("student").value;

        const facultyID =
            document.getElementById("faculty").value;

        const issueDate =
            document.getElementById("issueDate").value;

        const dueDate =
            document.getElementById("dueDate").value;

        const fine =
            document.getElementById("fine").value || 0;


        // Basic validation
        if (bookID === "" ||
            borrowerType === "" ||
            issueDate === "" ||
            dueDate === "") {

            alert("Please fill all required fields.");
            return;
        }


        if (borrowerType === "Student" && studentID === "") {

            alert("Please select a student.");
            return;

        }


        if (borrowerType === "Faculty" && facultyID === "") {

            alert("Please select a faculty member.");
            return;

        }


        let selectedStudent = null;
        let selectedFaculty = null;


        if (borrowerType === "Student") {

            selectedStudent = studentID;

        }
        else if (borrowerType === "Faculty") {

            selectedFaculty = facultyID;

        }


        // =============================
        // UPDATE TRANSACTION
        // =============================

        if (editingTransactionId !== null) {

            fetch(`${API_URL}/transactions/${editingTransactionId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    BookID: bookID,
                    StudentID: selectedStudent,
                    FacultyID: selectedFaculty,
                    IssueDate: issueDate,
                    DueDate: dueDate,
                    Fine: fine

                })

            })
            .then(response => response.json())
            .then(data => {

                if (data.error) {
                    alert(data.error);
                    return;
                }

                alert("Transaction updated successfully!");

                resetForm();
                loadTransactions();

            })
            .catch(error => {

                console.error(
                    "Error updating transaction:",
                    error
                );

                alert("Failed to update transaction.");

            });

            return;
        }


        // =============================
        // ADD TRANSACTION
        // =============================

        fetch(`${API_URL}/transactions`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                BookID: bookID,
                StudentID: selectedStudent,
                FacultyID: selectedFaculty,
                IssueDate: issueDate,
                DueDate: dueDate,
                Fine: fine

            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {

                alert(data.error);
                return;

            }

            alert("Book issued successfully!");

            resetForm();
            loadTransactions();

        })

        .catch(error => {

            console.error(
                "Error issuing book:",
                error
            );

            alert("Failed to issue book.");

        });

    });


// =============================
// EDIT TRANSACTION
// =============================

function editTransaction(
    id,
    bookID,
    studentID,
    facultyID,
    issueDate,
    dueDate,
    fine
) {

    editingTransactionId = id;

    document.getElementById("book").value = bookID;

    document.getElementById("issueDate").value = issueDate;
    document.getElementById("dueDate").value = dueDate;
    document.getElementById("fine").value = fine;


    if (studentID !== null) {

        document.getElementById("borrowerType").value = "Student";

        document.getElementById("student").value = studentID;

        document.getElementById("faculty").value = "";

    }
    else {

        document.getElementById("borrowerType").value = "Faculty";

        document.getElementById("faculty").value = facultyID;

        document.getElementById("student").value = "";

    }


    document.getElementById("issueBookBtn").textContent =
        "Update Transaction";
}


// =============================
// DELETE TRANSACTION
// =============================

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }


    fetch(`${API_URL}/transactions/${id}`, {

        method: "DELETE"

    })
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert("Transaction deleted successfully!");

        loadTransactions();

    })
    .catch(error => {

        console.error(
            "Error deleting transaction:",
            error
        );

        alert("Failed to delete transaction.");

    });
}


// =============================
// RESET FORM
// =============================

function resetForm() {

    editingTransactionId = null;

    document.getElementById("book").value = "";
    document.getElementById("borrowerType").value = "";
    document.getElementById("student").value = "";
    document.getElementById("faculty").value = "";
    document.getElementById("issueDate").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("fine").value = "";

    document.getElementById("issueBookBtn").textContent =
        "Issue Book";
}
