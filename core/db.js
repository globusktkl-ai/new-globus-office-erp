/**

* NEW GLOBUS OFFICE ERP v3.0
* Database Connection
  */

import { CONFIG } from './config.js';

let supabase = null;

export async function initDatabase() {
if (supabase) return supabase;

```
if (typeof window.supabase === 'undefined') {
    await loadSupabase();
}

supabase = window.supabase.createClient(
    CONFIG.supabase.url,
    CONFIG.supabase.anonKey
);

return supabase;
```

}

async function loadSupabase() {
return new Promise((resolve, reject) => {
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

```
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
});
```

}

export async function getDB() {
return await initDatabase();
}

export async function query(table) {
const db = await getDB();
return db.from(table);
}
