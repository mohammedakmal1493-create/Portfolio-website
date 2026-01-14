function toggleProject(card) {
    const allCards = document.querySelectorAll(".project-card");

    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove("active");
        }
    });

    card.classList.toggle("active");
}


/* ===================== */
/* MENU TOGGLE */
/* ===================== */

const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

menuBtn.addEventListener("click", () => {
    menuOverlay.classList.add("active");
});

menuClose.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
});

/* CLOSE MENU ON LINK CLICK */
document.querySelectorAll(".menu-nav a").forEach(link => {
    link.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
    });
});


const canvas = document.getElementById("antigravity-bg");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ========================= */
/* MOUSE */
/* ========================= */
const mouse = { x: -9999, y: -9999 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
});

/* ========================= */
/* GRID PARTICLES */
/* ========================= */
const GAP = 36;                // distance between dots
const RADIUS = 8;            // dot size
const INTERACTION_RADIUS = 150;

const particles = [];

for (let y = 0; y < h; y += GAP) {
    for (let x = 0; x < w; x += GAP) {
        particles.push({
            x,
            y,
            ox: x,             // original position
            oy: y,
            vx: 0,
            vy: 0,
            alpha: 0           // invisible initially
        });
    }
}

/* ========================= */
/* ANIMATION */
/* ========================= */
function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        /* VISIBILITY BASED ON DISTANCE */
        const visibility = Math.max(
            0,
            1 - dist / INTERACTION_RADIUS
        );
        p.alpha += (visibility - p.alpha) * 0.08;

        /* FORCE ONLY WHEN NEAR */
        if (dist < INTERACTION_RADIUS) {
            const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
            p.vx -= (dx / dist) * force * 1.2;
            p.vy -= (dy / dist) * force * 1.2;
        }

        /* SPRING BACK TO HOME */
        p.vx += (p.ox - p.x) * 0.02;
        p.vy += (p.oy - p.y) * 0.02;

        /* DAMPING */
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        /* DRAW */
        if (p.alpha > 0.01) {
            ctx.fillStyle = `rgba(0,0,0,${Math.min(1, p.alpha * 1.4)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    requestAnimationFrame(animate);
}

animate();
