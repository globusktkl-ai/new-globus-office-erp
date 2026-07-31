import { login } from '../../core/auth.js';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorBox = document.getElementById('login-error');

form.addEventListener('submit', async (e) => {
e.preventDefault();

```
errorBox.textContent = '';

const email = emailInput.value.trim();
const password = passwordInput.value;

const result = await login(email, password);

if (!result.success) {
    errorBox.textContent = result.message;
    return;
}

window.location.href = 'dashboard.html';
```

});
