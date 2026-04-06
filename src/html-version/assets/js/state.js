/**
 * State.js - Global State Management
 * Replaces React hooks and context
 */

// Storage keys
const STORAGE_KEYS = {
    COACH_DATA: 'weight_tracker_coach',
    ALERTS: 'weight_tracker_alerts',
    CURRENT_USER: 'weight_tracker_current_user',
    THEME: 'weight_tracker_theme'
};

// Global state object
const AppState = {
    coach: null,
    alerts: [],
    currentUser: null,
    loading: false,
    initialized: false
};

// Subscribers for state changes
const stateSubscribers = [];

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call when state changes
 * @returns {Function} Unsubscribe function
 */
function subscribe(callback) {
    stateSubscribers.push(callback);
    return () => {
        const index = stateSubscribers.indexOf(callback);
        if (index > -1) {
            stateSubscribers.splice(index, 1);
        }
    };
}

/**
 * Notify all subscribers of state change
 */
function notifySubscribers() {
    stateSubscribers.forEach(callback => callback(AppState));
}

/**
 * Update state and notify subscribers
 * @param {Object} updates - State updates
 */
function updateState(updates) {
    Object.assign(AppState, updates);
    saveToLocalStorage();
    notifySubscribers();
}

/**
 * Initialize state from localStorage or defaults
 */
function initializeState() {
    if (AppState.initialized) return;

    // Load from localStorage
    const savedCoach = localStorage.getItem(STORAGE_KEYS.COACH_DATA);
    const savedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    // Initialize with mock data or saved data
    AppState.coach = savedCoach ? JSON.parse(savedCoach) : getMockCoach();
    AppState.alerts = savedAlerts ? JSON.parse(savedAlerts) : getMockAlerts();
    AppState.currentUser = savedUser ? JSON.parse(savedUser) : getMockUsers()[0];
    AppState.initialized = true;

    saveToLocalStorage();
    log('State initialized', 'info');
}

/**
 * Save current state to localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.COACH_DATA, JSON.stringify(AppState.coach));
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(AppState.alerts));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(AppState.currentUser));
    } catch (error) {
        log('Error saving to localStorage: ' + error.message, 'error');
    }
}

/**
 * Clear all data from localStorage
 */
function clearLocalStorage() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    log('LocalStorage cleared', 'info');
}

/**
 * Get current client based on current user
 * @returns {Object|null} Client object or null
 */
function getCurrentClient() {
    if (!AppState.currentUser || AppState.currentUser.role !== 'client') {
        return null;
    }
    return getClientById(AppState.currentUser.id);
}

/**
 * Get client by ID
 * @param {string} clientId - Client ID
 * @returns {Object|null} Client object or null
 */
function getClientById(clientId) {
    if (!AppState.coach || !AppState.coach.clients) return null;
    return AppState.coach.clients.find(client => client.id === clientId) || null;
}

/**
 * Switch user (for demo purposes)
 * @param {string} userId - User ID to switch to
 */
function switchUser(userId) {
    const user = getMockUsers().find(u => u.id === userId);
    if (user) {
        updateState({ currentUser: user });
        log(`Switched to user: ${user.name}`, 'info');
    }
}

/**
 * Add weight entry for a client
 * @param {string} clientId - Client ID
 * @param {Object} entry - Weight entry (without ID)
 */
function addWeightEntry(clientId, entry) {
    const newEntry = {
        ...entry,
        id: generateId('entry')
    };

    const updatedClients = AppState.coach.clients.map(client => {
        if (client.id === clientId) {
            const updatedEntries = [...client.weightEntries, newEntry];
            
            // Sort entries by date
            const sortedEntries = sortEntriesByDate(updatedEntries);
            
            // Calculate moving averages and weekly rates
            const recalculatedEntries = sortedEntries.map((entry, index) => ({
                ...entry,
                movingAverage: calculateDoubleExponentialMovingAverage(sortedEntries, index),
                weeklyRate: calculateWeeklyRate(sortedEntries, index)
            }));
            
            // Check for new alerts
            checkAndGenerateAlerts(client, recalculatedEntries[0], recalculatedEntries);
            
            return {
                ...client,
                weightEntries: recalculatedEntries
            };
        }
        return client;
    });

    updateState({
        coach: {
            ...AppState.coach,
            clients: updatedClients
        }
    });
}

/**
 * Update weight entry
 * @param {string} clientId - Client ID
 * @param {string} entryId - Entry ID
 * @param {Object} updates - Entry updates
 */
function updateWeightEntry(clientId, entryId, updates) {
    const updatedClients = AppState.coach.clients.map(client => {
        if (client.id === clientId) {
            const updatedEntries = client.weightEntries.map(entry =>
                entry.id === entryId ? { ...entry, ...updates } : entry
            );
            
            // Sort and recalculate
            const sortedEntries = sortEntriesByDate(updatedEntries);
            const recalculatedEntries = sortedEntries.map((entry, index) => ({
                ...entry,
                movingAverage: calculateDoubleExponentialMovingAverage(sortedEntries, index),
                weeklyRate: calculateWeeklyRate(sortedEntries, index)
            }));
            
            return {
                ...client,
                weightEntries: recalculatedEntries
            };
        }
        return client;
    });

    updateState({
        coach: {
            ...AppState.coach,
            clients: updatedClients
        }
    });
}

