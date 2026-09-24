const API_URL = "http://localhost:3000/api/faculty";


// Load faculty when page opens
window.onload = function () {
    loadFaculty();
};


// Get faculty from MySQL
function loadFaculty() {

    fetch(API_URL)
        .then(response => response.json())
        .then(faculty => {

            const tableBody =
                document.getElementById("facultyTableBody");

            tableBody.innerHTML = "";

            faculty.forEach(member => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${member.FacultyID}</td>
                    <td>${member.Name}</td>
                    <td>${member.Email}</td>
                    <td>${member.Department}</td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading faculty:", error);
        });
}


// Add Faculty
document.getElementById("addFacultyBtn")
    .addEventListener("click", function () {

        const name =
            document.getElementById("facultyName").value;

        const email =
            document.getElementById("facultyEmail").value;

        const department =
            document.getElementById("facultyDepartment").value;


        if (name === "" ||
            email === "" ||
            department === "") {

            alert("Please fill all fields.");
            return;
        }


        fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Name: name,
                Email: email,
                Department: department
            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {
                alert(data.error);
                return;
            }

            alert("Faculty added successfully!");

            document.getElementById("facultyName").value = "";
            document.getElementById("facultyEmail").value = "";
            document.getElementById("facultyDepartment").value = "";

            loadFaculty();

        })

        .catch(error => {

            console.error("Error adding faculty:", error);

            alert("Failed to add faculty.");

        });

    });
