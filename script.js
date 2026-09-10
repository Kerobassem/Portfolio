particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#2c80ff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 1,
        "color": "#0088ff"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#e0913d",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 200,
        "line_linked": {
          "opacity": 0.5
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

const words = {
  en: ["UI/UX Designer", "Mobile Developer", "Frontend Developer", "Graphic Designer"],
  ar: ["مصمم واجهات", "مطور تطبيقات موبايل", "مطور واجهات أمامية", "مصمم جرافيك"],
};

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer = null;

const TYPE_SPEED   = 70;
const DELETE_SPEED = 35;
const PAUSE_AFTER  = 1800;
const PAUSE_BEFORE = 300;

function type() {
  const lang = document.documentElement.lang || 'en';
  const el   = document.getElementById('animated-word');
  if (!el) return;

  const current = words[lang][wordIndex];

  if (!isDeleting) {
    el.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typeTimer = setTimeout(type, PAUSE_AFTER);
      return;
    }
  } else {
    el.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words[lang].length;
      typeTimer = setTimeout(type, PAUSE_BEFORE);
      return;
    }
  }

  typeTimer = setTimeout(type, isDeleting ? DELETE_SPEED : TYPE_SPEED);
}

typeTimer = setTimeout(type, 500);

// ── Page loader: hide on enter ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('hide');
  }, 800);
});

// ── Page loader: show on exit ──
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href.startsWith('http') && href.endsWith('.html')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      const loader = document.getElementById('page-loader');
      loader.classList.remove('hide');
      setTimeout(() => { window.location.href = href; }, 600);
    });
  }
});

// ── EmailJS ──
emailjs.init("RDOIg--aKTHAe5QJC");

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = this.querySelector(".contact-send-btn");
  btn.disabled = true;
  btn.querySelector("span").textContent = "Sending...";

  const templateParams = {
    name: document.getElementById("from_name").value,
    email: document.getElementById("from_email").value,
    message: document.getElementById("message").value,
    title: "New Message from Portfolio"
  };

  emailjs.send("service_c7hr8vi", "template_4ufu3js", templateParams)
    .then(() => {
      btn.querySelector("span").textContent = "Message Sent ✓";
      btn.style.background = "green";
      document.getElementById("contactForm").reset();
    })
    .catch(() => {
      btn.querySelector("span").textContent = "Failed. Try Again.";
      btn.disabled = false;
    });
});
// ── Theme Toggle ──
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Set theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme
initTheme();

// Disable custom cursor on mobile/touch devices - More robust detection
function isMobileDevice() {
  // Check 1: Touch events
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return true;
  
  // Check 2: User agent (most reliable for DevTools emulation)
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)) return true;
  
  // Check 3: Screen width
  if (window.innerWidth <= 768) return true;
  
  return false;
}

let isTouchDevice = isMobileDevice();

// Immediately remove cursor if mobile
if (isTouchDevice) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('div[style*="z-index: 9999"]').forEach(el => el.remove());
  });
  window.addEventListener('load', () => {
    document.querySelectorAll('div[style*="z-index: 9999"]').forEach(el => el.remove());
  });
}

// Recheck on resize
window.addEventListener('resize', () => {
  const wasMobile = isTouchDevice;
  isTouchDevice = isMobileDevice();
  
  // If transitioned to mobile, remove cursor elements
  if (!wasMobile && isTouchDevice) {
    const cursorElements = document.querySelectorAll('div[style*="z-index: 9999"]');
    cursorElements.forEach(el => el.remove());
  }
});

if (!isTouchDevice) {

  // ── Smooth Cursor Follower ──
  const DOT_SMOOTHNESS = 0.2;
  const BORDER_SMOOTHNESS = 0.1;

  const mouse = { x: 0, y: 0 };
  const dot = { x: 0, y: 0 };
  const border = { x: 0, y: 0 };

  // Create dot element
  const dotEl = document.createElement('div');
  dotEl.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  `;

  // Create border ring element
  const borderEl = document.createElement('div');
  borderEl.style.cssText = `
    position: fixed;
    width: 28px;
    height: 28px;
    border: 2.5px solid;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  `;

  document.body.appendChild(dotEl);
  document.body.appendChild(borderEl);

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Hover animation
  document.querySelectorAll('a, button, img, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      borderEl.style.width = '44px';
      borderEl.style.height = '44px';
    });

    el.addEventListener('mouseleave', () => {
      borderEl.style.width = '28px';
      borderEl.style.height = '28px';
    });
  });

  // Smooth animation
  const lerp = (start, end, factor) =>
    start + (end - start) * factor;

  function animate() {
    dot.x = lerp(dot.x, mouse.x, DOT_SMOOTHNESS);
    dot.y = lerp(dot.y, mouse.y, DOT_SMOOTHNESS);

    border.x = lerp(border.x, mouse.x, BORDER_SMOOTHNESS);
    border.y = lerp(border.y, mouse.y, BORDER_SMOOTHNESS);

    dotEl.style.left = `${dot.x}px`;
    dotEl.style.top = `${dot.y}px`;

    borderEl.style.left = `${border.x}px`;
    borderEl.style.top = `${border.y}px`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Cursor color
  function updateCursorColor() {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';

    const color = isDark ? '#ff8800' : '#1a6bcc';

    dotEl.style.background = color;
    borderEl.style.borderColor = color;
  }

  updateCursorColor();

  const themeObserver = new MutationObserver(updateCursorColor);

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

}