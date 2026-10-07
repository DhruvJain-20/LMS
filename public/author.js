const API_URL = "http://localhost:3000/api/authors";

let editingAuthorId = null;

// Load authors when page opens
window.onload = function () {
    loadAuthors();
};


// Get authors from MySQL
function loadAuthors() {

    fetch(API_URL)
        .then(response => response.json())
        .then(authors => {

            const tableBody = document.getElementById("authorTableBody");

            tableBody.innerHTML = "";

            authors.forEach(author => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${author.AuthorID}</td>
                    <td>${author.Name}</td>
                    <td>${author.Email}</td>
                    <td>
                        <button class="edit-btn" onclick="editAuthor(${author.AuthorID}, '${author.Name}', '${author.Email}')">
                            Edit
                        </button>

                        <button class="delete-btn" onclick="deleteAuthor(${author.AuthorID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading authors:", error);
        });
}


// Add / Update author
document.getElementById("addAuthorBtn").addEventListener("click", function () {

    const name = document.getElementById("authorName").value.trim();
    const email = document.getElementById("authorEmail").value.trim();

    if (name === "" || email === "") {
        alert("Please enter author name and email.");
        return;
    }

    // UPDATE
    if (editingAuthorId !== null) {

        fetch(`${API_URL}/${editingAuthorId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Name: name,
                Email: email
            })

        })
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                alert(data.error);
                return;
            }

            alert("Author updated successfully!");

            resetForm();
            loadAuthors();

        })
        .catch(error => {
            console.error("Error updating author:", error);
            alert("Failed to update author.");
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
            Email: email
        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert("Author added successfully!");

        resetForm();
        loadAuthors();

    })

    .catch(error => {
        console.error("Error adding author:", error);
        alert("Failed to add author.");
    });

});


// Edit author
function editAuthor(id, name, email) {

    editingAuthorId = id;

    document.getElementById("authorName").value = name;
    document.getElementById("authorEmail").value = email;

    document.getElementById("addAuthorBtn").textContent = "Update Author";
}


// Delete author
function deleteAuthor(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this author?"
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

        alert("Author deleted successfully!");

        loadAuthors();

    })
    .catch(error => {

        console.error("Error deleting author:", error);
        alert("Failed to delete author.");

    });
}


// Reset form
function resetForm() {

    editingAuthorId = null;

    document.getElementById("authorName").value = "";
    document.getElementById("authorEmail").value = "";

    document.getElementById("addAuthorBtn").textContent = "Add Author";
}
