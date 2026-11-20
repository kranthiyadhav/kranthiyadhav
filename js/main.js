/**
 * Burra Kirani - Portfolio Interactive Controller
 * Python Full-Stack Developer & Trainee
 */

(function () {
  'use strict';

  // ==========================================
  // 1. TYPING TEXT EFFECT (HERO)
  // ==========================================
  const typingElement = document.getElementById('typingText');
  const typingWords = [
    'Python Full-Stack Web Apps',
    'Django Robust Backends',
    'Responsive Modern Web UIs',
    'Modular Multi-App Architectures',
    'SQLite3 Database Solutions',
    'Clean, High-Performance Code'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingDelay = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      typingDelay = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingDelay);
  }

  typeEffect();

  // ==========================================
  // 2. CUSTOM NEON CURSOR FOLLOWER
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  let mouseX = -100;
  let mouseY = -100;
  let glowX = -100;
  let glowY = -100;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
  }, { passive: true });

  function renderCursor() {
    if (cursorGlow) {
      // Smooth interpolation for the glow follower
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states for cursor
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tilt-card, .copyable-text, .module-tab-btn');
  interactiveElements.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (cursorGlow) cursorGlow.classList.add('cursor-grow');
    });
    el.addEventListener('mouseleave', function () {
      if (cursorGlow) cursorGlow.classList.remove('cursor-grow');
    });
  });

  // ==========================================
  // 3. 3D TILT EFFECT ON CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (max ~12 degrees)
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 3D Avatar Parallax in Hero
  const avatarWrapper = document.getElementById('avatar3D');
  if (avatarWrapper) {
    window.addEventListener('mousemove', function (e) {
      const rect = avatarWrapper.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - avatarCenterX) / 25;
      const deltaY = (e.clientY - avatarCenterY) / 25;

      const avatarCard = avatarWrapper.querySelector('.avatar-card');
      if (avatarCard) {
        avatarCard.style.transform = `perspective(1200px) rotateY(${deltaX.toFixed(2)}deg) rotateX(${(-deltaY).toFixed(2)}deg)`;
      }
    }, { passive: true });
  }

  // ==========================================
  // 4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || window.pageYOffset;

    // Navbar backdrop darkening
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Tracking
    let currentSectionId = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 5. GOOGLE PROJECT MODULE TABS INTERACTION
  // ==========================================
  const moduleTabs = document.querySelectorAll('.module-tab-btn');
  const moduleViews = document.querySelectorAll('.module-view');

  moduleTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetModule = tab.getAttribute('data-module');

      // Update active tab button
      moduleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active view
      moduleViews.forEach(view => {
        view.classList.remove('active');
        if (view.id === 'module-' + targetModule) {
          view.classList.add('active');
        }
      });

      playSfx('switch');
    });
  });

  // ==========================================
  // 6. SYNTHESIZED CYBER AUDIO SFX (Web Audio API)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = false;
  const soundToggleBtn = document.getElementById('soundToggle');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSfx(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click' || type === 'switch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.08);
        osc.frequency.setValueAtTime(1040, now + 0.16);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn('Audio SFX play issue:', e);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      initAudio();

      if (soundEnabled) {
        soundToggleBtn.classList.add('sound-active');
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        showToast('Sound Effects Enabled', 'fa-solid fa-volume-high');
        playSfx('success');
      } else {
        soundToggleBtn.classList.remove('sound-active');
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        showToast('Sound Effects Muted', 'fa-solid fa-volume-xmark');
      }
    });
  }

  // Attach hover and click sound triggers
  document.querySelectorAll('[data-sfx="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => playSfx('hover'));
  });
  document.querySelectorAll('[data-sfx="click"]').forEach(el => {
    el.addEventListener('click', () => playSfx('click'));
  });

  // ==========================================
  // 7. TOAST NOTIFICATIONS & CLIPBOARD COPY
  // ==========================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  // Copy-to-clipboard handler
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`, 'fa-regular fa-copy');
        playSfx('success');
      }).catch(err => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`, 'fa-regular fa-copy');
        playSfx('success');
      });
    });
  });

  // ==========================================
  // 8. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.style.color = '#ff1a40';
          formStatus.textContent = 'Please fill out all required fields.';
        }
        return;
      }

      // Compose mailto URL for direct email client opening
      const mailtoUrl = `mailto:burrakranthi41@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      // Show instant feedback
      if (formStatus) {
        formStatus.style.color = '#00ff88';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you, ' + name + '! Launching your email client...';
      }

      showToast('Opening email client for Burra Kirani...', 'fa-solid fa-paper-plane');
      playSfx('success');

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
        setTimeout(() => {
          if (formStatus) formStatus.textContent = '';
        }, 5000);
      }, 700);
    });
  }

  // ==========================================
  // 9. AUTOMATIC COPYRIGHT YEAR
  // ==========================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.log('%c Burra Kirani Portfolio Initialized %c Python Full-Stack & Django ', 'background: #ff1a40; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;', 'background: #09080d; color: #ff8093; padding: 4px 8px; border-radius: 4px;');
})();
