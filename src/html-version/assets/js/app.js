/**
 * App.js - Main Application Logic
 * Initialization, routing, and event handling
 */

// Global app instance
const WeightTrackerApp = {
    initialized: false,
    chart: null,
    
    /**
     * Initialize the application
     */
    init() {
        if (this.initialized) return;
        
        log('Initializing Weight Tracker App', 'info');
        
        // Initialize state from localStorage or mock data
        initializeState();
        
        // Setup theme system
        ThemeManager.init();
        ThemeManager.renderToggleButton('theme-toggle-container');
        
        // Subscribe to state changes
        subscribe((state) => {
            this.render();
        });
        
        // Setup global event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        this.initialized = true;
        log('App initialized successfully', 'info');
    },
    
    /**
     * Render current view based on user role
     */
    render() {
        const { currentUser, coach, alerts } = AppState;
        
        if (!currentUser) {
            log('No current user found', 'error');
            return;
        }
        
        // Render user switcher
        this.renderUserSwitcher();
        
        // Render main content based on role
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            log('Main content container not found', 'error');
            return;
        }
        
        if (currentUser.role === 'coach') {
            mainContent.innerHTML = renderCoachDashboard(coach, alerts);
        } else {
            const client = getCurrentClient();
            if (client) {
                mainContent.innerHTML = renderClientLogbook(client);
                // Initialize chart after rendering
                this.initializeChart(client);
            } else {
                mainContent.innerHTML = '<div class="text-center py-8"><p class="text-gray-600 dark:text-gray-400">Client data not found</p></div>';
            }
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Initialize notifications for coach
        initializeNotifications();
    },
    
    /**
     * Render user switcher
     */
    renderUserSwitcher() {
        const container = document.getElementById('user-switcher');
        if (!container) return;
        
        const users = getMockUsers();
        const { currentUser } = AppState;
        
        container.innerHTML = renderUserSwitcher(users, currentUser);
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Add weight (client only)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (AppState.currentUser.role === 'client') {
                    this.openAddWeightDialog();
                }
            }
            
            // Escape: Close modal
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Handle window resize for chart
        window.addEventListener('resize', debounce(() => {
            if (this.chart) {
                this.chart.resize();
            }
        }, 250));
    },
    
    /**
     * Initialize weight chart
     * @param {Object} client - Client data
     */
    initializeChart(client) {
        const canvas = document.getElementById('weight-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Prepare data
        const sortedEntries = sortEntriesByDate(client.weightEntries).reverse();
        const labels = sortedEntries.map(e => {
            const date = new Date(e.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const weights = sortedEntries.map(e => e.weight);
        const movingAverages = sortedEntries.map((e, i) => {
            return calculateDoubleExponentialMovingAverage(sortedEntries.reverse(), sortedEntries.length - 1 - i);
        });
        
        // Chart config
        const isDark = ThemeManager.isDark();
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Weight',
                        data: weights,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'DEMA Trend',
                        data: movingAverages,
                        borderColor: 'rgb(168, 85, 247)',
                        backgroundColor: 'rgba(168, 85, 247, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: textColor,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toFixed(1) + ' ' + client.unit;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return value.toFixed(1) + ' ' + client.unit;
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
        
        // Listen for theme changes to update chart
        window.addEventListener('themechange', () => {
            if (this.chart) {
                const isDark = ThemeManager.isDark();
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
                
                this.chart.options.plugins.legend.labels.color = textColor;
                this.chart.options.scales.y.grid.color = gridColor;
                this.chart.options.scales.y.ticks.color = textColor;
                this.chart.options.scales.x.grid.color = gridColor;
                this.chart.options.scales.x.ticks.color = textColor;
                this.chart.update();
            }
        });
    },
    
    /**
     * Open Add Weight Dialog
     */
    openAddWeightDialog() {
        const client = getCurrentClient();
        if (!client) return;
        
        const modalId = createModal({
            title: 'Add Weight Entry',
            description: 'Record your weight for today',
            content: `
                <div class="space-y-4">
                    ${createLabel({ text: 'Weight', htmlFor: 'weight-input', required: true })}
                    ${createInput({
                        type: 'number',
                        id: 'weight-input',
                        placeholder: `Enter weight in ${client.unit}`,
                        step: '0.1',
                        min: '0',
                        required: true
                    })}
                    
                    ${createLabel({ text: 'Date', htmlFor: 'date-input', required: true })}
                    ${createInput({
                        type: 'date',
                        id: 'date-input',
                        value: getTodayString(),
                        required: true
                    })}
                    
                    ${createLabel({ text: 'Notes (optional)', htmlFor: 'notes-input' })}
                    ${createTextarea({
                        id: 'notes-input',
                        placeholder: 'Any notes about your weight today?',
                        rows: 3
                    })}
                </div>
            `,
            footer: `
                ${createButton({
                    text: 'Cancel',
                    variant: 'outline',
                    onClick: `closeModal('${modalId || 'modal-add-weight'}')`
                })}
                ${createButton({
                    text: 'Add Entry',
                    onClick: 'submitAddWeight()'
                })}
            `,
            size: 'default'
        });
        
        // Store modal ID globally for submit
        window.currentModalId = modalId;
        showModal(modalId);
    },
    
    /**
     * Close all modals
     */
    closeAllModals() {
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        document.body.style.overflow = '';
    }
};

// ============================================================================
// GLOBAL FUNCTIONS (called from HTML onclick handlers)
// ============================================================================

/**
 * Handle user switch from dropdown
 * @param {string} userId - User ID
 */
function handleUserSwitch(userId) {
    switchUser(userId);
}

/**
 * Open add weight dialog
 */
function openAddWeightDialog() {
    WeightTrackerApp.openAddWeightDialog();
}

/**
 * Submit add weight form
 */
function submitAddWeight() {
    const weightInput = document.getElementById('weight-input');
    const dateInput = document.getElementById('date-input');
    const notesInput = document.getElementById('notes-input');
    
    if (!weightInput || !dateInput) {
        createToast({
            message: 'Form inputs not found',
            type: 'error'
        });
        return;
    }
    
    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;
    const notes = notesInput ? notesInput.value : '';
    
    if (!weight || weight <= 0) {
        createToast({
            message: 'Please enter a valid weight',
            type: 'error'
        });
        return;
    }
    
    if (!date) {
        createToast({
            message: 'Please select a date',
            type: 'error'
        });
        return;
    }
    
    const client = getCurrentClient();
    if (client) {
        addWeightEntry(client.id, {
            weight,
            date,
            notes,
            recordedBy: 'client'
        });
        
        createToast({
            message: 'Weight recorded successfully!',
            type: 'success'
        });
        
        if (window.currentModalId) {
            closeModal(window.currentModalId);
        }
    }
}

/**
 * View client details (coach only)
 * @param {string} clientId - Client ID
 */
function viewClientDetails(clientId) {
    // Switch to client view
    switchUser(clientId);
}

/**
 * Mark alert as read
 * @param {string} alertId - Alert ID
 */
function markAlertRead(alertId) {
    markAlertAsRead(alertId);
    updateNotificationBadge();
    
    // Re-render notifications panel if open
    const panel = document.getElementById('notifications-panel');
    if (panel && !panel.classList.contains('notification-panel-close')) {
        const { alerts } = AppState;
        panel.innerHTML = renderNotificationsPanel(alerts);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        setupSwipeGesture(panel);
    }
    
    createToast({
        message: 'Alert marked as read',
        type: 'success'
    });
}

/**
 * View notes for entry
 * @param {string} entryId - Entry ID
 */
function viewNotes(entryId) {
    const client = getCurrentClient();
    if (!client) return;
    
    const entry = client.weightEntries.find(e => e.id === entryId);
    if (!entry || !entry.notes) return;
    
    const modalId = createModal({
        title: 'Notes',
        description: formatDate(entry.date).day + ' ' + formatDate(entry.date).weekday,
        content: `<p class="text-gray-700 dark:text-gray-300">${escapeHtml(entry.notes)}</p>`,
        footer: createButton({
            text: 'Close',
            variant: 'outline',
            onClick: `closeModal('${modalId || 'modal-view-notes'}')`
        })
    });
    
    showModal(modalId);
}

/**
 * Edit notes for entry
 * @param {string} entryId - Entry ID
 * @param {string} currentNotes - Current notes
 */
function editNotes(entryId, currentNotes) {
    const modalId = createModal({
        title: 'Edit Notes',
        content: `
            ${createTextarea({
                id: 'edit-notes-input',
                value: currentNotes,
                rows: 4
            })}
        `,
        footer: `
            ${createButton({
                text: 'Cancel',
                variant: 'outline',
                onClick: `closeModal('${modalId || 'modal-edit-notes'}')`
            })}
            ${createButton({
                text: 'Save',
                onClick: `saveNotes('${entryId}', '${modalId || 'modal-edit-notes'}')`
            })}
        `
    });
    
    showModal(modalId);
}

/**
 * Save edited notes
 * @param {string} entryId - Entry ID
 * @param {string} modalId - Modal ID to close
 */
function saveNotes(entryId, modalId) {
    const input = document.getElementById('edit-notes-input');
    if (!input) return;
    
    const client = getCurrentClient();
    if (client) {
        updateWeightEntry(client.id, entryId, { notes: input.value });
        closeModal(modalId);
        createToast({
            message: 'Notes updated successfully',
            type: 'success'
        });
    }
}

/**
 * Add notes to entry
 * @param {string} entryId - Entry ID
 */
function addNotes(entryId) {
    editNotes(entryId, '');
}

/**
 * View photo
 * @param {string} photoId - Photo ID
 */
function viewPhoto(photoId) {
    // TODO: Implement photo viewer
    createToast({
        message: 'Photo viewer coming soon',
        type: 'info'
    });
}

/**
 * Toggle settings
 */
function toggleSettings() {
    createToast({
        message: 'Settings panel coming soon',
        type: 'info'
    });
}

/**
 * Open Request Photo Dialog
 */
function openRequestPhotoDialog() {
    const modalId = createModal({
        title: 'Request Physique Photo',
        description: 'Request a progress photo from your client',
        content: `
            <div class="space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    This will send a notification to your client requesting a physique photo for progress tracking.
                </p>
                ${createLabel({ text: 'Photo Type', htmlFor: 'photo-type-select' })}
                <select 
                    id="photo-type-select"
                    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-input-background dark:bg-input/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="front">Front</option>
                    <option value="side">Side</option>
                    <option value="back">Back</option>
                </select>
                
                ${createLabel({ text: 'Notes (optional)', htmlFor: 'photo-notes-input' })}
                ${createTextarea({
                    id: 'photo-notes-input',
                    placeholder: 'Add any specific instructions for the photo...',
                    rows: 3
                })}
            </div>
        `,
        footer: `
            ${createButton({
                text: 'Cancel',
                variant: 'outline',
                onClick: `closeModal('${modalId || 'modal-request-photo'}')`
            })}
            ${createButton({
                text: 'Send Request',
                onClick: 'submitPhotoRequest()'
            })}
        `
    });
    
    window.currentModalId = modalId;
    showModal(modalId);
}

/**
 * Submit photo request
 */
function submitPhotoRequest() {
    const photoType = document.getElementById('photo-type-select')?.value || 'front';
    const notes = document.getElementById('photo-notes-input')?.value || '';
    
    // TODO: Implement actual photo request logic with API
    createToast({
        message: `Photo request sent successfully (${photoType})`,
        type: 'success'
    });
    
    if (window.currentModalId) {
        closeModal(window.currentModalId);
    }
}

// ============================================================================
// NOTIFICATIONS PANEL MANAGEMENT
// ============================================================================

// Track scroll position for floating button
let lastScrollTop = 0;
let scrollTimeout = null;

/**
 * Toggle notifications panel
 */
function toggleNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;
    
    if (panel.style.display === 'none' || panel.classList.contains('notification-panel-close')) {
        openNotificationsPanel();
    } else {
        closeNotificationsPanel();
    }
}

/**
 * Open notifications panel
 */
function openNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;
    
    // Render notifications content
    const { alerts } = AppState;
    panel.innerHTML = renderNotificationsPanel(alerts);
    
    // Show panel
    panel.style.display = 'block';
    setTimeout(() => {
        panel.classList.remove('notification-panel-close');
        panel.classList.add('notification-panel-open');
    }, 10);
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Setup swipe gesture for closing
    setupSwipeGesture(panel);
}

/**
 * Close notifications panel
 */
function closeNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;
    
    panel.classList.remove('notification-panel-open');
    panel.classList.add('notification-panel-close');
    
    setTimeout(() => {
        panel.style.display = 'none';
    }, 300);
}

