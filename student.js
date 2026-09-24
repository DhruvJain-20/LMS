const API_URL = "http://localhost:3000/api/students";


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
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading students:", error);
        });
}


// Add Student
document.getElementById("addStudentBtn")
    .addEventListener("click", function () {

        const name =
            document.getElementById("studentName").value;

        const email =
            document.getElementById("studentEmail").value;

        const department =
            document.getElementById("department").value;

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

            document.getElementById("studentName").value = "";
            document.getElementById("studentEmail").value = "";
            document.getElementById("department").value = "";
            document.getElementById("studentYear").value = "";

            loadStudents();

        })

        .catch(error => {

            console.error("Error adding student:", error);

            alert("Failed to add student.");

        });

    });
