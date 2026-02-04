function toggleMobileMenu() {
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

function closeMenu() {
    const menu = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.mobile-menu i');
    menu.classList.remove('active');
    hamburger.className = 'fas fa-bars';
}

document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to menu links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});