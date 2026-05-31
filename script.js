// ============================================
// User Action Tracking
// ============================================

let actionCounter = 0;
let notificationCounter = 0;
let notifications = [];

// Update action counter in UI
function updateActionCounter() {
    document.getElementById('actionCount').textContent = actionCounter;
    document.getElementById('totalActions').textContent = actionCounter;
    document.getElementById('lastActionTime').textContent = new Date().toLocaleTimeString();
}

// Increment counter manually
function incrementCounter() {
    actionCounter++;
    updateActionCounter();
    addUserNotification('success', `Action counter incremented to ${actionCounter}`);
    showToast.success(`Counter is now ${actionCounter}`);
}

// ============================================
// Button Handlers (User Clicks)
// ============================================

function handleButtonClick(buttonName) {
    actionCounter++;
    updateActionCounter();
    
    // Show feedback in the button section
    const feedbackDiv = document.getElementById('buttonFeedback');
    feedbackDiv.innerHTML = `
        <div class="feedback-message">
            ✅ You clicked <strong>${buttonName}</strong> at ${new Date().toLocaleTimeString()}
        </div>
    `;
    
    // Add to notifications
    addUserNotification('success', `${buttonName} was clicked!`);
    
    // Show toast
    showToast.success(`${buttonName} clicked successfully!`);
    
    // Console log
    console.log(`${buttonName} clicked by user`);
}

function handleCardClick(cardName) {
    actionCounter++;
    updateActionCounter();
    
    const feedbackDiv = document.getElementById('cardFeedback');
    feedbackDiv.innerHTML = `
        <div class="feedback-message">
            🃏 You clicked on <strong>${cardName}</strong> card at ${new Date().toLocaleTimeString()}
        </div>
    `;
    
    addUserNotification('info', `User viewed ${cardName} card`);
    showToast.info(`You opened ${cardName} card`);
}

function handleCardAction(cardName) {
    actionCounter++;
    updateActionCounter();
    
    const feedbackDiv = document.getElementById('cardFeedback');
    feedbackDiv.innerHTML = `
        <div class="feedback-message">
            🎯 You performed action on <strong>${cardName}</strong> card at ${new Date().toLocaleTimeString()}
        </div>
    `;
    
    addUserNotification('success', `Action performed on ${cardName}`);
    showToast.success(`${cardName} action triggered!`);
}

// ============================================
// Form Handlers
// ============================================

function submitForm() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const message = document.getElementById('messageInput').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.input').forEach(el => el.classList.remove('error'));
    
    // Validate name
    if (!name.trim()) {
        showError('nameError', 'Name is required');
        document.getElementById('nameInput').classList.add('error');
        isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
        showError('emailError', 'Email is required');
        document.getElementById('emailInput').classList.add('error');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        document.getElementById('emailInput').classList.add('error');
        isValid = false;
    }
    
    // Validate message
    if (!message.trim()) {
        showError('messageError', 'Message is required');
        document.getElementById('messageInput').classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        actionCounter++;
        updateActionCounter();
        
        const feedbackDiv = document.getElementById('formFeedback');
        feedbackDiv.innerHTML = `
            <div class="feedback-message">
                📧 Form submitted successfully!<br>
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Message:</strong> ${message.substring(0, 100)}<br>
                <em>Submitted at: ${new Date().toLocaleTimeString()}</em>
            </div>
        `;
        
        addUserNotification('success', `New message from ${name}: ${message.substring(0, 50)}...`);
        showToast.success(`Thank you ${name}! Your message has been sent.`);
        
        // Clear form
        clearForm();
    } else {
        showToast.error('Please fix the errors in the form');
    }
}

function clearForm() {
    document.getElementById('nameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('messageInput').value = '';
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.input').forEach(el => el.classList.remove('error'));
    
    const feedbackDiv = document.getElementById('formFeedback');
    feedbackDiv.innerHTML = `
        <div class="feedback-message">
            🧹 Form has been cleared at ${new Date().toLocaleTimeString()}
        </div>
    `;
    
    addUserNotification('info', 'User cleared the form');
    showToast.info('Form cleared successfully');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Real-time validation on input
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const messageInput = document.getElementById('messageInput');
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                document.getElementById('nameError').textContent = '';
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (isValidEmail(this.value)) {
                this.classList.remove('error');
                document.getElementById('emailError').textContent = '';
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                document.getElementById('messageError').textContent = '';
            }
        });
    }
});

// ============================================
// Notification System (User Created Only)
// ============================================

