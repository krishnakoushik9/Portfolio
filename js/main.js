// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // GitHub Projects Carousel
    const githubProjects = document.getElementById('github-projects');
    const prevButton = document.getElementById('github-prev');
    const nextButton = document.getElementById('github-next');
    
    if (githubProjects && prevButton && nextButton) {
        let currentPosition = 0;
        const cardWidth = window.innerWidth >= 768 ? 33.33 : 100; // Percentage width of each card
        const totalCards = githubProjects.children.length;
        const visibleCards = window.innerWidth >= 768 ? 3 : 1;
        const maxPosition = Math.max(0, totalCards - visibleCards);
        
        // Update carousel position
        function updateCarouselPosition() {
            githubProjects.style.transform = `translateX(-${currentPosition * cardWidth}%)`;
        }
        
        // Previous button click handler
        prevButton.addEventListener('click', function() {
            currentPosition = Math.max(0, currentPosition - 1);
            updateCarouselPosition();
        });
        
        // Next button click handler
        nextButton.addEventListener('click', function() {
            currentPosition = Math.min(maxPosition, currentPosition + 1);
            updateCarouselPosition();
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const newVisibleCards = window.innerWidth >= 768 ? 3 : 1;
            const newMaxPosition = Math.max(0, totalCards - newVisibleCards);
            currentPosition = Math.min(currentPosition, newMaxPosition);
            updateCarouselPosition();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all sections and cards
    document.querySelectorAll('section, .card').forEach(el => {
        el.style.opacity = 0;
        observer.observe(el);
    });
});
