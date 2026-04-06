/**
 * Components.js - Main Component Generators
 * HTML generators for Weight Tracker main components
 */

/**
 * Render User Switcher (Top Bar)
 * @param {Array} users - Available users
 * @param {Object} currentUser - Current user
 * @returns {string} HTML string
 */
function renderUserSwitcher(users, currentUser) {
    const roleColors = {
        coach: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        client: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    };

    const roleLabels = {
        coach: 'Coach',
        client: 'Client'
    };

    return `
        <div class="flex items-start justify-between gap-4">
            <div class="flex flex-col gap-2 flex-1">
                <div class="flex items-center gap-2">
                    <i data-lucide="user" class="w-5 h-5 text-gray-600 dark:text-gray-400"></i>
                    <span class="font-medium text-gray-900 dark:text-gray-100">${currentUser.name}</span>
                </div>
                <div class="flex items-center gap-3">
                    ${createBadge({
                        text: roleLabels[currentUser.role],
                        className: roleColors[currentUser.role]
                    })}
                    <!-- User Selector -->
                    <div class="relative">
                        <select 
                            id="user-selector"
                            class="flex h-9 items-center justify-between rounded-md border border-input bg-input-background dark:bg-input/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            onchange="handleUserSwitch(this.value)"
                        >
                            ${users.map(user => `
                                <option value="${user.id}" ${user.id === currentUser.id ? 'selected' : ''}>
                                    ${user.name} (${roleLabels[user.role]})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-3">
                <!-- Theme Toggle -->
                <div id="theme-toggle-container"></div>
            </div>
        </div>
    `;
}

/**
 * Render Weight Table
 * @param {Array} entries - Weight entries
 * @param {Object} options - Options
 * @returns {string} HTML string
 */
function renderWeightTable(entries, options = {}) {
    const {
        unit = 'kg',
        canEdit = false,
        showMovingAverage = true,
        physiquePhotos = []
    } = options;

    if (!entries || entries.length === 0) {
        return `
            <div class="text-center py-12">
                <i data-lucide="scale" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">No weight entries yet</p>
                <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Start by adding your first weight entry</p>
            </div>
        `;
    }

    // Group entries by month
    const grouped = groupEntriesByMonth(entries);
    const monthKeys = Object.keys(grouped).sort().reverse();

    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T12:00:00');
        const day = date.getDate();
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        return { day, weekday };
    };

    const getWeeklyRateColor = (rate) => {
        if (rate > 0) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        if (rate < 0) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    };

    const hasPhotoForDate = (date) => {
        return physiquePhotos.find(photo => photo.date === date);
    };

    let html = '<div class="space-y-6">';

    monthKeys.forEach(monthKey => {
        const monthEntries = grouped[monthKey];
        const monthLabel = formatMonthYear(monthKey);

        html += `
            <div class="space-y-2">
                <!-- Month Header -->
                <div class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">${monthLabel}</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">${monthEntries.length} entries</span>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b dark:border-gray-700">
                                <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Date</th>
                                <th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Recorded</th>
                                ${showMovingAverage ? '<th class="text-right py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Moving Average</th>' : ''}
                                <th class="text-center py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Weekly Rate</th>
                                <th class="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monthEntries.map((entry, index) => {
                                const { day, weekday } = formatDate(entry.date);
                                const photo = hasPhotoForDate(entry.date);
                                const hasNotes = entry.notes && entry.notes.trim().length > 0;
                                
                                return `
                                    <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <!-- Date -->
                                        <td class="py-3 px-3">
                                            <div class="flex items-center gap-2">
                                                <div class="text-center min-w-[50px]">
                                                    <div class="text-2xl font-medium text-gray-900 dark:text-gray-100">${day}</div>
                                                    <div class="text-xs text-gray-500 dark:text-gray-400">${weekday}</div>
                                                </div>
                                                ${photo ? `
                                                    <button 
                                                        class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                        onclick="viewPhoto('${photo.id}')"
                                                        title="View photo"
                                                    >
                                                        <i data-lucide="camera" class="w-4 h-4 text-blue-600 dark:text-blue-400"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>

                                        <!-- Weight -->
                                        <td class="py-3 px-3 text-right">
                                            <span class="font-medium text-gray-900 dark:text-gray-100">
                                                ${entry.weight.toFixed(1)} ${unit}
                                            </span>
                                        </td>

                                        <!-- Moving Average -->
                                        ${showMovingAverage ? `
                                            <td class="py-3 px-3 text-right">
                                                <span class="text-gray-600 dark:text-gray-400">
                                                    ${entry.movingAverage ? entry.movingAverage.toFixed(1) : '-'} ${unit}
                                                </span>
                                            </td>
                                        ` : ''}

                                        <!-- Weekly Rate -->
                                        <td class="py-3 px-3">
                                            <div class="flex justify-center">
                                                ${entry.weeklyRate !== undefined && entry.weeklyRate !== 0 ? `
                                                    <span class="inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${getWeeklyRateColor(entry.weeklyRate)}">
                                                        ${entry.weeklyRate > 0 ? '↑' : '↓'} ${Math.abs(entry.weeklyRate).toFixed(1)}
                                                    </span>
                                                ` : '<span class="text-gray-400 dark:text-gray-500">-</span>'}
                                            </div>
                                        </td>

                                        <!-- Notes -->
                                        <td class="py-3 px-3">
                                            ${hasNotes ? `
                                                <div class="flex items-center gap-2">
                                                    <button 
                                                        class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                        onclick="viewNotes('${entry.id}')"
                                                        title="View notes"
                                                    >
                                                        <i data-lucide="message-square" class="w-4 h-4 text-gray-600 dark:text-gray-400"></i>
                                                    </button>
                                                    ${canEdit ? `
                                                        <button 
                                                            class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-xs text-blue-600 dark:text-blue-400"
                                                            onclick="editNotes('${entry.id}', '${escapeHtml(entry.notes)}')"
                                                        >
                                                            Edit
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            ` : canEdit ? `
                                                <button 
                                                    class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                                    onclick="addNotes('${entry.id}')"
                                                >
                                                    Add notes
                                                </button>
                                            ` : '<span class="text-gray-400 dark:text-gray-500">-</span>'}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

/**
 * Render Client Logbook
 * @param {Object} client - Client data
 * @returns {string} HTML string
 */
function renderClientLogbook(client) {
    const stats = calculateClientStats(client);

    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="text-center">
                <h1 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Weight Tracker</h1>
                <p class="text-gray-600 dark:text-gray-400">Track your progress and stay consistent</p>
            </div>

            <!-- Stats Cards -->
            ${renderStatsCards(client, stats)}

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-3">
                ${createButton({
                    text: 'Add Weight Entry',
                    icon: 'plus',
                    size: 'lg',
                    onClick: 'openAddWeightDialog()',
                    className: 'w-full sm:w-auto'
                })}
                ${createButton({
                    text: 'Request Photo',
                    icon: 'camera',
                    size: 'lg',
                    variant: 'outline',
                    onClick: 'openRequestPhotoDialog()',
                    className: 'w-full sm:w-auto'
                })}
            </div>

            <!-- Weight Chart - HIDDEN (can be re-enabled later) -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6" style="display: none;">
                <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Weight Trend</h3>
                <div id="weight-chart-container">
                    <canvas id="weight-chart" height="300"></canvas>
                </div>
            </div>

            <!-- Weight Table -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Weight Log</h3>
                    <button 
                        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        onclick="toggleSettings()"
                    >
                        <i data-lucide="settings" class="w-4 h-4"></i>
                    </button>
                </div>
                <div id="weight-table">
                    ${renderWeightTable(client.weightEntries, {
                        unit: client.unit,
                        canEdit: true,
                        showMovingAverage: client.showMovingAverage !== false,
                        physiquePhotos: client.physiquePhotos || []
                    })}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Stats Cards
 * @param {Object} client - Client data
 * @param {Object} stats - Calculated stats
 * @returns {string} HTML string
 */
function renderStatsCards(client, stats) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Current Weight -->
            ${createCard({
                content: `
                    <div class="flex items-center gap-3">
                        <i data-lucide="scale" class="w-8 h-8 text-blue-600 dark:text-blue-400"></i>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Current Weight</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                ${stats.currentWeight.toFixed(1)} ${client.unit}
                            </p>
                        </div>
                    </div>
                `,
                className: 'p-4'
            })}

            <!-- Lowest Weight -->
            ${createCard({
                content: `
                    <div class="flex items-center gap-3">
                        <i data-lucide="trending-down" class="w-8 h-8 text-green-600 dark:text-green-400"></i>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Lowest</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                ${stats.lowestWeight.toFixed(1)} ${client.unit}
                            </p>
                        </div>
                    </div>
                `,
                className: 'p-4'
            })}

            <!-- Highest Weight -->
            ${createCard({
                content: `
                    <div class="flex items-center gap-3">
                        <i data-lucide="trending-up" class="w-8 h-8 text-red-600 dark:text-red-400"></i>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Highest</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                ${stats.highestWeight.toFixed(1)} ${client.unit}
                            </p>
                        </div>
                    </div>
                `,
                className: 'p-4'
            })}

            <!-- Target Rate -->
            ${createCard({
                content: `
                    <div class="flex items-center gap-3">
                        <i data-lucide="target" class="w-8 h-8 text-purple-600 dark:text-purple-400"></i>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Target Rate</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                ${client.targetWeeklyRate > 0 ? '+' : ''}${client.targetWeeklyRate.toFixed(1)} ${client.unit}/wk
                            </p>
                        </div>
                    </div>
                `,
                className: 'p-4'
            })}
        </div>
    `;
}

/**
 * Calculate Client Stats
 * @param {Object} client - Client data
 * @returns {Object} Stats
 */
function calculateClientStats(client) {
    if (!client.weightEntries || client.weightEntries.length === 0) {
        return {
            currentWeight: 0,
            lowestWeight: 0,
            highestWeight: 0,
            totalEntries: 0,
            streak: 0
        };
    }

    const sorted = sortEntriesByDate(client.weightEntries);
    const weights = sorted.map(e => e.weight);

    return {
        currentWeight: sorted[0].weight,
        lowestWeight: Math.min(...weights),
        highestWeight: Math.max(...weights),
        totalEntries: client.weightEntries.length,
        streak: calculateStreak(sorted)
    };
}

/**
 * Calculate weight entry streak
 * @param {Array} sortedEntries - Sorted entries
 * @returns {number} Streak count
 */
function calculateStreak(sortedEntries) {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date);
        entryDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Render Coach Dashboard
 * @param {Object} coach - Coach data
 * @param {Array} alerts - Alerts
 * @returns {string} HTML string
 */
function renderCoachDashboard(coach, alerts) {
    const unreadAlerts = alerts.filter(a => !a.isRead);

    return `
        <div class="space-y-6">
            <!-- Clients Table -->
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Name</th>
                                    <th class="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Current Weight</th>
                                    <th class="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Rate</th>
                                    <th class="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Target</th>
                                    <th class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                        <span class="hide-mobile">Actions</span>
                                        <span class="show-mobile"></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                ${coach.clients.map(client => renderClientRow(client)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Client Row for Coach Dashboard Table
 * @param {Object} client - Client data
 * @returns {string} HTML string
 */
function renderClientRow(client) {
    const stats = calculateClientStats(client);
    const lastEntry = client.weightEntries && client.weightEntries.length > 0
        ? sortEntriesByDate(client.weightEntries)[0]
        : null;
    
    // Calculate current weekly rate if there's data
    let weeklyRate = 0;
    if (lastEntry && client.weightEntries.length >= 3) {
        const sorted = sortEntriesByDate(client.weightEntries);
        weeklyRate = calculateWeeklyRate(sorted, 0);
    }
    
    // Check if target rate is deviated (outside recommended range)
    const targetRate = client.targetWeeklyRate || 0;
    const recommendedMin = -1.0; // -1.0 kg/week
    const recommendedMax = -0.25; // -0.25 kg/week
    const isDeviated = targetRate < recommendedMin || targetRate > recommendedMax;
    
    const getWeeklyRateColor = (rate) => {
        if (rate > 0) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        if (rate < 0) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    };

    return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-4">
                <div>
                    <div class="text-gray-900 dark:text-gray-100">${client.name}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${client.email}</div>
                </div>
            </td>
            <td class="px-4 py-4">
                ${lastEntry ? `
                    <span class="text-gray-900 dark:text-gray-100">${lastEntry.weight.toFixed(1)} ${client.unit}</span>
                ` : `
                    <span class="text-gray-500 dark:text-gray-400">-</span>
                `}
            </td>
            <td class="px-4 py-4">
                ${weeklyRate !== 0 ? `
                    <span class="inline-flex items-center px-2 py-1 rounded-md border text-xs ${getWeeklyRateColor(weeklyRate)}">
                        ${weeklyRate > 0 ? '+' : ''}${weeklyRate.toFixed(1)} ${client.unit}/wk
                    </span>
                ` : `
                    <span class="text-gray-500 dark:text-gray-400">-</span>
                `}
            </td>
            <td class="px-4 py-4">
                <span class="inline-flex items-center px-2 py-1 rounded-md border text-xs ${isDeviated ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'}">
                    ${targetRate > 0 ? '+' : ''}${targetRate.toFixed(1)} ${client.unit}/wk
                </span>
            </td>
            <td class="px-4 py-4 text-right">
                <button 
                    class="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 h-9 w-9 sm:w-auto sm:px-3"
                    onclick="viewClientDetails('${client.id}')"
                    title="Settings"
                >
                    <span class="hide-mobile text-gray-700 dark:text-gray-300">Settings</span>
                    <i data-lucide="more-vertical" class="show-mobile w-5 h-5 text-gray-600 dark:text-gray-400"></i>
                </button>
            </td>
        </tr>
    `;
}

/**
 * Render Alerts Panel
 * @param {Array} alerts - Alerts to display
 * @returns {string} HTML string
 */
function renderAlertsPanel(alerts) {
    return createCard({
        title: 'Recent Alerts',
        content: `
            <div class="space-y-2 max-h-[400px] overflow-y-auto">
                ${alerts.map(alert => `
                    <div class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <i data-lucide="${getAlertIcon(alert.type)}" class="w-5 h-5 mt-0.5 ${getAlertIconColor(alert.type)}"></i>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-gray-900 dark:text-gray-100">${alert.message}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${getRelativeTime(alert.date)}</p>
                        </div>
                        ${createButton({
                            text: 'Mark Read',
                            variant: 'ghost',
                            size: 'sm',
                            onClick: `markAlertRead('${alert.id}')`
                        })}
                    </div>
                `).join('')}
            </div>
        `
    });
}

/**
 * Get alert icon based on type
 * @param {string} type - Alert type
 * @returns {string} Icon name
 */
function getAlertIcon(type) {
    const icons = {
        lowest: 'trending-down',
        highest: 'trending-up',
        rate_deviation: 'alert-circle',
        no_weight_entry: 'calendar-x',
        milestone_achieved: 'trophy',
        target_streak: 'zap'
    };
    return icons[type] || 'info';
}

/**
 * Get alert icon color based on type
 * @param {string} type - Alert type
 * @returns {string} Color class
 */
function getAlertIconColor(type) {
    const colors = {
        lowest: 'text-green-600 dark:text-green-400',
        highest: 'text-red-600 dark:text-red-400',
        rate_deviation: 'text-yellow-600 dark:text-yellow-400',
        no_weight_entry: 'text-gray-600 dark:text-gray-400',
        milestone_achieved: 'text-purple-600 dark:text-purple-400',
        target_streak: 'text-blue-600 dark:text-blue-400'
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400';
}

/**
 * Render Notifications Panel (Full Screen)
 * @param {Array} alerts - All alerts
 * @returns {string} HTML string
 */
function renderNotificationsPanel(alerts) {
    const unreadAlerts = alerts.filter(a => !a.isRead);
    const readAlerts = alerts.filter(a => a.isRead);

    return `
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between">
                <h2 class="text-xl text-gray-900 dark:text-gray-100">Notifications</h2>
                <button 
                    onclick="closeNotificationsPanel()"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <i data-lucide="x" class="w-6 h-6 text-gray-600 dark:text-gray-400"></i>
                </button>
            </div>

            <!-- Tabs -->
            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="flex">
                    <button 
                        id="unread-tab"
                        class="flex-1 px-4 py-3 text-sm border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                        onclick="switchNotificationTab('unread')"
                    >
                        Unread (${unreadAlerts.length})
                    </button>
                    <button 
                        id="read-tab"
                        class="flex-1 px-4 py-3 text-sm border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        onclick="switchNotificationTab('read')"
                    >
                        Read (${readAlerts.length})
                    </button>
                </div>
            </div>

            <!-- Notifications List -->
            <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div id="unread-notifications" class="p-4 space-y-3">
                    ${unreadAlerts.length > 0 ? unreadAlerts.map(alert => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                            <div class="flex items-start gap-3">
                                <i data-lucide="${getAlertIcon(alert.type)}" class="w-5 h-5 mt-0.5 ${getAlertIconColor(alert.type)}"></i>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 dark:text-gray-100">${alert.message}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${getRelativeTime(alert.date)}</p>
                                </div>
                            </div>
                            <button 
                                class="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                onclick="markAlertRead('${alert.id}')"
                            >
                                Mark as read
                            </button>
                        </div>
                    `).join('') : `
                        <div class="text-center py-12">
                            <i data-lucide="bell-off" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <p class="text-gray-600 dark:text-gray-400">No unread notifications</p>
                        </div>
                    `}
                </div>

                <div id="read-notifications" class="p-4 space-y-3 hidden">
                    ${readAlerts.length > 0 ? readAlerts.map(alert => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm opacity-75">
                            <div class="flex items-start gap-3">
                                <i data-lucide="${getAlertIcon(alert.type)}" class="w-5 h-5 mt-0.5 ${getAlertIconColor(alert.type)}"></i>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 dark:text-gray-100">${alert.message}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${getRelativeTime(alert.date)}</p>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center py-12">
                            <i data-lucide="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <p class="text-gray-600 dark:text-gray-400">No read notifications</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}
