// User Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.isLoggedIn = !!this.currentUser;
    }

    register(name, email, phone, password) {
        if (!name || !email || !phone || !password) {
            throw new Error('All fields are required');
        }
        if (this.users.find(u => u.email === email)) {
            throw new Error('User already exists with this email');
        }
        const newUser = { id: Date.now(), name, email, phone, password };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.currentUser = { id: newUser.id, name, email };
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    login(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        this.currentUser = { id: user.id, name: user.name, email: user.email };
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Global variables
let cart = [];

// DOM elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadCart();
    updateLoginStatus();
    setupScrollAnimations();
    addProductCardAnimations();
});

function initializeApp() {
    setupCategoryFilter();
    setupSmoothScrolling();
    setupMobileMenu();
}

function setupEventListeners() {
    // Login/Register modals
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (auth.isAuthenticated()) {
                logout();
            } else {
                showModal('loginModal');
            }
        });
    }
    
    const showRegister = document.getElementById('showRegister');
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('loginModal');
            showModal('registerModal');
        });
    }
    
    const showLogin = document.getElementById('showLogin');
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('registerModal');
            showModal('loginModal');
        });
    }
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.getElementById('contactForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
    
    // Cart
    cartBtn.addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    try {
        const user = auth.login(email, password);
        updateLoginStatus();
        hideModal('loginModal');
        form.reset();
        showNotification('Login successful! Welcome ' + user.name, 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    try {
        const user = auth.register(name, email, phone, password);
        updateLoginStatus();
        hideModal('registerModal');
        form.reset();
        showNotification('Registration successful! Welcome ' + user.name, 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function updateLoginStatus() {
    if (auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
    } else {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
    }
}

function logout() {
    auth.logout();
    updateLoginStatus();
    showNotification('Logged out successfully', 'success');
}

function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function addToCart(e) {
    const btn = e.target;
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
    saveCart();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    <button class="qty-btn" onclick="removeFromCart('${item.name}')" style="background: #dc3545; margin-left: 10px;">×</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
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

function handleCheckout() {
    if (!auth.isAuthenticated()) {
        showNotification('Please login to checkout', 'error');
        closeCart();
        showModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = {
        user: auth.getCurrentUser(),
        items: cart,
        total: total,
        date: new Date().toISOString()
    };
    
    console.log('Order placed:', orderDetails);
    
    cart = [];
    updateCartUI();
    saveCart();
    closeCart();
    
    showNotification(`Order placed successfully! Total: ₹${total}`, 'success');
}

function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    console.log('Contact form submitted:', Object.fromEntries(formData));
    
    form.reset();
    showNotification('Message sent successfully!', 'success');
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '2000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Expose functions to global scope for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.scrollToSection = scrollToSection;

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

function addProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });

    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });

    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.setProperty('--i', index);
    });
}

// Enhanced smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add loading animation
function addLoadingAnimation() {
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}
// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add scroll animation class to elements
    document.querySelectorAll('.product-card, .service-card, .gallery-item').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Mobile Menu Enhancement
function enhanceMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Touch Gestures for Mobile
function initTouchGestures() {
    let startX, startY, distX, distY;
    const threshold = 150;
    const restraint = 100;
    
    document.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
    });
    
    document.addEventListener('touchend', e => {
        distX = e.changedTouches[0].pageX - startX;
        distY = e.changedTouches[0].pageY - startY;
        
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX > 0) {
                // Swipe right - close cart if open
                document.getElementById('cartSidebar').classList.remove('open');
            } else {
                // Swipe left - could open cart or navigate
            }
        }
    });
}

// Performance Optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    enhanceMobileMenu();
    initTouchGestures();
    optimizePerformance();
});
// Mobile-Specific Enhancements
function initMobileEnhancements() {
    // Add touch feedback to buttons
    document.querySelectorAll('.cta-btn, .add-to-cart, .category-btn').forEach(btn => {
        btn.classList.add('touch-feedback', 'haptic-feedback');
    });
    
    // Mobile swipe gestures for product cards
    let startX, startY, currentX, currentY;
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        card.addEventListener('touchmove', e => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    // Swipe left - add to cart
                    card.style.transform = 'translateX(-20px)';
                    card.style.backgroundColor = '#e8f5e8';
                } else if (diffX < -50) {
                    // Swipe right - view details
                    card.style.transform = 'translateX(20px)';
                    card.style.backgroundColor = '#fff3e0';
                }
            }
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
            card.style.backgroundColor = '';
            startX = startY = null;
        });
    });
    
    // Mobile pull-to-refresh simulation
    let pullStart = 0;
    let pullCurrent = 0;
    
    document.addEventListener('touchstart', e => {
        pullStart = e.touches[0].screenY;
    });
    
    document.addEventListener('touchmove', e => {
        pullCurrent = e.touches[0].screenY;
        if (pullCurrent - pullStart > 100 && window.scrollY === 0) {
            document.body.style.transform = 'translateY(20px)';
            document.body.style.transition = 'transform 0.3s';
        }
    });
    
    document.addEventListener('touchend', () => {
        if (pullCurrent - pullStart > 100 && window.scrollY === 0) {
            // Simulate refresh
            showMobileNotification('Refreshing...', 'info');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
        document.body.style.transform = '';
        pullStart = pullCurrent = 0;
    });
    
    // Mobile-optimized cart
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            const cartSidebar = document.getElementById('cartSidebar');
            cartSidebar.style.animation = 'slideInFromBottom 0.4s ease-out';
        });
    }
    
    // Mobile keyboard handling
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// Mobile notification system
function showMobileNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `mobile-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <div class="mobile-loading"></div>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '25px',
        zIndex: '3000',
        animation: 'bounceInUp 0.5s ease-out',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile performance optimization
function optimizeMobilePerformance() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency <= 2) {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (window.innerWidth <= 768) {
            img.loading = 'lazy';
            img.style.willChange = 'transform';
        }
    });
    
    // Mobile-specific event listeners
    document.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        initMobileEnhancements();
        optimizeMobilePerformance();
        
        // Add swipe indicator
        const swipeIndicator = document.createElement('div');
        swipeIndicator.className = 'swipe-indicator';
        swipeIndicator.textContent = '← Swipe cards to interact →';
        document.body.appendChild(swipeIndicator);
        
        setTimeout(() => {
            swipeIndicator.remove();
        }, 5000);
    }
});