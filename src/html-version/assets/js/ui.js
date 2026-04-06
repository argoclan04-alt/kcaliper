/**
 * UI.js - Reusable UI Components
 * Vanilla JavaScript equivalents to shadcn/ui components
 */

/**
 * Merge class names (replaces cn utility)
 */
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

/**
 * Create Button
 * @param {Object} options - Button options
 * @returns {string} HTML string
 */
function createButton(options = {}) {
    const {
        text = '',
        variant = 'default',     // default, destructive, outline, secondary, ghost, link
        size = 'default',         // default, sm, lg, icon
        icon = null,              // Lucide icon name
        iconPosition = 'left',    // left, right
        onClick = '',
        disabled = false,
        fullWidth = false,
        className = '',
        id = '',
        type = 'button',
        ariaLabel = ''
    } = options;

    const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60',
        outline: 'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline'
    };

    const sizes = {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9 rounded-md'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const classes = cn(baseClasses, variants[variant], sizes[size], widthClass, className);

    const iconLeft = icon && iconPosition === 'left' ? `<i data-lucide="${icon}" class="w-4 h-4"></i>` : '';
    const iconRight = icon && iconPosition === 'right' ? `<i data-lucide="${icon}" class="w-4 h-4"></i>` : '';

    return `
        <button 
            type="${type}"
            class="${classes}"
            ${disabled ? 'disabled' : ''}
            ${onClick ? `onclick="${onClick}"` : ''}
            ${id ? `id="${id}"` : ''}
            ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}
        >
            ${iconLeft}
            ${text}
            ${iconRight}
        </button>
    `;
}

/**
 * Create Card
 * @param {Object} options - Card options
 * @returns {string} HTML string
 */
function createCard(options = {}) {
    const {
        title = '',
        description = '',
        content = '',
        footer = '',
        action = '',
        className = '',
        id = ''
    } = options;

    const hasHeader = title || description || action;
    const hasFooter = footer;

    return `
        <div 
            class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border ${className}"
            ${id ? `id="${id}"` : ''}
        >
            ${hasHeader ? `
                <div class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 ${action ? 'grid-cols-[1fr_auto]' : ''} ${hasFooter ? 'border-b pb-6' : ''}">
                    ${title ? `<h4 class="leading-none">${title}</h4>` : ''}
                    ${description ? `<p class="text-muted-foreground">${description}</p>` : ''}
                    ${action ? `<div class="col-start-2 row-span-2 row-start-1 self-start justify-self-end">${action}</div>` : ''}
                </div>
            ` : ''}
            ${content ? `
                <div class="px-6 ${!hasFooter ? 'pb-6' : ''}">
                    ${content}
                </div>
            ` : ''}
            ${hasFooter ? `
                <div class="flex items-center px-6 pb-6 border-t pt-6">
                    ${footer}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Create Badge
 * @param {Object} options - Badge options
 * @returns {string} HTML string
 */
function createBadge(options = {}) {
    const {
        text = '',
        variant = 'default',      // default, secondary, destructive, outline
        icon = null,
        className = '',
        onClick = ''
    } = options;

    const baseClasses = 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden';

    const variants = {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-white dark:bg-destructive/60',
        outline: 'text-foreground'
    };

    const classes = cn(baseClasses, variants[variant], className);
    const iconHtml = icon ? `<i data-lucide="${icon}" class="w-3 h-3"></i>` : '';
    const isClickable = onClick ? 'cursor-pointer' : '';

    return `
        <span 
            class="${classes} ${isClickable}"
            ${onClick ? `onclick="${onClick}"` : ''}
        >
            ${iconHtml}
            ${text}
        </span>
    `;
}

/**
 * Create Input
 * @param {Object} options - Input options
 * @returns {string} HTML string
 */
function createInput(options = {}) {
    const {
        type = 'text',
        placeholder = '',
        value = '',
        id = '',
        name = '',
        required = false,
        disabled = false,
        className = '',
        onInput = '',
        onChange = '',
        min = '',
        max = '',
        step = ''
    } = options;

    const baseClasses = 'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

    return `
        <input 
            type="${type}"
            class="${cn(baseClasses, className)}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${value ? `value="${escapeHtml(value)}"` : ''}
            ${id ? `id="${id}"` : ''}
            ${name ? `name="${name}"` : ''}
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${onInput ? `oninput="${onInput}"` : ''}
            ${onChange ? `onchange="${onChange}"` : ''}
            ${min ? `min="${min}"` : ''}
            ${max ? `max="${max}"` : ''}
            ${step ? `step="${step}"` : ''}
        />
    `;
}

/**
 * Create Textarea
 * @param {Object} options - Textarea options
 * @returns {string} HTML string
 */
function createTextarea(options = {}) {
    const {
        placeholder = '',
        value = '',
        id = '',
        name = '',
        rows = 3,
        required = false,
        disabled = false,
        className = '',
        onInput = ''
    } = options;

    const baseClasses = 'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

    return `
        <textarea 
            class="${cn(baseClasses, className)}"
            rows="${rows}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${id ? `id="${id}"` : ''}
            ${name ? `name="${name}"` : ''}
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${onInput ? `oninput="${onInput}"` : ''}
        >${escapeHtml(value)}</textarea>
    `;
}

/**
 * Create Label
 * @param {Object} options - Label options
 * @returns {string} HTML string
 */
function createLabel(options = {}) {
    const {
        text = '',
        htmlFor = '',
        required = false,
        className = ''
    } = options;

    return `
        <label 
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}"
            ${htmlFor ? `for="${htmlFor}"` : ''}
        >
            ${text}
            ${required ? '<span class="text-destructive ml-1">*</span>' : ''}
        </label>
    `;
}

/**
 * Create Modal/Dialog
 * @param {Object} options - Modal options
 * @returns {string} Modal ID (use showModal(id) to display)
 */
function createModal(options = {}) {
    const {
        id = generateId('modal'),
        title = '',
        description = '',
        content = '',
        footer = '',
        onClose = null,
        size = 'default',       // default, sm, lg, xl, full
        closeButton = true
    } = options;

    const sizes = {
        default: 'sm:max-w-lg',
        sm: 'sm:max-w-sm',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
        full: 'sm:max-w-[90vw]'
    };

    const modalHtml = `
        <div id="${id}" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" data-modal>
            <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 bg-background rounded-lg border p-6 shadow-lg duration-200 ${sizes[size]}">
                ${closeButton ? `
                    <button 
                        class="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        onclick="closeModal('${id}')"
                        aria-label="Close"
                    >
                        <i data-lucide="x" class="h-4 w-4"></i>
                    </button>
                ` : ''}
                ${title || description ? `
                    <div class="flex flex-col gap-2 text-center sm:text-left">
                        ${title ? `<h3 class="text-lg leading-none font-semibold">${title}</h3>` : ''}
                        ${description ? `<p class="text-sm text-muted-foreground">${description}</p>` : ''}
                    </div>
                ` : ''}
                <div class="modal-content">
                    ${content}
                </div>
                ${footer ? `
                    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        ${footer}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add to modal container
    const container = document.getElementById('modal-container');
    if (container) {
        container.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add event listener to close on backdrop click
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(id);
                    if (onClose) onClose();
                }
            });
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    return id;
}