/**
 * Switch notification tab
 * @param {string} tab - Tab name ('unread' or 'read')
 */
function switchNotificationTab(tab) {
    const unreadTab = document.getElementById('unread-tab');
    const readTab = document.getElementById('read-tab');
    const unreadContent = document.getElementById('unread-notifications');
    const readContent = document.getElementById('read-notifications');
    
    if (!unreadTab || !readTab || !unreadContent || !readContent) return;
    
    if (tab === 'unread') {
        unreadTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400');
        unreadTab.classList.remove('border-transparent', 'text-gray-600', 'dark:text-gray-400');
        readTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400');
        readTab.classList.add('border-transparent', 'text-gray-600', 'dark:text-gray-400');
        unreadContent.classList.remove('hidden');
        readContent.classList.add('hidden');
    } else {
        readTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400');
        readTab.classList.remove('border-transparent', 'text-gray-600', 'dark:text-gray-400');
        unreadTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400');
        unreadTab.classList.add('border-transparent', 'text-gray-600', 'dark:text-gray-400');
        readContent.classList.remove('hidden');
        unreadContent.classList.add('hidden');
    }
}

/**
 * Setup swipe gesture for closing panel
 * @param {HTMLElement} panel - Panel element
 */
function setupSwipeGesture(panel) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    panel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    panel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        if (diff > 0) {
            panel.style.transform = `translateX(${diff}px)`;
        }
    });
    
    panel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = currentX - startX;
        
        if (diff > 100) {
            closeNotificationsPanel();
        } else {
            panel.style.transform = 'translateX(0)';
        }
    });
}

