import { supabase } from './supabase-config.js';
import './theme-manager.js';

function showCustomAlert(message, redirectUrl) {
    const oldBox = document.getElementById('customAlertBox'); 
    if (oldBox) oldBox.remove();
    const box = document.createElement('div'); 
    box.id = 'customAlertBox';

    let iconHtml = `<div style="background:#fee2e2; color:#ef4444; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;
    
    if (message.includes('PREMIUM') || message.includes('Upgrade')) {
        iconHtml = `<div style="background:#fef3c7; color:#d97706; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px; font-size:24px;">👑</div>`;
    }

    box.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.98); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);`;
    box.innerHTML = `
        <div style="background: #ffffff; padding: 24px; border-radius: 16px; width: 90%; max-width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; animation: sheetUp 0.3s ease;">
            ${iconHtml}
            <div style="font-size: 15px; font-weight: 900; color: ${message.includes('PREMIUM') ? '#b45309' : '#ef4444'}; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.5;">${message}</div>
            <button id="cAlertOk" style="width: 100%; padding: 12px; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.2s;">OK, Go Back</button>
        </div>
    `;
    if(!document.querySelector('style#sheetUpAnim')){ document.head.insertAdjacentHTML('beforeend', '<style id="sheetUpAnim">@keyframes sheetUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'); }
    document.body.appendChild(box);

    document.getElementById('cAlertOk').onclick = () => {
        box.remove();
        if(redirectUrl) window.location.replace(redirectUrl);
    };

    if(redirectUrl) {
        // 🔥 മാക്രോ-ലോക്ക് വരുമ്പോൾ വായിക്കാൻ 5 സെക്കൻഡ് സമയം നൽകുന്നു 🔥
        setTimeout(() => { window.location.replace(redirectUrl); }, 5000); 
    }
}

async function verifySaaSStatus() {
    try {
        const { data: client, error } = await supabase.from('saas_clients').select('*').limit(1).single();
        
        if (error || !client) {
            document.body.innerHTML = `
                <div style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f8fafc; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 20px; position: fixed; top: 0; left: 0; z-index: 9999999;">
                    <div style="font-size: 60px; margin-bottom: 10px;">❌</div>
                    <h1 style="font-size: 32px; margin: 0; color: #ef4444; font-weight: 900; letter-spacing: 1px;">LICENSE NOT FOUND</h1>
                    <p style="color: #94a3b8; font-size: 15px; max-width: 450px; margin-top: 15px; line-height: 1.6;">
                        This ERP application is not registered or the license has been terminated.
                    </p>
                </div>
            `;
            throw new Error("NO_LICENSE_FOUND");
        }

        if (client.is_active === false) {
            document.body.innerHTML = `
                <div style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f8fafc; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 20px; position: fixed; top: 0; left: 0; z-index: 9999999;">
                    <div style="font-size: 60px; margin-bottom: 10px; animation: pulse 2s infinite;">⏳</div>
                    <h1 style="font-size: 30px; margin: 0; color: #f59e0b; font-weight: 900; letter-spacing: 1px;">SUBSCRIPTION EXPIRED</h1>
                    <p style="color: #94a3b8; font-size: 14px; max-width: 450px; margin-top: 15px; line-height: 1.6;">
                        Your ERP software subscription period has ended. To continue using all features, please renew your plan.
                    </p>
                    <div style="margin-top: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239,68,68,0.3); padding: 12px 20px; border-radius: 8px; color: #fca5a5; font-size: 12px; max-width: 450px;">
                        ⚠️ <strong style="letter-spacing: 0.5px;">DATA RETENTION POLICY</strong><br>
                        Your existing data is safe. However, if not renewed within 60 days, it will be permanently deleted.
                    </div>
                </div>
            `;
            throw new Error("SYSTEM_LOCKED_BY_MASTER");
        }

        const userRole = localStorage.getItem('userRole');
        if (client.valid_until && (userRole === 'Super Admin' || userRole === 'Admin')) {
            const diffDays = Math.ceil((new Date(client.valid_until) - new Date()) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                const banner = document.createElement('div');
                banner.style.cssText = "background: #ef4444; color: white; text-align: center; padding: 10px 15px; font-size: 12px; font-weight: 800; z-index: 999999; position: sticky; top: 0; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.1);";
                banner.innerHTML = `🚨 URGENT: Your ERP Subscription has EXPIRED. System will be locked shortly.`;
                document.body.prepend(banner);
            }
        }

        if (client.plan_name) {
            const { data: plan } = await supabase.from('subscription_plans').select('*').eq('plan_name', client.plan_name).single();
            
            if (plan) {
                localStorage.setItem('saas_micro_features', JSON.stringify(plan.micro_features || {}));
                localStorage.setItem('saas_limit_admissions', plan.usage_limits ? plan.usage_limits.max_admissions : 100);
                localStorage.setItem('saas_current_plan', plan.plan_name);

                const currentPage = window.location.pathname.split('/').pop();
                let isBlocked = false;
                const mods = plan.module_access || {};

                if (currentPage === 'admission.html' && mods.admission === false) isBlocked = true;
                if (currentPage === 'fees.html' && mods.fee_collect === false) isBlocked = true;
                if ((currentPage === 'expense.html' || currentPage === 'report.html') && mods.day_book === false) isBlocked = true;
                if (currentPage === 'inventory.html' && mods.inventory === false) isBlocked = true;

                if (isBlocked) {
                    document.body.innerHTML = ''; 
                    showCustomAlert(`👑 PREMIUM FEATURE LOCKED\n\nYour current plan (${plan.plan_name}) does not include access to this module.\n\nPlease contact VPKTech to upgrade your plan.`, 'dashboard.html');
                    throw new Error("SAAS_MODULE_LOCKED");
                }
            }
        }

    } catch(e) {
        if(e.message === "SYSTEM_LOCKED_BY_MASTER" || e.message === "NO_LICENSE_FOUND" || e.message === "SAAS_MODULE_LOCKED") throw e;
        console.error("SaaS Check Error:", e);
    }
}

async function enforceSecurity() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'login.html' || currentPage === 'index.html') return;

    const userRole = localStorage.getItem('userRole');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session || !userRole) {
        window.location.replace('login.html');
        return;
    }

    await verifySaaSStatus();
}

window.checkDynamicAccess = async function(moduleName) {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return false;
    if (userRole === 'Super Admin') return true; 

    const { data, error } = await supabase.from('role_management').select('permissions').eq('role_name', userRole).single();

    if (error || !data) {
        document.body.innerHTML = ''; 
        showCustomAlert("⛔ Security Error: Could not verify your permissions.", 'dashboard.html');
        return false;
    }

    const perms = data.permissions || {};
    const modulePerms = perms[moduleName] || { view: false };

    if (modulePerms.view !== true) {
        document.body.innerHTML = ''; 
        showCustomAlert(`ACCESS DENIED:\nYou do not have permission to view this page.`, 'dashboard.html');
        return false;
    }

    window.currentModulePermissions = modulePerms;
    return true;
};

enforceSecurity();
