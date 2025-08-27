// Initialize Three.js background
let scene, camera, renderer, particles;

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('three-bg').appendChild(renderer.domElement);

  // Create particles
  const geometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 50;

    colors[i] = Math.random() * 0.5 + 0.5;
    colors[i + 1] = 1;
    colors[i + 2] = Math.random() * 0.5 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.7
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 5;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.001;
  
  renderer.render(scene, camera);
}

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 100);
});

// Hover effects for cursor
document.querySelectorAll('a, button, .event-card, .team-card, .submit-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
    cursor.style.borderColor = '#00ff88';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.borderColor = '#00ff88';
  });
});

// Add this after the existing cursor follower code
document.querySelectorAll('a, button, .nav-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.querySelector('.cursor').classList.add('hovered');
    document.querySelector('.cursor-follower').classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    document.querySelector('.cursor').classList.remove('hovered');
    document.querySelector('.cursor-follower').classList.remove('hovered');
  });
});

// Page Navigation
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function showPage(pageId) {
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  document.getElementById(pageId).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  setTimeout(() => {
    initPageAnimations();
  }, 100);
}

// Navigation event listeners
document.querySelectorAll('[data-page]').forEach(element => {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = element.getAttribute('data-page');
    showPage(pageId);
  });
});

// Countdown functionality
function updateCountdown() {
  const eventDate = new Date('2025-09-09T00:00:00').getTime();
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">Event</span><span class="countdown-label">Started!</span></div>';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Floating elements
function createFloatingElements() {
  const container = document.getElementById('floating-elements');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDelay = Math.random() * 20 + 's';
    element.style.animationDuration = (Math.random() * 10 + 15) + 's';
    container.appendChild(element);
  }
}

// GSAP Animations
function initPageAnimations() {
  // Animate content sections on scroll
  gsap.utils.toArray('.content-section').forEach(section => {
    gsap.fromTo(section, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  // --- NEW: Past Editions Timeline Animation ---
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if (timelineItems.length > 0) {
    gsap.from(timelineItems, {
      opacity: 0,
      y: 100,
      stagger: 0.2, // Creates a cool, staggered effect
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline', // The container for the timeline
        start: 'top 80%', // Starts animation when 80% of the timeline is visible
        end: 'bottom top',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

// Contact Form Functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  const submitBtn = this.querySelector('.submit-btn');
  const successMessage = document.getElementById('successMessage');
  
  submitBtn.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;
    
    successMessage.classList.add('show');
    this.reset();
    
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
    
    console.log('Form submitted:', data);
  }, 2000);
});

// Find this block in your code
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'block';
  successMessage.style.opacity = '1';

  // Add this line to clear the form
  contactForm.reset(); 

  setTimeout(() => {
    successMessage.style.opacity = '0';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 500);
  }, 5000);
});

// Modal functionality
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');

document.addEventListener('click', (e) => {
  if (e.target.closest('.event-card')) {
    const card = e.target.closest('.event-card');
    const imageSrc = card.dataset.image;
    if (imageSrc) {
      modalImage.src = imageSrc;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
});

closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModalFunc();
});

function closeModalFunc() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModalFunc();
  }
  
  const pageKeys = {
    '1': 'home',
    '2': 'events', 
    '3': 'about',
    '4': 'team',
    '5': 'past-events',
    '6': 'contact'
  };
  
  if (pageKeys[e.key]) {
    showPage(pageKeys[e.key]);
  }
});

// Window resize handler
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

// Form validation
const formInputs = document.querySelectorAll('.form-input, .form-textarea');
formInputs.forEach(input => {
  input.addEventListener('blur', validateField);
  input.addEventListener('input', clearValidation);
});

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  field.style.borderColor = '';
  
  if (field.hasAttribute('required') && !value) {
    field.style.borderColor = '#ff6b6b';
    return false;
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      field.style.borderColor = '#ff6b6b';
      return false;
    }
  }
  
  field.style.borderColor = 'var(--primary)';
  return true;
}

function clearValidation(e) {
  const field = e.target;
  field.style.borderColor = '';
}

// Page load sequence
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);

  initThree();
  createFloatingElements();
  
  updateCountdown();
  setInterval(updateCountdown, 1000);

  setTimeout(() => {
    initPageAnimations();
  }, 2200);

  document.body.classList.add('loaded');
});

// Touch gesture support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    const pages = ['home', 'events', 'about', 'team', 'past-events', 'contact'];
    const currentPage = document.querySelector('.page.active').id;
    const currentIndex = pages.indexOf(currentPage);
    
    if (diff > 0 && currentIndex < pages.length - 1) {
      showPage(pages[currentIndex + 1]);
    } else if (diff < 0 && currentIndex > 0) {
      showPage(pages[currentIndex - 1]);
    }
  }
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

console.log(`
🎯 Abhigyan 25 - Keyboard Shortcuts:
1 - Home
2 - Events  
3 - About
4 - Team
5 - Past Events
6 - Contact
ESC - Close Modal
Swipe left/right on mobile for navigation
`);

// Header Scroll Animation
window.addEventListener('scroll', () => {
  const header = document.querySelector('.top-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// =================================
//  Hamburger Menu Functionality
// =================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger-menu');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-container .nav-link');

  // This check prevents errors if the elements don't exist
  if (hamburger && navContainer) {
    // Open/close menu when hamburger is clicked
    hamburger.addEventListener('click', () => {
      navContainer.classList.toggle('nav-active');
      hamburger.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('nav-active')) {
        navContainer.classList.remove('nav-active');
        hamburger.classList.remove('active');
      }
    });
  });
});