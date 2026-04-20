// ==========================================
// 1. LENIS SMOOTH SCROLL & KINETIC SKEW
// ==========================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.2
});

let currentScroll = 0;
let maxScroll = document.body.scrollHeight - window.innerHeight;

lenis.on('scroll', (e) => {
    currentScroll = e.animatedScroll;
    let skew = e.velocity * 0.15;
    skew = Math.max(-10, Math.min(10, skew));
    gsap.to('.gs-skew', { skewY: skew, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ==========================================
// 2. GLSL LIQUID DISSOLVE TRANSITIONS
// ==========================================
document.querySelectorAll('.nav-trigger').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if(!targetEl) return;
        const transitionLayer = document.querySelector('.liquid-transition-layer');
        if(transitionLayer) {
            transitionLayer.classList.add('active');
            setTimeout(() => { lenis.scrollTo(targetEl, { offset: 0, duration: 0, immediate: true }); }, 600);
            setTimeout(() => { transitionLayer.classList.remove('active'); }, 1000);
        } else {
            lenis.scrollTo(targetEl, { offset: 0, duration: 1.5 });
        }
    });
});

// ==========================================
// 3. GSAP SCROLL & PRELOADER
// ==========================================
gsap.registerPlugin(ScrollTrigger);
window.addEventListener('load', () => {
    maxScroll = document.body.scrollHeight - window.innerHeight;
    const loaderWrapper = document.querySelector('.preloader');
    const percentTxt = document.querySelector('.loader-percentage');
    let perc = 0;
    const interval = setInterval(() => {
        perc += Math.floor(Math.random() * 15);
        if(perc >= 100) {
            perc = 100;
            clearInterval(interval);
            gsap.timeline()
                .to(".loader-text", { y: '-100%', duration: 0.8, ease: "power4.inOut" })
                .to(loaderWrapper, { y: '-100%', duration: 1, ease: "expo.inOut" }, "-=0.4")
                .from(".hero-title", { y: '50px', opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
                .from(".hero-top-text, .hero-bottom-text", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");
        }
        if(percentTxt) percentTxt.textContent = `${perc}%`;
    }, 80);
});

// Horizontal Parallax
const expertiseContainer = document.querySelector('.expertise-container');
if(window.innerWidth > 1024 && expertiseContainer) {
    gsap.to(expertiseContainer, { x: () => -(expertiseContainer.scrollWidth - window.innerWidth) + "px", ease: "none", scrollTrigger: { trigger: ".expertise", pin: true, scrub: 1, end: () => "+=" + expertiseContainer.scrollWidth } });
}
gsap.to(".bg-type:not(.outline)", { x: "-10vw", ease: "none", scrollTrigger: { trigger: ".massive-type", scrub: 1 } });
gsap.to(".bg-type.outline", { x: "10vw", ease: "none", scrollTrigger: { trigger: ".massive-type", scrub: 1 } });

// Filters
const filterBtns = document.querySelectorAll('.filter-btn');
const prItems = document.querySelectorAll('.pr-item');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        prItems.forEach(item => {
            if(filter === 'all' || item.classList.contains(filter)) { item.style.display = 'block'; setTimeout(() => item.style.opacity = 1, 10); } 
            else { item.style.opacity = 0; setTimeout(() => item.style.display = 'none', 400); }
        });
    });
});

// Magnetic Buttons (Fixed: ONLY on big circle button now, NOT on tiny nav links)
document.querySelectorAll('.circle-btn').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => { gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' }); });
});

