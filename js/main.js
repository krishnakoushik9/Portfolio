// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Book popup functionality
    const bookBtn = document.getElementById('book-btn');
    const bookPopup = document.getElementById('book-popup');
    const popupContent = document.getElementById('popup-content');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopup = document.getElementById('close-popup');
    const yearsWritingSpan = document.getElementById('years-writing');
    const yearsUntilSpan = document.getElementById('years-until');
    const assemblyCode = `section .data
    msg db "Every day I wake up and then I choose between peak narcissism versus peak self-hatred.", 10
    len equ $ - msg

section .text
    global _start

_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, len
    int 0x80

    mov eax, 1
    xor ebx, ebx
    int 0x80
`;

    let i = 0;
    const speed = 20;
    const pre = document.getElementById("assembly-text");
    const finalMessage = document.getElementById("final-message");

    function typeWriter() {
        if (i < assemblyCode.length) {
            pre.innerHTML += assemblyCode.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            finalMessage.classList.add("visible");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        typeWriter();
    });


    if (bookBtn && bookPopup) {
        // Calculate years since February 2023
        function updateYears() {
            const startDate = new Date(2023, 1, 1); // February 1, 2023
            const releaseDate = new Date(2030, 0, 1); // January 1, 2030
            const currentDate = new Date();

            // Calculate years writing (with one decimal place)
            const yearsWriting = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
            yearsWritingSpan.textContent = yearsWriting.toFixed(1);

            // Calculate years until release (with one decimal place)
            const yearsUntil = (releaseDate - currentDate) / (1000 * 60 * 60 * 24 * 365.25);
            yearsUntilSpan.textContent = Math.max(0, yearsUntil).toFixed(1);
        }

        // Open popup
        bookBtn.addEventListener('click', function () {
            updateYears();
            bookPopup.classList.remove('hidden');
            setTimeout(() => {
                popupContent.classList.add('scale-100', 'opacity-100');
                popupContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        });

        // Close popup when clicking the close button
        closePopup.addEventListener('click', function () {
            popupContent.classList.remove('scale-100', 'opacity-100');
            popupContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                bookPopup.classList.add('hidden');
            }, 300);
        });

        // Close popup when clicking outside
        popupOverlay.addEventListener('click', function () {
            popupContent.classList.remove('scale-100', 'opacity-100');
            popupContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                bookPopup.classList.add('hidden');
            }, 300);
        });
    }
    // Mobile menu and smooth scroll logic removed - now handled by navbar.js

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
        prevButton.addEventListener('click', function () {
            currentPosition = Math.max(0, currentPosition - 1);
            updateCarouselPosition();
        });

        // Next button click handler
        nextButton.addEventListener('click', function () {
            currentPosition = Math.min(maxPosition, currentPosition + 1);
            updateCarouselPosition();
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            const newVisibleCards = window.innerWidth >= 768 ? 3 : 1;
            const newMaxPosition = Math.max(0, totalCards - newVisibleCards);
            currentPosition = Math.min(currentPosition, newMaxPosition);
            updateCarouselPosition();
        });
    }


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
    // Achievement Slideshow
    const achievementSlider = document.getElementById('achievement-slider');
    const slidePrev = document.getElementById('slide-prev');
    const slideNext = document.getElementById('slide-next');
    const slideDots = document.querySelectorAll('.slide-dot');

    if (achievementSlider && slidePrev && slideNext) {
        let currentSlide = 0;
        const totalSlides = achievementSlider.children.length;

        function updateSlides() {
            achievementSlider.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            slideDots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('bg-white');
                    dot.classList.remove('bg-white/50');
                    dot.style.width = '24px'; // Expansion effect
                } else {
                    dot.classList.remove('bg-white');
                    dot.classList.add('bg-white/50');
                    dot.style.width = '12px';
                }
            });
        }

        slidePrev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlides();
        });

        slideNext.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlides();
        });

        slideDots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.getAttribute('data-index'));
                updateSlides();
            });
        });

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlides();
        }, 5000);

        // Initialize dots
        updateSlides();
    }
});
