/**
 * Professional Portfolio - Interactive JavaScript
 * Purple Color Palette Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================================================
    // Navigation & Header Interactions
    // ===================================================================
    
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Mobile navigation toggle
    function toggleMobileNav() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger icon
        const icon = navToggle.querySelector('i') || navToggle;
        if (navMenu.classList.contains('active')) {
            icon.style.transform = 'rotate(90deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
    
    // Close mobile nav when clicking on a link
    function closeMobileNav() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        const icon = navToggle.querySelector('i') || navToggle;
        icon.style.transform = 'rotate(0deg)';
    }
    
    // Active navigation highlighting
    function setActiveNav() {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    if (navToggle) navToggle.addEventListener('click', toggleMobileNav);
    navLinks.forEach(link => link.addEventListener('click', closeMobileNav));
    setActiveNav();
    
    // ===================================================================
    // Smooth Scrolling for Anchor Links
    // ===================================================================
    
    function initSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initSmoothScrolling();
    
    // ===================================================================
    // Skills Animation
    // ===================================================================
    
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const percentage = skillBar.getAttribute('data-percentage') || 
                                     skillBar.parentElement.querySelector('.skill-percentage')?.textContent.replace('%', '') || 
                                     '0';
                    
                    skillBar.style.width = '0%';
                    setTimeout(() => {
                        skillBar.style.width = percentage + '%';
                    }, 200);
                    
                    observer.unobserve(skillBar);
                }
            });
        }, observerOptions);
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    animateSkillBars();
    
    // ===================================================================
    // Project Filtering
    // ===================================================================
    
    function initProjectFiltering() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    initProjectFiltering();
    
    // ===================================================================
    // Form Enhancements
    // ===================================================================
    
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
        
        // Add floating label effect
        inputs.forEach(input => {
            const label = input.previousElementSibling;
            
            function checkInput() {
                if (input.value !== '' || input === document.activeElement) {
                    label?.classList.add('active');
                } else {
                    label?.classList.remove('active');
                }
            }
            
            input.addEventListener('focus', checkInput);
            input.addEventListener('blur', checkInput);
            input.addEventListener('input', checkInput);
            
            // Check on page load
            checkInput();
        });
        
        // Form submission handling
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Sending...';
                    
                    // Re-enable after 3 seconds (adjust based on your backend)
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Send Message';
                    }, 3000);
                }
            });
        });
    }
    
    enhanceForms();
    
    // ===================================================================
    // Scroll Animations
    // ===================================================================
    
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .project-card, .blog-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-fadeInUp');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    initScrollAnimations();
    
    // ===================================================================
    // Search Functionality
    // ===================================================================
    
    function initSearch() {
        const searchInput = document.querySelector('#search-input');
        const searchableItems = document.querySelectorAll('[data-searchable]');
        
        if (!searchInput || searchableItems.length === 0) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                searchableItems.forEach(item => {
                    const searchText = item.getAttribute('data-searchable').toLowerCase();
                    
                    if (query === '' || searchText.includes(query)) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.3s ease-out';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }, 300);
        });
    }
    
    initSearch();
    
    // ===================================================================
    // Dark Theme Particles (Hero Background Effect)
    // ===================================================================
    
    function initParticleEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        hero.appendChild(canvas);
        
        let particles = [];
        let animationId;
        
        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            };
        }
        
        function initParticles() {
            particles = [];
            const particleCount = Math.floor(canvas.width * canvas.height / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        }
        
        function updateParticles() {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            });
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 81, 155, ${particle.opacity})`;
                ctx.fill();
            });
        }
        
        function animate() {
            updateParticles();
            drawParticles();
            animationId = requestAnimationFrame(animate);
        }
        
        // Initialize
        resizeCanvas();
        initParticles();
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        
        // Clean up when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }
    
    // Only init particles on desktop for performance
    if (window.innerWidth > 768) {
        initParticleEffect();
    }
    
    // ===================================================================
    // Loading States
    // ===================================================================
    
    function initLoadingStates() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            if (button.type === 'submit' || button.classList.contains('ajax-btn')) {
                button.addEventListener('click', function() {
                    if (!this.classList.contains('loading')) {
                        this.classList.add('loading');
                        const originalText = this.innerHTML;
                        this.innerHTML = '<span class="loading-spinner"></span> Loading...';
                        
                        // Remove loading state after 3 seconds (adjust as needed)
                        setTimeout(() => {
                            this.classList.remove('loading');
                            this.innerHTML = originalText;
                        }, 3000);
                    }
                });
            }
        });
    }
    
    initLoadingStates();
    
    // ===================================================================
    // Utility Functions
    // ===================================================================
    
    // Debounce function for performance optimization
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
    
    // Optimized scroll handling
    const debouncedScrollHandler = debounce(handleScroll, 10);
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // ===================================================================
    // Theme Utilities
    // ===================================================================
    
    // Add CSS custom property support for older browsers
    function initCSSVariablesFallback() {
        if (!CSS.supports('color', 'var(--primary-dark)')) {
            document.documentElement.style.setProperty('--primary-dark', '#1e202c');
            document.documentElement.style.setProperty('--accent-purple', '#60519b');
            document.documentElement.style.setProperty('--secondary-dark', '#31323c');
            document.documentElement.style.setProperty('--light-text', '#bfc0d1');
        }
    }
    
    initCSSVariablesFallback();
    
    // ===================================================================
    // Performance Monitoring
    // ===================================================================
    
    // Simple performance monitoring for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🎨 Purple Portfolio Design System Loaded');
        console.log('📊 Performance:', {
            loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
            domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
        });
    }
    
});

// ===================================================================
// Service Worker Registration (for PWA capabilities)
// ===================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}