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
});

function initializeApp() {
    // Setup category filtering
    setupCategoryFilter();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup mobile menu
    setupMobileMenu();
}

function setupEventListeners() {
    // Login/Register modals
    loginBtn.addEventListener('click', () => showModal('loginModal'));
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showModal('registerModal');
    });
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('registerModal');
        showModal('loginModal');
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            hideModal(e.target.closest('.modal').id);
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
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
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type=\"email\"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type=\"password\"]').value;
    
    // Simple validation (in real app, this would be server-side)
    if (email && password) {\n        isLoggedIn = true;\n        currentUser = { email: email, name: email.split('@')[0] };\n        localStorage.setItem('user', JSON.stringify(currentUser));\n        updateLoginStatus();\n        hideModal('loginModal');\n        showNotification('Login successful!', 'success');\n    } else {\n        showNotification('Please fill all fields', 'error');\n    }\n}\n\nfunction handleRegister(e) {\n    e.preventDefault();\n    const form = e.target;\n    const name = form.querySelector('input[type=\"text\"]').value;\n    const email = form.querySelector('input[type=\"email\"]').value;\n    const phone = form.querySelector('input[type=\"tel\"]').value;\n    const password = form.querySelector('input[type=\"password\"]').value;\n    \n    if (name && email && phone && password) {\n        isLoggedIn = true;\n        currentUser = { name, email, phone };\n        localStorage.setItem('user', JSON.stringify(currentUser));\n        updateLoginStatus();\n        hideModal('registerModal');\n        showNotification('Registration successful!', 'success');\n    } else {\n        showNotification('Please fill all fields', 'error');\n    }\n}\n\nfunction checkLoginStatus() {\n    const user = localStorage.getItem('user');\n    if (user) {\n        isLoggedIn = true;\n        currentUser = JSON.parse(user);\n        updateLoginStatus();\n    }\n}\n\nfunction updateLoginStatus() {\n    if (isLoggedIn) {\n        loginBtn.innerHTML = `<i class=\"fas fa-user\"></i> ${currentUser.name}`;\n        loginBtn.onclick = logout;\n    } else {\n        loginBtn.innerHTML = '<i class=\"fas fa-user\"></i> Login';\n        loginBtn.onclick = () => showModal('loginModal');\n    }\n}\n\nfunction logout() {\n    isLoggedIn = false;\n    currentUser = null;\n    localStorage.removeItem('user');\n    updateLoginStatus();\n    showNotification('Logged out successfully', 'success');\n}\n\nfunction setupCategoryFilter() {\n    const categoryBtns = document.querySelectorAll('.category-btn');\n    const productCards = document.querySelectorAll('.product-card');\n    \n    categoryBtns.forEach(btn => {\n        btn.addEventListener('click', () => {\n            // Remove active class from all buttons\n            categoryBtns.forEach(b => b.classList.remove('active'));\n            // Add active class to clicked button\n            btn.classList.add('active');\n            \n            const category = btn.dataset.category;\n            \n            productCards.forEach(card => {\n                if (category === 'all' || card.dataset.category === category) {\n                    card.style.display = 'block';\n                } else {\n                    card.style.display = 'none';\n                }\n            });\n        });\n    });\n}\n\nfunction addToCart(e) {\n    const btn = e.target;\n    const name = btn.dataset.name;\n    const price = parseInt(btn.dataset.price);\n    \n    const existingItem = cart.find(item => item.name === name);\n    \n    if (existingItem) {\n        existingItem.quantity += 1;\n    } else {\n        cart.push({ name, price, quantity: 1 });\n    }\n    \n    updateCartUI();\n    saveCart();\n    showNotification(`${name} added to cart!`, 'success');\n}\n\nfunction removeFromCart(name) {\n    cart = cart.filter(item => item.name !== name);\n    updateCartUI();\n    saveCart();\n}\n\nfunction updateQuantity(name, change) {\n    const item = cart.find(item => item.name === name);\n    if (item) {\n        item.quantity += change;\n        if (item.quantity <= 0) {\n            removeFromCart(name);\n        } else {\n            updateCartUI();\n            saveCart();\n        }\n    }\n}\n\nfunction updateCartUI() {\n    // Update cart count\n    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);\n    cartCount.textContent = totalItems;\n    \n    // Update cart items\n    if (cart.length === 0) {\n        cartItems.innerHTML = '<p class=\"empty-cart\">Your cart is empty</p>';\n    } else {\n        cartItems.innerHTML = cart.map(item => `\n            <div class=\"cart-item\">\n                <div class=\"cart-item-info\">\n                    <h4>${item.name}</h4>\n                    <p>₹${item.price} × ${item.quantity}</p>\n                </div>\n                <div class=\"cart-item-controls\">\n                    <button class=\"qty-btn\" onclick=\"updateQuantity('${item.name}', -1)\">-</button>\n                    <span>${item.quantity}</span>\n                    <button class=\"qty-btn\" onclick=\"updateQuantity('${item.name}', 1)\">+</button>\n                    <button class=\"qty-btn\" onclick=\"removeFromCart('${item.name}')\" style=\"background: #dc3545; margin-left: 10px;\">×</button>\n                </div>\n            </div>\n        `).join('');\n    }\n    \n    // Update total\n    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    cartTotal.textContent = total;\n}\n\nfunction toggleCart() {\n    cartSidebar.classList.toggle('open');\n}\n\nfunction closeCart() {\n    cartSidebar.classList.remove('open');\n}\n\nfunction saveCart() {\n    localStorage.setItem('cart', JSON.stringify(cart));\n}\n\nfunction loadCart() {\n    const savedCart = localStorage.getItem('cart');\n    if (savedCart) {\n        cart = JSON.parse(savedCart);\n        updateCartUI();\n    }\n}\n\nfunction handleCheckout() {\n    if (!isLoggedIn) {\n        showNotification('Please login to checkout', 'error');\n        closeCart();\n        showModal('loginModal');\n        return;\n    }\n    \n    if (cart.length === 0) {\n        showNotification('Your cart is empty', 'error');\n        return;\n    }\n    \n    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    const orderDetails = {\n        user: currentUser,\n        items: cart,\n        total: total,\n        date: new Date().toISOString()\n    };\n    \n    // In a real app, this would send to server\n    console.log('Order placed:', orderDetails);\n    \n    // Clear cart\n    cart = [];\n    updateCartUI();\n    saveCart();\n    closeCart();\n    \n    showNotification(`Order placed successfully! Total: ₹${total}`, 'success');\n}\n\nfunction handleContactForm(e) {\n    e.preventDefault();\n    const form = e.target;\n    const formData = new FormData(form);\n    \n    // In a real app, this would send to server\n    console.log('Contact form submitted:', Object.fromEntries(formData));\n    \n    form.reset();\n    showNotification('Message sent successfully!', 'success');\n}\n\nfunction setupSmoothScrolling() {\n    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {\n        anchor.addEventListener('click', function (e) {\n            e.preventDefault();\n            const target = document.querySelector(this.getAttribute('href'));\n            if (target) {\n                target.scrollIntoView({\n                    behavior: 'smooth',\n                    block: 'start'\n                });\n            }\n        });\n    });\n}\n\nfunction scrollToSection(sectionId) {\n    const section = document.getElementById(sectionId);\n    if (section) {\n        section.scrollIntoView({\n            behavior: 'smooth',\n            block: 'start'\n        });\n    }\n}\n\nfunction setupMobileMenu() {\n    const mobileMenu = document.querySelector('.mobile-menu');\n    const navLinks = document.querySelector('.nav-links');\n    \n    if (mobileMenu) {\n        mobileMenu.addEventListener('click', () => {\n            navLinks.classList.toggle('active');\n        });\n    }\n}\n\nfunction showNotification(message, type = 'info') {\n    // Create notification element\n    const notification = document.createElement('div');\n    notification.className = `notification ${type}`;\n    notification.textContent = message;\n    \n    // Style the notification\n    Object.assign(notification.style, {\n        position: 'fixed',\n        top: '100px',\n        right: '20px',\n        padding: '1rem 1.5rem',\n        borderRadius: '5px',\n        color: 'white',\n        fontWeight: 'bold',\n        zIndex: '2000',\n        transform: 'translateX(400px)',\n        transition: 'transform 0.3s ease'\n    });\n    \n    // Set background color based on type\n    switch (type) {\n        case 'success':\n            notification.style.background = '#28a745';\n            break;\n        case 'error':\n            notification.style.background = '#dc3545';\n            break;\n        default:\n            notification.style.background = '#17a2b8';\n    }\n    \n    // Add to DOM\n    document.body.appendChild(notification);\n    \n    // Animate in\n    setTimeout(() => {\n        notification.style.transform = 'translateX(0)';\n    }, 100);\n    \n    // Remove after 3 seconds\n    setTimeout(() => {\n        notification.style.transform = 'translateX(400px)';\n        setTimeout(() => {\n            document.body.removeChild(notification);\n        }, 300);\n    }, 3000);\n}\n\n// Expose functions to global scope for onclick handlers\nwindow.updateQuantity = updateQuantity;\nwindow.removeFromCart = removeFromCart;\nwindow.scrollToSection = scrollToSection;