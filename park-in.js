// Park-In Page Logic
function initPage() {
    // Reload global state
    parkingData = JSON.parse(localStorage.getItem('parkingData')) || {};
    parkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) || {};
    transactionLog = JSON.parse(localStorage.getItem('transactionLog')) || [];
    
    generateTicketNumber();
    populateSlotDropdown();
    setupFormSubmission();
}

function generateTicketNumber() {
    const ticketInput = document.getElementById('ticketNumber');
    const timestamp = Date.now().toString().slice(-6);
    const ticketNum = 'TK-' + timestamp;
    ticketInput.value = ticketNum;
    
    // Set time in
    const timeInInput = document.getElementById('timeIn');
    timeInInput.value = new Date().toLocaleString();
}

function populateSlotDropdown() {
    const slotSelect = document.getElementById('slotNumber');
    slotSelect.innerHTML = '<option value="">Select Slot</option>';
    
    // Get available slots
    const availableSlots = Object.entries(parkingSlots)
        .filter(([slotId, slot]) => slot.status === 'available')
        .map(([slotId]) => slotId)
        .sort();
    
    availableSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        slotSelect.appendChild(option);
    });
    
    if (availableSlots.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No available slots';
        slotSelect.appendChild(option);
    }
}

function setupFormSubmission() {
    const form = document.getElementById('parkInForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticketNumber = document.getElementById('ticketNumber').value;
        const timeIn = document.getElementById('timeIn').value;
        const plateNumber = document.getElementById('plateNumber').value.toUpperCase();
        const vehicleType = document.getElementById('vehicleType').value;
        const slotNumber = document.getElementById('slotNumber').value;
        const ownerName = document.getElementById('ownerName').value;
        
        if (!plateNumber || !vehicleType || !slotNumber || !ownerName) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if plate is already parked
        if (Object.values(parkingData).some(v => v.plateNumber === plateNumber && !v.timeOut)) {
            showNotification('Vehicle is already parked!', 'error');
            return;
        }
        
        // Create parking record
        parkingData[ticketNumber] = {
            ticketNumber: ticketNumber,
            plateNumber: plateNumber,
            ownerName: ownerName,
            vehicleType: vehicleType,
            slotNumber: slotNumber,
            timeIn: timeIn,
            timeOut: null,
            fee: PARKING_CONFIG.fee,
            status: 'Pending Checkout'
        };
        
        // Update slot status - ensure slot object exists
        if (!parkingSlots[slotNumber]) {
            parkingSlots[slotNumber] = {};
        }
        parkingSlots[slotNumber].status = 'occupied';
        parkingSlots[slotNumber].vehicleTicket = ticketNumber;
        
        // Add to transaction log
        transactionLog.push({
            ticketNumber: ticketNumber,
            plateNumber: plateNumber,
            ownerName: ownerName,
            vehicleType: vehicleType,
            slotNumber: slotNumber,
            timeIn: timeIn,
            timeOut: null,
            fee: PARKING_CONFIG.fee,
            status: 'Pending Checkout'
        });
        
        // Save to localStorage
        localStorage.setItem('parkingData', JSON.stringify(parkingData));
        localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
        localStorage.setItem('transactionLog', JSON.stringify(transactionLog));
        
        // Success notification
        showNotification(`Ticket ${ticketNumber} created successfully!`, 'success');
        
        // Reset form
        form.reset();
        generateTicketNumber();
        populateSlotDropdown();
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
