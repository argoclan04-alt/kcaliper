/**
 * API.js - FastAPI Integration
 * HTTP client for communicating with backend
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',  // Change this in production
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Base fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            ...API_CONFIG.HEADERS,
            ...options.headers
        }
    };
    
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    config.signal = controller.signal;
    
    try {
        log(`API Request: ${options.method || 'GET'} ${endpoint}`, 'info');
        
        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        
        // Parse response
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle errors
        if (!response.ok) {
            throw new APIError(
                data.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                data
            );
        }
        
        log(`API Response: Success`, 'info');
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new APIError('Request timeout', 408);
        }
        
        if (error instanceof APIError) {
            throw error;
        }
        
        log(`API Error: ${error.message}`, 'error');
        throw new APIError(error.message, 0, error);
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 0, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// ============================================================================
// COACH ENDPOINTS
// ============================================================================

/**
 * Get Coach Dashboard
 * @returns {Promise} Coach data with clients and alerts
 */
async function fetchCoachDashboard() {
    return apiFetch('/coach/dashboard');
}

/**
 * Get Clients List
 * @returns {Promise} Array of clients
 */
async function fetchClients() {
    return apiFetch('/coach/clients');
}

/**
 * Get Client Details
 * @param {string} clientId - Client ID
 * @returns {Promise} Client data
 */
async function fetchClientDetails(clientId) {
    return apiFetch(`/coach/clients/${clientId}`);
}

/**
 * Get Alerts
 * @param {Object} params - Query parameters
 * @returns {Promise} Array of alerts
 */
async function fetchAlerts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/coach/alerts?${queryParams}` : '/coach/alerts';
    return apiFetch(endpoint);
}

/**
 * Mark Alert as Read
 * @param {string} alertId - Alert ID
 * @returns {Promise} Success response
 */
async function apiMarkAlertAsRead(alertId) {
    return apiFetch(`/coach/alerts/${alertId}/read`, {
        method: 'POST'
    });
}

/**
 * Update Target Rate
 * @param {string} clientId - Client ID
 * @param {number} targetRate - New target rate
 * @returns {Promise} Success response
 */
async function apiUpdateTargetRate(clientId, targetRate) {
    return apiFetch(`/coach/clients/${clientId}/target-rate`, {
        method: 'PUT',
        body: JSON.stringify({ targetWeeklyRate: targetRate })
    });
}

/**
 * Update Client Settings
 * @param {string} clientId - Client ID
 * @param {Object} settings - Settings to update
 * @returns {Promise} Success response
 */
async function apiUpdateClientSettings(clientId, settings) {
    return apiFetch(`/coach/clients/${clientId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
}

/**
 * Request Photo from Client
 * @param {Object} photoRequest - Photo request data
 * @returns {Promise} Success response
 */
async function apiRequestPhoto(photoRequest) {
    return apiFetch('/coach/photo-request', {
        method: 'POST',
        body: JSON.stringify(photoRequest)
    });
}

// ============================================================================
// CLIENT ENDPOINTS
// ============================================================================

/**
 * Get Client Dashboard
 * @returns {Promise} Client data
 */
async function fetchClientDashboard() {
    return apiFetch('/client/dashboard');
}

/**
 * Get Weight Entries
 * @param {Object} params - Query parameters
 * @returns {Promise} Array of weight entries
 */
