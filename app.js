// ==========================================================================
// Team Galaxy — Main Application & Motion Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check for scroll query parameter (useful for testing & screenshots)
  const applyScroll = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollY = parseInt(urlParams.get('scroll'), 10);
    if (!isNaN(scrollY)) {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  };
  applyScroll();
  window.addEventListener('load', applyScroll);

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Canvas Constellation Starfield
  initGalaxyCanvas();

  // Mobile Menu Setup
  initMobileMenu();

  // Global ESC Key Listener for Modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closePledgeModal();
    }
  });

  // Close modals on clicking backdrop
  const lightboxModal = document.getElementById('lightbox-modal');
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  const pledgeModal = document.getElementById('pledge-modal');
  if (pledgeModal) {
    pledgeModal.addEventListener('click', (e) => {
      if (e.target === pledgeModal) closePledgeModal();
    });
  }
});

// --------------------------------------------------------------------------
// 1. Interactive Starfield & Constellation Canvas
// --------------------------------------------------------------------------
function initGalaxyCanvas() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let particles = [];
  const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 14000), 85);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 0.8;
      // Slight cyan/amber/white palette
      const colors = ['#00E5FF', '#38BDF8', '#818CF8', '#F59E0B', '#FFFFFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse interactive push
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.8;
        this.x -= (dx / dist) * force * 2;
        this.y -= (dy / dist) * force * 2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles with delicate glowing lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00E5FF';
          ctx.globalAlpha = (1 - dist / 110) * 0.15;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

// --------------------------------------------------------------------------
// 2. Mobile Menu Setup
// --------------------------------------------------------------------------
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

// --------------------------------------------------------------------------
// 3. Lightbox Functionality
// --------------------------------------------------------------------------
function openLightbox(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (!modal || !img || !cap) return;

  img.src = src;
  img.alt = caption || 'Team Galaxy Award/Photo Proof';
  cap.textContent = caption || '';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// --------------------------------------------------------------------------
// 4. Pledge Modal Functionality
// --------------------------------------------------------------------------
function openPledgeModal() {
  const modal = document.getElementById('pledge-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePledgeModal() {
  const modal = document.getElementById('pledge-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';

  const indicator = document.getElementById('pledge-item-indicator');
  if (indicator) indicator.classList.add('hidden');
}

function selectPledgeItem(itemName, cost) {
  openPledgeModal();
  const indicator = document.getElementById('pledge-item-indicator');
  if (indicator) {
    indicator.innerHTML = `<strong>Selected Item to Sponsor:</strong> ${itemName} (${cost})`;
    indicator.classList.remove('hidden');
  }

  // Pre-fill form dropdown if user navigates to form
  const select = document.getElementById('form-tier-select');
  if (select) {
    select.value = 'general';
  }
}

function selectTierPledge(tierName) {
  openPledgeModal();
  const indicator = document.getElementById('pledge-item-indicator');
  if (indicator) {
    indicator.innerHTML = `<strong>Selected Sponsorship Tier:</strong> ${tierName}`;
    indicator.classList.remove('hidden');
  }

  const select = document.getElementById('form-tier-select');
  if (select) {
    if (tierName.includes('Bronze')) select.value = 'bronze';
    else if (tierName.includes('Silver')) select.value = 'silver';
    else if (tierName.includes('Gold')) select.value = 'gold';
  }
}

// --------------------------------------------------------------------------
// 5. Copy Bank & Account Details
// --------------------------------------------------------------------------
function copyAccountDetails() {
  const details = `Team Galaxy / FGC Ikom Robotics Sponsorship Details:
Account Name: Federal Government College Ikom (Robotics / Team Galaxy)
Bank: First Bank of Nigeria
Account Number: 1023489210
Reference: FTC-GALAXY-[YourName]
Location: FGC Ikom, Cross River State, Nigeria
Contact: teamgalaxy.fgcikom@gmail.com`;

  navigator.clipboard.writeText(details).then(
    () => {
      showToast('Bank details copied to clipboard!');
      const btnText = document.getElementById('copy-btn-text');
      if (btnText) {
        btnText.textContent = 'Copied!';
        setTimeout(() => {
          btnText.textContent = 'Copy Info';
        }, 2500);
      }
    },
    () => {
      showToast('Could not copy automatically. Details shown on screen.');
    }
  );
}

// --------------------------------------------------------------------------
// 6. Toast Notification Helper
// --------------------------------------------------------------------------
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

// --------------------------------------------------------------------------
// 7. Form Submission Handler
// --------------------------------------------------------------------------
function handleInquirySubmit(e) {
  e.preventDefault();
  const form = document.getElementById('inquiry-form');
  const successMsg = document.getElementById('form-success-msg');

  if (form && successMsg) {
    successMsg.classList.remove('hidden');
    form.reset();
    showToast('Inquiry submitted successfully!');
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

// Make functions globally accessible for inline HTML handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openPledgeModal = openPledgeModal;
window.closePledgeModal = closePledgeModal;
window.selectPledgeItem = selectPledgeItem;
window.selectTierPledge = selectTierPledge;
window.copyAccountDetails = copyAccountDetails;
window.handleInquirySubmit = handleInquirySubmit;
window.showToast = showToast;
