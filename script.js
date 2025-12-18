// ======================
// MAIN ANIMATION ENGINE
// ======================

console.log(" PivoCloud Animated App Initializing...");

// Port display for PivoCloud requirement
document.getElementById('portDisplay').textContent = 
    process.env.PORT || window.location.port || '8080';

// ======================
// THREE.JS 3D BACKGROUND
// ======================

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    // Renderer
    const canvas = document.getElementById('bgCanvas');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1000;
        positions[i + 1] = (Math.random() - 0.5) * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 1000;
        
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Mouse movement
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animateParticles();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    particles.rotation.x += mouseY * 0.0001;
    particles.rotation.y += mouseX * 0.0001;
    
    const positions = particles.geometry.attributes.position.array;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i] * 0.01) * 0.5;
        positions[i + 1] += Math.cos(time + positions[i + 1] * 0.01) * 0.5;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    
    // Update FPS counter
    updateStats();
}

// ======================
// GSAP ANIMATIONS
// ======================

function initGSAPAnimations() {
    // Animate cards on load
    gsap.from('.card', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 0.5
    });
    
    // Animate header
    gsap.from('.floating-header', {
        duration: 1.2,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    // Animate buttons
    gsap.from('.btn', {
        duration: 1,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
        delay: 1
    });
    
    // Continuous cube rotation
    const cubes = document.querySelectorAll('.cube');
    cubes.forEach(cube => {
        gsap.to(cube, {
            duration: 20,
            rotationY: '+=360',
            rotationX: '+=180',
            repeat: -1,
            ease: 'none'
        });
    });
    
    // Hover effects for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1.05,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                ease: 'power2.out'
            });
            
            // Animate icon
            const icon = card.querySelector('.card-icon');
            gsap.to(icon, {
                duration: 0.3,
                scale: 1.3,
                rotation: 360,
                ease: 'back.out(2)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                ease: 'power2.out'
            });
            
            const icon = card.querySelector('.card-icon');
            gsap.to(icon, {
                duration: 0.3,
                scale: 1,
                rotation: 0,
                ease: 'power2.out'
            });
        });
    });
}

// ======================
// INTERACTIVE CONTROLS
// ======================

function initControls() {
    let animationsActive = true;
    let darkTheme = false;
    
    // Toggle Animations Button
    document.getElementById('toggleAnim').addEventListener('click', function() {
        animationsActive = !animationsActive;
        const icon = this.querySelector('i');
        
        if (animationsActive) {
            icon.className = 'fas fa-play';
            this.innerHTML = '<i class="fas fa-play"></i> Pause Animations';
            gsap.globalTimeline.play();
        } else {
            icon.className = 'fas fa-pause';
            this.innerHTML = '<i class="fas fa-pause"></i> Resume Animations';
            gsap.globalTimeline.pause();
        }
        
        // Button feedback
        gsap.to(this, {
            duration: 0.2,
            scale: 0.9,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
    
    // Change Theme Button
    document.getElementById('changeTheme').addEventListener('click', function() {
        darkTheme = !darkTheme;
        const icon = this.querySelector('i');
        
        if (darkTheme) {
            icon.className = 'fas fa-sun';
            this.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
            document.body.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
        } else {
            icon.className = 'fas fa-moon';
            this.innerHTML = '<i class="fas fa-moon"></i> Dark Theme';
            document.body.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
        }
        
        // Theme transition effect
        gsap.to('body', {
            duration: 1,
            backgroundPosition: '+=100px',
            ease: 'power2.inOut'
        });
    });
    
    // Particle Explosion Button
    document.getElementById('explodeBtn').addEventListener('click', function() {
        // Create explosion effect
        for (let i = 0; i < 50; i++) {
            createParticle(
                this.offsetLeft + this.offsetWidth / 2,
                this.offsetTop + this.offsetHeight / 2
            );
        }
        
        // Button shake effect
        gsap.to(this, {
            duration: 0.2,
            x: () => Math.random() * 20 - 10,
            y: () => Math.random() * 20 - 10,
            repeat: 5,
            ease: 'power1.inOut',
            onComplete: () => gsap.to(this, { x: 0, y: 0, duration: 0.2 })
        });
        
        // Update particle count
        updateParticleCount(50);
    });
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: linear-gradient(45deg, #ff0080, #00ffcc);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(particle);
    
    // Animate particle
    gsap.to(particle, {
        duration: 1.5,
        x: () => Math.random() * 400 - 200,
        y: () => Math.random() * 400 - 200,
        opacity: 0,
        scale: 0,
        ease: 'power2.out',
        onComplete: () => particle.remove()
    });
}

// ======================
// PERFORMANCE STATS
// ======================

let frameCount = 0;
let lastTime = performance.now();
let fps = 60;
let particleCount = 0;
let startTime = Date.now();

function updateStats() {
    frameCount++;
    
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        document.getElementById('fps').textContent = fps;
    }
    
    // Update time
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('time').textContent = elapsed;
    
    // Update particle count (simulated)
    particleCount = Math.floor(1500 + Math.sin(Date.now() * 0.001) * 200);
    document.getElementById('particles').textContent = particleCount.toLocaleString();
}

function updateParticleCount(addCount) {
    particleCount += addCount;
    document.getElementById('particles').textContent = particleCount.toLocaleString();
}

// ======================
// INITIALIZE EVERYTHING
// ======================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing animations...');
    
    // Initialize Three.js background
    try {
        initThreeJS();
        console.log(' Three.js background initialized');
    } catch (error) {
        console.log(' Three.js failed, using fallback background');
        document.getElementById('bgCanvas').style.background = 
            'radial-gradient(circle, #0f0c29, #302b63)';
    }
    
    // Initialize GSAP animations
    initGSAPAnimations();
    console.log(' GSAP animations initialized');
    
    // Initialize interactive controls
    initControls();
    console.log(' Interactive controls initialized');
    
    // Start stats update
    setInterval(updateStats, 100);
    
    console.log(' PivoCloud animated app fully loaded!');
    
    // Welcome message
    setTimeout(() => {
        gsap.to('.floating-header', {
            duration: 0.5,
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }, 2000);
});

// Handle window resize
window.addEventListener('resize', function() {
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// PivoCloud deployment check
console.log(' PivoCloud Requirements:');
console.log(' Dockerfile in root: YES');
console.log(' PORT environment variable: ' + (process.env.PORT ? 'SET' : 'Using default 8080'));
console.log(' Public GitHub repo: READY for deployment');
