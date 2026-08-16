// ==========================================
// GLOBUS: GLOBAL THEME & SETTINGS ENGINE
// ==========================================
import { supabase } from './supabase-config.js';

class ThemeManager {
    constructor() {
        this.applyLocalTheme(); // Apply cached theme immediately
        this.syncWithDatabase(); // Fetch latest from DB
    }

    applyLocalTheme() {
        const themeColor = localStorage.getItem('globus_theme_color') || '#2563eb';
        document.documentElement.style.setProperty('--app-theme-color', themeColor);
        
        const hexToRgb = (hex) => {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '37, 99, 235';
        };
        document.documentElement.style.setProperty('--app-theme-rgb', hexToRgb(themeColor));
    }

    async syncWithDatabase() {
        try {
            const { data, error } = await supabase.from('institute_settings').select('theme_color, allow_guest_login').eq('id', 1).single();
            if (data && !error) {
                if(data.theme_color) localStorage.setItem('globus_theme_color', data.theme_color);
                localStorage.setItem('globus_allow_guest', data.allow_guest_login);
                this.applyLocalTheme();
                this.checkGuestLoginAccess();
            }
        } catch (err) {}
    }

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

    // Global Function to push Audit Logs
    static async logAction(moduleName, actionType, details) {
        try {
            const userEmail = localStorage.getItem('userEmail') || 'Unknown';
            const userRole = localStorage.getItem('userRole') || 'System';

            console.log(`[Audit Log] Sending to DB:`, moduleName, actionType);

            const { error } = await supabase.from('activity_logs').insert([{
                user_email: userEmail,
                user_role: userRole,
                module: moduleName,
                action_type: actionType,
                details: details
            }]);

            if (error) {
                console.error("[Audit Log] Supabase Error:", error.message);
            } else {
                console.log("[Audit Log] Successfully Saved!");
            }
        } catch (err) {
            console.error("[Audit Log] JS Error:", err);
        }
    }
}

// Make it globally accessible immediately (Without waiting for DOM load)
window.ThemeManager = ThemeManager;
new ThemeManager();
