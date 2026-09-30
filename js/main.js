console.log('WEBZER_SERVICES - Built with ❤️');

document.addEventListener('DOMContentLoaded', () => {

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
        }, 1200);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
        }, 1200);
    }

    // ── NAVBAR SCROLL EFFECT ──
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // ── MOBILE MENU TOGGLE ──
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ── SMOOTH SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── SCROLL ANIMATIONS (Intersection Observer) ──
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ── HERO TEXT ANIMATION ──
    // The hero elements use the .fade-in class with CSS transition-delay,
    // so we just need to trigger them after a short delay
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const heroItems = heroContent.querySelectorAll('.fade-in');
        setTimeout(() => {
            heroItems.forEach(item => item.classList.add('visible'));
        }, 300);
    }

    // ── ACTIVE NAV LINK HIGHLIGHTING ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-40% 0px -60% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ── COUNTER / STAT NUMBER ANIMATION ──
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const duration = 2000;
                    const steps = 60;
                    const stepTime = duration / steps;
                    let current = 0;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, stepTime);

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => counterObserver.observe(num));
    }

    // ── PORTFOLIO CARD TILT EFFECT ──
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // ── CONTACT FORM ──
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.form-btn');
            const btnSpan = btn.querySelector('span');
            const originalText = btnSpan.textContent;

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Form Data:', data);

            // Build WhatsApp message
            const message = `Hi! I'm ${data.name}.\n\nI need: ${data.service}\n\nMessage: ${data.message}\n\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

            // Show success feedback
            btnSpan.textContent = '✓ Sent Successfully!';
            btn.style.background = '#2ecc71';
            btn.style.borderColor = '#2ecc71';
            btn.style.color = '#fff';
            btn.disabled = true;

            // Open WhatsApp (optional — uncomment if you want)
            // window.open(whatsappUrl, '_blank');

            setTimeout(() => {
                contactForm.reset();
                btnSpan.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        });
    }

    // ── PARALLAX ON HERO BG ──
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        });
    }

});
