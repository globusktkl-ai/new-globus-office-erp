import { getDB } from './db.js';

export async function login(email, password) {
const db = await getDB();

```
const { data, error } = await db
    .from('users')
    .select('id, full_name, email')
    .eq('email', email)
    .eq('password_hash', password)
    .eq('is_active', true)
    .single();

if (error || !data) {
    return { success: false, message: 'Invalid email or password' };
}

localStorage.setItem('ng_office_session', JSON.stringify(data));

return { success: true, user: data };
```

}

export function getSession() {
const raw = localStorage.getItem('ng_office_session');
return raw ? JSON.parse(raw) : null;
}

export function logout() {
localStorage.removeItem('ng_office_session');
}

export function requireAuth() {
const user = getSession();
if (!user) {
window.location.href = 'login.html';
return null;
}
return user;
}
