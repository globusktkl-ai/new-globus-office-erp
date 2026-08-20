// ==========================================
// GLOBUS: GLOBAL THEME & SETTINGS ENGINE
// ==========================================
import { supabase } from './supabase-config.js';

class ThemeManager {
    constructor() {
        this.applyLocalTheme(); 
        this.syncWithDatabase(); 

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initThemeButton());
        } else {
            this.initThemeButton();
        }
    }

    applyLocalTheme() {
        const themeColor = localStorage.getItem('globus_theme_color') || '#2563eb';
        document.documentElement.style.setProperty('--app-theme-color', themeColor);
        
        const hexToRgb = (hex) => {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '37, 99, 235';
        };
        document.documentElement.style.setProperty('--app-theme-rgb', hexToRgb(themeColor));

        const currentFile = window.location.pathname.toLowerCase();
        if (currentFile.includes('id card') || currentFile.includes('id%20card')) {
            document.body.classList.remove('dark-mode');
            return;
        }

        if (localStorage.getItem('globus_dark_mode') === 'true') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    async syncWithDatabase() {
        try {
            const { data, error } = await supabase.from('institute_settings').select('theme_color, guest_login_enabled, allow_guest_login, menu_style').eq('id', 1).single();
            if (data && !error) {
                if(data.theme_color) localStorage.setItem('globus_theme_color', data.theme_color);
                const guestEnabled = data.guest_login_enabled !== undefined ? data.guest_login_enabled : data.allow_guest_login;
                localStorage.setItem('globus_allow_guest', guestEnabled);
                if(data.menu_style) localStorage.setItem('globus_menu_style', data.menu_style);

                this.applyLocalTheme();
                this.checkGuestLoginAccess();
            }
        } catch (err) {}
    }

    checkGuestLoginAccess() {
        const guestBtn = document.querySelector('.btn-guest');
        if (guestBtn) {
            const allowGuest = localStorage.getItem('globus_allow_guest');
            const divider = document.querySelector('.divider');
            if (allowGuest === 'false') {
                guestBtn.style.display = 'none';
                if(divider) divider.style.display = 'none';
            } else {
                guestBtn.style.display = 'block';
                if(divider) divider.style.display = 'flex';
            }
        }
    }

    initThemeButton() {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (!themeBtn) return; // ഡാഷ്‌ബോർഡിൽ മാത്രമേ ഇനി ബട്ടൺ ഉണ്ടാകൂ!

        this.updateThemeIcon(themeBtn);

        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('globus_dark_mode', isDark);
            this.updateThemeIcon(themeBtn);
        });
    }

    updateThemeIcon(btn) {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    }

    static async logAction(moduleName, actionType, details) {
        try {
            const userEmail = localStorage.getItem('userEmail') || 'Unknown';
            const userRole = localStorage.getItem('userRole') || 'System';
            await supabase.from('activity_logs').insert([{ user_email: userEmail, user_role: userRole, module: moduleName, action_type: actionType, details: details }]);
        } catch (err) {}
    }
}

window.ThemeManager = ThemeManager;
new ThemeManager();
