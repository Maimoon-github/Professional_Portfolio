// Basic enhancements: active nav highlighting & dark mode toggle persistence
(function(){
  const path = window.location.pathname;
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    if(a.getAttribute('href') === path || (path.startsWith('/projects') && a.getAttribute('href').includes('project_list'))){
      a.classList.add('active');
    }
  });
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if(stored === 'dark') document.body.classList.add('dark');
  if(toggle){
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }
})();
