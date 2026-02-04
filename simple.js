// Simple Working JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu - Fixed
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Product Filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    function updateCart() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align:center;padding:2rem;color:#999;">Cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div style="display:flex;justify-content:space-between;padding:1rem;border-bottom:1px solid #eee;">
                        <div>
                            <h4>${item.name}</h4>
                            <p>₹${item.price} × ${item.quantity}</p>
                        </div>
                        <button onclick="removeItem('${item.name}')" style="background:#ff6b35;color:white;border:none;padding:5px 10px;border-radius:5px;">Remove</button>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            updateCart();
            alert(name + ' added to cart!');
        });
    });
    
    // Cart sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }
    
    // Auth
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    function updateLoginBtn() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = currentUser ? `👤 ${currentUser.name}` : '👤 Login';
        }
    }
    
    // Login
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            if (currentUser) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                updateLoginBtn();
                alert('Logged out!');
            } else {
                loginModal.style.display = 'block';
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = { name: user.name, email: user.email };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateLoginBtn();
                loginModal.style.display = 'none';
                alert('Login successful!');
            } else {
                alert('Invalid credentials!');
            }
        });
    }
    
    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            if (users.find(u => u.email === email)) {
                alert('User already exists!');
                return;
            }
            
            users.push({ name, email, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            currentUser = { name, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateLoginBtn();
            
            document.getElementById('registerModal').style.display = 'none';
            alert('Registration successful!');
        });
    }
    
    // Modal controls
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('registerModal').style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('registerModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        });
    }
    
    // Initialize
    updateCart();
    updateLoginBtn();
});

// Global functions
function removeItem(name) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}