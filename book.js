const API_URL = "http://localhost:3000/api";

let editingBookId = null;


// Run when page opens
window.onload = function () {
    loadAuthors();
    loadPublishers();
    loadBooks();
};


// Load Authors into dropdown
function loadAuthors() {

    fetch(`${API_URL}/authors`)
        .then(response => response.json())
        .then(authors => {

            const authorSelect = document.getElementById("author");

            authorSelect.innerHTML =
                '<option value="">Select Author</option>';

            authors.forEach(author => {

                const option = document.createElement("option");

                option.value = author.AuthorID;
                option.textContent = author.Name;

                authorSelect.appendChild(option);

            });

        })
        .catch(error => {
            console.error("Error loading authors:", error);
        });
}


// Load Publishers into dropdown
function loadPublishers() {

    fetch(`${API_URL}/publishers`)
        .then(response => response.json())
        .then(publishers => {

            const publisherSelect =
                document.getElementById("publisher");

            publisherSelect.innerHTML =
                '<option value="">Select Publisher</option>';

            publishers.forEach(publisher => {

                const option = document.createElement("option");

                option.value = publisher.PublisherID;
                option.textContent = publisher.Name;

                publisherSelect.appendChild(option);

            });

        })
        .catch(error => {
            console.error("Error loading publishers:", error);
        });
}


// Load Books
function loadBooks() {

    fetch(`${API_URL}/books`)
        .then(response => response.json())
        .then(books => {

            const tableBody =
                document.getElementById("bookTableBody");

            tableBody.innerHTML = "";

            books.forEach(book => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${book.BookID}</td>
                    <td>${book.Title}</td>
                    <td>${book.AuthorName}</td>
                    <td>${book.PublisherName}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editBook(${book.BookID}, '${book.Title}', ${book.AuthorID}, ${book.PublisherID})">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteBook(${book.BookID})">
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading books:", error);
        });
}


// Add / Update Book
document.getElementById("addBookBtn")
    .addEventListener("click", function () {

        const title =
            document.getElementById("bookTitle").value.trim();

        const authorID =
            document.getElementById("author").value;

        const publisherID =
            document.getElementById("publisher").value;


        if (title === "" ||
            authorID === "" ||
            publisherID === "") {

            alert("Please fill all fields.");
            return;
        }


        // UPDATE BOOK
        if (editingBookId !== null) {

            fetch(`${API_URL}/books/${editingBookId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    Title: title,
                    AuthorID: authorID,
                    PublisherID: publisherID
                })

            })
            .then(response => response.json())
            .then(data => {

                if (data.error) {
                    alert(data.error);
                    return;
                }

                alert("Book updated successfully!");

                resetForm();
                loadBooks();

            })
            .catch(error => {

                console.error("Error updating book:", error);
                alert("Failed to update book.");

            });

            return;
        }


        // ADD BOOK
        fetch(`${API_URL}/books`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Title: title,
                AuthorID: authorID,
                PublisherID: publisherID
            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {
                alert(data.error);
                return;
            }

            alert("Book added successfully!");

            resetForm();
            loadBooks();

        })

        .catch(error => {

            console.error("Error adding book:", error);

            alert("Failed to add book.");

        });

    });


// Edit Book
function editBook(id, title, authorID, publisherID) {

    editingBookId = id;

    document.getElementById("bookTitle").value = title;
    document.getElementById("author").value = authorID;
    document.getElementById("publisher").value = publisherID;

    document.getElementById("addBookBtn").textContent = "Update Book";
}


// Delete Book
function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    fetch(`${API_URL}/books/${id}`, {

        method: "DELETE"

    })
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            alert(data.error);
            return;
        }

        alert("Book deleted successfully!");

        loadBooks();

    })
    .catch(error => {

        console.error("Error deleting book:", error);
        alert("Failed to delete book.");

    });
}


// Reset form
function resetForm() {

    editingBookId = null;

    document.getElementById("bookTitle").value = "";
    document.getElementById("author").value = "";
    document.getElementById("publisher").value = "";

    document.getElementById("addBookBtn").textContent = "Add Book";
}
