import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';

// Initialize the 3D scene
function initRobotModel() {
    const modelContainer = document.getElementById('robot-model-container');
    
    if (!modelContainer) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    modelContainer.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Log for debugging
    console.log('Loading 3D model from:', window.location.origin + '/combat_robot.glb');
    
    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load(
        window.location.origin + '/combat_robot.glb',
        function (gltf) {
            console.log('Model loaded successfully!');
            const model = gltf.scene;
            model.position.set(0, -0.5, 0); // Slightly lower the model
            model.scale.set(0.8, 0.8, 0.8); // Adjust scale if needed
            scene.add(model);
            
            // Auto rotate the model
            const autoRotate = true;
            const rotationSpeed = 0.005;
            
            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                
                if (autoRotate) {
                    model.rotation.y += rotationSpeed;
                }
                
                controls.update();
                renderer.render(scene, camera);
            }
            
            animate();
        },
        function (xhr) {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete) + '% loaded');
            } else {
                console.log('Loading progress: ' + Math.round(xhr.loaded / 1000) + ' KB');
            }
        },
        function (error) {
            console.error('Error loading the model:', error);
            
            // Fallback - display a message in the container
            const container = document.getElementById('robot-model-container');
            if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full">
                        <p class="text-lg font-bold mb-2">3D Model Loading Error</p>
                        <p>Please check console for details</p>
                    </div>
                `;
            }
        }
    );
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    });
}

// Initialize the skills visualization
function initSkillsViz() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;
    
    const skills = Array.from(document.querySelectorAll('.skill-item'));
    
    // Set up the circle
    const centerX = skillsContainer.clientWidth / 2;
    const centerY = skillsContainer.clientHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Position skills in a circle
    skills.forEach((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        skill.style.position = 'absolute';
        skill.style.left = `${x - skill.clientWidth/2}px`;
        skill.style.top = `${y - skill.clientHeight/2}px`;
        skill.style.transform = 'translate(-50%, -50%)';
        
        // Add hover effect
        skill.addEventListener('mouseover', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.2)';
            this.style.zIndex = '10';
        });
        
        skill.addEventListener('mouseout', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newCenterX = skillsContainer.clientWidth / 2;
        const newCenterY = skillsContainer.clientHeight / 2;
        const newRadius = Math.min(newCenterX, newCenterY) * 0.7;
        
        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * Math.PI * 2;
            const x = newCenterX + newRadius * Math.cos(angle);
            const y = newCenterY + newRadius * Math.sin(angle);
            
            skill.style.left = `${x - skill.clientWidth/2}px`;
            skill.style.top = `${y - skill.clientHeight/2}px`;
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initRobotModel();
    
    // Initialize skills visualization after a short delay to ensure elements are rendered
    setTimeout(initSkillsViz, 500);
});
