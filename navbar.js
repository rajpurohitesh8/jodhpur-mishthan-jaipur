// Minimal Navbar Fix
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.mobile-menu');
    const menu = document.querySelector('.nav-links');
    
    console.log('Hamburger:', hamburger);
    console.log('Menu:', menu);
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            console.log('Hamburger clicked');
            menu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                hamburger.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
});