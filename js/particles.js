// Initialize particles.js for the home page
document.addEventListener('DOMContentLoaded', function() {
    // Particle effect configuration with colors matching the main site theme
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 120,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#000000"
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
                "color": "#000000",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "bounce",
                "bounce": true,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "window",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "attract"
                },
                "onclick": {
                    "enable": true,
                    "mode": "repulse"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 200,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "attract": {
                    "distance": 200,
                    "duration": 0.4,
                    "speed": 3
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
                    "duration": 0.8
                },
                "push": {
                    "particles_nb": 8
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Add toggle functionality
    const toggleParticles = document.getElementById('toggleParticles');
    if (toggleParticles) {
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
    }
});
