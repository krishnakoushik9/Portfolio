/**
 * mobile-app.js
 * Interactions and dynamic rendering logic for the Softly-themed DesignV2 mobile page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Grain Overlay
    injectGrainOverlay();

    // 2. Scroll Reveal Animations
    initScrollReveal();

    // 3. Carousel Slideshow (Achievements / Vivriti)
    initMobileSliders();

    // 4. Interactive FAQ Accordion
    initFAQAccordion();

    // 5. GitHub API Integration & Dynamic Projects List (Disabled for hardcoded codebase)
    // initMobileProjects();

    // 6. Book Project Secrets Log Popup
    initBookPopup();

    // 7. Live Experiences Iframe Cycling
    initLiveExperiences();
});

/**
 * Global SVG Grain Overlay Injector
 */
function injectGrainOverlay() {
    const grainDiv = document.createElement('div');
    grainDiv.id = 'grain-overlay';
    
    // Inline styling to match requirements
    Object.assign(grainDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        pointerEvents: 'none',
        opacity: '0.35',
        mixBlendMode: 'overlay'
    });

    // Grain texture using SVG filter with feTurbulence
    grainDiv.innerHTML = `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block;">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="transparent" />
        </svg>
    `;
    
    document.body.appendChild(grainDiv);
}

/**
 * Scroll Reveal using IntersectionObserver
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-mobile');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Interactive FAQ Accordion
 */
function initFAQAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });
            
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Slide Carousel for Achievements and Vivriti sections
 */
