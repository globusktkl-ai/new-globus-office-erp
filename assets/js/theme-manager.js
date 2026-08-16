// ==========================================
// GLOBUS: GLOBAL THEME & SETTINGS ENGINE
// ==========================================
import { supabase } from './supabase-config.js';

class ThemeManager {
    constructor() {
        this.applyLocalTheme(); // Apply cached theme immediately for zero-lag loading
        this.syncWithDatabase(); // Fetch latest from DB in background
    }

    // 1. Apply theme instantly from Local Storage
    applyLocalTheme() {
        const themeColor = localStorage.getItem('globus_theme_color') || '#2563eb';
        document.documentElement.style.setProperty('--app-theme-color', themeColor);
        
        // Convert HEX to RGB for shadow effects
        const hexToRgb = (hex) => {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '37, 99, 235';
        };
        document.documentElement.style.setProperty('--app-theme-rgb', hexToRgb(themeColor));
    }

    // 2. Fetch latest SaaS settings from Database
    async syncWithDatabase() {
        try {
            const { data, error } = await supabase.from('institute_settings').select('theme_color, allow_guest_login').eq('id', 1).single();
            if (data && !error) {
                // Update Local Storage
                if(data.theme_color) localStorage.setItem('globus_theme_color', data.theme_color);
                localStorage.setItem('globus_allow_guest', data.allow_guest_login);
                
                // Re-apply in case it changed
                this.applyLocalTheme();
                this.checkGuestLoginAccess();
            }
        } catch (err) {
            console.warn("Theme sync skipped (Offline or DB Error)");
        }
    }

    // 3. Control Guest Login Button Visibility (For login.html)
    checkGuestLoginAccess() {
        const guestBtn = document.querySelector('.btn-guest');
        if (guestBtn) {
            const allowGuest = localStorage.getItem('globus_allow_guest');
            if (allowGuest === 'false') {
                guestBtn.style.display = 'none';
                const divider = document.querySelector('.divider');
                if(divider) divider.style.display = 'none';
            } else {
                guestBtn.style.display = 'block';
            }
        }
    }

    // 4. Global Function to push Audit Logs to Database
    static async logAction(moduleName, actionType, details) {
        try {
            const userEmail = localStorage.getItem('userEmail') || 'Unknown';
            const userRole = localStorage.getItem('userRole') || 'System';

            await supabase.from('activity_logs').insert([{
                user_email: userEmail,
                user_role: userRole,
                module: moduleName,
                action_type: actionType, // CREATE, UPDATE, DELETE, LOGIN
                details: details
            }]);
        } catch (err) {
            console.error("Audit log failed to record:", err);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.ThemeManager = ThemeManager; // Make it globally accessible
    new ThemeManager();
});