// ==========================================
// 4. SENTINEL TERMINAL AI JS
// ==========================================
const termBody = document.getElementById('term-body');
function createInputLine() {
    if(!termBody) return;
    const line = document.createElement('div');
    line.className = 'term-input-line';
    line.innerHTML = `<span>C:\\LeadVal&gt;</span> <input type="text" class="term-input" autocomplete="off" spellcheck="false">`;
    termBody.appendChild(line);
    const input = line.querySelector('.term-input');
    
    termBody.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            const val = input.value.trim().toLowerCase();
            input.disabled = true;
            if(val) processCommand(val);
            else createInputLine();
        }
    });
    termBody.scrollTop = termBody.scrollHeight;
}
function processCommand(cmd) {
    if(!termBody) return;
    printLine(`C:\\LeadVal&gt; ${cmd}`, 'user');
    setTimeout(() => {
        if(cmd === 'help') {
            printLine("AVAILABLE COMMANDS:", "sys-msg");
            printLine(" - about   : View core statistics", "sys-msg");
            printLine(" - contact : Get communication relays", "sys-msg");
            printLine(" - clear   : Clean terminal", "sys-msg");
            printLine(" - logs    : Simulates catching a cheater", "sys-msg");
        } else if(cmd === 'about') {
            printLine("[+] Accessing Databanks...", "sys-msg");
            printLine("LeadVal: 7 Years EXP. 40+ Networks. 50+ manual detections daily.", "sys-msg");
        } else if(cmd === 'contact') {
            printLine("Initiating secure channel over Discord...", "sys-msg");
            printLine("User: LEADVAL / Email: leadrhin@gmail.com", "sys-msg");
        } else if(cmd === 'clear') {
            termBody.innerHTML = '';
        } else if(cmd === 'logs') {
            printLine("[WARN] Unusual memory signature detected at 0x00FF8...", "err-msg");
            printLine("Analyzing... Injectable Client Found. KDR Manipulation confirmed.", "err-msg");
            printLine("[ACTION] Banning user 'GhostHacker12'. Executed.", "sys-msg");
        } else {
            printLine(`Command not found: '${cmd}'. Type 'help' for logic structure.`, "err-msg");
        }
        createInputLine();
    }, 500);
}
function printLine(text, className) {
    if(!termBody) return;
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.textContent = text;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
}
setTimeout(() => { createInputLine(); }, 100);

// ==========================================
// 5. AUDIO SCAPE
// ==========================================
const audioBtn = document.querySelector('.audio-btn');
const audioStatus = document.querySelector('.audio-status');
const audioWaves = document.querySelectorAll('.audio-waves .w');
let audioCtx, filter, gainNode;
let isAudioPlaying = false;

function toggleAudio() {
    if(!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(60, audioCtx.currentTime); 
        const subOsc = audioCtx.createOscillator(); subOsc.type = 'triangle'; subOsc.frequency.setValueAtTime(30, audioCtx.currentTime);
        filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(200, audioCtx.currentTime);
        gainNode = audioCtx.createGain(); gainNode.gain.setValueAtTime(0, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 3);
        osc.connect(filter); subOsc.connect(filter); filter.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.start(); subOsc.start();
        
        lenis.on('scroll', (e) => {
            if(!isAudioPlaying) return;
            const newFreq = 200 + (Math.abs(e.velocity) * 10);
            filter.frequency.setTargetAtTime(Math.min(newFreq, 1000), audioCtx.currentTime, 0.1);
        });
    }
    
    if(isAudioPlaying) {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        if(audioStatus) audioStatus.textContent = "SOUND: OFF"; 
        gsap.to(audioWaves, {height: '3px', duration: 0.3});
    } else {
        audioCtx.resume();
        gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1);
        if(audioStatus) audioStatus.textContent = "SOUND: ON"; 
        gsap.to(audioWaves, { height: () => '15px', duration: 0.3, stagger: 0.1, yoyo: true, repeat: -1 });
    }
    isAudioPlaying = !isAudioPlaying;
}
if(audioBtn) audioBtn.addEventListener('click', toggleAudio);

