/**

* NEW GLOBUS OFFICE ERP v3.0
* Authentication
  */

import { getDB } from './db.js';
import { CONFIG } from './config.js';

export async function login(email, password) {
const db = await getDB();

```
const { data, error } = await db
    .from('users')
    .select('id, full_name, email, role_id')
    .eq('email', email)
    .eq('password_hash', password)
    .eq('is_active', true)
    .single();

if (error || !data) {
    return { success: false, message: 'Invalid email or password' };
}

localStorage.setItem(CONFIG.session.key, JSON.stringify({
    user: data,
    loginTime: Date.now()
}));

return { success: true, user: data };
```

}

export function getSession() {
const raw = localStorage.getItem(CONFIG.session.key);
if (!raw) return null;

```
try {
    return JSON.parse(raw);
} catch {
    return null;
}
```

}

export function logout() {
localStorage.removeItem(CONFIG.session.key);
}

export function requireAuth() {
const session = getSession();

```
if (!session) {
    window.location.href = '/login.html';
    return null;
}

return session.user;
```

}
