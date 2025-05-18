// Content protection script
document.addEventListener('DOMContentLoaded', function() {
    // Get Some Help meme video URL
    const getHelpURL = 'https://youtu.be/l60MnDJklnM?si=cPcK9VtHfB8x84i1';
    
    // Create audio element for "Stop It" sound
    const stopItAudio = new Audio('./src/stopit.m4a');
    stopItAudio.loop = true; // Enable looping
    
    // Flag to track if audio is currently playing
    let isAudioPlaying = false;
    
    // Request audio permission on page load
    requestAudioPermission();
    
    // Function to request audio permission
    function requestAudioPermission() {
        // Create permission request container
        const permissionBox = document.createElement('div');
        permissionBox.style.position = 'fixed';
        permissionBox.style.bottom = '20px';
        permissionBox.style.right = '20px';
        permissionBox.style.padding = '15px 20px';
        permissionBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        permissionBox.style.color = 'white';
        permissionBox.style.borderRadius = '10px';
        permissionBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        permissionBox.style.zIndex = '9999';
        permissionBox.style.fontFamily = 'Poppins, sans-serif';
        permissionBox.style.fontSize = '14px';
        permissionBox.style.display = 'flex';
        permissionBox.style.flexDirection = 'column';
        permissionBox.style.alignItems = 'center';
        permissionBox.style.backdropFilter = 'blur(5px)';
        permissionBox.style.WebkitBackdropFilter = 'blur(5px)';
        permissionBox.style.transition = 'opacity 0.3s ease';
        
        // Add text
        const text = document.createElement('p');
        text.textContent = 'Allow audio for the best experience';
        text.style.marginBottom = '10px';
        text.style.fontWeight = 'bold';
        
        // Add button
        const button = document.createElement('button');
        button.textContent = 'Allow Audio';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.transition = 'background-color 0.3s ease';
        
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#3e8e41';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4CAF50';
        });
        
        button.addEventListener('click', function() {
            // Play and immediately pause to get permission
            stopItAudio.volume = 0.01; // Almost silent
            stopItAudio.play().then(() => {
                stopItAudio.pause();
                stopItAudio.currentTime = 0;
                stopItAudio.volume = 1.0; // Reset volume
                
                // Fade out and remove permission box
                permissionBox.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(permissionBox)) {
                        document.body.removeChild(permissionBox);
                    }
                }, 300);
            }).catch(error => {
                console.log('Audio permission denied:', error);
            });
        });
        
        // Add elements to container
        permissionBox.appendChild(text);
        permissionBox.appendChild(button);
        
        // Add to body
        document.body.appendChild(permissionBox);
    }
    
    // Function to play Stop It audio
    function playStopItAudio() {
        if (!isAudioPlaying) {
            stopItAudio.currentTime = 0; // Reset to start
            stopItAudio.play().then(() => {
                isAudioPlaying = true;
            }).catch(error => {
                console.log('Could not play audio:', error);
            });
        }
    }
    
    // Function to stop audio
    function stopAudio() {
        stopItAudio.pause();
        stopItAudio.currentTime = 0;
        isAudioPlaying = false;
    }
    
    // Function to open multiple tabs with the Get Some Help video
    function openGetHelpTabs() {
        // Play Stop It audio
        playStopItAudio();
        
        // Show glassmorphic popup first
        showGlassmorphicPopup();
        
        // Then open multiple tabs
        //for (let i = 0; i < 2; i++) {
        //    window.open(getHelpURL, '_blank');
        //}
    }
    
    // Function to show glassmorphic popup
    function showGlassmorphicPopup() {
        // Create popup container
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '500px';
        popup.style.maxWidth = '90%';
        popup.style.padding = '30px';
        popup.style.borderRadius = '15px';
        popup.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        popup.style.backdropFilter = 'blur(10px)';
        popup.style.WebkitBackdropFilter = 'blur(10px)';
        popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        popup.style.zIndex = '999999';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.alignItems = 'center';
        popup.style.justifyContent = 'center';
        popup.style.textAlign = 'center';
        popup.style.color = '#ffffff';
        popup.style.fontFamily = 'Poppins, sans-serif';
        popup.style.fontSize = '18px';
        popup.style.fontWeight = 'bold';
        popup.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
        
        // Add warning image
        const image = document.createElement('img');
        image.src = './src/WHY ARE YOU TRYING TO CHECK MY PORTFOLIO SITES CODE STOP IT GET SOME HELP.png';
        image.style.width = '100%';
        image.style.marginBottom = '20px';
        image.style.borderRadius = '8px';
        image.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        
        // Add text
        const text = document.createElement('p');
        text.textContent = 'WHY ARE YOU TRYING TO CHECK MY PORTFOLIO SITES CODE OR TRYING TO COPY STUFF';
        text.style.marginBottom = '10px';
        text.style.fontSize = '20px';
        text.style.color = '#ffffff';
        
        const subText = document.createElement('p');
        subText.textContent = 'STOP IT GET SOME HELP';
        subText.style.fontSize = '24px';
        subText.style.color = '#ff3333';
        subText.style.textShadow = '0 0 10px rgba(255, 51, 51, 0.7)';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK, I\'ll Stop';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        closeButton.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        closeButton.style.borderRadius = '30px';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'all 0.3s ease';
        
        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        });
        
        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });
        
        closeButton.addEventListener('click', function() {
            // Stop the looping audio
            stopAudio();
            
            // Remove popup
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        
        // Add elements to popup
        popup.appendChild(image);
        popup.appendChild(text);
        popup.appendChild(subText);
        popup.appendChild(closeButton);
        
        // Create dark overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '999998';
        
        // Add to body
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
    }
    
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    
    // Disable right-click context menu and redirect
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        playStopItAudio(); // Play audio immediately
        openGetHelpTabs();
        return false;
    });
    
    // Disable cut, copy, paste
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable keyboard shortcuts and redirect for developer tools
    document.addEventListener('keydown', function(e) {
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            playStopItAudio(); // Play audio immediately
            openGetHelpTabs();
            return false;
        }
        
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            playStopItAudio(); // Play audio immediately
            openGetHelpTabs();
            return false;
        }
        
        // F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            playStopItAudio(); // Play audio immediately
            openGetHelpTabs();
            return false;
        }
        
        // Disable other shortcuts: Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A
        if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88 || e.keyCode === 65)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Show a message when user tries to copy or right-click
    let messageShown = false;
    let messageTimeout;
    
    function showProtectionMessage() {
        if (!messageShown) {
            messageShown = true;
            
            const messageDiv = document.createElement('div');
            messageDiv.style.position = 'fixed';
            messageDiv.style.top = '20px';
            messageDiv.style.left = '50%';
            messageDiv.style.transform = 'translateX(-50%)';
            messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            messageDiv.style.color = 'white';
            messageDiv.style.padding = '10px 20px';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.zIndex = '9999';
            messageDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            messageDiv.style.fontFamily = 'Poppins, sans-serif';
            messageDiv.style.fontSize = '14px';
            messageDiv.style.transition = 'opacity 0.3s ease';
            messageDiv.style.opacity = '0';
            messageDiv.textContent = 'Content is protected';
            
            document.body.appendChild(messageDiv);
            
            // Fade in
            setTimeout(() => {
                messageDiv.style.opacity = '1';
            }, 10);
            
            // Remove after 2 seconds
            messageTimeout = setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(messageDiv);
                    messageShown = false;
                }, 300);
            }, 2000);
        }
    }
    
    document.addEventListener('copy', showProtectionMessage);
    document.addEventListener('cut', showProtectionMessage);
    
    // Additional protection against DevTools
    // Detect if DevTools is open
    let devToolsOpen = false;
    
    // Method 1: Check window size (DevTools changes window dimensions)
    const checkWindowSize = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                playStopItAudio(); // Play audio immediately
                openGetHelpTabs();
            }
        } else {
            devToolsOpen = false;
        }
    };
    
    // Method 2: Console clear detection
    const detectDevTools = () => {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    playStopItAudio(); // Play audio immediately
                    openGetHelpTabs();
                }
            }
        });
        
        console.log('%c', element);
    };
    
    // Run detections
    window.addEventListener('resize', checkWindowSize);
    setInterval(detectDevTools, 1000);
    setInterval(checkWindowSize, 1000);
});
