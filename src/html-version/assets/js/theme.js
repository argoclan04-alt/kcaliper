/**
 * Theme.js - Dark/Light Mode System
 * Manages theme switching with persistence
 */

const ThemeManager = {
    STORAGE_KEY: 'weight_tracker_theme',
    currentTheme: 'light',
    
    /**
     * Initialize theme system
     */
    init() {
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        this.currentTheme = savedTheme || systemPreference;
        this.applyTheme(this.currentTheme, false);
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        log('Theme system initialized: ' + this.currentTheme, 'info');
    },
    
    /**
     * Set theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            log('Invalid theme: ' + theme, 'error');
            return;
        }
        
        this.currentTheme = theme;
        this.applyTheme(theme, true);
        localStorage.setItem(this.STORAGE_KEY, theme);
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },
    
    /**
     * Toggle between light and dark
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    /**
     * Apply theme to DOM
     * @param {string} theme - 'light' or 'dark'
     * @param {boolean} animate - Whether to animate the transition
     */
    applyTheme(theme, animate = true) {
        const html = document.documentElement;
        
        if (animate) {
            // Add transition class temporarily
            html.classList.add('theme-transition');
            setTimeout(() => {
                html.classList.remove('theme-transition');
            }, 300);
        }
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    },
    
    /**
     * Update meta theme-color for mobile
     * @param {string} theme - Current theme
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set color based on theme
        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    },
    
    /**
     * Get current theme
     * @returns {string} 'light' or 'dark'
     */
    getTheme() {
        return this.currentTheme;
    },
    
    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    isDark() {
        return this.currentTheme === 'dark';
    },
    
    /**
     * Check if light mode is active
     * @returns {boolean}
     */
    isLight() {
        return this.currentTheme === 'light';
    },
    
    /**
     * Render theme toggle button
     * @param {string} containerId - ID of container element
     */
    renderToggleButton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            log('Theme toggle container not found: ' + containerId, 'error');
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'theme-toggle-btn';
        button.className = 'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = this.getToggleIcon();
        
        button.addEventListener('click', () => {
            this.toggle();
            button.innerHTML = this.getToggleIcon();
            
            // Reinitialize lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
        
        container.appendChild(button);
    },
    
    /**
     * Get toggle icon HTML based on current theme
     * @returns {string} HTML for icon
     */
    getToggleIcon() {
        if (this.isDark()) {
            return '<i data-lucide="sun" class="w-5 h-5 text-gray-700 dark:text-gray-300"></i>';
        } else {
            return '<i data-lucide="moon" class="w-5 h-5 text-gray-700 dark:text-gray-300"></i>';
        }
    },
    
    /**
     * Add theme toggle to existing button
     * @param {HTMLElement} button - Button element
     */
    attachToButton(button) {
        if (!button) return;
        
        button.addEventListener('click', () => {
            this.toggle();
        });
        
        // Update button icon on theme change
        window.addEventListener('themechange', () => {
            const icon = button.querySelector('i[data-lucide]');
            if (icon) {
                icon.setAttribute('data-lucide', this.isDark() ? 'sun' : 'moon');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}
