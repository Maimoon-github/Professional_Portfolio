/**
 * Professional Portfolio - Premium Interactive JavaScript
 * Enterprise-Level Purple Design System Implementation
 * Advanced Animations, Particle Systems, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================================================
    // ADVANCED PARTICLE SYSTEM
    // ===================================================================
    
    class ParticleSystem {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }
        
        init() {
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.opacity = '0.6';
            document.body.appendChild(this.canvas);
            
            this.resize();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createParticles() {
            const particleCount = Math.min(150, window.innerWidth / 10);
            for (let i = 0; i < particleCount; i++) {
                this.particles.push(new Particle(this.canvas.width, this.canvas.height));
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.update(this.mouseX, this.mouseY);
                particle.draw(this.ctx);
            });
            
            this.drawConnections();
            requestAnimationFrame(() => this.animate());
        }
        
        drawConnections() {
            this.particles.forEach((particle, i) => {
                this.particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.strokeStyle = `rgba(96, 81, 155, ${0.3 * (1 - distance / 120)})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                });
            });
        }
    }
    
    class Particle {
        constructor(canvasWidth, canvasHeight) {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.baseRadius = this.radius;
        }
        
        update(mouseX, mouseY) {
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx -= (dx / distance) * force * 0.01;
                this.vy -= (dy / distance) * force * 0.01;
                this.radius = this.baseRadius * (1 + force);
            } else {
                this.radius = this.baseRadius;
            }
            
            // Update position
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary checking
            if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
            if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
            
            // Keep within bounds
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
            
            // Friction
            this.vx *= 0.99;
            this.vy *= 0.99;
        }
        
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(96, 81, 155, 0.7)';
            ctx.fill();
            ctx.shadowColor = 'rgba(96, 81, 155, 0.5)';
            ctx.shadowBlur = 10;
        }
    }
    
    // Initialize particle system
    const particleSystem = new ParticleSystem();
    
    // ===================================================================
    // PREMIUM NAVIGATION & HEADER INTERACTIONS
    // ===================================================================
    
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Premium header scroll effect with glassmorphism
    function handleScroll() {
        const scrolled = window.scrollY > 50;
        header.classList.toggle('scrolled', scrolled);
        
        // Add premium scroll indicator
        const scrollProgress = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
        updateScrollProgress(scrollProgress);
    }
    
    function updateScrollProgress(progress) {
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #60519b, #9687d4);
                z-index: 9999;
                transition: width 0.1s ease;
                box-shadow: 0 0 10px rgba(96, 81, 155, 0.5);
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = `${progress * 100}%`;
    }
    
    // Enhanced mobile navigation with premium animations
    function toggleMobileNav() {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Premium hamburger animation
        const icon = navToggle.querySelector('i') || navToggle;
        if (isActive) {
            icon.style.transform = 'rotate(180deg) scale(1.1)';
            navMenu.style.transform = 'translateX(0)';
            navMenu.style.opacity = '1';
            // Add blur to background
            document.body.style.backdropFilter = 'blur(5px)';
        } else {
            icon.style.transform = 'rotate(0deg) scale(1)';
            navMenu.style.transform = 'translateX(100%)';
            navMenu.style.opacity = '0';
            document.body.style.backdropFilter = 'none';
        }
    }
    
    // Premium close navigation with fade effect
    function closeMobileNav() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        const icon = navToggle.querySelector('i') || navToggle;
        icon.style.transform = 'rotate(0deg) scale(1)';
        navMenu.style.transform = 'translateX(100%)';
        navMenu.style.opacity = '0';
        document.body.style.backdropFilter = 'none';
    }
    
    // Enhanced active navigation with magnetic effect
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
    
    // ===================================================================
    // PREMIUM MAGNETIC CURSOR EFFECT
    // ===================================================================
    
    class MagneticCursor {
        constructor() {
            this.cursor = document.createElement('div');
            this.cursorFollower = document.createElement('div');
            this.init();
        }
        
        init() {
            // Main cursor
            this.cursor.className = 'magnetic-cursor';
            this.cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: linear-gradient(45deg, #60519b, #9687d4);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
                box-shadow: 0 0 20px rgba(96, 81, 155, 0.5);
            `;
            
            // Cursor follower
            this.cursorFollower.className = 'cursor-follower';
            this.cursorFollower.style.cssText = `
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(96, 81, 155, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorFollower);
            
            document.addEventListener('mousemove', (e) => this.updateCursor(e));
            
            // Interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .btn, .card, .nav-link');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => this.onHover(true));
                el.addEventListener('mouseleave', () => this.onHover(false));
            });
        }
        
        updateCursor(e) {
            this.cursor.style.left = `${e.clientX - 10}px`;
            this.cursor.style.top = `${e.clientY - 10}px`;
            
            this.cursorFollower.style.left = `${e.clientX - 20}px`;
            this.cursorFollower.style.top = `${e.clientY - 20}px`;
        }
        
        onHover(isHovering) {
            if (isHovering) {
                this.cursor.style.transform = 'scale(0.5)';
                this.cursorFollower.style.transform = 'scale(1.5)';
                this.cursorFollower.style.borderColor = 'rgba(96, 81, 155, 0.8)';
            } else {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
                this.cursorFollower.style.borderColor = 'rgba(96, 81, 155, 0.3)';
            }
        }
    }
    
    // Initialize magnetic cursor on desktop
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        new MagneticCursor();
    }
    
    // ===================================================================
    // PREMIUM CARD HOVER EFFECTS
    // ===================================================================
    
    function initPremiumCardEffects() {
        const cards = document.querySelectorAll('.card, .project-card, .blog-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                // Add premium glow effect
                this.style.boxShadow = `
                    0 25px 50px -12px rgba(96, 81, 155, 0.25),
                    0 0 40px rgba(96, 81, 155, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
                this.style.transform = 'translateY(-8px) scale(1.02)';
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, rgba(96, 81, 155, 0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
                this.style.transform = '';
            });
            
            // Add premium tilt effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }
    
    initPremiumCardEffects();
    
    // ===================================================================
    // PREMIUM LOADING STATES
    // ===================================================================
    
    function initPremiumLoadingStates() {
        // Add skeleton loading for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                const skeleton = document.createElement('div');
                skeleton.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, rgba(96, 81, 155, 0.1) 25%, rgba(96, 81, 155, 0.2) 50%, rgba(96, 81, 155, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: inherit;
                `;
                
                img.style.position = 'relative';
                img.parentNode.style.position = 'relative';
                img.parentNode.insertBefore(skeleton, img);
                
                img.addEventListener('load', () => skeleton.remove());
            }
        });
    }
    
    initPremiumLoadingStates();
    
    // ===================================================================
    // PREMIUM SCROLL ANIMATIONS
    // ===================================================================
    
    function initPremiumScrollAnimations() {
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero, .section:first-child');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            });
        }
        
        // Reveal animations with stagger
        const revealElements = document.querySelectorAll('.card, .timeline-item, .project-card, h1, h2, h3');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            revealObserver.observe(el);
        });
    }
    
    initPremiumScrollAnimations();

});

// ===================================================================
// PREMIUM CSS ANIMATIONS
// ===================================================================

const premiumStyles = document.createElement('style');
premiumStyles.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(96, 81, 155, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(96, 81, 155, 0.6);
        }
    }
    
    .premium-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .premium-glow {
        animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .glass-morphism {
        background: rgba(191, 192, 209, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(191, 192, 209, 0.2);
        box-shadow: 0 8px 32px rgba(96, 81, 155, 0.15);
    }
    
    /* Hide cursor on touch devices */
    @media (hover: none) and (pointer: coarse) {
        .magnetic-cursor,
        .cursor-follower {
            display: none !important;
        }
    }
`;
document.head.appendChild(premiumStyles);

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