document.addEventListener('DOMContentLoaded', function () {

    const inputBukuForm = document.getElementById('form-input-buku');
    const searchBukuForm = document.getElementById('form-search-buku');
    const editBukuForm = document.getElementById('form-edit-buku');

    inputBukuForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    searchBukuForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });
    
    editBukuForm.addEventListener('submit', function (event) {
        event.preventDefault();
        saveEditBook();
    });

    document.querySelector('.btn-cancel').addEventListener('click', function(event){
        event.preventDefault();
        document.querySelector('#modal-edit').style.display = 'none';
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromBooks();
});