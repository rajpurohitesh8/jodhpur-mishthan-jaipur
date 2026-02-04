// Mobile-Optimized JavaScript
// Remove duplicate DOMContentLoaded listener

// Mobile Navigation Fix
function setupMobileNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            
            // Update hamburger icon
            if (navLinks.classList.contains('active')) {
                mobileMenu.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach((link, index) => {
            link.parentElement.style.setProperty('--i', index);
            link.addEventListener('click', (e) => {
                navLinks.classList.remove('active');
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Scroll Animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Animate elements on scroll
    document.querySelectorAll('.product-card, .service-card, .gallery-item, .contact-item').forEach((el, index) => {
        el.style.setProperty('--i', index);
        observer.observe(el);
    });

    // Animate features
    document.querySelectorAll('.feature').forEach((el, index) => {
        el.style.setProperty('--i', index);
    });
}

// Touch Interactions
function setupTouchInteractions() {
    // Add touch feedback to buttons
    document.querySelectorAll('.cta-btn, .add-to-cart, .category-btn').forEach(btn => {
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', () => {
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });

    // Product card swipe gestures
    let startX, startY;
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        card.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - add to cart
                    card.style.background = '#e8f5e8';
                    card.style.transform = 'translateX(-10px)';
                } else {
                    // Swipe right - view details
                    card.style.background = '#fff3e0';
                    card.style.transform = 'translateX(10px)';
                }
            }
        });

        card.addEventListener('touchend', () => {
            card.style.background = '';
            card.style.transform = '';
            startX = startY = null;
        });
    });
}

// Mobile Cart Fix
function setupMobileCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('open');
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!currentUser) {
                showMobileNotification('Please login to checkout', 'error');
                cartSidebar.classList.remove('open');
                document.getElementById('loginModal').style.display = 'block';
                return;
            }
            
            if (cart.length === 0) {
                showMobileNotification('Your cart is empty', 'error');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cart = [];
            updateCartUI();
            saveCart();
            cartSidebar.classList.remove('open');
            showMobileNotification(`Order placed! Total: ₹${total}`, 'success');
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            
            if (name && price) {
                addToCart(name, price);
                showMobileNotification(`${name} added to cart!`, 'success');
            }
        });
    });

    loadCart();
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <button onclick="updateQuantity('${item.name}', -1)" style="width:30px;height:30px;border:none;background:#ff6b35;color:white;border-radius:50%;cursor:pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" style="width:30px;height:30px;border:none;background:#ff6b35;color:white;border-radius:50%;cursor:pointer;">+</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
        updateCartUI();
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Authentication Fix
function setupAuth() {
    updateLoginButton();
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                logout();
            } else {
                document.getElementById('loginModal').style.display = 'block';
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            
            if (login(email, password)) {
                document.getElementById('loginModal').style.display = 'none';
                e.target.reset();
                showMobileNotification('Login successful!', 'success');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = e.target.querySelector('input[type="text"]').value;
            const email = e.target.querySelector('input[type="email"]').value;
            const phone = e.target.querySelector('input[type="tel"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            
            if (register(name, email, phone, password)) {
                document.getElementById('registerModal').style.display = 'none';
                e.target.reset();
                showMobileNotification('Registration successful!', 'success');
            }
        });
    }
    
    // Modal controls
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('registerModal').style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        });
    }
    
    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showMobileNotification('Invalid credentials', 'error');
        return false;
    }
    currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateLoginButton();
    return true;
}

function register(name, email, phone, password) {
    if (users.find(u => u.email === email)) {
        showMobileNotification('User already exists', 'error');
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

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginButton();
    showMobileNotification('Logged out successfully', 'success');
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

// Product Filters Fix
function setupProductFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach((btn, index) => {
        btn.style.setProperty('--i', index);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            productCards.forEach((card, cardIndex) => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = `slideInUp 0.6s ease ${cardIndex * 0.1}s both`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Mobile Notifications
function showMobileNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 4000;
        animation: bounceIn 0.5s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile Optimizations
function optimizeForMobile() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Prevent zoom on input focus
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        input.addEventListener('blur', () => {
            document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
}

// Expose functions globally
window.updateQuantity = updateQuantity;
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
// Scroll to Section Fix
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 70;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }
}

// Contact Form Handler
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            console.log('Contact form submitted:', data);
            e.target.reset();
            showMobileNotification('Message sent successfully!', 'success');
        });
    }
}

// Initialize all functions
window.addEventListener('load', () => {
    setupContactForm();
});