function addUserNotification(type, message) {
    notificationCounter++;
    document.getElementById('totalNotifications').textContent = notificationCounter;
    document.getElementById('notificationCount').textContent = notifications.length + 1;
    
    const notification = {
        id: Date.now(),
        type: type,
        message: message,
        timestamp: new Date().toLocaleTimeString()
    };
    
    notifications.unshift(notification);
    
    // Keep only last 50
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    renderNotifications();
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔔</div>
                <p>No notifications yet</p>
                <small>Click buttons above to create notifications</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type}" onclick="showToast.${notif.type}('${notif.message.replace(/'/g, "\\'")}')">
            <div class="notification-message">
                ${getIconForType(notif.type)} ${notif.message}
            </div>
            <div class="notification-time">${notif.timestamp}</div>
        </div>
    `).join('');
}

function getIconForType(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || '📢';
}

function clearAllNotifications() {
    notifications = [];
    notificationCounter = 0;
    renderNotifications();
    document.getElementById('notificationCount').textContent = '0';
    document.getElementById('totalNotifications').textContent = '0';
    showToast.info('All notifications cleared');
}

function addCustomMessage() {
    const customMessage = prompt('Enter your custom message:', 'This is my custom message!');
    if (customMessage && customMessage.trim()) {
        actionCounter++;
        updateActionCounter();
        addUserNotification('info', customMessage);
        showToast.success('Custom message added!');
    } else if (customMessage !== null) {
        showToast.warning('Please enter a message');
    }
}

function sendCustomMessage() {
    const input = document.getElementById('customMessageInput');
    const message = input.value.trim();
    
    if (message) {
        actionCounter++;
        updateActionCounter();
        addUserNotification('info', `Custom: ${message}`);
        showToast.success(`Message sent: "${message.substring(0, 50)}"`);
        input.value = '';
    } else {
        showToast.warning('Please type a message first');
    }
}

// ============================================
// Toast Notifications System
// ============================================

const showToast = {
    success: (message) => createToast(message, 'success', '✅'),
    error: (message) => createToast(message, 'error', '❌'),
    warning: (message) => createToast(message, 'warning', '⚠️'),
    info: (message) => createToast(message, 'info', 'ℹ️')
};

function createToast(message, type, icon) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-close">✕</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }
    }, 3000);
    
    // Close button functionality
    toast.querySelector('.toast-close').onclick = () => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    };
}

// ============================================
// Tab Navigation
// ============================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update URL hash
    window.location.hash = tabName;
    
    addUserNotification('info', `Switched to ${tabName} tab`);
}

// Event listeners for tabs
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Handle hash on load
function handleHash() {
    const hash = window.location.hash.substring(1);
    if (hash && ['components', 'interactive', 'docs'].includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('components');
    }
}

// ============================================
// Utility Functions
// ============================================

function resetAll() {
    if (confirm('Are you sure you want to reset everything? This will clear all actions and notifications.')) {
        actionCounter = 0;
        notificationCounter = 0;
        notifications = [];
        
        updateActionCounter();
        renderNotifications();
        document.getElementById('notificationCount').textContent = '0';
        document.getElementById('totalNotifications').textContent = '0';
        
        // Clear all feedback areas
        document.getElementById('buttonFeedback').innerHTML = '<p class="feedback-placeholder">✨ Click any button above to see feedback here</p>';
        document.getElementById('cardFeedback').innerHTML = '<p class="feedback-placeholder">✨ Click any card above to see feedback here</p>';
        document.getElementById('formFeedback').innerHTML = '<p class="feedback-placeholder">✨ Fill the form and click Send Message</p>';
        
        clearForm();
        
        showToast.success('Everything has been reset!');
        addUserNotification('success', 'System reset by user');
    }
}

function showHelp() {
    showToast.info('Click buttons, fill forms, and create notifications! Everything is manual.');
    addUserNotification('info', 'User requested help');
}

// Add slideOut animation if not exists
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    handleHash();
    addUserNotification('info', 'Welcome to NexAgent Interactive UI! Start clicking buttons!');
    showToast.success('Welcome! Click any button to get started.');
    
    // Initialize custom message input if exists
    const customInput = document.getElementById('customMessageInput');
    if (customInput) {
        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendCustomMessage();
            }
        });
    }
});

// Make functions global
window.handleButtonClick = handleButtonClick;
window.handleCardClick = handleCardClick;
window.handleCardAction = handleCardAction;
window.submitForm = submitForm;
window.clearForm = clearForm;
window.addUserNotification = addUserNotification;
window.clearAllNotifications = clearAllNotifications;
window.addCustomMessage = addCustomMessage;
window.sendCustomMessage = sendCustomMessage;
window.incrementCounter = incrementCounter;
window.resetAll = resetAll;
window.showHelp = showHelp;
window.showToast = showToast;