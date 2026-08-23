import { supabase } from './supabase-config.js';
import './theme-manager.js';

function showCustomAlert(message, redirectUrl) {
    const oldBox = document.getElementById('customAlertBox'); 
    if (oldBox) oldBox.remove();
    const box = document.createElement('div'); 
    box.id = 'customAlertBox';
    const iconHtml = `<div style="background:#fee2e2; color:#ef4444; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px;"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;
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
    document.getElementById('cAlertOk').onclick = () => { box.remove(); if(redirectUrl) window.location.replace(redirectUrl); };
    if(redirectUrl) { setTimeout(() => { window.location.replace(redirectUrl); }, 3000); }
}

async function verifySaaSStatus() {
    try {
        const { data: client, error } = await supabase.from('saas_clients').select('*').limit(1).single();
        
        if (error || !client) {
            document.body.innerHTML = `
                <div style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f8fafc; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 20px; position: fixed; top: 0; left: 0; z-index: 9999999;">
                    <div style="font-size: 60px; margin-bottom: 10px;">❌</div>
                    <h1 style="font-size: 28px; margin: 0; color: #ef4444; font-weight: 900; letter-spacing: 1px;">LICENSE NOT FOUND</h1>
                    <p style="color: #94a3b8; font-size: 15px; max-width: 450px; margin-top: 15px; line-height: 1.6;">
                        This ERP application is not registered or the license has been terminated by the provider.
                    </p>
                </div>
            `;
            throw new Error("NO_LICENSE_FOUND");
        }

        // 🟢 THE SOFT KILL SWITCH (EXPIRED)
        if (client.is_active === false) {
            document.body.innerHTML = `
                <div style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #f8fafc; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 20px; position: fixed; top: 0; left: 0; z-index: 9999999;">
                    <div style="font-size: 60px; margin-bottom: 10px; animation: pulse 2s infinite;">⏳</div>
                    <h1 style="font-size: 30px; margin: 0; color: #f59e0b; font-weight: 900; letter-spacing: 1px;">SUBSCRIPTION EXPIRED</h1>
                    <p style="color: #94a3b8; font-size: 14px; max-width: 450px; margin-top: 15px; line-height: 1.6;">
                        Your ERP software subscription period has ended. To continue using all features and access your dashboard, please renew your plan.
                    </p>
                    
                    <div style="margin-top: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239,68,68,0.3); padding: 12px 20px; border-radius: 8px; color: #fca5a5; font-size: 12px; max-width: 450px; line-height: 1.5;">
                        ⚠️ <strong style="letter-spacing: 0.5px;">DATA RETENTION POLICY</strong><br>
                        Your existing data is safe. However, if the subscription is not renewed within <strong>60 days</strong>, your institute data will be permanently deleted from the cloud.
                    </div>

                    <div style="margin-top: 30px; background: #1e293b; padding: 15px 25px; border: 1px dashed #334155; border-radius: 12px; color: #cbd5e1; font-size: 14px;">
                        To renew and instantly unlock your system, contact:<br>
                        <strong style="color: #3b82f6; font-size: 16px; display: inline-block; margin-top: 8px;">vpktechsolutions@gmail.com</strong>
                    </div>
                </div>
            `;
            throw new Error("SYSTEM_LOCKED_BY_MASTER");
        }

        const userRole = localStorage.getItem('userRole');
        if (client.valid_until && (userRole === 'Super Admin' || userRole === 'Admin')) {
            const expiryDate = new Date(client.valid_until);
            const diffDays = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

            if (diffDays <= 15 && diffDays >= 0) {
                const banner = document.createElement('div');
                banner.style.cssText = "background: linear-gradient(135deg, #f59e0b, #d97706); color: white; text-align: center; padding: 10px 15px; font-size: 12px; font-weight: 800; z-index: 999999; position: sticky; top: 0; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); letter-spacing: 0.5px;";
                banner.innerHTML = `⚠️ REMINDER: Your ERP Subscription expires in ${diffDays} days. Please renew soon to avoid interruptions.`;
                document.body.prepend(banner);
            } else if (diffDays < 0) {
                const banner = document.createElement('div');
                banner.style.cssText = "background: #ef4444; color: white; text-align: center; padding: 10px 15px; font-size: 12px; font-weight: 800; z-index: 999999; position: sticky; top: 0; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); letter-spacing: 0.5px;";
                banner.innerHTML = `🚨 URGENT: Your ERP Subscription has EXPIRED. The system will be locked shortly.`;
                document.body.prepend(banner);
            }
        }
    } catch(e) {
        if(e.message === "SYSTEM_LOCKED_BY_MASTER" || e.message === "NO_LICENSE_FOUND") throw e;
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
