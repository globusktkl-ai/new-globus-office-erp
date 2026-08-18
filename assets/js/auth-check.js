import { supabase } from './supabase-config.js';

// ========================================================
// GLOBUS ERP: MASTER AUTHENTICATION & SECURITY SHIELD
// ========================================================

async function enforceSecurity() {
    // നിലവിലെ പേജിന്റെ പേര് എടുക്കുന്നു
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // ലോഗിൻ പേജിൽ ഈ ചെക്കിങ് ആവശ്യമില്ല (ഇല്ലെങ്കിൽ ലൂപ്പ് ആകും)
    if (currentPage === 'login.html' || currentPage === 'index.html') return;

    const userRole = localStorage.getItem('userRole');
    
    // --- 1. GUEST MODE VALIDATION ---
    if (userRole === 'Guest') {
        const loginTime = localStorage.getItem('guestLoginTime');
        const timePassed = Date.now() - parseInt(loginTime || '0');
        
        // 30 മിനിറ്റ് കഴിഞ്ഞാൽ ഗസ്റ്റിനെ പുറത്താക്കും
        if (timePassed > 30 * 60 * 1000) { 
            forceLogout("⏳ Guest session expired (30 minutes). Please login again.");
        }
        return; // ഗസ്റ്റ് സമയം കഴിഞ്ഞിട്ടില്ലെങ്കിൽ പേജിൽ തുടരാം
    }

    // --- 2. SUPABASE SESSION VALIDATION (Normal Users) ---
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // സെഷൻ ഇല്ലെങ്കിലോ, എറർ ഉണ്ടെങ്കിലോ, റോൾ ഇല്ലെങ്കിലോ പുറത്താക്കും
    if (error || !session || !userRole) {
        forceLogout("⛔ Session expired or invalid. Please sign in again.");
        return;
    }
}

// യൂസറെ പുറത്താക്കാനുള്ള ഫംഗ്ഷൻ
function forceLogout(msg) {
    if(window.alert) { window.alert(msg); } else { alert(msg); }
    
    localStorage.clear();
    supabase.auth.signOut().then(() => {
        window.location.replace('login.html');
    });
}

// --- 3. PAGE LEVEL ACCESS CONTROL (RBAC) ---
// ഏതൊക്കെ റോളുകൾക്ക് ഈ പേജ് കാണാം എന്ന് തീരുമാനിക്കാനുള്ള ഗ്ലോബൽ ഫംഗ്ഷൻ
window.restrictAccess = function(allowedRoles) {
    const currentRole = localStorage.getItem('userRole');
    
    // അനുവദിക്കപ്പെട്ട റോളുകളിൽ നിലവിലെ യൂസറുടെ റോൾ ഇല്ലെങ്കിൽ
    if (!allowedRoles.includes(currentRole)) {
        
        if (window.alert) {
            window.alert("⛔ SECURITY ALERT: You do not have permission to access this module.");
        } else {
            alert("⛔ SECURITY ALERT: You do not have permission to access this module.");
        }
        
        // ഡാഷ്‌ബോർഡിലേക്ക് തിരികെ വിടുന്നു
        setTimeout(() => {
            window.location.replace('dashboard.html');
        }, 2000);
        
        return false; // Access Denied
    }
    return true; // Access Granted
};

// ഫയൽ ലോഡ് ആകുമ്പോൾ തന്നെ സെക്യൂരിറ്റി ചെക്ക് പ്രവർത്തിക്കും
enforceSecurity();
