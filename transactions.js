// Transactions Page Logic
function initPage() {
    // Reload global state
    transactionLog = JSON.parse(localStorage.getItem('transactionLog')) || [];
    
    setupFilters();
    displayTransactions();
}

function setupFilters() {
    const filterSelect = document.getElementById('filterStatus');
    
    filterSelect.addEventListener('change', function() {
        displayTransactions();
    });
}

function displayTransactions() {
    const tbody = document.getElementById('transactionTableBody');
    const filterValue = document.getElementById('filterStatus').value;
    
    // Filter transactions
    let filtered = transactionLog;
    if (filterValue) {
        filtered = transactionLog.filter(t => t.status === filterValue);
    }
    
    // Sort by time in descending order (most recent first)
    filtered.sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn));
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-message">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(transaction => `
        <tr>
            <td>${transaction.ticketNumber}</td>
            <td>${transaction.plateNumber}</td>
            <td>${transaction.ownerName}</td>
            <td>${transaction.slotNumber}</td>
            <td>${transaction.timeIn}</td>
            <td>${transaction.timeOut || '-'}</td>
            <td>$${transaction.fee.toFixed(2)}</td>
            <td>
                <span class="status-badge ${transaction.status.toLowerCase().replace(' ', '-')}">
                    ${transaction.status}
                </span>
            </td>
        </tr>
    `).join('');
}
