/**
 * THE SOUNDFORGE // KINETIC ENGINE v1.0
 * Architect: DJ SMOKE STREAM
 */

const audio = document.getElementById('audio-engine');
const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const cells = document.querySelectorAll('.cell');
const powerLv = document.getElementById('power-lv');
const bars = document.querySelectorAll('.bar');

let audioCtx, analyser, dataArray;

startBtn.addEventListener('click', () => {
    // Initialize Audio Context on user gesture
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    analyser.fftSize = 128; // Faster response for industrial beats
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Transition UI
    gsap.to(bootScreen, { 
        y: "-100%", 
        duration: 1, 
        ease: "power4.inOut", 
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

    // Capture specific frequencies
    const bass = dataArray[2];      // The kick drum
    const mid = dataArray[10];      // The industrial clanging
    const treble = dataArray[40];   // The digital noise

    // 1. Update Power Level HUD
    const powerValue = Math.round((bass / 255) * 100);
    powerLv.innerText = `${powerValue}%`;

    // 2. Kinetic Grid Distortion
    cells.forEach((cell, index) => {
        // Create a staggered movement effect
        const skew = (mid / 20) * (index % 2 === 0 ? 1 : -1);
        const scale = 1 + (bass / 1000);
        
        cell.style.transform = `skewX(${skew}deg) scale(${scale})`;
        
        // High-intensity glitch flash
        if (bass > 230) {
            cell.style.backgroundColor = 'rgba(255, 51, 0, 0.4)';
            cell.style.borderColor = '#ffffff';
        } else {
            cell.style.backgroundColor = 'rgba(255, 51, 0, 0.05)';
            cell.style.borderColor = 'rgba(255, 51, 0, 0.3)';
        }
    });

    // 3. Visualizer Bars
    bars.forEach((bar, i) => {
        const h = (dataArray[i * 5] / 255) * 100;
        bar.style.height = `${h}%`;
    });

    // 4. Screen-Wide Shock
    if (bass > 240) {
        document.body.classList.add('shock');
        // Slight camera shake
        gsap.to("#forge-container", { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10, duration: 0.05 });
    } else {
        document.body.classList.remove('shock');
        gsap.to("#forge-container", { x: 0, y: 0, duration: 0.1 });
    }
}
