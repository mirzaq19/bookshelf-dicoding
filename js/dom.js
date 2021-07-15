const SUDAHBACA_LIST_ID = 'sudah-baca';
const BELUMBACA_LIST_ID = 'belum-baca';
const BOOK_ITEMID = 'itemID';
const BELUMBACA_COUNT_ID = 'belum-baca-count';
const SUDAHBACA_COUNT_ID = 'sudah-baca-count';
let BELUMBACA_COUNT = 0;
let SUDAHBACA_COUNT = 0;

function addBook() {

    const newJudul = document.getElementById("input-judul").value;
    const newPenulis = document.getElementById("input-penulis").value;
    const newTahun = document.getElementById("input-tahun").value;
    const newStatus = document.getElementById("input-baca").checked;
    
    document.getElementById("input-judul").value = '';
    document.getElementById("input-penulis").value = '';
    document.getElementById("input-tahun").value = '';
    document.getElementById("input-baca").checked = false;

    const book = makeBook(newJudul,newPenulis,newTahun,newStatus);
    const bookObject = composeBookObject(newJudul,newPenulis,newTahun,newStatus);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    let listID;
    if(newStatus){
        listID = SUDAHBACA_LIST_ID;
        SUDAHBACA_COUNT++;
    }
    else{
        listID = BELUMBACA_LIST_ID;
        BELUMBACA_COUNT++;
    }

    const listBook = document.getElementById(listID);

    listBook.append(book);
    updateCount()
    updateDataToStorage();
    showStatusRak();
}

function makeBook(newJudul,newPenulis,newTahun,newStatus) {
    const judul = document.createElement('h3');
    judul.innerText = newJudul;
    judul.classList.add('judul');

    const penulis = document.createElement("p");
    penulis.innerHTML = 'Penulis: <span class=\'penulis\'>'+newPenulis+'</span>';
    
    const tahun = document.createElement("p");
    tahun.innerHTML = 'Tahun: <span class=\'tahun\'>'+newTahun+'</span>';

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-wrapper');

    if (!newStatus)
        btnContainer.append(createCheckButton(), createTrashButton());
    else
        btnContainer.append(createUndoButton(), createTrashButton());

    const container = document.createElement('div');
    container.classList.add('item');

    container.append(judul,penulis,tahun,btnContainer);
    return container;
}

