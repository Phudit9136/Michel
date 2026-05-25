// Authentication and Session Management
(function() {
    // Check authentication for protected pages
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('dashboard-v2.html')) {
        const user = sessionStorage.getItem('loggedInUser');
        if (!user) {
            window.location.href = '/';
        } else {
            console.log(`Logged in as: ${user}`);
            const displayUserElem = document.getElementById('displayUser');
            if (displayUserElem) displayUserElem.innerText = user;
        }
    }
    
    // Login logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('loginBtn');
        const errorMsg = document.getElementById('errorMsg');
        
        function isValidCredentials(username, password) {
            const hasCh = username && username.toLowerCase().includes('ch');
            const has27 = password && password.includes('27');
            return username.length > 0 && password.length > 0 && hasCh && has27;
        }
        
        let loginTimeout = null;
        
        async function autoLogin() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (username && password && isValidCredentials(username, password)) {
                if (loginBtn) {
                    loginBtn.disabled = true;
                    loginBtn.innerHTML = '<span class="btn-text">⟁ LOGGING IN... ⟁</span>';
                }
                
                try {
                    const res = await fetch('/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        sessionStorage.setItem('loggedInUser', username);
                        window.location.href = '/dashboard.html';
                    } else {
                        if (loginBtn) {
                            loginBtn.disabled = false;
                            loginBtn.innerHTML = '<span class="btn-text">⟁ BYPASS FIREWALL ⟁</span>';
                        }
                        if (errorMsg) {
                            errorMsg.innerText = '❌ ' + data.message;
                            errorMsg.style.display = 'block';
                        }
                        const card = document.querySelector('.login-card');
                        if (card) {
                            card.style.animation = 'shake 0.3s ease-in-out';
                            setTimeout(() => { card.style.animation = ''; }, 300);
                        }
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    if (loginBtn) {
                        loginBtn.disabled = false;
                        loginBtn.innerHTML = '<span class="btn-text">⟁ BYPASS FIREWALL ⟁</span>';
                    }
                    if (errorMsg) {
                        errorMsg.innerText = '❌ CONNECTION ERROR';
                        errorMsg.style.display = 'block';
                    }
                }
            }
        }
        
        function delayedAutoLogin() {
            if (loginTimeout) clearTimeout(loginTimeout);
            loginTimeout = setTimeout(autoLogin, 50);
        }
        
        function updateLoginButtonState() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (username && password && isValidCredentials(username, password)) {
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                }
                if (errorMsg) errorMsg.style.display = 'none';
            } else {
                if (loginBtn) {
                    loginBtn.disabled = true;
                    loginBtn.style.opacity = '0.5';
                }
            }
        }
        
        if (usernameInput) {
            usernameInput.addEventListener('input', () => {
                updateLoginButtonState();
                delayedAutoLogin();
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                updateLoginButtonState();
                delayedAutoLogin();
            });
        }
        
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.5';
        }
        
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') autoLogin();
        };
        
        if (usernameInput) usernameInput.addEventListener('keypress', handleKeyPress);
        if (passwordInput) passwordInput.addEventListener('keypress', handleKeyPress);
    }
})();

// Global logout function
window.logout = function() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = '/';
};