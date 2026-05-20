// Global state management
const PARKING_CONFIG = {
    totalSlots: 100,
    fee: 50.00,
    adminId: 5,
    rows: ['A', 'B', 'C', 'D', 'E'],
    slotsPerRow: 20
};

let parkingData = JSON.parse(localStorage.getItem('parkingData')) || {};
let parkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) || initializeSlots();
let transactionLog = JSON.parse(localStorage.getItem('transactionLog')) || [];

// Initialize parking slots
function initializeSlots() {
    const slots = {};
    PARKING_CONFIG.rows.forEach(row => {
        for (let i = 1; i <= PARKING_CONFIG.slotsPerRow; i++) {
            const slotId = `${row}-${String(i).padStart(2, '0')}`;
            slots[slotId] = { status: 'available' };
        }
    });
    localStorage.setItem('parkingSlots', JSON.stringify(slots));
    return slots;
}

// Page navigation and dynamic loading
document.addEventListener('DOMContentLoaded', function() {
    setupSidebarNavigation();
    setupLogout();
    loadPage('dashboard');
});

function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Load page
            loadPage(page);
        });
    });
}

function setupLogout() {
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutDropdown');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        });
    });
}

function loadPage(page) {
    const contentWrapper = document.getElementById('contentWrapper');
    const pageTitle = document.getElementById('pageTitle');
    const pageStylesheet = document.getElementById('pageStylesheet');
    
    // Map page keys to filenames
    const fileMap = {
        'slots': 'parking-slots',
        'transactions': 'transactions',
        'park-in': 'park-in',
        'park-out': 'park-out',
        'settings': 'settings'
    };
    
    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'park-in': 'Park-In (Create Ticket)',
        'park-out': 'Park-Out (Process Payment)',
        'slots': 'Parking Slots',
        'transactions': 'Transaction Logs',
        'settings': 'Settings'
    };
    
    pageTitle.textContent = titles[page] || 'Dashboard';
    
    // Show loading state
    contentWrapper.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>';
    
    // Clear previous stylesheet
    pageStylesheet.href = '';
    
    // Handle special case for dashboard (no external files)
    if (page === 'dashboard') {
        loadDashboard();
        pageStylesheet.href = '';
    } else {
        // Get the correct filename for this page
        const filename = fileMap[page] || page;
        
        // Load external HTML file and extract body content
        fetch(`${filename}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filename}.html`);
                return response.text();
            })
            .then(html => {
                // Extract content from body only (skip DOCTYPE, html, head tags)
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Get all content from body except script tags
                const bodyContent = Array.from(doc.body.childNodes)
                    .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT')
                    .map(node => node.outerHTML)
                    .join('');
                
                contentWrapper.innerHTML = bodyContent;
                
                // Load CSS if exists
                pageStylesheet.href = `${filename}.css`;
                
                // Load and execute JS if exists
                const script = document.createElement('script');
                script.src = `${filename}.js`;
                script.onload = function() {
                    if (typeof initPage === 'function') {
                        initPage();
                    }
                };
                script.onerror = function() {
                    console.warn(`${filename}.js not found or error loading`);
                };
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                contentWrapper.innerHTML = '<div class="error-message"><p>Error loading page. Please try again.</p></div>';
            });
    }
}

function loadDashboard() {
    const contentWrapper = document.getElementById('contentWrapper');
    
    // Calculate stats
    const occupiedCount = Object.values(parkingSlots).filter(s => s.status === 'occupied').length;
    const occupancyRate = (occupiedCount / PARKING_CONFIG.totalSlots) * 100;
    
    // Calculate revenue
    const completedTransactions = transactionLog.filter(t => t.status === 'Completed');
    const todayRevenue = completedTransactions.length * PARKING_CONFIG.fee;
    
    const pendingCheckouts = Object.values(parkingData).filter(v => v.timeOut === null).length;
    
    // Build dashboard HTML
    const dashboardHTML = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-car-side"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Parked</h3>
                    <p class="stat-value">${occupiedCount}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-square-parking"></i>
                </div>
                <div class="stat-info">
                    <h3>Available Slots</h3>
                    <p class="stat-value">${PARKING_CONFIG.totalSlots - occupiedCount}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-peso-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>Today's Revenue</h3>
                    <p class="stat-value">₱${todayRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-hourglass-end"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending Checkouts</h3>
                    <p class="stat-value">${pendingCheckouts}</p>
                </div>
            </div>
        </div>

        <div class="dashboard-charts">
            <div class="chart-card">
                <h3>Occupancy Rate</h3>
                <div class="occupancy-meter">
                    <div class="occupancy-bar">
                        <div class="occupancy-fill" style="width: ${occupancyRate}%;"></div>
                    </div>
                    <span class="occupancy-text">${occupancyRate.toFixed(1)}% Occupied</span>
                </div>
            </div>

            <div class="chart-card">
                <h3>Recent Transactions</h3>
                <div class="transaction-list">
                    ${transactionLog.length === 0 ? '<p class="empty-message">No transactions yet</p>' : 
                      transactionLog.slice(-5).reverse().map(t => `
                        <div class="transaction-item">
                            <span class="ticket">${t.ticketNumber}</span>
                            <span class="plate">${t.plateNumber}</span>
                            <span class="status ${t.status.toLowerCase().replace(' ', '-')}">${t.status}</span>
                        </div>
                      `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
    contentWrapper.innerHTML = dashboardHTML;
}

// Notify other tabs of data changes
window.addEventListener('storage', function(e) {
    if (e.key === 'parkingSlots' || e.key === 'parkingData' || e.key === 'transactionLog') {
        // Refresh current page
        const activePage = document.querySelector('.nav-item.active');
        if (activePage && typeof initPage === 'function') {
            initPage();
        }
    }
});

// Sidebar toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});

document.getElementById('sidebarToggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});
