const API_URL = "http://localhost:3000/api/publishers";


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
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading publishers:", error);
        });
}


// Add publisher
document.getElementById("addPublisherBtn").addEventListener("click", function () {

    const name = document.getElementById("publisherName").value;
    const email = document.getElementById("publisherEmail").value;

    if (name === "" || email === "") {
        alert("Please enter publisher name and email.");
        return;
    }

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

        document.getElementById("publisherName").value = "";
        document.getElementById("publisherEmail").value = "";

        loadPublishers();

    })

    .catch(error => {
        console.error("Error adding publisher:", error);
        alert("Failed to add publisher.");
    });

});
