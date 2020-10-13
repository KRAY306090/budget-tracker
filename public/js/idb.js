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
         uploadFinance();
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

function uploadFinance() {
    const transaction = db.transaction(['new_finance'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_finance');

    const getAll = budgetObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    
                    const transaction = db.transaction(['new_finance'], 'readwrite');
        
                    const budgetObjectStore = transaction.objectStore('new_finance');
            
                    budgetObjectStore.clear();

                    alert('All saved transactions have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}
window.addEventListener('online', uploadFinance);