function initMobileSliders() {
    const sliders = [
        {
            wrapper: document.getElementById('achievement-wrapper-mobile'),
            dots: document.getElementById('achievement-dots-mobile'),
            prev: document.getElementById('achievement-prev-mobile'),
            next: document.getElementById('achievement-next-mobile')
        },
        {
            wrapper: document.getElementById('vivriti-wrapper-mobile'),
            dots: document.getElementById('vivriti-dots-mobile'),
            prev: document.getElementById('vivriti-prev-mobile'),
            next: document.getElementById('vivriti-next-mobile')
        }
    ];

    sliders.forEach(slider => {
        if (!slider.wrapper) return;
        
        let currentIndex = 0;
        const slides = slider.wrapper.children;
        const totalSlides = slides.length;
        
        // Generate Dots
        if (slider.dots) {
            slider.dots.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = `slider-dot-mobile ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(i));
                slider.dots.appendChild(dot);
            }
        }
        
        function updateDots() {
            if (!slider.dots) return;
            Array.from(slider.dots.children).forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function goToSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            slider.wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }
        
        if (slider.prev) {
            slider.prev.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        
        if (slider.next) {
            slider.next.addEventListener('click', () => goToSlide(currentIndex + 1));
        }
        
        // Auto-scroll every 6 seconds
        let autoScroll = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 6000);
        
        // Pause auto-scroll on interaction
        const resetInterval = () => {
            clearInterval(autoScroll);
            autoScroll = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 6000);
        };
        
        if (slider.prev) slider.prev.addEventListener('click', resetInterval);
        if (slider.next) slider.next.addEventListener('click', resetInterval);
    });
}

/**
 * Fetch and Render GitHub Projects specifically for Mobile Layout
 */
async function initMobileProjects() {
    const container = document.getElementById('mobile-projects-list');
    if (!container) return;

    // Fallbacks identical to uiRenderer.js
    const FALLBACK_PROJECTS = [
        { name: "AYUR-VERSE", description: "Immersive 3D exploration of sacred trees combining ancient knowledge with modern tech.", html_url: "https://github.com/krishnakoushik9/AyurVerse", stargazers_count: 5, pushed_at: "2024-11-20T12:00:00Z" },
        { name: "EMO-CARE", description: "Real-time emotion and voice response system using facial recognition.", html_url: "https://github.com/krishnakoushik9/EMO-CARE-KAVVY", stargazers_count: 3, pushed_at: "2024-11-15T12:00:00Z" },
        { name: "E-SUMMIT", description: "Modern landing page with Three.js animations and event scheduling.", html_url: "https://github.com/krishnakoushik9/E-SUMMIT", stargazers_count: 2, pushed_at: "2025-01-10T12:00:00Z" },
        { name: "ASHBORN-RAG", description: "24/7 document-based RAG AI bot designed for local execution.", html_url: "https://github.com/krishnakoushik9/HackIndia-Spark-4-2025-ASHBORN-SRCS", stargazers_count: 4, pushed_at: "2025-02-15T12:00:00Z" },
        { name: "LEGION-SURF", description: "Full-stack AI chatbot for discovering and planning local events.", html_url: "https://github.com/krishnakoushik9/legion-surf-mate/tree/main/eventmate", stargazers_count: 2, pushed_at: "2024-12-05T12:00:00Z" }
    ];

    const GITHUB_USERNAME = 'krishnakoushik9';
    const CACHE_KEY = 'github_cache_data';
    const TIMESTAMP_KEY = 'github_cache_timestamp';
    const FETCH_INTERVAL = 12 * 60 * 60 * 1000; 

    // Same obfuscation logic
    const GITHUB_TOKEN = 'QME mF4RNVu6qxXvLEieXCJevVlE5RU4wHlBg_phg'.replace(/ /g, '').split('').reverse().join('');

    function renderList(repos) {
        const data = (repos && repos.length > 0) ? repos : FALLBACK_PROJECTS;
        container.innerHTML = '';

        data.forEach((repo, index) => {
            const isMostActive = index === 0;
            const lastUpdated = new Date(repo.pushed_at || repo.updatedAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            const card = document.createElement('div');
            card.className = `project-card-soft ${isMostActive ? 'highlighted' : ''}`;
            card.innerHTML = `
                <div class="project-card-header">
                    <h3>${repo.name.toUpperCase()}</h3>
                    <span class="project-stars">★ ${repo.stargazers_count}</span>
                </div>
                <p class="project-desc">${repo.description || 'No description provided.'}</p>
                <div class="project-card-footer">
                    <a href="${repo.html_url}" target="_blank" class="project-btn">PULL_REQUEST</a>
                    <span class="project-date">UPDT: ${lastUpdated}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Try cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && lastFetch && (now - parseInt(lastFetch) < FETCH_INTERVAL)) {
        renderList(JSON.parse(cachedData));
        return;
    }

    // Render fallbacks immediately as loading indicator
    renderList(null);

    // Fetch fresh
    try {
        // Starred fetch
        const starRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        
        let starred = [];
        if (starRes.ok) {
            const repos = await starRes.json();
            starred = repos.filter(repo => !repo.fork && !repo.archived);
        }

        // Pinned query
        let pinned = [];
        if (GITHUB_TOKEN) {
            const query = `
                query {
                    user(login: "${GITHUB_USERNAME}") {
                        pinnedItems(first: 6, types: REPOSITORY) {
                            nodes {
                                ... on Repository {
                                    name
                                    description
                                    url
                                    stargazerCount
                                    updatedAt
                                }
                            }
                        }
                    }
                }
            `;
            const pinRes = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GITHUB_TOKEN}`
                },
                body: JSON.stringify({ query })
            });

            if (pinRes.ok) {
                const result = await pinRes.json();
                pinned = result.data.user.pinnedItems.nodes.map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    html_url: repo.url,
                    stargazers_count: repo.stargazerCount,
                    pushed_at: repo.updatedAt
                }));
            }
        }

        // Merge & deduplicate
        const merged = [...pinned];
        const names = new Set(pinned.map(r => r.name.toLowerCase()));

        for (const repo of starred) {
            if (merged.length >= 5) break;
            if (!names.has(repo.name.toLowerCase())) {
                merged.push(repo);
                names.add(repo.name.toLowerCase());
            }
        }

        const finalRepos = merged.slice(0, 5);
        if (finalRepos.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(finalRepos));
            localStorage.setItem(TIMESTAMP_KEY, now.toString());
            renderList(finalRepos);
        }
    } catch (e) {
        console.warn('Mobile GitHub Fetch failed, staying with fallback / cache', e);
    }
}

/**
 * Secret log popup logic
 */
function initBookPopup() {
    const bookBtn = document.getElementById('book-btn-mobile');
    const bookPopup = document.getElementById('book-popup-mobile');
    const closeBtn = document.getElementById('book-close-mobile');
    const yearsWriting = document.getElementById('years-writing-mobile');
    const yearsUntil = document.getElementById('years-until-mobile');

    if (!bookBtn || !bookPopup) return;

    if (yearsWriting) {
        yearsWriting.textContent = (new Date().getFullYear() - 2023).toString();
    }
    if (yearsUntil) {
        yearsUntil.textContent = (2030 - new Date().getFullYear()).toString();
    }

    const openModal = () => {
        bookPopup.style.display = 'flex';
        setTimeout(() => {
            bookPopup.style.opacity = '1';
            bookPopup.querySelector('.modal-content-mobile').style.transform = 'scale(1)';
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        bookPopup.style.opacity = '0';
        bookPopup.querySelector('.modal-content-mobile').style.transform = 'scale(0.9)';
        setTimeout(() => {
            bookPopup.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    };

    bookBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    bookPopup.addEventListener('click', (e) => {
        if (e.target === bookPopup) closeModal();
    });
}

/**
 * Cycle Live Experiences in iframe
 */
function initLiveExperiences() {
    const iframe = document.getElementById('experience-iframe');
    const btn = document.getElementById('toggle-experience-btn');
    const openBtn = document.getElementById('open-experience-btn');
    const title = document.getElementById('experience-project-title');
    
    if (!iframe || !btn || !title) return;
    
    const sites = [
        "https://suvyaikth.vercel.app/",
        "https://ps-x-industrial-digital-twin.vercel.app/",
        "https://cdss-ochre.vercel.app/"
    ];
    
    let currentIndex = 0;
    
    btn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % sites.length;
        const currentSite = sites[currentIndex];
        
        // Update iframe source
        iframe.src = currentSite;
        
        // Update external link href if button exists
        if (openBtn) {
            openBtn.href = currentSite;
        }
        
        // Extract display name from URL (e.g. suvyaikth.vercel.app)
        const displayName = currentSite.replace("https://", "").replace("/", "");
        title.textContent = `Currently Experiencing: ${displayName}`;
    });
}
