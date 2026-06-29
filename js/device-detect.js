/**
 * device-detect.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PRE-LOAD device detection script.
 * This MUST be the first script loaded in <head> with NO defer/async.
 * It determines the device type and orientation, then routes to the
 * correct design version before any other rendering occurs.
 *
 * Rules:
 *   • Laptop / MacBook (16:10 or 16:9 aspect ratio) → Current site (index.html)
 *   • iPad Horizontal                                → Current site (index.html)
 *   • iPad Vertical                                  → DesignV2 (mobile.html)
 *   • Mobile / Smartphone                            → DesignV2 (mobile.html)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

(function () {
    'use strict';

    // ──────────────── Helpers ────────────────

    /**
     * Get the usable screen dimensions.
     * Uses screen.availWidth/Height for the most accurate pre-render measurement,
     * falling back to screen.width/height, then window.innerWidth/Height.
     */
    function getScreenDimensions() {
        return {
            width: screen.availWidth || screen.width || window.innerWidth,
            height: screen.availHeight || screen.height || window.innerHeight
        };
    }

    /**
     * Detect if the User-Agent string matches known tablet patterns.
     * iPad detection is tricky because iPadOS 13+ reports as "Macintosh".
     */
    function isIPad() {
        const ua = navigator.userAgent || '';

        // Classic iPad UA
        if (/iPad/i.test(ua)) return true;

        // iPadOS 13+ — reports as Mac but has touch
        if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return true;

        return false;
    }

    /**
     * Detect if the device is a mobile phone (not tablet).
     */
    function isMobilePhone() {
        const ua = navigator.userAgent || '';

        // Explicit mobile tokens
        if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;
        if (/iPhone/i.test(ua)) return true;
        if (/iPod/i.test(ua)) return true;
        if (/Windows Phone/i.test(ua)) return true;
        if (/BlackBerry|BB10/i.test(ua)) return true;
        if (/Opera Mini|Opera Mobi/i.test(ua)) return true;
        if (/webOS/i.test(ua)) return true;

        // Catch-all: small screen + touch (but not iPad-sized)
        var dim = getScreenDimensions();
        var minDim = Math.min(dim.width, dim.height);
        if (navigator.maxTouchPoints > 0 && minDim <= 480) return true;

        return false;
    }

    /**
     * Detect if device is a desktop/laptop with widescreen aspect ratio.
     * Checks for 16:9 (1.777...) or 16:10 (1.6) within a tolerance.
     */
    function isDesktopWidescreen() {
        var dim = getScreenDimensions();
        var w = Math.max(dim.width, dim.height);
        var h = Math.min(dim.width, dim.height);
        var ratio = w / h;

        // 16:9 = 1.778, 16:10 = 1.6, 3:2 = 1.5, 21:9 = 2.333
        // We consider anything >= 1.45 as "widescreen-ish" for laptops
        // Combined with no touch or large screen
        var isWide = ratio >= 1.45;
        var isLargeScreen = w >= 1024;
        var hasNoTouch = navigator.maxTouchPoints === 0;
        var hasKeyboard = !('ontouchstart' in window) || hasNoTouch;

        return isLargeScreen && (isWide || hasKeyboard) && !isIPad() && !isMobilePhone();
    }

    /**
     * Check if the current screen is in landscape (horizontal) orientation.
     */
    function isLandscape() {
        // Prefer the Screen Orientation API
        if (screen.orientation && screen.orientation.type) {
            return screen.orientation.type.indexOf('landscape') !== -1;
        }
        // Fallback to window.orientation (deprecated but widely supported)
        if (typeof window.orientation !== 'undefined') {
            return Math.abs(window.orientation) === 90;
        }
        // Fallback to dimension comparison
        var dim = getScreenDimensions();
        return dim.width > dim.height;
    }

    // ──────────────── Detection Logic ────────────────

    /**
     * Determine the device class.
     * Returns: 'desktop' | 'ipad-landscape' | 'ipad-portrait' | 'mobile'
     */
    function detectDevice() {
        // 1. Check iPad first (before desktop, because iPadOS fakes Mac UA)
        if (isIPad()) {
            return isLandscape() ? 'ipad-landscape' : 'ipad-portrait';
        }

        // 2. Check mobile phone
        if (isMobilePhone()) {
            return 'mobile';
        }

        // 3. Check desktop/laptop widescreen
        if (isDesktopWidescreen()) {
            return 'desktop';
        }

        // 4. Fallback: Check screen size for Android tablets / unknown devices
        var dim = getScreenDimensions();
        var minDim = Math.min(dim.width, dim.height);
        var maxDim = Math.max(dim.width, dim.height);

        // Tablet-ish: min dimension > 600px but smaller than laptop
        if (minDim > 600 && maxDim < 1200 && navigator.maxTouchPoints > 0) {
            // Treat like iPad rules
            return isLandscape() ? 'ipad-landscape' : 'ipad-portrait';
        }

        // Small screens that slipped through
        if (maxDim <= 900 && navigator.maxTouchPoints > 0) {
            return 'mobile';
        }

        // Default: treat as desktop
        return 'desktop';
    }

    // ──────────────── Routing Decision ────────────────

    var device = detectDevice();

    // Store the detected device for use by other scripts
    window.__DEVICE_CLASS = device;

    // Determine current page
    var currentPath = window.location.pathname;
    var isOnMobilePage = currentPath.indexOf('mobile.html') !== -1;
    var isOnIndexPage = currentPath === '/' || currentPath.indexOf('index.html') !== -1 || currentPath === '';

    // Also handle root paths served by static hosts (Vercel, etc.)
    if (!isOnMobilePage && !isOnIndexPage) {
        // Could be on /portfolio/ or similar — check if it ends without a specific html file
        var pathLower = currentPath.toLowerCase();
        if (!pathLower.endsWith('.html')) {
            isOnIndexPage = true;
        }
    }

    /**
     * Routing Rules:
     *   desktop        → index.html (current design)
     *   ipad-landscape → index.html (current design)
     *   ipad-portrait  → mobile.html (DesignV2)
     *   mobile         → mobile.html (DesignV2)
     */
    var shouldUseMobile = (device === 'mobile' || device === 'ipad-portrait');

    if (shouldUseMobile && !isOnMobilePage) {
        // Redirect to mobile version — preserve hash/query
        var mobilePath = currentPath.replace(/\/?$/, '').replace(/\/index\.html$/, '') + '/mobile.html';
        if (currentPath === '/' || currentPath === '') {
            mobilePath = '/mobile.html';
        }
        window.location.replace(mobilePath + window.location.search + window.location.hash);
    } else if (!shouldUseMobile && isOnMobilePage) {
        // Redirect back to desktop version
        var desktopPath = currentPath.replace('/mobile.html', '/') || '/';
        window.location.replace(desktopPath + window.location.search + window.location.hash);
    }

    // ──────────────── Orientation Change Listener ────────────────
    // For iPads that rotate while on the page

    function handleOrientationChange() {
        // Small debounce to let the browser settle
        setTimeout(function () {
            var newDevice = detectDevice();
            var newShouldUseMobile = (newDevice === 'mobile' || newDevice === 'ipad-portrait');
            var currentlyOnMobile = window.location.pathname.indexOf('mobile.html') !== -1;

            if (newShouldUseMobile !== currentlyOnMobile) {
                if (newShouldUseMobile) {
                    window.location.replace('/mobile.html' + window.location.search + window.location.hash);
                } else {
                    window.location.replace('/' + window.location.search + window.location.hash);
                }
            }
        }, 300);
    }

    // Listen for orientation changes
    if (screen.orientation) {
        screen.orientation.addEventListener('change', handleOrientationChange);
    }
    window.addEventListener('orientationchange', handleOrientationChange);

    // Log detection for debugging
    console.log('[DeviceDetect] Device: ' + device + ' | Screen: ' +
        getScreenDimensions().width + 'x' + getScreenDimensions().height +
        ' | Touch: ' + navigator.maxTouchPoints +
        ' | Route: ' + (shouldUseMobile ? 'MOBILE (DesignV2)' : 'DESKTOP (Current)'));

})();
