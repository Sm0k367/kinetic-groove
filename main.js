/**
 * BLUE MONEY // WEALTH ENGINE v1.0
 * Architect: DJ SMOKE STREAM
 */

const audio = document.getElementById('audio-engine');
const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const cells = document.querySelectorAll('.cell');
const wealthDisplay = document.getElementById('wealth-counter');
const bars = document.querySelectorAll('.bar');

let audioCtx, analyser, dataArray;
let currentWealth = 0;

startBtn.addEventListener('click', () => {
    // Standard Audio Context Init
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Entrance Animation
    gsap.to(bootScreen, { 
        opacity: 0, 
        scale: 1.1,
        duration: 1.2, 
        ease: "expo.inOut", 
        onComplete: () => {
            bootScreen.style.display = 'none';
            audio.play();
            update();
        } 
    });
});

function update() {
    requestAnimationFrame(update);
    analyser.getByteFrequencyData(dataArray);

    // Audio Analysis Nodes
    const bass = dataArray[2];      // The rhythm/beat
    const mids = dataArray[15];     // The melody/vocals
    
    // 1. WEALTH COUNTER LOGIC
    // Increments faster during high-energy moments
    if (bass > 100) {
        currentWealth += (bass / 500);
        wealthDisplay.innerText = currentWealth.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // 2. LIQUID GRID MOVEMENT
    cells.forEach((cell, index) => {
        const span = cell.querySelector('span');
        
        // Gentle liquid floating
        const moveY = Math.sin(Date.now() * 0.002 + index) * 15;
        const pulse = 1 + (bass / 400);
        
        // Apply transform to the "$" inside the cell
        span.style.transform = `translateY(${moveY}px) scale(${pulse})`;
        
        // Cell border reacts to mids
        const borderAlpha = (mids / 255).toFixed(2);
        cell.style.borderColor = `rgba(0, 255, 136, ${borderAlpha})`;
        
        // Background shift
        cell.style.background = `rgba(0, 119, 255, ${bass / 2000})`;
    });

    // 3. BAR VISUALIZER (SMOOTH)
    bars.forEach((bar, i) => {
        const val = dataArray[i * 10] || 0;
        const h = (val / 255) * 100;
        gsap.to(bar, { height: `${h}%`, duration: 0.1 });
    });

    // 4. THE LUXURY SHOCK
    // A clean "Golden Flash" on heavy hits
    if (bass > 235) {
        document.body.classList.add('shock');
    } else {
        document.body.classList.remove('shock');
    }
}

// Ensure clean resizing
window.addEventListener('resize', () => {
    // Handle any responsive UI adjustments here if needed
});
