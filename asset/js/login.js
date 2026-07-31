/**

* NEW GLOBUS OFFICE ERP v3.0
* Login Controller
  */

import { login } from '../../core/auth.js';

const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorBox = document.getElementById('login-error');

form.addEventListener('submit', async (e) => {
e.preventDefault();

```
errorBox.textContent = '';

const result = await login(
    email.value.trim(),
    password.value
);

if (!result.success) {
    errorBox.textContent = result.message;
    return;
}

window.location.href = 'dashboard.html';
```

});
