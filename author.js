const API_URL = "http://localhost:3000/api/authors";


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
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading authors:", error);
        });
}


// Add new author
document.getElementById("addAuthorBtn").addEventListener("click", function () {

    const name = document.getElementById("authorName").value;
    const email = document.getElementById("authorEmail").value;

    if (name === "" || email === "") {
        alert("Please enter author name and email.");
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

        alert("Author added successfully!");

        document.getElementById("authorName").value = "";
        document.getElementById("authorEmail").value = "";

        loadAuthors();

    })

    .catch(error => {
        console.error("Error adding author:", error);
        alert("Failed to add author.");
    });

});
