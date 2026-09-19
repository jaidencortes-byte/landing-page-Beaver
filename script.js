// Interactive & CRO Script for Beaver Construction Specialists Ltd.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smart Header & Scrolled Effect Controller
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollY = window.scrollY || 0;
    let isMobile = window.innerWidth <= 767;

    // Track responsive viewport changes
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 767;
        if (!isMobile && navbar) {
            navbar.classList.remove('header-hidden');
        }
    }, { passive: true });

    // Scroll listener with direction detection
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        const currentScrollY = window.scrollY;

        // Navbar shadow and background depth
        if (currentScrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Smart Header behavior: strictly active on mobile devices (< 768px)
        if (isMobile) {
            const scrollDelta = currentScrollY - lastScrollY;
            const isMenuOpen = navLinks && navLinks.classList.contains('active');

            // Keep header visible at the top of the page
            if (currentScrollY <= 15) {
                navbar.classList.remove('header-hidden');
            } else if (!isMenuOpen && Math.abs(scrollDelta) > 6) {
                if (scrollDelta > 0 && currentScrollY > 60) {
                    // Scrolling DOWN: smoothly slide header up out of view
                    navbar.classList.add('header-hidden');
                } else if (scrollDelta < 0) {
                    // Scrolling UP: smoothly reveal header
                    navbar.classList.remove('header-hidden');
                }
            }
        } else {
            // Desktop mode: ensure header is never hidden
            navbar.classList.remove('header-hidden');
        }

        lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });

    // 2. Mobile Menu Toggle & Auto-Close on Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle && navLinks) {
        const closeMobileMenu = () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        };

        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu automatically when any nav link is clicked
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // 3. Language Switcher (EN / FR)
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en]');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            translatableElements.forEach(el => {
                const text = el.getAttribute(`data-${lang}`);
                if (text) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = text;
                    } else {
                        el.innerHTML = text;
                    }
                }
            });

            // Save preference
            localStorage.setItem('beaver_lang', lang);
        });
    });

    // Load saved language if available
    const savedLang = localStorage.getItem('beaver_lang');
    if (savedLang) {
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
        if (activeBtn) activeBtn.click();
    }

    // 4. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        const statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;
        const rect = statsBar.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !animated) {
            animated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target') || '0', 10);
                const suffix = stat.getAttribute('data-suffix') || '';
                let count = 0;
                const speed = Math.ceil(target / 45);
                const timer = setInterval(() => {
                    count += speed;
                    if (count >= target) {
                        stat.innerHTML = `${target}<span>${suffix}</span>`;
                        clearInterval(timer);
                    } else {
                        stat.innerHTML = `${count}<span>${suffix}</span>`;
                    }
                }, 30);
            });
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats();

    // 5. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // 6. Modal Gallery Preview
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImg = document.querySelector('.modal-img');
    const modalTitle = document.querySelector('.modal-title-text');
    const modalCategory = document.querySelector('.modal-category-text');
    const modalClose = document.querySelector('.modal-close');

    if (modalOverlay && modalClose) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.portfolio-title');
                const category = item.querySelector('.portfolio-tag');

                if (img && modalImg) modalImg.src = img.src;
                if (title && modalTitle) modalTitle.textContent = title.textContent;
                if (category && modalCategory) modalCategory.textContent = category.textContent;

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // 7. Lead Forms Handling (Hero Form & Main Quote Form)
    const forms = document.querySelectorAll('.lead-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            setTimeout(() => {
                submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Quote Requested Successfully!';
                form.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = originalText;
                }, 4000);
            }, 1200);
        });
    });
});
