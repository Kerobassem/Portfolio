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