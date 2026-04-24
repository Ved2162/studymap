/**
 * StudyMap - Application Configuration
 * This file contains all configuration needed for frontend-backend integration
 */

// ============================================
// SERVER CONFIGURATION
// ============================================

// Auto-detect environment: if running on Netlify (or any non-localhost),
// use the deployed Render backend; otherwise use localhost for development.
const IS_PRODUCTION = !['localhost', '127.0.0.1'].includes(window.location.hostname);

// ── IMPORTANT: Update this after deploying your backend to Render ──
// Replace 'YOUR_RENDER_APP_NAME' with the actual Render service name
// e.g. 'studymap-backend-xxxx.onrender.com'
const PRODUCTION_BACKEND_URL = 'https://studymap-backend-86ft.onrender.com';

// Backend Server Configuration
const SERVER_CONFIG = {
    // Backend API Server (Flask)
    backend: {
        host: IS_PRODUCTION ? new URL(PRODUCTION_BACKEND_URL).hostname : 'localhost',
        port: IS_PRODUCTION ? (new URL(PRODUCTION_BACKEND_URL).port || 443) : 5000,
        protocol: IS_PRODUCTION ? 'https' : 'http',
        
        // Full URL for API calls
        get baseUrl() {
            if (IS_PRODUCTION) {
                return PRODUCTION_BACKEND_URL;
            }
            return `${this.protocol}://${this.host}:${this.port}`;
        },
        get apiUrl() {
            return `${this.baseUrl}/api`;
        }
    },
    
    // Frontend Server (HTTP Server)
    frontend: {
        host: IS_PRODUCTION ? window.location.hostname : 'localhost',
        port: IS_PRODUCTION ? (window.location.port || 443) : 8000,
        protocol: IS_PRODUCTION ? 'https' : 'http',
        
        get baseUrl() {
            if (IS_PRODUCTION) {
                return `${window.location.protocol}//${window.location.host}`;
            }
            return `${this.protocol}://${this.host}:${this.port}`;
        }
    },
    
    // JWT Token Configuration
    jwt: {
        storageKey: 'studymap-token',
        userStorageKey: 'studymap-user',
        expirationMinutes: 43200  // 30 days
    },
    
    // File Upload Configuration
    upload: {
        maxFileSize: 16 * 1024 * 1024,  // 16MB
        allowedFormats: ['pdf', 'PDF'],
        uploadFolder: 'uploads'
    },
    
    // Application Configuration
    app: {
        name: 'StudyMap',
        version: '1.0.0',
        debug: !IS_PRODUCTION
    }
};

// Log active configuration (only in dev)
if (!IS_PRODUCTION) {
    console.log('[StudyMap] Running in DEVELOPMENT mode');
    console.log('[StudyMap] Backend URL:', SERVER_CONFIG.backend.baseUrl);
} else {
    console.log('[StudyMap] Running in PRODUCTION mode');
    console.log('[StudyMap] Backend URL:', SERVER_CONFIG.backend.baseUrl);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if backend server is accessible
 */
async function checkBackendConnection() {
    try {
        const response = await fetch(`${SERVER_CONFIG.backend.apiUrl}/auth/me`, {
            method: 'GET',
            timeout: 5000
        });
        return response.ok || response.status === 401;  // 401 means server is up but not authenticated
    } catch (error) {
        console.warn('Backend connection check failed:', error);
        return false;
    }
}

/**
 * Get API endpoint URL
 */
function getEndpoint(path) {
    return `${SERVER_CONFIG.backend.apiUrl}${path}`;
}

/**
 * Get stored JWT token
 */
function getToken() {
    return localStorage.getItem(SERVER_CONFIG.jwt.storageKey);
}

/**
 * Save JWT token
 */
function saveToken(token) {
    localStorage.setItem(SERVER_CONFIG.jwt.storageKey, token);
}

/**
 * Get stored user data
 */
function getUser() {
    const userJson = localStorage.getItem(SERVER_CONFIG.jwt.userStorageKey);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Save user data
 */
function saveUser(user) {
    localStorage.setItem(SERVER_CONFIG.jwt.userStorageKey, JSON.stringify(user));
}

/**
 * Clear authentication (logout)
 */
function clearAuth() {
    localStorage.removeItem(SERVER_CONFIG.jwt.storageKey);
    localStorage.removeItem(SERVER_CONFIG.jwt.userStorageKey);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

// ============================================
// EXPORT FOR OTHER FILES
// ============================================

// If using modules, export the config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SERVER_CONFIG;
}
