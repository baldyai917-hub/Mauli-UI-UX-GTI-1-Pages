document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Language Switcher Logic
  // ==========================================
  const langBtn = document.querySelector('.lang-btn');
  const langMenu = document.querySelector('.lang-menu');
  const langOptions = document.querySelectorAll('.lang-option');
  const currentLangSpan = document.getElementById('current-lang');
  
  // Supported languages
  const SUPPORTED_LANGS = {
    'id': 'ID',
    'en': 'EN'
  };

  // Get preferred language from localStorage or default to ID
  let currentLang = localStorage.getItem('gti_lang') || 'id';
  
  // Initialize language
  setLanguage(currentLang);

  // Toggle language dropdown menu
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
      langMenu.classList.remove('show');
    });
  }

  // Handle language option clicks
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const selectedLang = e.target.getAttribute('data-value');
      if (selectedLang !== currentLang) {
        setLanguage(selectedLang);
      }
    });
  });

  function setLanguage(langCode) {
    if (!SUPPORTED_LANGS[langCode]) return;
    
    currentLang = langCode;
    localStorage.setItem('gti_lang', langCode);
    
    if (currentLangSpan) {
      currentLangSpan.textContent = SUPPORTED_LANGS[langCode];
    }

    // Find all elements that need translation
    const translatableElements = document.querySelectorAll('[data-lang-id]');
    
    translatableElements.forEach(el => {
      const content = el.getAttribute(`data-lang-${langCode}`);
      if (content) {
        // Only set innerHTML if content contains HTML tags, else textContent
        if (content.includes('<') && content.includes('>')) {
          el.innerHTML = content;
        } else {
          el.textContent = content;
        }
      }
    });
    
    // Update placeholders for inputs
    const translatableInputs = document.querySelectorAll('input[data-placeholder-id], textarea[data-placeholder-id]');
    translatableInputs.forEach(input => {
      const placeholder = input.getAttribute(`data-placeholder-${langCode}`);
      if (placeholder) {
        input.placeholder = placeholder;
      }
    });
  }

  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // ==========================================
  // 3. Hero Slider (Homepage Only)
  // ==========================================
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const sliderTrack = heroSlider.querySelector('.slider-track');
    const slides = heroSlider.querySelectorAll('.slide');
    const dots = heroSlider.querySelectorAll('.dot');
    let currentSlide = 0;
    let sliderInterval;
    const SLIDE_DURATION = 5500; // 5.5 seconds
    const totalSlides = slides.length;

    function goToSlide(index) {
      // Update dots
      dots[currentSlide].classList.remove('active');
      currentSlide = index;
      dots[currentSlide].classList.add('active');

      // Slide the track horizontally
      const offset = -(currentSlide * (100 / totalSlides));
      sliderTrack.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % totalSlides;
      goToSlide(next);
    }

    // Start auto-play
    function startAutoPlay() {
      sliderInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoPlay() {
      clearInterval(sliderInterval);
    }

    startAutoPlay();

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);

    // Dot click navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        if (slideIndex !== currentSlide) {
          stopAutoPlay();
          goToSlide(slideIndex);
          startAutoPlay();
        }
      });
    });
  }

  // ==========================================
  // 4. Scroll Fade-in Animations
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });

  // ==========================================
  // 4. Update active nav link based on URL
  // ==========================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // 5. Basic Contact Form Handling (dummy)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = currentLang === 'id' ? 'Mengirim...' : 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        alert(currentLang === 'id' 
          ? 'Terima kasih. Pesan Anda telah terkirim.' 
          : 'Thank you. Your message has been sent.');
          
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});