/**
 * Update notification badge
 */
function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    const { alerts, currentUser } = AppState;
    
    if (!badge || !currentUser || currentUser.role !== 'coach') return;
    
    const unreadCount = alerts.filter(a => !a.isRead).length;
    
    if (unreadCount > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

/**
 * Setup scroll behavior for floating notification button
 */
let scrollListenerAdded = false;
function setupNotificationButtonScroll() {
    const btn = document.getElementById('floating-notifications-btn');
    if (!btn || scrollListenerAdded) return;
    
    scrollListenerAdded = true;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide button
            btn.classList.add('floating-btn-hide');
            btn.classList.remove('floating-btn-show');
        } else {
            // Scrolling up - show button
            btn.classList.remove('floating-btn-hide');
            btn.classList.add('floating-btn-show');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Clear timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Show button after scrolling stops for 1 second
        scrollTimeout = setTimeout(() => {
            btn.classList.remove('floating-btn-hide');
            btn.classList.add('floating-btn-show');
        }, 1000);
    });
}

/**
 * Initialize notifications system for coach
 */
function initializeNotifications() {
    const { currentUser } = AppState;
    
    if (currentUser && currentUser.role === 'coach') {
        const btn = document.getElementById('floating-notifications-btn');
        if (btn) {
            btn.style.display = 'block';
            btn.classList.add('floating-btn-show');
        }
        
        updateNotificationBadge();
        setupNotificationButtonScroll();
    } else {
        const btn = document.getElementById('floating-notifications-btn');
        if (btn) {
            btn.style.display = 'none';
        }
    }
}

// ============================================================================
// AUTO-INITIALIZE ON DOM READY
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WeightTrackerApp.init();
        initializeNotifications();
    });
} else {
    WeightTrackerApp.init();
    initializeNotifications();
}