/**
 * Show Modal
 * @param {string} modalId - Modal ID
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Modal
 * @param {string} modalId - Modal ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

/**
 * Remove Modal from DOM
 * @param {string} modalId - Modal ID
 */
function removeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

/**
 * Create Toast Notification
 * @param {Object} options - Toast options
 */
function createToast(options = {}) {
    const {
        message = '',
        type = 'default',        // default, success, error, warning, info
        duration = 4000,
        icon = null,
        action = null
    } = options;

    const id = generateId('toast');

    const types = {
        default: {
            bg: 'bg-background',
            border: 'border-border',
            text: 'text-foreground',
            icon: icon || 'info'
        },
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-900 dark:text-green-100',
            icon: icon || 'check-circle'
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-900 dark:text-red-100',
            icon: icon || 'alert-circle'
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-900 dark:text-yellow-100',
            icon: icon || 'alert-triangle'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-900 dark:text-blue-100',
            icon: icon || 'info'
        }
    };

    const config = types[type];

    const toastHtml = `
        <div id="${id}" class="toast ${config.bg} ${config.border} ${config.text} min-w-[300px] max-w-[500px] rounded-lg border p-4 shadow-lg flex items-start gap-3">
            <i data-lucide="${config.icon}" class="w-5 h-5 mt-0.5 shrink-0"></i>
            <div class="flex-1">
                <p class="text-sm font-medium">${message}</p>
                ${action ? `
                    <button 
                        class="text-xs underline mt-1 hover:no-underline"
                        onclick="${action.onClick}"
                    >
                        ${action.label}
                    </button>
                ` : ''}
            </div>
            <button 
                class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                onclick="removeToast('${id}')"
                aria-label="Close"
            >
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    const container = document.getElementById('toast-container');
    if (container) {
        container.insertAdjacentHTML('beforeend', toastHtml);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }

    return id;
}

/**
 * Remove Toast
 * @param {string} toastId - Toast ID
 */
function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }
}

/**
 * Create Switch/Toggle
 * @param {Object} options - Switch options
 * @returns {string} HTML string
 */
function createSwitch(options = {}) {
    const {
        id = generateId('switch'),
        checked = false,
        disabled = false,
        label = '',
        onChange = '',
        className = ''
    } = options;

    return `
        <div class="flex items-center gap-2 ${className}">
            <button
                type="button"
                role="switch"
                aria-checked="${checked}"
                id="${id}"
                class="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-input'}"
                ${disabled ? 'disabled' : ''}
                onclick="toggleSwitch('${id}', '${onChange}')"
            >
                <span class="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}"></span>
            </button>
            ${label ? `<label for="${id}" class="text-sm font-medium cursor-pointer">${label}</label>` : ''}
        </div>
    `;
}

/**
 * Toggle Switch State
 * @param {string} switchId - Switch ID
 * @param {string} onChangeFunc - onChange function name
 */
function toggleSwitch(switchId, onChangeFunc) {
    const switchEl = document.getElementById(switchId);
    if (!switchEl) return;

    const isChecked = switchEl.getAttribute('aria-checked') === 'true';
    const newState = !isChecked;

    switchEl.setAttribute('aria-checked', newState);
    
    if (newState) {
        switchEl.classList.add('bg-primary');
        switchEl.classList.remove('bg-input');
        switchEl.querySelector('span').classList.add('translate-x-4');
        switchEl.querySelector('span').classList.remove('translate-x-0');
    } else {
        switchEl.classList.remove('bg-primary');
        switchEl.classList.add('bg-input');
        switchEl.querySelector('span').classList.remove('translate-x-4');
        switchEl.querySelector('span').classList.add('translate-x-0');
    }

    // Call onChange function if provided
    if (onChangeFunc) {
        window[onChangeFunc](newState);
    }
}

/**
 * Create Select Dropdown
 * @param {Object} options - Select options
 * @returns {string} HTML string
 */
function createSelect(options = {}) {
    const {
        id = '',
        name = '',
        value = '',
        options: selectOptions = [],
        placeholder = 'Select an option',
        onChange = '',
        disabled = false,
        className = ''
    } = options;

    const baseClasses = 'flex h-9 w-full items-center justify-between rounded-md border border-input bg-input-background dark:bg-input/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    return `
        <select 
            class="${cn(baseClasses, className)}"
            ${id ? `id="${id}"` : ''}
            ${name ? `name="${name}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${onChange ? `onchange="${onChange}"` : ''}
        >
            ${placeholder ? `<option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>` : ''}
            ${selectOptions.map(opt => `
                <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
                    ${opt.label}
                </option>
            `).join('')}
        </select>
    `;
}

