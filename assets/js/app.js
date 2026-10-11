// ==========================================================================
// Team Galaxy 21131 — Main Application & Motion Script
// Federal Government College, Ikom • FIRST Tech Challenge Nigeria Champions
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
// 1. Mobile Menu Setup
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
// 2. Lightbox Functionality
// --------------------------------------------------------------------------
function openLightbox(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (!modal || !img || !cap) return;

  img.src = src;
  img.alt = caption || 'Team Galaxy Award / Photo Proof';
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
// 3. Pledge Modal Functionality
// --------------------------------------------------------------------------
function openPledgeModal(initialItem = '', initialCost = '') {
  const modal = document.getElementById('pledge-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const indicator = document.getElementById('pledge-item-indicator');
  if (indicator) {
    if (initialItem) {
      indicator.innerHTML = `<strong>Selected Item:</strong> ${initialItem} ${initialCost ? `(${initialCost})` : ''}`;
      indicator.classList.remove('hidden');
    } else {
      indicator.classList.add('hidden');
    }
  }
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
  openPledgeModal(itemName, cost);

  // Pre-fill form dropdown if user navigates to form
  const select = document.getElementById('form-tier-select');
  if (select) {
    select.value = 'bom-item';
  }

  const messageBox = document.getElementById('form-message');
  if (messageBox) {
    messageBox.value = `I would like to sponsor / pledge for hardware item: ${itemName} (${cost}).`;
  }
}

function selectTierPledge(tierName) {
  openPledgeModal(tierName);

  const select = document.getElementById('form-tier-select');
  if (select) {
    if (tierName.includes('Booster') || tierName.includes('150,000')) select.value = 'tier-1';
    else if (tierName.includes('Partner') || tierName.includes('500,000')) select.value = 'tier-2';
    else if (tierName.includes('Title') || tierName.includes('1,500,000')) select.value = 'tier-3';
  }

  const messageBox = document.getElementById('form-message');
  if (messageBox) {
    messageBox.value = `I would like to support Team Galaxy under the ${tierName} sponsorship package.`;
  }
}

// --------------------------------------------------------------------------
// 4. Instant WhatsApp Inquiry Redirect Handler
// --------------------------------------------------------------------------
function handleInquirySubmit(e) {
  e.preventDefault();
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  const name = form.querySelector('#form-name')?.value.trim() || 'Anonymous';
  const org = form.querySelector('#form-org')?.value.trim() || '';
  const email = form.querySelector('#form-email')?.value.trim() || 'Not provided';
  const phone = form.querySelector('#form-phone')?.value.trim() || 'Not provided';
  const intention = form.querySelector('#form-tier-select')?.value || 'General Inquiry';
  const mentorSelect = form.querySelector('#form-mentor-select')?.value || 'jude';
  const userMessage = form.querySelector('#form-message')?.value.trim() || 'No message provided';

  // Choose mentor target phone number
  // Mr. Jude Lukeson: +234 704 356 1686 (2347043561686)
  // Mr. Jeremiah Offre: +234 803 960 8857 (2348039608857)
  const targetPhone = mentorSelect === 'offre' ? '2348039608857' : '2347043561686';
  const mentorName = mentorSelect === 'offre' ? 'Mr. Jeremiah Offre' : 'Mr. Jude Lukeson';

  const waMessage = 
`*TEAM GALAXY 21131 SPONSORSHIP INQUIRY*
----------------------------------------
*To:* ${mentorName} (FGC Ikom Robotics)
*From:* ${name}${org ? ` (${org})` : ''}
*Email:* ${email}
*Phone / WhatsApp:* ${phone}
*Sponsorship Intention:* ${intention}

*Message:*
${userMessage}
----------------------------------------
_Dispatched via team-galaxy-website.vercel.app_`;

  const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

  // Show inline success message
  const successMsg = document.getElementById('form-success-msg');
  if (successMsg) {
    successMsg.classList.remove('hidden');
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  showToast('Opening WhatsApp with your pre-filled inquiry...');

  // Open WhatsApp in new tab
  window.open(waUrl, '_blank');
}

// --------------------------------------------------------------------------
// 5. Direct WhatsApp Chat Initiators
// --------------------------------------------------------------------------
function openWhatsAppChat(mentor = 'jude', customText = '') {
  const targetPhone = mentor === 'offre' ? '2348039608857' : '2347043561686';
  const mentorName = mentor === 'offre' ? 'Mr. Jeremiah Offre' : 'Mr. Jude Lukeson';
  
  const defaultText = customText || `Hello ${mentorName}, I am contacting you regarding sponsorship & hardware support for Team Galaxy 21131 (FGC Ikom Robotics).`;
  const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(defaultText)}`;
  window.open(waUrl, '_blank');
}

function requestBursaryDetails(mentor = 'jude') {
  const customText = `Hello, I would like to request the official Federal Government College, Ikom school bursary account details and payment reference to sponsor Team Galaxy 21131.`;
  openWhatsAppChat(mentor, customText);
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
  }, 3500);
}

// Global exposure for inline HTML event handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openPledgeModal = openPledgeModal;
window.closePledgeModal = closePledgeModal;
window.selectPledgeItem = selectPledgeItem;
window.selectTierPledge = selectTierPledge;
window.handleInquirySubmit = handleInquirySubmit;
window.openWhatsAppChat = openWhatsAppChat;
window.requestBursaryDetails = requestBursaryDetails;
window.showToast = showToast;
