document.addEventListener('DOMContentLoaded', () => {
    // Device & Browser Capability Detection
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Apply refraction SVG displacement map ONLY on desktop Chrome/Firefox/Edge (non-Safari, non-touch)
    const shouldApplyRefraction = !isTouchDevice && !isSafari && !isIOS;
    
    // Custom cursor visibility: only show on desktop (non-touch devices)
    const showCursor = !isTouchDevice;

    if (showCursor) {
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

        // Only build and inject SVG filter if displacement-map refraction is supported and performant (Desktop Chrome/Firefox/Edge)
        if (shouldApplyRefraction) {
            const lensMap = generateLensMap();
            const cubeMap = generateCubeMap();

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
            filter.setAttribute("x", "0%");
            filter.setAttribute("y", "0%");
            filter.setAttribute("width", "100%");
            filter.setAttribute("height", "100%");
            
            // Flood filter with neutral grey (#808080) for 0 default displacement
            const feFlood = document.createElementNS(svgNS, "feFlood");
            feFlood.setAttribute("flood-color", "#808080");
            feFlood.setAttribute("flood-opacity", "1");
            feFlood.setAttribute("result", "neutral");
            
            const feImageLens = document.createElementNS(svgNS, "feImage");
            feImageLens.setAttribute("id", "refraction-map-lens");
            feImageLens.setAttribute("result", "lensMap");
            feImageLens.setAttribute("width", "72");
            feImageLens.setAttribute("height", "72");
            feImageLens.setAttribute("preserveAspectRatio", "none");
            feImageLens.setAttribute("href", lensMap);
            feImageLens.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", lensMap);

            const feImageCube = document.createElementNS(svgNS, "feImage");
            feImageCube.setAttribute("id", "refraction-map-cube");
            feImageCube.setAttribute("result", "cubeMap");
            feImageCube.setAttribute("width", "72");
            feImageCube.setAttribute("height", "72");
            feImageCube.setAttribute("preserveAspectRatio", "none");
            feImageCube.setAttribute("href", cubeMap);
            feImageCube.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", cubeMap);
            
            const feCompositeBlend = document.createElementNS(svgNS, "feComposite");
            feCompositeBlend.setAttribute("id", "refraction-blend");
            feCompositeBlend.setAttribute("operator", "arithmetic");
            feCompositeBlend.setAttribute("in", "lensMap");
            feCompositeBlend.setAttribute("in2", "cubeMap");
            feCompositeBlend.setAttribute("k1", "0");
            feCompositeBlend.setAttribute("k2", "1");
            feCompositeBlend.setAttribute("k3", "0");
            feCompositeBlend.setAttribute("k4", "0");
            feCompositeBlend.setAttribute("result", "cursorMap");

            // Composite dynamic cursor map on top of full-screen neutral grey background
            const feCompositeOverlay = document.createElementNS(svgNS, "feComposite");
            feCompositeOverlay.setAttribute("operator", "over");
            feCompositeOverlay.setAttribute("in", "cursorMap");
            feCompositeOverlay.setAttribute("in2", "neutral");
            feCompositeOverlay.setAttribute("result", "displacementMap");
            
            const feDisplacementMap = document.createElementNS(svgNS, "feDisplacementMap");
            feDisplacementMap.setAttribute("in", "SourceGraphic");
            feDisplacementMap.setAttribute("in2", "displacementMap");
            feDisplacementMap.setAttribute("scale", "52");
            feDisplacementMap.setAttribute("xChannelSelector", "R");
            feDisplacementMap.setAttribute("yChannelSelector", "G");
            
            filter.appendChild(feFlood);
            filter.appendChild(feImageLens);
            filter.appendChild(feImageCube);
            filter.appendChild(feCompositeBlend);
            filter.appendChild(feCompositeOverlay);
            filter.appendChild(feDisplacementMap);
            defs.appendChild(filter);
            svg.appendChild(defs);
            document.body.appendChild(svg);

            // Apply the displacement filter to the main content container wrapper
            const appWrap = document.getElementById('app-wrap');
            if (appWrap) {
                appWrap.style.filter = "url(#glass-refraction-filter)";
                appWrap.style.webkitFilter = "url(#glass-refraction-filter)";
            }
        }

        // Create Custom Cursor DOM Element
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        
        // If SVG refraction is NOT supported/applied (e.g., macOS Safari), apply native CSS glass fallback
        if (!shouldApplyRefraction) {
            cursor.style.backdropFilter = "blur(12px) saturate(140%)";
            cursor.style.webkitBackdropFilter = "blur(12px) saturate(140%)";
            cursor.style.background = "rgba(255, 255, 255, 0.1)";
            cursor.style.border = "1.5px solid rgba(255, 255, 255, 0.45)";
            cursor.style.boxShadow = "0 12px 35px 0 rgba(0, 0, 0, 0.35), inset 0 0 8px rgba(255, 255, 255, 0.25)";
        }
        
        document.body.appendChild(cursor);

        let viewportX = 0, viewportY = 0;
        let documentX = 0, documentY = 0;
        
        let cursorX = 0, cursorY = 0;
        let filterX = 0, filterY = 0;

        let cursorScaleTarget = 1;
        let cursorScaleCurrent = 1;
        let morphTarget = 0; // 0 = lens, 1 = cube
        let morphCurrent = 0;

        document.addEventListener('mousemove', (e) => {
            viewportX = e.clientX;
            viewportY = e.clientY;
            documentX = e.pageX;
            documentY = e.pageY;
        });

        function animateCursor() {
            const lerp = 0.12;
            cursorX += (viewportX - cursorX) * lerp;
            cursorY += (viewportY - cursorY) * lerp;
            
            if (shouldApplyRefraction) {
                filterX += (documentX - filterX) * lerp;
                filterY += (documentY - filterY) * lerp;
            }
            
            const morphLerp = 0.035;
            morphCurrent += (morphTarget - morphCurrent) * morphLerp;
            
            const scaleLerp = 0.045;
            cursorScaleCurrent += (cursorScaleTarget - cursorScaleCurrent) * scaleLerp;
            
            if (shouldApplyRefraction) {
                const blend = document.getElementById('refraction-blend');
                if (blend) {
                    blend.setAttribute('k2', (1 - morphCurrent).toFixed(4));
                    blend.setAttribute('k3', morphCurrent.toFixed(4));
                }

                const lensImg = document.getElementById('refraction-map-lens');
                const cubeImg = document.getElementById('refraction-map-cube');
                const currentSize = 72 * cursorScaleCurrent;
                const halfSize = currentSize / 2;
                
                if (lensImg) {
                    lensImg.setAttribute('x', (filterX - halfSize).toFixed(1));
                    lensImg.setAttribute('y', (filterY - halfSize).toFixed(1));
                    lensImg.setAttribute('width', currentSize.toFixed(1));
                    lensImg.setAttribute('height', currentSize.toFixed(1));
                }
                if (cubeImg) {
                    cubeImg.setAttribute('x', (filterX - halfSize).toFixed(1));
                    cubeImg.setAttribute('y', (filterY - halfSize).toFixed(1));
                    cubeImg.setAttribute('width', currentSize.toFixed(1));
                    cubeImg.setAttribute('height', currentSize.toFixed(1));
                }
            }
            
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
    }

    // Book Popup Logic (Unconditionally active for all screen sizes and devices)
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
