const API_URL = "http://localhost:3000/api/publishers";

let editingPublisherId = null;


// Load publishers when page opens
window.onload = function () {
    loadPublishers();
};


// Get publishers from MySQL
function loadPublishers() {

    fetch(API_URL)
        .then(response => response.json())
        .then(publishers => {

            const tableBody = document.getElementById("publisherTableBody");

            tableBody.innerHTML = "";

            publishers.forEach(publisher => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${publisher.PublisherID}</td>
                    <td>${publisher.Name}</td>
                    <td>${publisher.Email}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editPublisher(${publisher.PublisherID}, '${publisher.Name}', '${publisher.Email}')">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deletePublisher(${publisher.PublisherID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading publishers:", error);
        });
}


// Add / Update publisher
document.getElementById("addPublisherBtn").addEventListener("click", function () {

    const name = document.getElementById("publisherName").value.trim();
    const email = document.getElementById("publisherEmail").value.trim();

    if (name === "" || email === "") {
        alert("Please enter publisher name and email.");
        return;
    }


    // UPDATE
    if (editingPublisherId !== null) {

        fetch(`${API_URL}/${editingPublisherId}`, {

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

            alert("Publisher updated successfully!");

            resetForm();
            loadPublishers();

        })
        .catch(error => {
            console.error("Error updating publisher:", error);
            alert("Failed to update publisher.");
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

        alert("Publisher added successfully!");

        resetForm();
        loadPublishers();

    })

    .catch(error => {
        console.error("Error adding publisher:", error);
        alert("Failed to add publisher.");
    });

});


// Edit publisher
function editPublisher(id, name, email) {

    editingPublisherId = id;

    document.getElementById("publisherName").value = name;
    document.getElementById("publisherEmail").value = email;

    document.getElementById("addPublisherBtn").textContent = "Update Publisher";
}


// Delete publisher
function deletePublisher(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this publisher?"
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

        alert("Publisher deleted successfully!");

        loadPublishers();

    })
    .catch(error => {

        console.error("Error deleting publisher:", error);
        alert("Failed to delete publisher.");

    });
}


// Reset form
function resetForm() {

    editingPublisherId = null;

    document.getElementById("publisherName").value = "";
    document.getElementById("publisherEmail").value = "";

    document.getElementById("addPublisherBtn").textContent = "Add Publisher";
}
