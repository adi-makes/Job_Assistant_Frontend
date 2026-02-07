// Authentication Module for Job Assistant
// Handles user registration, login, logout, and token management

// Configuration - UPDATE THIS WITH YOUR BACKEND API URL
const API_BASE_URL = 'http://localhost:8000'; // Change this to your backend URL

// Authentication API endpoints
const API_ENDPOINTS = {
    register: `${API_BASE_URL}/api/users/register/`,
    login: `${API_BASE_URL}/api/users/login/`,
    profile: `${API_BASE_URL}/api/users/profile/`
};

// LocalStorage keys
const STORAGE_KEYS = {
    token: 'auth_token',
    userId: 'user_id',
    username: 'username'
};

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @param {string} email - User's email
 * @returns {Promise<Object>} Response data with token
 */
async function register(username, password, email) {
    try {
        const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email })
        });

        const data = await response.json();

        if (response.status === 201) {
            // Registration successful
            if (data.token) {
                saveAuthData(data.token, data.user_id, data.username || username);
            }
            return { success: true, data };
        } else {
            // Registration failed
            return { success: false, error: data.error || 'Registration failed' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Login an existing user
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data with token and user info
 */
async function login(username, password) {
    try {
        const response = await fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            saveAuthData(data.token, data.user_id, data.username);
            return { success: true, data };
        } else {
            // Login failed
            return { success: false, error: data.error || 'Invalid credentials' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

/**
 * Logout the current user
 */
function logout() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.username);
    window.location.href = 'login.html';
}

/**
 * Get the authentication token
 * @returns {string|null} The auth token or null if not found
 */
function getToken() {
    return localStorage.getItem(STORAGE_KEYS.token);
}

/**
 * Get the current user ID
 * @returns {string|null} The user ID or null if not found
 */
function getUserId() {
    return localStorage.getItem(STORAGE_KEYS.userId);
}

/**
 * Get the current username
 * @returns {string|null} The username or null if not found
 */
function getUsername() {
    return localStorage.getItem(STORAGE_KEYS.username);
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
function isAuthenticated() {
    return getToken() !== null;
}

/**
 * Get headers with authentication token
 * @returns {Object} Headers object with Authorization token
 */
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Token ${token}` : ''
    };
}

/**
 * Save authentication data to localStorage
 * @private
 */
function saveAuthData(token, userId, username) {
    localStorage.setItem(STORAGE_KEYS.token, token);
    if (userId) localStorage.setItem(STORAGE_KEYS.userId, userId);
    if (username) localStorage.setItem(STORAGE_KEYS.username, username);
}

/**
 * Protect a page by checking authentication
 * Redirects to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

/**
 * Display error message to user
 * @param {HTMLElement} container - Element to display error in
 * @param {string} message - Error message to display
 */
function showError(container, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'padding: 12px; background: #FEE2E2; color: #DC2626; border-radius: 6px; margin-bottom: 15px; border: 1px solid #FCA5A5;';
    errorDiv.textContent = message;

    // Remove any existing error messages
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    container.insertBefore(errorDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Display success message to user
 * @param {HTMLElement} container - Element to display success in
 * @param {string} message - Success message to display
 */
function showSuccess(container, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = 'padding: 12px; background: #D1FAE5; color: #059669; border-radius: 6px; margin-bottom: 15px; border: 1px solid #6EE7B7;';
    successDiv.textContent = message;

    // Remove any existing success messages
    const existingSuccess = container.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    container.insertBefore(successDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    return { isValid: true, message: '' };
}

// Export functions for use in other scripts
window.Auth = {
    register,
    login,
    logout,
    getToken,
    getUserId,
    getUsername,
    isAuthenticated,
    getAuthHeaders,
    requireAuth,
    showError,
    showSuccess,
    validateEmail,
    validatePassword,
    API_ENDPOINTS
};
