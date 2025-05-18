/**
 * Divine Game Dev Details JavaScript
 * Enhances the Shiva-inspired game development page with animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Animated elements reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all elements that should animate on scroll
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add divine particle effects (subtle floating elements)
    createDivineParticles();
    
    // Add audio element for background ambient sounds (optional, starts muted)
    addBackgroundAmbience();
    
    // Add trishul decorative elements
    addTrishulDecorations();
});

/**
 * Creates subtle floating particles that resemble divine elements
 */
function createDivineParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
}

/**
 * Creates a single divine particle
 */
function createParticle(container) {
    const particle = document.createElement('div');
    
    // Random particle type (Om symbol, dot, or small trishul)
    const particleTypes = ['॥', '•', '॥', '॥', '•'];
    const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    
    // Set particle properties
    particle.textContent = particleType;
    particle.style.position = 'absolute';
    particle.style.color = 'rgba(255, 114, 0, 0.2)';
    particle.style.fontSize = Math.random() * 20 + 10 + 'px';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    // Animation properties
    const duration = Math.random() * 60 + 30;
    const delay = Math.random() * 10;
    
    // Apply animation
    particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
    
    // Add to container
    container.appendChild(particle);
    
    // Add keyframes for floating animation if not already added
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.1;
                }
                25% {
                    opacity: 0.3;
                }
                50% {
                    transform: translateY(-70vh) rotate(180deg);
                    opacity: 0.2;
                }
                75% {
                    opacity: 0.1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Adds background ambient sounds (starts muted)
 */
function addBackgroundAmbience() {
    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-controls';
    audioContainer.innerHTML = `
        <audio id="bg-ambience" loop preload="none">
            <source src="https://soundbible.com/mp3/tibetan-singing-bowl-daniel_simon.mp3" type="audio/mpeg">
        </audio>
        <button id="toggle-audio" class="divine-btn audio-btn" title="Toggle ambient sounds">
            <i class="fas fa-volume-mute"></i>
        </button>
    `;
    
    // Style the audio button
    const style = document.createElement('style');
    style.textContent = `
        .audio-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100;
        }
        .audio-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(audioContainer);
    
    // Add event listener for audio toggle
    const audioBtn = document.getElementById('toggle-audio');
    const audio = document.getElementById('bg-ambience');
    
    audioBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.volume = 0.2; // Low volume
            audio.play();
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            audio.pause();
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}

/**
 * Adds decorative trishul elements to the page
 */
function addTrishulDecorations() {
    // Create SVG trishuls
    const trishulSVG = `
        <svg class="trishul-decoration trishul-top-right" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,10 L50,90 M30,30 L50,10 L70,30" stroke="rgba(255,114,0,0.3)" stroke-width="4" fill="none"/>
        </svg>
        <svg class="trishul-decoration trishul-bottom-left" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,10 L50,90 M30,30 L50,10 L70,30" stroke="rgba(255,114,0,0.3)" stroke-width="4" fill="none"/>
        </svg>
    `;
    
    // Add to body
    const trishulContainer = document.createElement('div');
    trishulContainer.className = 'trishul-container';
    trishulContainer.style.position = 'fixed';
    trishulContainer.style.top = '0';
    trishulContainer.style.left = '0';
    trishulContainer.style.width = '100%';
    trishulContainer.style.height = '100%';
    trishulContainer.style.pointerEvents = 'none';
    trishulContainer.style.zIndex = '-1';
    trishulContainer.innerHTML = trishulSVG;
    
    document.body.appendChild(trishulContainer);
}

/**
 * Enhances gallery images with lightbox functionality
 */
document.addEventListener('click', function(e) {
    if (e.target.closest('.gallery-item')) {
        const img = e.target.closest('.gallery-item').querySelector('img');
        if (img) {
            openLightbox(img.src, img.alt);
        }
    }
});

/**
 * Opens a lightbox with the selected image
 */
function openLightbox(src, alt) {
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}" class="lightbox-img">
                <div class="lightbox-caption">${alt}</div>
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // Style the lightbox
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .lightbox.show {
                opacity: 1;
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .lightbox-img {
                max-width: 100%;
                max-height: 80vh;
                display: block;
                border: 3px solid var(--divine-border);
                box-shadow: var(--divine-glow);
            }
            .lightbox-caption {
                color: white;
                text-align: center;
                padding: 10px;
                font-family: 'Cinzel', serif;
            }
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 30px;
                color: white;
                background: none;
                border: none;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Add to body
        document.body.appendChild(lightbox);
        
        // Add close event
        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox').addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
        
        // Show lightbox
        setTimeout(() => {
            document.querySelector('.lightbox').classList.add('show');
        }, 10);
    } else {
        // Update existing lightbox
        document.querySelector('.lightbox-img').src = src;
        document.querySelector('.lightbox-img').alt = alt;
        document.querySelector('.lightbox-caption').textContent = alt;
        document.querySelector('.lightbox').classList.add('show');
    }
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.remove();
        }, 300);
    }
}
