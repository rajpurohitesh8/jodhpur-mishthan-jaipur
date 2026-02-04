// Simple Authentication System
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function register(name, email, phone, password) {
    if (users.find(u => u.email === email)) {
        alert('User already exists');
        return false;
    }
    const user = { id: Date.now(), name, email, phone, password };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { id: user.id, name, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateLoginButton();
    return true;
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Invalid credentials');
        return false;
    }
    currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateLoginButton();
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginButton();
}

function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        } else {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLoginButton();
    
    // Login button click
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            logout();
        } else {
            document.getElementById('loginModal').style.display = 'block';
        }
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        if (login(email, password)) {
            document.getElementById('loginModal').style.display = 'none';
            this.reset();
        }
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const password = this.querySelector('input[type="password"]').value;
        if (register(name, email, phone, password)) {
            document.getElementById('registerModal').style.display = 'none';
            this.reset();
        }
    });
    
    // Modal controls
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('registerModal').style.display = 'block';
    });
    
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerModal').style.display = 'none';
        document.getElementById('loginModal').style.display = 'block';
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
});