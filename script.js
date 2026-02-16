/* ============================================
   NEW YEAR 2026 - AUTO-PLAY VERSION
   ============================================ */

// ============================
// FIREWORKS
// ============================
(function () {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fireworks = [];
    const particles = [];
    const colors = [
        '#fbbf24', '#fde68a', '#ec4899', '#f9a8d4',
        '#a78bfa', '#7c3aed', '#fb7185', '#ffffff',
        '#f472b6', '#c084fc', '#fcd34d'
    ];

    class Firework {
        constructor(x, ty) {
            this.x = x ?? Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = ty ?? canvas.height * 0.1 + Math.random() * canvas.height * 0.4;
            this.speed = 3.5 + Math.random() * 3;
            this.vy = -this.speed;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.trail = [];
            this.alive = true;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.trail.push({ x: this.x, y: this.y, a: 1 });
            if (this.trail.length > 8) this.trail.shift();
            this.x += this.vx; this.y += this.vy; this.vy += 0.035;
            if (this.y <= this.targetY || this.vy >= 0) { this.explode(); this.alive = false; }
            this.trail.forEach(t => t.a -= 0.12);
        }
        explode() {
            const n = 50 + Math.floor(Math.random() * 50);
            for (let i = 0; i < n; i++) {
                const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
                const spd = 1 + Math.random() * 4.5;
                const c = Math.random() > 0.3 ? this.color : colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(this.x, this.y, ang, spd, c));
            }
        }
        draw() {
            this.trail.forEach(t => {
                if (t.a <= 0) return;
                ctx.globalAlpha = t.a * 0.4;
                ctx.beginPath(); ctx.arc(t.x, t.y, 2 * t.a, 0, Math.PI * 2);
                ctx.fillStyle = this.color; ctx.fill();
            });
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill();
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 10);
            g.addColorStop(0, this.color + '50'); g.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
        }
    }

    class Particle {
        constructor(x, y, angle, speed, color) {
            this.x = x; this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = 0.007 + Math.random() * 0.014;
            this.color = color;
            this.size = 1.5 + Math.random() * 1.5;
        }
        update() {
            this.vx *= 0.98; this.vy *= 0.98; this.vy += 0.025;
            this.x += this.vx; this.y += this.vy; this.alpha -= this.decay;
        }
        draw() {
            if (this.alpha <= 0) return;
            ctx.globalAlpha = this.alpha;
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            g.addColorStop(0, this.color + '70'); g.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill();
        }
    }

    let introMode = true;
    let last = 0;

    function animate(ts) {
        requestAnimationFrame(animate);
        ctx.globalAlpha = introMode ? 0.18 : 0.12;
        ctx.fillStyle = 'rgba(10,10,26,1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        const interval = introMode ? 250 + Math.random() * 350 : 1500 + Math.random() * 2500;
        if (ts - last > interval) {
            fireworks.push(new Firework());
            if (introMode && Math.random() > 0.2) fireworks.push(new Firework());
            if (introMode && Math.random() > 0.5) fireworks.push(new Firework());
            last = ts;
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update(); fireworks[i].draw();
            if (!fireworks[i].alive) fireworks.splice(i, 1);
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(); particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);

    document.addEventListener('click', (e) => {
        if (e.target.closest('.music-toggle')) return;
        fireworks.push(new Firework(e.clientX, e.clientY));
    });

    window.setFireworksAmbient = () => { introMode = false; };
})();