function createButton(iconButton, textButton, eventListener) {
    const button = document.createElement('button');
    button.classList.add('btn-action');

    const icon = document.createElement('i');
    icon.classList.add('fas', iconButton);

    button.innerHTML = icon.outerHTML+' '+textButton;

    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function createCheckButton() {
    return createButton('fa-check-circle', 'Selesai baca' , function (event) {
        addTaskToCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton('fa-trash', 'Hapus buku' , function (event) {
        removeTaskFromCompleted(event.target.parentElement.parentElement);
    });
}

function createUndoButton() {
    return createButton('fa-sync-alt', 'Baca ulang' , function (event) {
        undoTaskFromCompleted(event.target.parentElement.parentElement);
    });
}



function addTaskToCompleted(bookItem) {
    const judul = bookItem.querySelector(".judul").innerText;
    const penulis = bookItem.querySelector(".penulis").innerText;
    const tahun = bookItem.querySelector(".tahun").innerText;

    const newBook = makeBook(judul, penulis, tahun, true);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    const listSudahBaca = document.getElementById(SUDAHBACA_LIST_ID);
    listSudahBaca.append(newBook);
    bookItem.remove();

    SUDAHBACA_COUNT++;
    BELUMBACA_COUNT--;
    updateCount();
    updateDataToStorage();
    showStatusRak();
}


function removeTaskFromCompleted(bookItem) {
    const bookPosition = findBookIndex(bookItem[BOOK_ITEMID]);
    const bookStatus = books[bookPosition].isCompleted;

    if(bookStatus){
        SUDAHBACA_COUNT--;
    }else{
        BELUMBACA_COUNT--;
    }

    books.splice(bookPosition, 1);
    bookItem.remove();

    updateCount();
    updateDataToStorage();
    showStatusRak();
}

function undoTaskFromCompleted(bookItem) {
    const judul = bookItem.querySelector(".judul").innerText;
    const penulis = bookItem.querySelector(".penulis").innerText;
    const tahun = bookItem.querySelector(".tahun").innerText;

    const newBook = makeBook(judul, penulis, tahun, false);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    const listBelumBaca = document.getElementById(BELUMBACA_LIST_ID);
    listBelumBaca.append(newBook);
    bookItem.remove();
    SUDAHBACA_COUNT--;
    BELUMBACA_COUNT++;
    updateCount();
    updateDataToStorage();
    showStatusRak();
}

function updateCount() {
    document.getElementById(BELUMBACA_COUNT_ID).innerText = BELUMBACA_COUNT;
    document.getElementById(SUDAHBACA_COUNT_ID).innerText = SUDAHBACA_COUNT;
}

function showStatusRak() {
    const statusRakBelumBaca = document.querySelector('.status-rak-belumbaca');
    const statusRakSudahBaca = document.querySelector('.status-rak-sudahbaca');

    if(BELUMBACA_COUNT == 0 && statusRakBelumBaca == null){
        const newStatusBelumBaca = document.createElement('h4');
        newStatusBelumBaca.classList.add('status-rak-belumbaca','text-center');
        newStatusBelumBaca.innerText = 'Tidak ada buku yang belum dibaca';
        document.getElementById(BELUMBACA_LIST_ID).append(newStatusBelumBaca);
    }
    
    if(BELUMBACA_COUNT > 0 && statusRakBelumBaca != null){
        statusRakBelumBaca.remove();
    }
    
    if(SUDAHBACA_COUNT == 0 && statusRakSudahBaca == null){
        const newStatusSudahBaca = document.createElement('h4');
        newStatusSudahBaca.classList.add('status-rak-sudahbaca','text-center');
        newStatusSudahBaca.innerText = 'Tidak ada buku yang sudah dibaca';
        document.getElementById(SUDAHBACA_LIST_ID).append(newStatusSudahBaca);
    }
    
    if(SUDAHBACA_COUNT > 0 && statusRakSudahBaca != null){
        statusRakSudahBaca.remove();
    }
}

function refreshDataFromBooks() {
    const listBelumBaca = document.getElementById(BELUMBACA_LIST_ID);
    let listSudahBaca = document.getElementById(SUDAHBACA_LIST_ID);

    SUDAHBACA_COUNT = 0;
    BELUMBACA_COUNT = 0;
  
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
  
        if(book.isCompleted){
            SUDAHBACA_COUNT++;
            listSudahBaca.append(newBook);
        } else {
            BELUMBACA_COUNT++;
            listBelumBaca.append(newBook);
        }
    }
    updateCount();
    showStatusRak();
}

function searchBook() {
    const keyword = document.getElementById('input-search').value.toLowerCase();
    const listBelumBaca = document.getElementById(BELUMBACA_LIST_ID);
    let listSudahBaca = document.getElementById(SUDAHBACA_LIST_ID);

    listBelumBaca.innerHTML = '';
    listSudahBaca.innerHTML = '';

    if(keyword == '') {
        refreshDataFromBooks();
        return;
    }

    SUDAHBACA_COUNT = 0;
    BELUMBACA_COUNT = 0;

    for(book of books){[]
        if(book.title.toLowerCase().includes(keyword)){
            const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
            newBook[BOOK_ITEMID] = book.id;
      
            if(book.isCompleted){
                SUDAHBACA_COUNT++;
                listSudahBaca.append(newBook);
            } else {
                BELUMBACA_COUNT++;
                listBelumBaca.append(newBook);
            }
        }
    }
    updateCount();
    showStatusRak();
}