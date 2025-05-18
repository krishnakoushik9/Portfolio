// Script to handle YouTube video autoplay on hover
document.addEventListener('DOMContentLoaded', function() {
    // Get all YouTube video iframes with the class 'youtube-video'
    const youtubeVideos = document.querySelectorAll('.youtube-video');
    
    youtubeVideos.forEach(function(video) {
        // Get the parent card element
        const card = video.closest('.card');
        if (!card) return;
        
        // Get the video src
        const videoSrc = video.src;
        
        // Add event listeners to the card for hover
        card.addEventListener('mouseenter', function() {
            // Append autoplay=1 to the src if not already there
            if (videoSrc.includes('autoplay=1')) return;
            
            // Create a new src with autoplay enabled
            let newSrc = videoSrc;
            if (videoSrc.includes('?')) {
                newSrc = videoSrc + '&autoplay=1&mute=1';
            } else {
                newSrc = videoSrc + '?autoplay=1&mute=1';
            }
            
            // Update the iframe src
            video.src = newSrc;
        });
        
        // Pause the video when mouse leaves
        card.addEventListener('mouseleave', function() {
            // Reset to original src without autoplay
            setTimeout(() => {
                video.src = videoSrc;
            }, 300); // Small delay to ensure the hover overlay is fully visible
        });
    });
});
