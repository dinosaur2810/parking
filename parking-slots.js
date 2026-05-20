// Parking Slots Page Logic
function initPage() {
    // Reload global state
    parkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) || {};
    parkingData = JSON.parse(localStorage.getItem('parkingData')) || {};
    
    generateSlotsGrid();
    updateStats();
}

function generateSlotsGrid() {
    const grid = document.getElementById('slotsGrid');
    grid.innerHTML = '';
    
    // Create slots A-01 to E-20
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const slotsPerRow = 20;
    
    rows.forEach(row => {
        for (let i = 1; i <= slotsPerRow; i++) {
            const slotId = `${row}-${String(i).padStart(2, '0')}`;
            const slot = parkingSlots[slotId] || { status: 'available' };
            
            const slotElement = document.createElement('div');
            slotElement.className = `slot ${slot.status}`;
            slotElement.textContent = slotId;
            slotElement.title = slot.status === 'occupied' ? 
                `Occupied - Ticket: ${slot.vehicleTicket || 'Unknown'}` : 
                'Available';
            
            if (slot.vehicleTicket) {
                slotElement.setAttribute('data-ticket', slot.vehicleTicket);
            }
            
            slotElement.addEventListener('click', function() {
                if (slot.status === 'occupied' && slot.vehicleTicket) {
                    const vehicle = parkingData[slot.vehicleTicket];
                    if (vehicle) {
                        showSlotDetails(vehicle, slotId);
                    }
                }
            });
            
            grid.appendChild(slotElement);
        }
    });
}

function updateStats() {
    const occupied = Object.values(parkingSlots).filter(s => s.status === 'occupied').length;
    const available = PARKING_CONFIG.totalSlots - occupied;
    
    document.getElementById('totalSlotsCount').textContent = PARKING_CONFIG.totalSlots;
    document.getElementById('occupiedCount').textContent = occupied;
    document.getElementById('availableCount').textContent = available;
}

function showSlotDetails(vehicle, slotId) {
    const message = `
Slot: ${slotId}
Ticket: ${vehicle.ticketNumber}
Plate: ${vehicle.plateNumber}
Owner: ${vehicle.ownerName}
Type: ${vehicle.vehicleType}
Time In: ${vehicle.timeIn}
    `;
    
    alert(message);
}