// ============================
// PARTICLES
// ============================
(function () {
    const c = document.getElementById('particles-container');
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = 2 + Math.random() * 4, d = 8 + Math.random() * 12;
        const h = Math.random() > 0.5 ? '45' : '330';
        p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;bottom:-${s}px;animation-duration:${d}s;animation-delay:-${Math.random() * d}s;background:radial-gradient(circle,hsla(${h},80%,70%,0.7),transparent);`;
        c.appendChild(p);
    }
})();


// ============================
// HEARTS
// ============================
function startHearts() {
    const c = document.getElementById('hearts-container');
    const sym = ['💛', '💕', '✨', '🌸', '💫'];
    function make() {
        const h = document.createElement('span');
        h.className = 'heart';
        h.textContent = sym[Math.floor(Math.random() * sym.length)];
        const d = 10 + Math.random() * 15, dl = Math.random() * 3;
        h.style.cssText = `left:${Math.random() * 100}%;font-size:${0.7 + Math.random()}rem;animation-duration:${d}s;animation-delay:${dl}s;`;
        c.appendChild(h);
        setTimeout(() => { h.remove(); make(); }, (d + dl) * 1000);
    }
    for (let i = 0; i < 8; i++) setTimeout(make, i * 500);
}


// ============================
// MUSIC — Arpeggio
// ============================
let audioCtx = null;
let musicPlaying = false;
let musicNodes = { oscs: [], gains: [], master: null, intervals: [] };

function startMusic() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0, audioCtx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 2);
    master.connect(audioCtx.destination);
    musicNodes.master = master;

    const padGain = audioCtx.createGain();
    padGain.gain.value = 0.15;
    padGain.connect(master);

    [130.81, 164.81, 196.00, 246.94].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        const g = audioCtx.createGain();
        g.gain.value = 0.12;
        osc.connect(g);
        g.connect(padGain);
        osc.start();

        const lfo = audioCtx.createOscillator();
        const lfoG = audioCtx.createGain();
        lfo.frequency.value = 0.15 + i * 0.05;
        lfoG.gain.value = 1.5;
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        lfo.start();

        musicNodes.oscs.push(osc, lfo);
        musicNodes.gains.push(g);
    });

    const melodyNotes = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63];
    let noteIndex = 0;
    const melodyOsc = audioCtx.createOscillator();
    melodyOsc.type = 'sine';
    melodyOsc.frequency.value = melodyNotes[0];
    const melodyGain = audioCtx.createGain();
    melodyGain.gain.value = 0.2;
    melodyOsc.connect(melodyGain);
    melodyGain.connect(master);
    melodyOsc.start();
    musicNodes.oscs.push(melodyOsc);
    musicNodes.gains.push(melodyGain, padGain);

    const arpInterval = setInterval(() => {
        if (!audioCtx) { clearInterval(arpInterval); return; }
        noteIndex = (noteIndex + 1) % melodyNotes.length;
        melodyOsc.frequency.linearRampToValueAtTime(melodyNotes[noteIndex], audioCtx.currentTime + 0.15);
        melodyGain.gain.setValueAtTime(0.22, audioCtx.currentTime);
        melodyGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.5);
    }, 600);

    musicNodes.intervals.push(arpInterval);
    musicPlaying = true;
    document.getElementById('musicToggle').classList.add('playing');
    document.getElementById('musicToggle').textContent = '🎶';
}

function stopMusic() {
    if (!audioCtx) return;
    musicNodes.intervals.forEach(id => clearInterval(id));
    if (musicNodes.master) {
        musicNodes.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    }
    setTimeout(() => {
        musicNodes.oscs.forEach(o => { try { o.stop(); } catch (e) { } });
        try { audioCtx.close(); } catch (e) { }
        audioCtx = null;
        musicNodes = { oscs: [], gains: [], master: null, intervals: [] };
    }, 1000);
    musicPlaying = false;
    document.getElementById('musicToggle').classList.remove('playing');
    document.getElementById('musicToggle').textContent = '🎵';
}

document.getElementById('musicToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    if (musicPlaying) stopMusic(); else startMusic();
});


// ============================
// LINES DATA (no icons)
// ============================
const lines = [
    { text: 'Hế lô bé Thư 🙋🏽', style: 'message', duration: 3000 },
    { text: 'Nhân dịp năm mới, tớ có đôi lời muốn gửi đến cậuuu', style: 'wish', duration: 4000 },
    { text: 'Chúc cậu luôn khỏe mạnh, xinh đẹp và những điều tốt đẹp nhất sẽ đến với cậu.', style: 'wish', duration: 5000 },
    { text: 'Mong rằng trong những ngày của năm mới, 3 bữa - 4 mùa của cậu đều dịu dàng, bình an.', style: 'wish', duration: 5000 },
    { text: 'Hy vọng không lâu nữa, cậu sẽ là của tôiii 🙆🏽‍♂️', style: 'wish', duration: 4000 },
    { text: 'Hép pì niu diaaaaaaa', style: 'ending', duration: 0, divider: true },
];


// ============================
// AUTO-PLAY CONTROLLER (scrolling letter)
// ============================
window.addEventListener('load', () => {
    const overlay = document.getElementById('introOverlay');
    const introTitle = document.getElementById('introTitle');
    const stage = document.getElementById('linesStage');
    const card = document.getElementById('letterCard');

    // Start music
    startMusic();

    // Show title
    setTimeout(() => introTitle.classList.add('show'), 600);

    // After 3s → show letter
    setTimeout(() => {
        overlay.classList.add('fade-out');
        window.setFireworksAmbient();

        setTimeout(() => {
            overlay.classList.add('hidden');
            stage.classList.add('visible');
            startHearts();

            // Append lines one by one into the letter card (they stay)
            let index = 0;

            function showNext() {
                if (index >= lines.length) return;
                const line = lines[index];

                const el = document.createElement('div');
                el.className = 'line-item style-' + line.style;
                if (line.divider) el.classList.add('has-divider');
                el.innerHTML = line.text;
                card.appendChild(el);

                // Fade in + scroll to bottom
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.classList.add('show');
                        card.scrollTop = card.scrollHeight;
                    });
                });

                index++;

                if (line.duration > 0) {
                    setTimeout(showNext, line.duration);
                }
            }

            setTimeout(showNext, 500);
        }, 1500);
    }, 3000);
});


// ============================
// CURSOR SPARKLE
// ============================
(function () {
    let last = 0;
    document.addEventListener('mousemove', (e) => {
        if (Date.now() - last < 100) return;
        last = Date.now();
        const s = document.createElement('div');
        s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#fde68a,#fbbf24);pointer-events:none;z-index:9999;animation:sparkle .6s ease-out forwards;`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 600);
    });
    const st = document.createElement('style');
    st.textContent = `@keyframes sparkle{0%{transform:scale(1);opacity:1}100%{transform:scale(0) translate(${Math.random() * 20 - 10}px,${Math.random() * 20 - 10}px);opacity:0}}`;
    document.head.appendChild(st);
})();
