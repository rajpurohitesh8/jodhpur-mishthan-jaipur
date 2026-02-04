// Global Variables
let cart = [];
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing mobile app...');
    initMobileApp();
});

function initMobileApp() {
    try {
        setupMobileNavigation();
        setupScrollAnimations();
        setupTouchInteractions();
        setupMobileCart();
        setupAuth();
        setupProductFilters();
        optimizeForMobile();
        console.log('Mobile app initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}