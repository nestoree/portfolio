// ── RELOJ ──
function updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString('es-ES', { hour12: false });
    const d = now.toLocaleDateString('es-ES');
    const el = document.getElementById('clock');
    const ft = document.getElementById('footer-time');
    if (el) el.textContent = `[ ${d} // ${t} ]`;
    if (ft) ft.textContent = t;
}
setInterval(updateClock, 1000);
updateClock();

// ── TYPING EFFECT ──
const textStr = "nestore@portfolio:~ $ ./portfolio.sh";
let charIndex = 0;
function typeWriter() {
    if (charIndex < textStr.length) {
        document.getElementById("typing-text").innerHTML += textStr.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 52);
    }
}

// ── SCROLL FADE IN + SKILL BARS ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars inside this section
            entry.target.querySelectorAll('.fill[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.window').forEach(w => observer.observe(w));

// ── LIGHTBOX ──
function openLightbox(src, title) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const ttl = document.getElementById('lightbox-title');
    img.src = src;
    ttl.textContent = '> ' + title;
    lb.classList.add('open');
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── CANVAS PARTICLES ──
const canvas = document.getElementById('canvas-dots');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 140 };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 28 + 2;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        this.baseX += Math.sin(Date.now() / 2200) * 0.15;
        this.baseY += Math.cos(Date.now() / 2200) * 0.15;
        let dx = mouse.x - this.x, dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let force = (mouse.radius - dist) / mouse.radius;
        if (dist < mouse.radius) {
            this.x -= (dx / dist) * force * this.density;
            this.y -= (dy / dist) * force * this.density;
        } else {
            this.x += (this.baseX - this.x) / 12;
            this.y += (this.baseY - this.y) / 12;
        }
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const count = window.innerWidth < 700 ? 50 : 110;
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < 95) {
                ctx.strokeStyle = `rgba(0,255,65,${(1 - d / 95) * 0.4})`;
                ctx.lineWidth = 0.4;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.onload = () => { typeWriter(); init(); animate(); };
window.onresize = init;
