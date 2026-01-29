// Smooth Scrolling for Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Auto Sliding Banner
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Add exit class to current active slide
        const activeSlide = document.querySelector('.banner-slide.active');
        if (activeSlide) {
            activeSlide.classList.add('exit');
            activeSlide.classList.remove('active');
        }
        
        // Remove exit class from all slides after animation
        setTimeout(() => {
            slides.forEach(slide => slide.classList.remove('exit'));
        }, 600);
        
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to new slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Initialize banner
    if (slides.length > 0) {
        showSlide(0);
        startSlideShow();

        // Dot click functionality
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showSlide(currentSlide);
                stopSlideShow();
                startSlideShow(); // Restart the timer
            });
        });

        // Pause on hover
        const bannerSection = document.querySelector('.banner-section');
        if (bannerSection) {
            bannerSection.addEventListener('mouseenter', stopSlideShow);
            bannerSection.addEventListener('mouseleave', startSlideShow);
        }
    }
});

// Hot Promotion Banner Auto Slide with Manual Navigation
document.addEventListener('DOMContentLoaded', function() {
    const promotionSlides = document.querySelectorAll('.promotion-slide');
    const leftBtn = document.querySelector('.promotion-nav-left');
    const rightBtn = document.querySelector('.promotion-nav-right');
    let currentSlide = 0;
    let slideInterval;
    
    if (promotionSlides.length > 0) {
        function showSlide(index) {
            // Remove active class from all slides
            promotionSlides.forEach(slide => {
                slide.classList.remove('active', 'exit');
            });
            
            // Add active class to current slide
            promotionSlides[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % promotionSlides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + promotionSlides.length) % promotionSlides.length;
            showSlide(currentSlide);
        }
        
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 4000);
        }
        
        function stopSlideShow() {
            clearInterval(slideInterval);
        }
        
        // Manual navigation
        if (leftBtn) {
            leftBtn.addEventListener('click', function() {
                prevSlide();
                stopSlideShow();
                startSlideShow(); // Restart auto-advance
            });
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('click', function() {
                nextSlide();
                stopSlideShow();
                startSlideShow(); // Restart auto-advance
            });
        }
        
        // Pause on hover
        const banner = document.querySelector('.hot-promotion-banner');
        if (banner) {
            banner.addEventListener('mouseenter', stopSlideShow);
            banner.addEventListener('mouseleave', startSlideShow);
        }
        
        // Initialize first slide and start auto-advance
        showSlide(0);
        startSlideShow();
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll handling code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Mobile Bottom Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    
    // Add touch feedback and haptic-like animation
    navItems.forEach(item => {
        // Handle click/tap with visual feedback
        item.addEventListener('click', function(e) {
            // Add pulse animation
            this.style.transform = 'translateY(-1px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Touch start effect for better mobile feel
        item.addEventListener('touchstart', function(e) {
            this.style.transition = 'transform 0.1s ease';
        });
        
        // Touch end reset
        item.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.transition = '';
            }, 150);
        });
    });
    
    // Optional: Set active state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Map pages to nav items
    const pageMapping = {
        'index.html': 'home',
        'promotion.html': 'promotion',
        '': 'home' // Default to home for root
    };
    
    const currentNav = pageMapping[currentPage];
    if (currentNav) {
        const activeItem = document.querySelector(`.mobile-bottom-nav .nav-item[data-nav="${currentNav}"]`);
        if (activeItem) {
            navItems.forEach(nav => nav.classList.remove('active'));
            activeItem.classList.add('active');
        }
    }
    
    // Prevent footer from being hidden behind nav on mobile
    function adjustFooterPadding() {
        const nav = document.querySelector('.mobile-bottom-nav');
        const footer = document.querySelector('.footer');
        
        if (nav && footer && window.innerWidth <= 768) {
            const navHeight = nav.offsetHeight;
            footer.style.paddingBottom = `${navHeight + 20}px`;
        } else if (footer) {
            footer.style.paddingBottom = '';
        }
    }
    
    // Adjust on load and resize
    adjustFooterPadding();
    window.addEventListener('resize', debounce(adjustFooterPadding, 250));
});

// Mobile Side Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSideMenu = document.getElementById('mobileSideMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    function openMobileMenu() {
        if (mobileSideMenu && mobileMenuOverlay) {
            mobileSideMenu.classList.add('open');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        }
    }
    
    function closeMobileMenu() {
        if (mobileSideMenu && mobileMenuOverlay) {
            mobileSideMenu.classList.remove('open');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scroll
        }
    }
    
    // Open menu when hamburger is clicked
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openMobileMenu();
        });
    }
    
    // Close menu when close button is clicked
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMobileMenu();
        });
    }
    
    // Close menu when overlay is clicked
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }
    
    // Close menu when clicking on a nav item
    const mobileNavItems = document.querySelectorAll('.mobile-side-menu-nav .nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active state
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close menu after a short delay to show the click feedback
            setTimeout(() => {
                closeMobileMenu();
            }, 300);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSideMenu && mobileSideMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
});