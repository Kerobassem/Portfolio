// ── Pricing Tab Toggle with Smooth Transitions ──
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    document.querySelectorAll('.pricing-panel').forEach(panel => {
      panel.classList.add('hidden');
    });
    const activePanel = document.getElementById('tab-' + target);
    if (activePanel) {
      activePanel.classList.remove('hidden');
      activePanel.offsetHeight; // Trigger reflow for CSS animation
    }
  });
});

// ── Theme Toggle ──
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateCursorColor();
}

// Set theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateCursorColor();
}

function updateCursorColor() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const dotEl = document.querySelector('.cursor-dot');
  const ringEl = document.querySelector('.cursor-ring');
  
  if (dotEl && ringEl) {
    const color = isDark ? '#ff8800' : '#1a6bcc';
    dotEl.style.background = color;
    ringEl.style.borderColor = color;
  }
}

// Initialize theme on load
window.addEventListener('DOMContentLoaded', initTheme);

// ── Disable custom cursor on mobile/touch devices - FINAL ──
function isMobileDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return true;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)) return true;
  if (window.innerWidth <= 768) return true;
  return false;
}

const isMobile = isMobileDevice();

// Hide cursor immediately if mobile
if (isMobile) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => el.remove());
  });
  window.addEventListener('load', () => {
    document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => el.remove());
  });
}
window.addEventListener('load', () => {
  setTimeout(() => { document.getElementById('page-loader').classList.add('hide'); }, 1200);
});

// ── Navbar Scroll Effect ──
window.addEventListener('scroll', () => {
  const topBar = document.getElementById('topBar');
  if (window.scrollY > 100) {
    topBar.classList.add('scrolled');
  } else {
    topBar.classList.remove('scrolled');
  }
});

// ── Parallax Hero Background ──
window.addEventListener('scroll', () => {
  const heroBg = document.getElementById('heroBg');
  const scrolled = window.pageYOffset;
  heroBg.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
});

// ── Scroll reveal ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:0.08, rootMargin:'0px 0px -60px 0px' });
document.querySelectorAll('.section-wrap').forEach(el => obs.observe(el));

// ── Animated Counter for Stats ──
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (!target || stat.classList.contains('counted')) return;
        
        stat.classList.add('counted');
        let count = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            stat.textContent = target + '+';
            clearInterval(timer);
          } else {
            stat.textContent = Math.ceil(count);
          }
        }, 30);
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-strip').forEach(el => statsObs.observe(el));

// ── Filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const cat = item.dataset.cat;
      if(filter === 'all' || cat === filter){
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
      }
    });
  });
});

// ── 3D Tilt Effect on Gallery Items ──
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    item.style.setProperty('--rotate-x', `${rotateX}deg`);
    item.style.setProperty('--rotate-y', `${rotateY}deg`);
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.setProperty('--rotate-x', '0deg');
    item.style.setProperty('--rotate-y', '0deg');
  });
});

// ── Enhanced Smooth Cursor ──
if (!isMobile) {
  const DOT_S = 0.15, RING_S = 0.08;
  const mouse = {x:0,y:0}, dotP = {x:0,y:0}, ringP = {x:0,y:0};
  
  const dotEl = document.querySelector('.cursor-dot');
  const ringEl = document.querySelector('.cursor-ring');
  
  window.addEventListener('mousemove', e => { 
    mouse.x = e.clientX; 
    mouse.y = e.clientY; 
  });
  
  // Hover effects
  document.querySelectorAll('a, button, .filter-btn, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => { 
      ringEl.style.width='50px'; 
      ringEl.style.height='50px'; 
      dotEl.style.width='12px'; 
      dotEl.style.height='12px'; 
    });
    el.addEventListener('mouseleave', () => { 
      ringEl.style.width='28px'; 
      ringEl.style.height='28px'; 
      dotEl.style.width='8px'; 
      dotEl.style.height='8px'; 
    });
  });
  
  const lerp = (s,e,f) => s+(e-s)*f;
  function animateCursor(){
    dotP.x=lerp(dotP.x,mouse.x,DOT_S); 
    dotP.y=lerp(dotP.y,mouse.y,DOT_S);
    ringP.x=lerp(ringP.x,mouse.x,RING_S); 
    ringP.y=lerp(ringP.y,mouse.y,RING_S);
    
    dotEl.style.left=`${dotP.x}px`; 
    dotEl.style.top=`${dotP.y}px`;
    ringEl.style.left=`${ringP.x}px`; 
    ringEl.style.top=`${ringP.y}px`;
    
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);
  
  updateCursorColor();
  new MutationObserver(updateCursorColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}

// ── LIGHTBOX FUNCTIONALITY ──
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbCat = document.getElementById('lbCat');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let currentItemIndex = 0;
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

function openLightbox(index) {
  const item = galleryItems[index];
  const img = item.getAttribute('data-img');
  const title = item.getAttribute('data-title');
  const catLabel = item.getAttribute('data-cat-label');

  lbImg.src = img;
  lbImg.alt = title;
  lbTitle.textContent = title;
  lbCat.textContent = catLabel;
  currentItemIndex = index;
  
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showNextPoster() {
  currentItemIndex = (currentItemIndex + 1) % galleryItems.length;
  openLightbox(currentItemIndex);
}

function showPrevPoster() {
  currentItemIndex = (currentItemIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentItemIndex);
}

// ── Lightbox Open Buttons ──
document.querySelectorAll('.lb-open').forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const item = btn.closest('.gallery-item');
    const itemIndex = galleryItems.indexOf(item);
    openLightbox(itemIndex);
  });
});

// ── Lightbox Close ──
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ── Lightbox Navigation ──
lbPrev.addEventListener('click', showPrevPoster);
lbNext.addEventListener('click', showNextPoster);

// ── Keyboard Navigation ──
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrevPoster();
  if (e.key === 'ArrowRight') showNextPoster();
});

// ── Floating Orbs Follow Mouse (Subtle) - DISABLED FOR PERFORMANCE ──
// const orbs = document.querySelectorAll('.floating-orb');
// window.addEventListener('mousemove', (e) => {
//   const x = e.clientX / window.innerWidth;
//   const y = e.clientY / window.innerHeight;
//   
//   orbs.forEach((orb, i) => {
//     const speed = (i + 1) * 20;
//     orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
//   });
// });