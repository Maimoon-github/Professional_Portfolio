// Enhanced portfolio site interactions with accessibility support
(function(){
  // Active nav highlighting
  const path = window.location.pathname;
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    if(a.getAttribute('href') === path || (path.startsWith('/projects') && a.getAttribute('href').includes('project_list'))){
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
  
  // Theme is always dark with purple palette by default, toggle switches to light for accessibility
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  
  // Set initial state based on storage
  if(stored === 'light') {
    document.body.classList.add('light');
    if(toggle) toggle.setAttribute('aria-pressed', 'true');
    if(toggle) toggle.textContent = 'Switch to Dark Theme';
  } else {
    if(toggle) toggle.setAttribute('aria-pressed', 'false');
    if(toggle) toggle.textContent = 'Switch to Light Theme';
  }
  
  if(toggle){
    toggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      toggle.textContent = isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme';
      
      // Announce theme change to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('visually-hidden');
      announcement.textContent = `Theme switched to ${isLight ? 'light' : 'dark'} mode`;
      document.body.appendChild(announcement);
      
      // Clean up announcement after it's been read
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    });
  }
  
  // Add focus outlines for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('user-is-tabbing');
  });
  
  // Add hover animations to project cards
  const projectCards = document.querySelectorAll('#featured-projects .card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('purple-glow');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('purple-glow');
    });
  });
  
  // Initialize custom interactive elements
  document.addEventListener('DOMContentLoaded', () => {
    // Add skill badge hover effects
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05)';
        badge.style.boxShadow = `0 0 10px var(--purple-40)`;
      });
      
      badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
        badge.style.boxShadow = 'none';
      });
    });
  });
})();