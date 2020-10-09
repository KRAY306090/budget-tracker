let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_finance', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        // uploadFinance();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_finance'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_finance');
    budgetObjectStore.add(record);
}