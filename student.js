const API_URL = "http://localhost:3000/api/students";

let editingStudentId = null;


// Load students when page opens
window.onload = function () {
    loadStudents();
};


// Get students from MySQL
function loadStudents() {

    fetch(API_URL)
        .then(response => response.json())
        .then(students => {

            const tableBody =
                document.getElementById("studentTableBody");

            tableBody.innerHTML = "";

            students.forEach(student => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.StudentID}</td>
                    <td>${student.Name}</td>
                    <td>${student.Email}</td>
                    <td>${student.Department}</td>
                    <td>${student.Yeat}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editStudent(
                                ${student.StudentID},
                                '${student.Name}',
                                '${student.Email}',
                                '${student.Department}',
                                ${student.Yeat}
                            )">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteStudent(${student.StudentID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading students:", error);
        });
}


// Add / Update Student
document.getElementById("addStudentBtn")
    .addEventListener("click", function () {

        const name =
            document.getElementById("studentName").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const department =
            document.getElementById("department").value.trim();

        const year =
            document.getElementById("studentYear").value;


        if (name === "" ||
            email === "" ||
            department === "" ||
            year === "") {

            alert("Please fill all fields.");
            return;
        }


        // Convert First Year → 1, Second Year → 2, etc.
        let yearNumber;

        if (year === "First Year") {
            yearNumber = 1;
        }
        else if (year === "Second Year") {
            yearNumber = 2;
        }
        else if (year === "Third Year") {
            yearNumber = 3;
        }
        else if (year === "Fourth Year") {
            yearNumber = 4;
        }


        // UPDATE
        if (editingStudentId !== null) {

            fetch(`${API_URL}/${editingStudentId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Department: department,
                    Yeat: yearNumber
                })

            })
            .then(response => response.json())
            .then(data => {

                if (data.error) {
                    alert(data.error);
                    return;
                }

                alert("Student updated successfully!");

                resetForm();
                loadStudents();

            })
            .catch(error => {

                console.error("Error updating student:", error);
                alert("Failed to update student.");

            });

            return;
        }


        // ADD
        fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Name: name,
                Email: email,
                Department: department,
                Yeat: yearNumber
            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {
                alert(data.error);
                return;
            }

            alert("Student added successfully!");

            resetForm();
            loadStudents();

        })

        .catch(error => {

            console.error("Error adding student:", error);

            alert("Failed to add student.");

        });

    });


// Edit Student
function editStudent(id, name, email, department, year) {

    editingStudentId = id;

    document.getElementById("studentName").value = name;
    document.getElementById("studentEmail").value = email;
    document.getElementById("department").value = department;

    if (year == 1) {
        document.getElementById("studentYear").value = "First Year";
    }
    else if (year == 2) {
        document.getElementById("studentYear").value = "Second Year";
    }
    else if (year == 3) {
        document.getElementById("studentYear").value = "Third Year";
    }
    else if (year == 4) {
        document.getElementById("studentYear").value = "Fourth Year";
    }

    document.getElementById("addStudentBtn").textContent =
        "Update Student";
}


// Delete Student
function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert("Student deleted successfully!");

        loadStudents();

    })
    .catch(error => {

        console.error("Error deleting student:", error);
        alert("Failed to delete student.");

    });
}


// Reset form
function resetForm() {

    editingStudentId = null;

    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("department").value = "";
    document.getElementById("studentYear").value = "";

    document.getElementById("addStudentBtn").textContent =
        "Add Student";
}
