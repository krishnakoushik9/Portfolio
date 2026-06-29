document.addEventListener('DOMContentLoaded', () => {
    // Generate Normal Map for Sphere Lens (Apple style: edge-only heavy refraction)
    function generateLensMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(128, 128);
        const data = imgData.data;
        
        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                const dx = (x - 64) / 64;
                const dy = (y - 64) / 64;
                const r2 = dx*dx + dy*dy;
                
                let r = 128;
                let g = 128;
                let b = 255;
                
                const d = Math.sqrt(r2);
                if (d <= 1.0) {
                    let factor = 0;
                    if (d < 0.7) {
                        // Center is clear with very slight magnification
                        factor = 0.08 * d;
                    } else {
                        // Edges refract heavily (Apple Liquid Glass design)
                        const t = (d - 0.7) / 0.3; // 0 to 1
                        const edgeRefract = Math.sin(Math.PI * t) * 0.95;
                        factor = (0.08 * d) + edgeRefract;
                    }
                    const nx = -dx * factor;
                    const ny = -dy * factor;
                    
                    r = Math.floor((nx + 1.0) * 127.5);
                    g = Math.floor((ny + 1.0) * 127.5);
                }
                
                const idx = (y * 128 + x) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    // Generate Normal Map for Cube Lens (Apple style: edge-only heavy refraction)
    function generateCubeMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(128, 128);
        const data = imgData.data;
        
        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                const dx = (x - 64) / 64;
                const dy = (y - 64) / 64;
                const ax = Math.abs(dx);
                const ay = Math.abs(dy);
                const max = Math.max(ax, ay);
                
                let r = 128;
                let g = 128;
                let b = 255;
                
                if (max <= 1.0) {
                    let factor = 0;
                    if (max < 0.75) {
                        // Flat magnification in the middle
                        factor = 0.12;
                    } else {
                        // High refraction distortion near the square boundary
                        const t = (max - 0.75) / 0.25; // 0 to 1
                        const edgeRefract = Math.sin(Math.PI * t) * 1.05;
                        factor = 0.12 + edgeRefract;
                    }
                    const nx = -dx * factor;
                    const ny = -dy * factor;
                    
                    r = Math.floor((nx + 1.0) * 127.5);
                    g = Math.floor((ny + 1.0) * 127.5);
                }
                
                const idx = (y * 128 + x) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    const lensMap = generateLensMap();
    const cubeMap = generateCubeMap();

    // Create and append SVG filter for refraction to body dynamically.
    // SVG is rendered with non-zero dimensions off-screen to avoid browser clipping bugs.
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "128");
    svg.setAttribute("height", "128");
    svg.style.position = "fixed";
    svg.style.top = "-9999px";
    svg.style.left = "-9999px";
    svg.style.width = "128px";
    svg.style.height = "128px";
    svg.style.pointerEvents = "none";
    
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "glass-refraction-filter");
    filter.setAttribute("x", "-20%");
    filter.setAttribute("y", "-20%");
    filter.setAttribute("width", "140%");
    filter.setAttribute("height", "140%");
    
    const feImageLens = document.createElementNS(svgNS, "feImage");
    feImageLens.setAttribute("result", "lensMap");
    feImageLens.setAttribute("width", "100%");
    feImageLens.setAttribute("height", "100%");
    feImageLens.setAttribute("preserveAspectRatio", "none");
    feImageLens.setAttribute("href", lensMap);
    feImageLens.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", lensMap);

    const feImageCube = document.createElementNS(svgNS, "feImage");
    feImageCube.setAttribute("result", "cubeMap");
    feImageCube.setAttribute("width", "100%");
    feImageCube.setAttribute("height", "100%");
    feImageCube.setAttribute("preserveAspectRatio", "none");
    feImageCube.setAttribute("href", cubeMap);
    feImageCube.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", cubeMap);
    
    const feComposite = document.createElementNS(svgNS, "feComposite");
    feComposite.setAttribute("id", "refraction-blend");
    feComposite.setAttribute("operator", "arithmetic");
    feComposite.setAttribute("in", "lensMap");
    feComposite.setAttribute("in2", "cubeMap");
    feComposite.setAttribute("k1", "0");
    feComposite.setAttribute("k2", "1");
    feComposite.setAttribute("k3", "0");
    feComposite.setAttribute("k4", "0");
    feComposite.setAttribute("result", "map");
    
    const feDisplacementMap = document.createElementNS(svgNS, "feDisplacementMap");
    feDisplacementMap.setAttribute("in", "SourceGraphic");
    feDisplacementMap.setAttribute("in2", "map");
    feDisplacementMap.setAttribute("scale", "52"); // Increased displacement scale for prominent refraction
    feDisplacementMap.setAttribute("xChannelSelector", "R");
    feDisplacementMap.setAttribute("yChannelSelector", "G");
    
    filter.appendChild(feImageLens);
    filter.appendChild(feImageCube);
    filter.appendChild(feComposite);
    filter.appendChild(feDisplacementMap);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    // Create Custom Cursor DOM Element
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    // Set backdrop filter styling dynamically in JS to bypass external stylesheet path resolution bugs
    cursor.style.backdropFilter = "url(#glass-refraction-filter)";
    cursor.style.webkitBackdropFilter = "url(#glass-refraction-filter)";
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    let cursorScaleTarget = 1;
    let cursorScaleCurrent = 1;
    let morphTarget = 0; // 0 = lens, 1 = cube
    let morphCurrent = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const lerp = 0.12; // smooth tracker inertia
        cursorX += (mouseX - cursorX) * lerp;
        cursorY += (mouseY - cursorY) * lerp;
        
        // Slower transition rates for prominent, heavy-feeling physical glass animation
        const morphLerp = 0.035; // Morph is slower, taking ~1s to feel the blend
        morphCurrent += (morphTarget - morphCurrent) * morphLerp;
        
        const scaleLerp = 0.045; // Scale is also slower
        cursorScaleCurrent += (cursorScaleTarget - cursorScaleCurrent) * scaleLerp;
        
        // Update SVG arithmetic composite channels dynamically
        const blend = document.getElementById('refraction-blend');
        if (blend) {
            blend.setAttribute('k2', (1 - morphCurrent).toFixed(4));
            blend.setAttribute('k3', morphCurrent.toFixed(4));
        }
        
        // Centered translation based on default 72px cursor size (offset = -36px)
        cursor.style.transform = `translate(${cursorX - 36}px, ${cursorY - 36}px) scale(${cursorScaleCurrent})`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .btn-brutalist, .card-brutalist, input, [role="button"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorScaleTarget = 1.8;
            morphTarget = 1;
            cursor.classList.add('cube-mode');
        });
        el.addEventListener('mouseleave', () => {
            cursorScaleTarget = 1;
            morphTarget = 0;
            cursor.classList.remove('cube-mode');
        });
    });

    // Book Popup Logic
    const bookBtn = document.getElementById('book-btn');
    const bookPopup = document.getElementById('book-popup');
    const closePopup = document.getElementById('close-popup');
    const yearsWriting = document.getElementById('years-writing');
    const yearsUntil = document.getElementById('years-until');

    if (bookBtn && bookPopup) {
        if (yearsWriting) yearsWriting.textContent = new Date().getFullYear() - 2023;
        if (yearsUntil) yearsUntil.textContent = 2030 - new Date().getFullYear();

        bookBtn.addEventListener('click', () => {
            bookPopup.style.display = 'flex';
        });

        if (closePopup) {
            closePopup.addEventListener('click', () => {
                bookPopup.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === bookPopup) {
                bookPopup.style.display = 'none';
            }
        });
    }
});