/**
 * Create Spinner/Loader
 * @param {Object} options - Spinner options
 * @returns {string} HTML string
 */
function createSpinner(options = {}) {
    const {
        size = 'md',              // sm, md, lg
        className = ''
    } = options;

    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return `
        <div class="spinner border-muted border-t-primary rounded-full animate-spin ${sizes[size]} ${className}"></div>
    `;
}

/**
 * Create Alert
 * @param {Object} options - Alert options
 * @returns {string} HTML string
 */
function createAlert(options = {}) {
    const {
        title = '',
        message = '',
        variant = 'default',      // default, destructive
        icon = null,
        dismissible = false,
        onDismiss = '',
        className = ''
    } = options;

    const variants = {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
    };

    const defaultIcons = {
        default: 'info',
        destructive: 'alert-circle'
    };

    const alertIcon = icon || defaultIcons[variant];
    const id = dismissible ? generateId('alert') : '';

    return `
        <div 
            ${id ? `id="${id}"` : ''}
            class="relative w-full rounded-lg border p-4 ${variants[variant]} ${className}"
        >
            <div class="flex gap-3">
                ${alertIcon ? `<i data-lucide="${alertIcon}" class="h-4 w-4 mt-0.5"></i>` : ''}
                <div class="flex-1">
                    ${title ? `<h5 class="mb-1 font-medium leading-none tracking-tight">${title}</h5>` : ''}
                    ${message ? `<div class="text-sm opacity-90">${message}</div>` : ''}
                </div>
                ${dismissible ? `
                    <button 
                        class="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity"
                        onclick="document.getElementById('${id}').remove(); ${onDismiss ? onDismiss : ''}"
                        aria-label="Dismiss"
                    >
                        <i data-lucide="x" class="h-4 w-4"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Show/Hide Loading Overlay
 * @param {boolean} show - Show or hide
 */
function setLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Add CSS for animations
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
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
