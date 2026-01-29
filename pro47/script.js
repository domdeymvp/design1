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
        
        // Add active class to new slide
        slides[index].classList.add('active');
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

        // Pause on hover
        const bannerSection = document.querySelector('.banner-section');
        if (bannerSection) {
            bannerSection.addEventListener('mouseenter', stopSlideShow);
            bannerSection.addEventListener('mouseleave', startSlideShow);
        }
    }
});

// Header Section Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const headerSection = document.querySelector('.header-section');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            headerSection.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            headerSection.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
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

// Mobile Sidebar Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebarClose = document.getElementById('mobileSidebarClose');
    const mobileSidebarLinks = document.querySelectorAll('.mobile-sidebar-link');
    const body = document.body;
    
    // Function to open sidebar
    function openSidebar() {
        mobileSidebar.classList.add('active');
        mobileSidebarOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent body scroll
    }
    
    // Function to close sidebar
    function closeSidebar() {
        mobileSidebar.classList.remove('active');
        mobileSidebarOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = ''; // Restore body scroll
    }
    
    // Toggle sidebar when hamburger is clicked
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mobileSidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }
    
    // Close sidebar when close button is clicked
    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when overlay is clicked
    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when a link is clicked
    mobileSidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Update active state
            mobileSidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar after a short delay for better UX
            setTimeout(closeSidebar, 300);
        });
    });
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    mobileSidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Close sidebar on window resize if it's open and screen is larger than 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileSidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // Prevent sidebar from closing when clicking inside it
    if (mobileSidebar) {
        mobileSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

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

// Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored session data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Country Flags Dropdown (Desktop)
document.addEventListener('DOMContentLoaded', function() {
    const countryFlagWrapper = document.getElementById('countryFlagWrapper');
    const countryDropdown = document.getElementById('countryDropdown');
    const selectedCountryFlag = document.getElementById('selectedCountryFlag');
    const countryOptions = document.querySelectorAll('.country-option');
    
    // Desktop dropdown toggle
    if (countryFlagWrapper && countryDropdown) {
        countryFlagWrapper.addEventListener('click', function(e) {
            e.stopPropagation();
            countryDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!countryFlagWrapper.contains(e.target) && !countryDropdown.contains(e.target)) {
                countryDropdown.classList.remove('active');
            }
        });
        
        // Handle country selection
        countryOptions.forEach(option => {
            option.addEventListener('click', function() {
                const flag = this.getAttribute('data-flag');
                const country = this.getAttribute('data-country');
                
                if (selectedCountryFlag) {
                    selectedCountryFlag.src = flag;
                }
                
                // Store selected country
                localStorage.setItem('selectedCountry', country);
                localStorage.setItem('selectedCountryFlag', flag);
                
                // Close dropdown
                countryDropdown.classList.remove('active');
            });
        });
        
        // Load saved country
        const savedCountry = localStorage.getItem('selectedCountryFlag');
        if (savedCountry && selectedCountryFlag) {
            selectedCountryFlag.src = savedCountry;
        }
    }
});

// Country Flags Dropdown (Mobile)
document.addEventListener('DOMContentLoaded', function() {
    const countryFlagWrapperMobile = document.getElementById('countryFlagWrapperMobile');
    const countryDropdownMobile = document.getElementById('countryDropdownMobile');
    const selectedCountryFlagMobile = document.getElementById('selectedCountryFlagMobile');
    const countryOptionsMobile = document.querySelectorAll('.country-option-mobile');
    
    // Function to calculate optimal dropdown height
    function calculateDropdownHeight() {
        if (!countryDropdownMobile) return;
        
        const sidebar = document.querySelector('.mobile-sidebar');
        if (!sidebar) return;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const wrapperRect = countryFlagWrapperMobile.getBoundingClientRect();
        const availableHeight = window.innerHeight - wrapperRect.bottom - 20; // 20px padding
        
        // Calculate based on number of items
        const itemCount = countryOptionsMobile.length;
        const itemHeight = 48; // Approximate height per item
        const totalItemsHeight = itemCount * itemHeight;
        const maxHeight = Math.min(availableHeight, totalItemsHeight + 20); // 20px for padding
        
        return maxHeight;
    }
    
    // Mobile dropdown toggle
    if (countryFlagWrapperMobile && countryDropdownMobile) {
        countryFlagWrapperMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = countryDropdownMobile.classList.contains('active');
            
            if (!isActive) {
                // Calculate and set dynamic height when opening
                const calculatedHeight = calculateDropdownHeight();
                if (calculatedHeight > 0) {
                    countryDropdownMobile.style.maxHeight = calculatedHeight + 'px';
                }
                countryDropdownMobile.classList.add('active');
                countryFlagWrapperMobile.classList.add('active');
            } else {
                // Close dropdown - set maxHeight to 0 and remove active classes
                countryDropdownMobile.style.maxHeight = '0px';
                countryDropdownMobile.classList.remove('active');
                countryFlagWrapperMobile.classList.remove('active');
            }
        });
        
        // Handle country selection (mobile)
        countryOptionsMobile.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const flag = this.getAttribute('data-flag');
                const country = this.getAttribute('data-country');
                
                if (selectedCountryFlagMobile) {
                    selectedCountryFlagMobile.src = flag;
                }
                
                // Update desktop flag if it exists
                const selectedCountryFlag = document.getElementById('selectedCountryFlag');
                if (selectedCountryFlag) {
                    selectedCountryFlag.src = flag;
                }
                
                // Store selected country
                localStorage.setItem('selectedCountry', country);
                localStorage.setItem('selectedCountryFlag', flag);
                
                // Close dropdown - set maxHeight to 0 and remove active classes
                countryDropdownMobile.style.maxHeight = '0px';
                countryDropdownMobile.classList.remove('active');
                countryFlagWrapperMobile.classList.remove('active');
            });
        });
        
        // Load saved country
        const savedCountry = localStorage.getItem('selectedCountryFlag');
        if (savedCountry && selectedCountryFlagMobile) {
            selectedCountryFlagMobile.src = savedCountry;
        }
        
        // Recalculate on window resize
        window.addEventListener('resize', function() {
            if (countryDropdownMobile.classList.contains('active')) {
                const calculatedHeight = calculateDropdownHeight();
                if (calculatedHeight > 0) {
                    countryDropdownMobile.style.maxHeight = calculatedHeight + 'px';
                }
            }
        });
    }
});