// ==========================================
// 6. GPGPU POINT CLOUD MORPHING (THREE.JS)
// ==========================================
const container = document.getElementById('webgl-container');
if(container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    let mouse = new THREE.Vector2(0, 0);
    let targetMouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const particleCount = 20000;
    const geometry = new THREE.BufferGeometry();
    const posSphere = new Float32Array(particleCount * 3);
    const posCube = new Float32Array(particleCount * 3); 
    const colorArray = new Float32Array(particleCount * 3);

    for(let i=0; i<particleCount; i++) {
        const phi = Math.acos( - 1 + ( 2 * i ) / particleCount );
        const theta = Math.sqrt( particleCount * Math.PI ) * phi;
        const rSphere = 6 + Math.random() * 0.5;
        posSphere[i*3] = rSphere * Math.cos(theta) * Math.sin(phi);
        posSphere[i*3+1] = rSphere * Math.sin(theta) * Math.sin(phi);
        posSphere[i*3+2] = rSphere * Math.cos(phi);

        const span = 8;
        posCube[i*3] = (Math.random() - 0.5) * span;
        posCube[i*3+1] = (Math.random() - 0.5) * span;
        posCube[i*3+2] = (Math.random() - 0.5) * span;
        
        if (Math.random() > 0.5) {
            colorArray[i*3] = 1.0; colorArray[i*3+1] = 0.9; colorArray[i*3+2] = 0.0;
        } else {
            colorArray[i*3] = 0.0; colorArray[i*3+1] = 0.0; colorArray[i*3+2] = 1.0;
        }
    }

    const posCurrent = new Float32Array(particleCount * 3);
    for(let i=0; i<posCurrent.length; i++) { posCurrent[i] = posSphere[i]; }

    geometry.setAttribute('position', new THREE.BufferAttribute(posCurrent, 3));
    geometry.setAttribute('posSphere', new THREE.BufferAttribute(posSphere, 3));
    geometry.setAttribute('posCube', new THREE.BufferAttribute(posCube, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0 },
            u_lerp: { value: 0 }, 
            u_mouse: { value: new THREE.Vector2(0,0)}
        },
        vertexShader: `
            uniform float u_time;
            uniform float u_lerp;
            uniform vec2 u_mouse;
            attribute vec3 posSphere;
            attribute vec3 posCube;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec3 targetPos = mix(posSphere, posCube, u_lerp);
                targetPos.x += sin(u_time * 2.0 + targetPos.y) * 0.2;
                targetPos.y += cos(u_time * 1.5 + targetPos.x) * 0.2;
                targetPos.xy += u_mouse * 2.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
                gl_PointSize = (40.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if(dist > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.8 * (1.0 - (dist * 2.0))); 
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(geometry, particleMaterial);
    scene.add(particleMesh);
    const clock = new THREE.Clock();

    function animateThree() {
        requestAnimationFrame(animateThree);
        let scrollNorm = currentScroll / (maxScroll || 1);
        scrollNorm = Math.min(Math.max(scrollNorm, 0), 1);
        
        particleMaterial.uniforms.u_lerp.value += (scrollNorm - particleMaterial.uniforms.u_lerp.value) * 0.05;
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        particleMesh.rotation.y = clock.getElapsedTime() * 0.05;
        particleMesh.rotation.x = clock.getElapsedTime() * 0.02;

        particleMaterial.uniforms.u_time.value = clock.getElapsedTime();
        particleMaterial.uniforms.u_mouse.value = mouse;

        renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        maxScroll = document.body.scrollHeight - window.innerHeight;
    });
}

// ==========================================
// 7. DISCORD CLIPBOARD & REDIRECT LOGIC
// ==========================================
const discordBtn = document.getElementById('copy-discord');
if(discordBtn) {
    discordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('LEADVAL');
        
        const originalText = discordBtn.textContent;
        discordBtn.textContent = 'COPIED! REDIRECTING...';
        discordBtn.style.color = '#FACC15';
        
        setTimeout(() => {
            window.open('https://discord.com/app', '_blank');
            discordBtn.textContent = originalText;
            discordBtn.style.color = '#fff';
        }, 1200);
    });
}
