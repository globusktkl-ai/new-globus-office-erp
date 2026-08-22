import { supabase } from './supabase-config.js';
import './theme-manager.js';

// മനോഹരമായ (Custom UI) അലേർട്ട് സിസ്റ്റം
function showCustomAlert(message, redirectUrl) {
    const oldBox = document.getElementById('customAlertBox'); 
    if (oldBox) oldBox.remove();

    const box = document.createElement('div'); 
    box.id = 'customAlertBox';

    const iconHtml = `<div style="background:#fee2e2; color:#ef4444; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;

    // ബാക്ക്ഗ്രൗണ്ട് നല്ല ഇരുണ്ടതാക്കി മാറ്റുന്നു (അകത്തുള്ളത് കാണാതിരിക്കാൻ)
    box.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.98); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);`;
    box.innerHTML = `
        <div style="background: #ffffff; padding: 24px; border-radius: 16px; width: 90%; max-width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; animation: sheetUp 0.3s ease;">
            ${iconHtml}
            <div style="font-size: 15px; font-weight: 900; color: #ef4444; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.5;">${message}</div>
            <button id="cAlertOk" style="width: 100%; padding: 12px; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.2s;">OK, Go Back</button>
        </div>
    `;
    if(!document.querySelector('style#sheetUpAnim')){ document.head.insertAdjacentHTML('beforeend', '<style id="sheetUpAnim">@keyframes sheetUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'); }
    document.body.appendChild(box);

    document.getElementById('cAlertOk').onclick = () => {
        box.remove();
        if(redirectUrl) window.location.replace(redirectUrl);
    };

    // SECURE FALLBACK: യൂസർ OK അമർത്തിയില്ലെങ്കിലും 3 സെക്കൻഡിനുള്ളിൽ തനിയെ ഡാഷ്‌ബോർഡിലേക്ക് മാറ്റും!
    if(redirectUrl) {
        setTimeout(() => { window.location.replace(redirectUrl); }, 3000);
    }
}

// 1. Basic Session Check
async function enforceSecurity() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'login.html' || currentPage === 'index.html') return;

    const userRole = localStorage.getItem('userRole');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session || !userRole) {
        window.location.replace('login.html');
        return;
    }
}

// 2. DYNAMIC ACCESS CHECKER (THE MASTER GUARD)
window.checkDynamicAccess = async function(moduleName) {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return false;

    // സൂപ്പർ അഡ്മിന് എല്ലാ പേജുകളിലേക്കും നേരിട്ട് പ്രവേശനം
    if (userRole === 'Super Admin') return true; 

    const { data, error } = await supabase.from('role_management').select('permissions').eq('role_name', userRole).single();

    if (error || !data) {
        document.body.innerHTML = ''; // SECURITY NUKE: സ്ക്രീനിലുള്ളതെല്ലാം മായ്ച്ചു കളയുന്നു!
        showCustomAlert("⛔ Security Error: Could not verify your permissions.", 'dashboard.html');
        return false;
    }

    const perms = data.permissions || {};
    const modulePerms = perms[moduleName] || { view: false };

    // അവർക്ക് ഈ പേജ് കാണാനുള്ള (View) ടിക്ക് നൽകിയിട്ടില്ലെങ്കിൽ പുറത്താക്കും
    if (modulePerms.view !== true) {
        document.body.innerHTML = ''; // SECURITY NUKE: സ്ക്രീനിലുള്ളതെല്ലാം മായ്ച്ചു കളയുന്നു!
        showCustomAlert(`ACCESS DENIED:\nYou do not have permission to view this page.`, 'dashboard.html');
        return false;
    }

    window.currentModulePermissions = modulePerms;
    return true;
};

enforceSecurity();
