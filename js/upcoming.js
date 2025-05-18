// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Particle effect configuration
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#7e57c2"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#5e35b1",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Toggle particles effect
    const toggleParticles = document.getElementById('toggleParticles');
    let particlesEnabled = true;

    toggleParticles.addEventListener('click', function(e) {
        e.preventDefault();
        
        const particlesCanvas = document.querySelector('#particles-js canvas');
        
        if (particlesEnabled) {
            particlesCanvas.style.opacity = '0';
            particlesEnabled = false;
        } else {
            particlesCanvas.style.opacity = '1';
            particlesEnabled = true;
        }
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .gallery-item, .section-title, .bhashini-banner');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate-in');
            }
        });
    };

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .gallery-item, .section-title, .bhashini-banner {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(odd) {
            transition-delay: 0.2s;
        }
        
        .gallery-item:nth-child(3n+1) {
            transition-delay: 0.1s;
        }
        
        .gallery-item:nth-child(3n+2) {
            transition-delay: 0.2s;
        }
        
        .gallery-item:nth-child(3n+3) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);

    // Initialize animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgSrc}" alt="${imgAlt}">
                    <p>${imgAlt}</p>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            lightbox.querySelector('.close-lightbox').addEventListener('click', function() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }, 300);
            });
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    lightbox.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });
    });
    
    // Add CSS for lightbox
    const lightboxStyle = document.createElement('style');
    lightboxStyle.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            border: 2px solid #7e57c2;
            box-shadow: 0 0 20px rgba(126, 87, 194, 0.5);
        }
        
        .lightbox-content p {
            color: white;
            text-align: center;
            margin-top: 1rem;
        }
        
        .close-lightbox {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 30px;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-lightbox:hover {
            color: #7e57c2;
        }
    `;
    document.head.appendChild(lightboxStyle);
});
