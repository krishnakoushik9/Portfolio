// Script to handle 3D model zoom controls
document.addEventListener('DOMContentLoaded', function() {
    // Get the model viewer element
    const modelViewer = document.getElementById('robot-model');
    
    // Get control buttons
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetViewBtn = document.getElementById('reset-view');
    
    if (!modelViewer || !zoomInBtn || !zoomOutBtn || !resetViewBtn) {
        console.warn('Some 3D model control elements not found');
        return;
    }
    
    // Default camera settings
    const defaultCameraOrbit = '0deg 75deg 2m';
    const zoomFactor = 0.2;
    
    // Set initial camera position once the model is loaded
    modelViewer.addEventListener('load', function() {
        modelViewer.cameraOrbit = defaultCameraOrbit;
    });
    
    // Add zoom in functionality
    zoomInBtn.addEventListener('click', function() {
        // Parse the current camera distance
        const orbitValues = modelViewer.cameraOrbit.split(' ');
        const theta = orbitValues[0];
        const phi = orbitValues[1];
        let distance = orbitValues[2];
        
        // Remove 'm' and convert to number
        distance = parseFloat(distance.replace('m', ''));
        
        // Apply zoom (move camera closer)
        distance = Math.max(0.5, distance - zoomFactor);
        
        // Update camera orbit
        modelViewer.cameraOrbit = `${theta} ${phi} ${distance}m`;
    });
    
    // Add zoom out functionality
    zoomOutBtn.addEventListener('click', function() {
        // Parse the current camera distance
        const orbitValues = modelViewer.cameraOrbit.split(' ');
        const theta = orbitValues[0];
        const phi = orbitValues[1];
        let distance = orbitValues[2];
        
        // Remove 'm' and convert to number
        distance = parseFloat(distance.replace('m', ''));
        
        // Apply zoom (move camera farther)
        distance = Math.min(5, distance + zoomFactor);
        
        // Update camera orbit
        modelViewer.cameraOrbit = `${theta} ${phi} ${distance}m`;
    });
    
    // Add reset view functionality
    resetViewBtn.addEventListener('click', function() {
        modelViewer.cameraOrbit = defaultCameraOrbit;
        modelViewer.fieldOfView = 'auto';
    });
});
