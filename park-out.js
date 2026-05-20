// Park-Out Page Logic
function initPage() {
    // Reload global state
    parkingData = JSON.parse(localStorage.getItem('parkingData')) || {};
    parkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) || {};
    transactionLog = JSON.parse(localStorage.getItem('transactionLog')) || [];
    
    displayParkedVehicles();
    setupSearch();
    setupFormSubmission();
}

function displayParkedVehicles() {
    const list = document.getElementById('parkedVehiclesList');
    list.innerHTML = '';
    
    // Get all parked vehicles (timeOut is null)
    const parkedVehicles = Object.values(parkingData).filter(v => v.timeOut === null);
    
    if (parkedVehicles.length === 0) {
        list.innerHTML = '<p class="empty-message" style="grid-column: 1 / -1;">No parked vehicles at the moment</p>';
        return;
    }
    
    parkedVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <h4>${vehicle.plateNumber}</h4>
            <div class="vehicle-info">
                <span><strong>Ticket:</strong> ${vehicle.ticketNumber}</span>
                <span><strong>Owner:</strong> ${vehicle.ownerName}</span>
                <span><strong>Slot:</strong> ${vehicle.slotNumber}</span>
                <span><strong>Time In:</strong> ${vehicle.timeIn}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            populateCheckoutForm(vehicle);
        });
        
        list.appendChild(card);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchTicket');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.toUpperCase().trim();
        if (!query) {
            showNotification('Please enter a ticket number or plate number', 'error');
            return;
        }
        
        // Search in parkingData
        const vehicle = Object.values(parkingData).find(v => 
            (v.timeOut === null) && 
            (v.ticketNumber === query || v.plateNumber === query)
        );
        
        if (vehicle) {
            // Clear previous selections
            document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
            
            // Select and populate
            const cards = document.querySelectorAll('.vehicle-card');
            cards.forEach(card => {
                if (card.textContent.includes(vehicle.plateNumber)) {
                    card.classList.add('selected');
                }
            });
            
            populateCheckoutForm(vehicle);
        } else {
            showNotification('Vehicle not found or already checked out', 'error');
        }
        
        searchInput.value = '';
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

function populateCheckoutForm(vehicle) {
    document.getElementById('outTicketNumber').value = vehicle.ticketNumber;
    document.getElementById('outPlateNumber').value = vehicle.plateNumber;
    document.getElementById('outOwnerName').value = vehicle.ownerName;
    document.getElementById('outVehicleType').value = vehicle.vehicleType;
    document.getElementById('outSlot').value = vehicle.slotNumber;
    document.getElementById('outTimeIn').value = vehicle.timeIn;
    document.getElementById('outTimeOut').value = new Date().toLocaleString();
    document.getElementById('outFee').value = '$' + vehicle.fee.toFixed(2);
    
    // Store current vehicle for submission
    document.getElementById('parkOutForm').dataset.selectedTicket = vehicle.ticketNumber;
    
    // Show form
    document.getElementById('parkOutForm').style.display = 'block';
}

function setupFormSubmission() {
    const form = document.getElementById('parkOutForm');
    const clearBtn = document.getElementById('clearParkOutBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticketNumber = form.dataset.selectedTicket;
        const timeOut = document.getElementById('outTimeOut').value;
        const slotNumber = document.getElementById('outSlot').value;
        
        if (!ticketNumber) {
            showNotification('Please select a vehicle first', 'error');
            return;
        }
        
        // Update parking data
        parkingData[ticketNumber].timeOut = timeOut;
        parkingData[ticketNumber].status = 'Completed';
        
        // Free up slot - ensure slot object exists
        if (!parkingSlots[slotNumber]) {
            parkingSlots[slotNumber] = {};
        }
        parkingSlots[slotNumber].status = 'available';
        delete parkingSlots[slotNumber].vehicleTicket;
        
        // Update transaction log
        transactionLog.forEach(t => {
            if (t.ticketNumber === ticketNumber) {
                t.timeOut = timeOut;
                t.status = 'Completed';
            }
        });
        
        // Save to localStorage
        localStorage.setItem('parkingData', JSON.stringify(parkingData));
        localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
        localStorage.setItem('transactionLog', JSON.stringify(transactionLog));
        
        showNotification(`Vehicle ${document.getElementById('outPlateNumber').value} checked out successfully!`, 'success');
        
        // Clear form and refresh list
        form.style.display = 'none';
        form.reset();
        displayParkedVehicles();
    });
    
    clearBtn.addEventListener('click', function() {
        form.style.display = 'none';
        form.reset();
        document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
    });
}

function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
