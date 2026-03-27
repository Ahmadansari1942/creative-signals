// ========================================
// Creative Signals - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavigation();
  initHeroCanvas();
  initScrollAnimations();
  initCounters();
  initContactForm();
  initExperimentCanvases();
  initArticleDemo();
});

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

// ========================================
// Hero Canvas Animation
// ========================================
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: `rgba(${224 + Math.random() * 30}, ${122 + Math.random() * 30}, ${95 + Math.random() * 30}, ${Math.random() * 0.5 + 0.2})`
      });
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.vx -= dx * force * 0.01;
        p.vy -= dy * force * 0.01;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Boundary check
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(224, 122, 95, ${0.1 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  resize();
  animate();
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stagger children animations
        const children = entry.target.querySelectorAll('[data-index]');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('visible');
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section, .blog-card, .experiment-card, .timeline-item').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// Animated Counters
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        let current = 0;
        const increment = target / 60;
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ========================================
// Experiment Canvases
// ========================================
function initExperimentCanvases() {
  const canvases = document.querySelectorAll('.exp-canvas, .experiment-canvas');
  
  canvases.forEach((canvas, index) => {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = canvas.offsetHeight || 300;
    
    const type = index % 4;
    
    switch(type) {
      case 0:
        animateWaves(canvas, ctx);
        break;
      case 1:
        animateParticles(canvas, ctx);
        break;
      case 2:
        animateGrid(canvas, ctx);
        break;
      case 3:
        animateCircles(canvas, ctx);
        break;
    }
  });
}

function animateWaves(canvas, ctx) {
  let time = 0;
  
  function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height / 2 + 
                  Math.sin(x * 0.02 + time + i * 2) * 30 +
                  Math.sin(x * 0.01 + time * 0.5) * 20;
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `rgba(224, 122, 95, ${0.3 - i * 0.1})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    time += 0.03;
    requestAnimationFrame(draw);
  }
  
  draw();
}

function animateParticles(canvas, ctx) {
  const particles = [];
  
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      r: Math.random() * 3 + 1
    });
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 178, 154, 0.8)';
      ctx.fill();
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

function animateGrid(canvas, ctx) {
  let time = 0;
  
  function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cols = 10;
    const rows = 8;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cellW + cellW / 2;
        const y = j * cellH + cellH / 2;
        const dist = Math.sqrt((x - canvas.width/2) ** 2 + (y - canvas.height/2) ** 2);
        const size = Math.sin(dist * 0.02 - time) * 5 + 8;
        
        ctx.beginPath();
        ctx.arc(x, y, Math.abs(size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 204, 143, ${0.5 + size * 0.03})`;
        ctx.fill();
      }
    }
    
    time += 0.05;
    requestAnimationFrame(draw);
  }
  
  draw();
}

function animateCircles(canvas, ctx) {
  let time = 0;
  
  function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 5; i++) {
      const radius = 30 + i * 25 + Math.sin(time + i) * 10;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(224, 122, 95, ${0.5 - i * 0.08})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    time += 0.03;
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========================================
// Article Demo
// ========================================
function initArticleDemo() {
  const canvas = document.getElementById('articleDemo');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  
  let time = 0;
  
  function draw() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create flowing lines
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 + Math.sin(time + i * 0.5) * 100);
      
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height / 2 + 
                  Math.sin(x * 0.01 + time + i * 0.3) * (50 + i * 5) +
                  Math.cos(x * 0.02 + time * 0.5) * 30;
        ctx.lineTo(x, y);
      }
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `rgba(224, 122, 95, ${0.1})`);
      gradient.addColorStop(0.5, `rgba(129, 178, 154, ${0.2})`);
      gradient.addColorStop(1, `rgba(242, 204, 143, ${0.1})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    time += 0.02;
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        form.style.display = 'none';
        success.style.display = 'flex';
      }
    } catch (error) {
      console.error('Form error:', error);
    }
  });
  
  // Input animations
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// ========================================
// Copy Link
// ========================================
document.querySelectorAll('.copy-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    navigator.clipboard.writeText(url).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    });
  });
});

// ========================================
// Search
// ========================================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(async () => {
      const query = e.target.value;
      
      if (query.length > 2) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        // Update UI with results
        console.log('Search results:', results);
      }
    }, 300);
  });
}

// ========================================
// Smooth Scroll
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================================
// Page Transitions
// ========================================
window.addEventListener('beforeunload', () => {
  document.body.classList.add('exiting');
});
