import { supabase } from './supabase-config.js';

// 1. Basic Session Check (എല്ലാ പേജിലും ലോഗിൻ ഉറപ്പുവരുത്താൻ)
async function enforceSecurity() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'login.html' || currentPage === 'index.html') return;

    const userRole = localStorage.getItem('userRole');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session || !userRole) {
        alert("⛔ Session expired or invalid. Please sign in again.");
        localStorage.clear();
        window.location.replace('login.html');
        return;
    }
}

// 2. DYNAMIC ACCESS CHECKER (ഡാറ്റാബേസ് നോക്കി പെർമിഷൻ തീരുമാനിക്കാൻ)
window.checkDynamicAccess = async function(moduleName) {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return false;

    // സൂപ്പർ അഡ്മിന് എല്ലാ പേജുകളിലേക്കും നേരിട്ട് പ്രവേശനം
    if (userRole === 'Super Admin') return true; 

    // മറ്റുള്ളവരുടെ പെർമിഷൻ ഡാറ്റാബേസിൽ നിന്നും എടുക്കുന്നു
    const { data, error } = await supabase.from('role_management').select('permissions').eq('role_name', userRole).single();
    
    if (error || !data) {
        alert("⛔ Security Error: Could not verify your permissions.");
        window.location.replace('dashboard.html');
        return false;
    }

    const perms = data.permissions || {};
    const modulePerms = perms[moduleName] || { view: false };

    // അവർക്ക് ഈ പേജ് കാണാനുള്ള (View) ടിക്ക് നൽകിയിട്ടില്ലെങ്കിൽ പുറത്താക്കും
    if (modulePerms.view !== true) {
        alert(`⛔ ACCESS DENIED: You do not have permission to view this page.`);
        window.location.replace('dashboard.html');
        return false;
    }

    // പേജിനകത്ത് എഡിറ്റ്/ഡിലീറ്റ് ബട്ടണുകൾ മറയ്ക്കാൻ ഈ ഡാറ്റ ഉപയോഗിക്കാം
    window.currentModulePermissions = modulePerms;
    return true;
};

enforceSecurity();