async function fetchWeightEntries(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/client/weights?${queryParams}` : '/client/weights';
    return apiFetch(endpoint);
}

/**
 * Add Weight Entry
 * @param {Object} entry - Weight entry data
 * @returns {Promise} Created entry with alerts
 */
async function apiAddWeightEntry(entry) {
    return apiFetch('/client/weights', {
        method: 'POST',
        body: JSON.stringify(entry)
    });
}

/**
 * Update Weight Entry
 * @param {string} entryId - Entry ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise} Updated entry
 */
async function apiUpdateWeightEntry(entryId, updates) {
    return apiFetch(`/client/weights/${entryId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

/**
 * Delete Weight Entry
 * @param {string} entryId - Entry ID
 * @returns {Promise} Success response
 */
async function apiDeleteWeightEntry(entryId) {
    return apiFetch(`/client/weights/${entryId}`, {
        method: 'DELETE'
    });
}

/**
 * Upload Photo
 * @param {Object} photoData - Photo data (base64, notes, etc.)
 * @returns {Promise} Uploaded photo data
 */
async function apiUploadPhoto(photoData) {
    return apiFetch('/client/photos', {
        method: 'POST',
        body: JSON.stringify(photoData)
    });
}

/**
 * Get Notifications
 * @returns {Promise} Array of notifications
 */
async function fetchNotifications() {
    return apiFetch('/client/notifications');
}

/**
 * Mark Notification as Read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Success response
 */
async function apiMarkNotificationAsRead(notificationId) {
    return apiFetch(`/client/notifications/${notificationId}/read`, {
        method: 'POST'
    });
}

// ============================================================================
// USER MANAGEMENT (Demo Only)
// ============================================================================

/**
 * Switch User (Demo/Development only)
 * @param {string} userId - User ID
 * @returns {Promise} User data
 */
async function apiSwitchUser(userId) {
    return apiFetch('/users/switch', {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Sync local state with API
 * Fetches latest data from backend and updates local state
 */
async function syncWithAPI() {
    try {
        setLoading(true);
        
        const { currentUser } = AppState;
        
        if (currentUser.role === 'coach') {
            // Fetch coach data
            const data = await fetchCoachDashboard();
            updateState({
                coach: data.coach,
                alerts: data.alerts
            });
        } else {
            // Fetch client data
            const data = await fetchClientDashboard();
            const updatedClients = AppState.coach.clients.map(client =>
                client.id === currentUser.id ? data.client : client
            );
            updateState({
                coach: {
                    ...AppState.coach,
                    clients: updatedClients
                }
            });
        }
        
        createToast({
            message: 'Data synced successfully',
            type: 'success'
        });
        
    } catch (error) {
        log('Sync failed: ' + error.message, 'error');
        createToast({
            message: 'Failed to sync with server: ' + error.message,
            type: 'error',
            duration: 6000
        });
    } finally {
        setLoading(false);
    }
}

/**
 * Enhanced add weight entry with API integration
 * Falls back to local state if API fails
 * @param {string} clientId - Client ID
 * @param {Object} entry - Weight entry
 */
async function addWeightEntryWithAPI(clientId, entry) {
    try {
        setLoading(true);
        
        // Try API first
        const response = await apiAddWeightEntry(entry);
        
        // Update local state with response
        const updatedClients = AppState.coach.clients.map(client => {
            if (client.id === clientId) {
                const updatedEntries = [...client.weightEntries, response.data];
                return {
                    ...client,
                    weightEntries: recalculateAllWeeklyRates(updatedEntries)
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
        
        // Handle alerts from API response
        if (response.alerts && response.alerts.length > 0) {
            response.alerts.forEach(alert => {
                createToast({
                    message: alert.message,
                    type: alert.type === 'lowest' ? 'success' : 'info',
                    duration: 6000
                });
            });
        }
        
    } catch (error) {
        log('API add weight failed, using local state: ' + error.message, 'warn');
        
        // Fallback to local state
        addWeightEntry(clientId, entry);
        
        createToast({
            message: 'Weight saved locally (offline mode)',
            type: 'warning'
        });
    } finally {
        setLoading(false);
    }
}

/**
 * Enhanced update weight entry with API integration
 * @param {string} clientId - Client ID
 * @param {string} entryId - Entry ID
 * @param {Object} updates - Updates
 */
async function updateWeightEntryWithAPI(clientId, entryId, updates) {
    try {
        setLoading(true);
        
        // Try API first
        await apiUpdateWeightEntry(entryId, updates);
        
        // Update local state
        updateWeightEntry(clientId, entryId, updates);
        
    } catch (error) {
        log('API update failed, using local state: ' + error.message, 'warn');
        
        // Fallback to local state
        updateWeightEntry(clientId, entryId, updates);
        
        createToast({
            message: 'Update saved locally (offline mode)',
            type: 'warning'
        });
    } finally {
        setLoading(false);
    }
}

/**
 * Check API health
 * @returns {Promise<boolean>} True if API is healthy
 */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Initialize API integration
 * Checks if API is available and sets up auto-sync
 */
async function initializeAPI() {
    const isHealthy = await checkAPIHealth();
    
    if (isHealthy) {
        log('API connection established', 'info');
        
        // Optional: Setup auto-sync every 5 minutes
        setInterval(() => {
            syncWithAPI();
        }, 5 * 60 * 1000);
        
        return true;
    } else {
        log('API not available, running in offline mode', 'warn');
        createToast({
            message: 'Running in offline mode - data will be stored locally',
            type: 'info',
            duration: 6000
        });
        return false;
    }
}

// Auto-initialize API connection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAPI());
} else {
    initializeAPI();
}
