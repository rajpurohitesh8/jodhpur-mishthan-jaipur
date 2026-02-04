document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.mobile-menu');
    const menu = document.querySelector('.nav-links');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        hamburger.addEventListener('touchstart', function() {
            menu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
});