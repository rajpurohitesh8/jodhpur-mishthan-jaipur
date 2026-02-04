function toggleMenu() {
    const menu = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.mobile-menu i');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        hamburger.className = 'fas fa-bars';
    } else {
        menu.classList.add('active');
        hamburger.className = 'fas fa-times';
    }
}