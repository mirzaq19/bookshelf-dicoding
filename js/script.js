document.addEventListener("DOMContentLoaded", function () {

    const inputBukuForm = document.getElementById("form-input-buku");
    const searchBukuForm = document.getElementById("form-search-buku");

    inputBukuForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    searchBukuForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});