/**
 * Update target weekly rate for a client
 * @param {string} clientId - Client ID
 * @param {number} targetRate - New target rate
 */
function updateTargetWeeklyRate(clientId, targetRate) {
    const updatedClients = AppState.coach.clients.map(client => {
        if (client.id === clientId) {
            return {
                ...client,
                targetWeeklyRate: targetRate
            };
        }
        return client;
    });

    updateState({
        coach: {
            ...AppState.coach,
            clients: updatedClients
        }
    });
}

/**
 * Update notification settings for a client
 * @param {string} clientId - Client ID
 * @param {Object} settings - Settings to update
 */
function updateNotificationSettings(clientId, settings) {
    const updatedClients = AppState.coach.clients.map(client =>
        client.id === clientId ? { ...client, ...settings } : client
    );

    updateState({
        coach: {
            ...AppState.coach,
            clients: updatedClients
        }
    });
}

/**
 * Mark alert as read
 * @param {string} alertId - Alert ID
 */
function markAlertAsRead(alertId) {
    const updatedAlerts = AppState.alerts.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
    );

    updateState({ alerts: updatedAlerts });
}

/**
 * Check and generate alerts based on new entry
 * @param {Object} client - Client object
 * @param {Object} currentEntry - Current entry
 * @param {Array} allEntries - All entries
 */
function checkAndGenerateAlerts(client, currentEntry, allEntries) {
    const newAlerts = [];
    
    // Check for new lowest/highest weights
    const { lowest, highest } = findLowestAndHighestWeights(allEntries);
    
    if (lowest && lowest.id === currentEntry.id && client.notifyLowest !== false) {
        newAlerts.push({
            id: generateId('alert'),
            clientId: client.id,
            type: 'lowest',
            message: `${client.name} has reached a new lowest weight: ${currentEntry.weight.toFixed(1)} ${client.unit}`,
            date: currentEntry.date,
            isRead: false
        });
    }
    
    if (highest && highest.id === currentEntry.id && client.notifyHighest !== false) {
        newAlerts.push({
            id: generateId('alert'),
            clientId: client.id,
            type: 'highest',
            message: `${client.name} has reached a new highest weight: ${currentEntry.weight.toFixed(1)} ${client.unit}`,
            date: currentEntry.date,
            isRead: false
        });
    }
    
    // Check for rate deviation
    if (currentEntry.weeklyRate && client.notifyRateDeviation !== false) {
        if (checkRateDeviation(currentEntry.weeklyRate, client.targetWeeklyRate, 0.2)) {
            newAlerts.push({
                id: generateId('alert'),
                clientId: client.id,
                type: 'rate_deviation',
                message: `${client.name}'s weekly rate (${currentEntry.weeklyRate > 0 ? '+' : ''}${currentEntry.weeklyRate.toFixed(1)} ${client.unit}) deviates from target (${client.targetWeeklyRate > 0 ? '+' : ''}${client.targetWeeklyRate.toFixed(1)} ${client.unit})`,
                date: currentEntry.date,
                isRead: false,
                entryId: currentEntry.id
            });
        }
    }
    
    // Check for milestone achievement
    if (client.milestone && !client.milestoneAchieved) {
        const milestoneReached = client.targetWeeklyRate < 0
            ? currentEntry.weight <= client.milestone
            : currentEntry.weight >= client.milestone;
        
        if (milestoneReached) {
            newAlerts.push({
                id: generateId('alert'),
                clientId: client.id,
                type: 'milestone_achieved',
                message: `${client.name} has achieved their milestone: ${client.milestone.toFixed(1)} ${client.unit}`,
                date: currentEntry.date,
                isRead: false,
                entryId: currentEntry.id
            });
        }
    }
    
    // Add new alerts to state
    if (newAlerts.length > 0) {
        updateState({
            alerts: [...AppState.alerts, ...newAlerts]
        });
    }
}

/**
 * Get unread alerts
 * @returns {Array} Array of unread alerts
 */
function getUnreadAlerts() {
    return AppState.alerts.filter(alert => !alert.isRead);
}

/**
 * Export state as JSON
 * @returns {Object} State as JSON
 */
function exportState() {
    return {
        coach: AppState.coach,
        alerts: AppState.alerts,
        currentUser: AppState.currentUser,
        exportDate: new Date().toISOString()
    };
}

/**
 * Import state from JSON
 * @param {Object} data - State data
 */
function importState(data) {
    if (data.coach) AppState.coach = data.coach;
    if (data.alerts) AppState.alerts = data.alerts;
    if (data.currentUser) AppState.currentUser = data.currentUser;
    
    saveToLocalStorage();
    notifySubscribers();
    log('State imported successfully', 'info');
}
