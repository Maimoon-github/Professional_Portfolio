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
  
  // Dark mode toggle with accessibility
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  
  // Set initial state based on storage or user preference
  if(stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    if(toggle) toggle.setAttribute('aria-pressed', 'true');
  } else {
    if(toggle) toggle.setAttribute('aria-pressed', 'false');
  }
  
  if(toggle){
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      
      // Announce theme change to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('visually-hidden');
      announcement.textContent = `Theme switched to ${isDark ? 'dark' : 'light'} mode`;
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
})(); 