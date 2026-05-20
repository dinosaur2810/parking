// ============================================
// PAGE NAVIGATION
// ============================================

const loginPage = document.getElementById('loginPage');
const aboutPage = document.getElementById('aboutPage');
const goToAboutBtn = document.getElementById('goToAbout');
const goToLoginBtn = document.getElementById('goToLogin');

// Navigate to About page
goToAboutBtn.addEventListener('click', () => {
    loginPage.classList.add('fade-out');
    setTimeout(() => {
        loginPage.style.display = 'none';
        aboutPage.style.display = 'flex';
        aboutPage.classList.add('fade-in');
        window.scrollTo(0, 0);
    }, 300);
});

// Navigate back to Login page
goToLoginBtn.addEventListener('click', () => {
    aboutPage.classList.add('fade-out');
    setTimeout(() => {
        aboutPage.style.display = 'none';
        loginPage.style.display = 'flex';
        loginPage.classList.add('fade-in');
        window.scrollTo(0, 0);
    }, 300);
});

// ============================================
// LOGIN FORM FUNCTIONALITY
// ============================================

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    // Update icon
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate login
    const loginButton = loginForm.querySelector('.login-button');
    const originalText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        loginButton.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
        loginButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // Save preferences
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 1500);
});

// ============================================
// INPUT VALIDATION & UTILITIES
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#4DA3FF'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.4s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ============================================
// LOAD REMEMBERED EMAIL
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (rememberedEmail && rememberMe === 'true') {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

// ============================================
// FORM FIELD ANIMATIONS & INTERACTIONS
// ============================================

const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    // Add input event listener for real-time validation
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.background = 'var(--white)';
        }
    });
    
    // Blur event - validate on blur
    input.addEventListener('blur', () => {
        if (input.id === 'email' && input.value.trim() !== '') {
            if (!isValidEmail(input.value)) {
                input.style.borderColor = '#ff6b6b';
            } else {
                input.style.borderColor = '#4DA3FF';
            }
        }
    });
    
    // Focus event
    input.addEventListener('focus', () => {
        input.style.borderColor = '#4DA3FF';
    });
});

// ============================================
// LINK HANDLERS
// ============================================

const registerLink = document.querySelector('.register-link');
const forgotLink = document.querySelector('.forgot-link');

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Register page - Coming Soon!', 'info');
});

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (email && isValidEmail(email)) {
        showNotification(`Password reset link sent to ${email}`, 'success');
    } else {
        showNotification('Please enter a valid email address first', 'error');
    }
});

// ============================================
// ILLUSTRATION CARD INTERACTIONS
// ============================================

const illustrationCards = document.querySelectorAll('.illustration-card');

illustrationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// FEATURE CARD INTERACTIONS
// ============================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Enter to submit login form (if form is visible)
    if (e.key === 'Enter' && loginPage.style.display !== 'none') {
        const activeElement = document.activeElement;
        if (activeElement === emailInput || activeElement === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to go back (if on about page)
    if (e.key === 'Escape' && aboutPage.style.display !== 'none') {
        goToLoginBtn.click();
    }
});

// ============================================
// SCROLL ANIMATIONS (Optional Enhancement)
// ============================================

// Intersection Observer for fade-in on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
featureCards.forEach(card => {
    card.style.opacity = '0.7';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
});

// ============================================
// RESPONSIVE SIDEBAR TOGGLE (if needed)
// ============================================

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile adjustments
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    } else {
        document.documentElement.style.setProperty('--transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// INITIALIZATION
// ============================================

console.log('ParkEase - Parking Management System loaded successfully!');
console.log('Version: 1.0.0');
console.log('Theme: Modern Blue & Dark Blue');

// Log system info
console.log('System initialized with:', {
    loginForm: loginForm ? 'Active' : 'Inactive',
    pages: {
        login: loginPage ? 'Ready' : 'Missing',
        about: aboutPage ? 'Ready' : 'Missing'
    }
});
