const API_URL = "http://localhost:3000/api/faculty";

let editingFacultyId = null;


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
                    <td>
                        <button class="edit-btn"
                            onclick="editFaculty(
                                ${member.FacultyID},
                                '${member.Name}',
                                '${member.Email}',
                                '${member.Department}'
                            )">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteFaculty(${member.FacultyID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading faculty:", error);
        });
}


// Add / Update Faculty
document.getElementById("addFacultyBtn")
    .addEventListener("click", function () {

        const name =
            document.getElementById("facultyName").value.trim();

        const email =
            document.getElementById("facultyEmail").value.trim();

        const department =
            document.getElementById("facultyDepartment").value.trim();


        if (name === "" ||
            email === "" ||
            department === "") {

            alert("Please fill all fields.");
            return;
        }


        // UPDATE
        if (editingFacultyId !== null) {

            fetch(`${API_URL}/${editingFacultyId}`, {

                method: "PUT",

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

                alert("Faculty updated successfully!");

                resetForm();
                loadFaculty();

            })
            .catch(error => {

                console.error("Error updating faculty:", error);
                alert("Failed to update faculty.");

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

            resetForm();
            loadFaculty();

        })

        .catch(error => {

            console.error("Error adding faculty:", error);

            alert("Failed to add faculty.");

        });

    });


// Edit Faculty
function editFaculty(id, name, email, department) {

    editingFacultyId = id;

    document.getElementById("facultyName").value = name;
    document.getElementById("facultyEmail").value = email;
    document.getElementById("facultyDepartment").value = department;

    document.getElementById("addFacultyBtn").textContent =
        "Update Faculty";
}


// Delete Faculty
function deleteFaculty(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this faculty member?"
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

        alert("Faculty deleted successfully!");

        loadFaculty();

    })
    .catch(error => {

        console.error("Error deleting faculty:", error);
        alert("Failed to delete faculty.");

    });
}


// Reset form
function resetForm() {

    editingFacultyId = null;

    document.getElementById("facultyName").value = "";
    document.getElementById("facultyEmail").value = "";
    document.getElementById("facultyDepartment").value = "";

    document.getElementById("addFacultyBtn").textContent =
        "Add Faculty";
}
