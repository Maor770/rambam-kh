/* Shared navigation dropdown — auto-injects into any page */
(function(){
  var pages = [
    { name: 'דף הבית', href: '/' },
    { name: 'קידוש החודש', href: '/kiddush/' },
    { name: 'גמרא סוטה', href: '/sotah/' }
  ];

  // Detect current page
  var path = window.location.pathname;
  var current = pages[0].name;
  for(var i = 0; i < pages.length; i++){
    if(path.indexOf(pages[i].href) === 0 && pages[i].href !== '/' || (pages[i].href === '/' && (path === '/' || path === '/index.html'))){
      current = pages[i].name;
    }
  }

  // Resolve relative hrefs based on depth
  var depth = (path.match(/\//g) || []).length - 1;
  var prefix = depth > 0 ? '../'.repeat(depth) : './';
  // Fix: for root pages use ./ , for sub-dirs use ../
  function resolveHref(href){
    if(href === '/') return depth > 0 ? '../' : './';
    return depth > 0 ? '..' + href : '.' + href;
  }

  var style = document.createElement('style');
  style.textContent =
    '.nav-dropdown{position:relative;display:inline-flex;align-items:center;z-index:95}' +
    '.nav-trigger{display:flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid var(--border,#ddd);' +
    'border-radius:8px;background:var(--card,#fff);color:var(--gold);cursor:pointer;font-family:inherit;' +
    'font-size:.95rem;font-weight:700;min-height:36px;transition:border-color .2s}' +
    '.nav-trigger:hover{border-color:var(--gold)}' +
    '.nav-trigger .nav-arrow{font-size:.6rem;color:var(--txt3,#999);transition:transform .2s}' +
    '.nav-dropdown.open .nav-arrow{transform:rotate(180deg)}' +
    '.nav-menu{display:none;position:absolute;top:calc(100% + 4px);right:0;background:var(--card,#fff);' +
    'border:1px solid var(--border,#ddd);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);' +
    'min-width:160px;overflow:hidden;z-index:96}' +
    '.nav-dropdown.open .nav-menu{display:block}' +
    '.nav-menu a{display:block;padding:10px 16px;text-decoration:none;color:var(--txt,#333);' +
    'font-size:.9rem;font-weight:500;transition:background .15s;white-space:nowrap}' +
    '.nav-menu a:hover{background:var(--gold-bg,#fdf6e3)}' +
    '.nav-menu a.nav-active{color:var(--gold);font-weight:700;pointer-events:none}';
  document.head.appendChild(style);

  // Create dropdown HTML
  var dd = document.createElement('div');
  dd.className = 'nav-dropdown';
  dd.innerHTML =
    '<button class="nav-trigger" aria-haspopup="true" aria-expanded="false">' +
      '<span class="nav-current">' + current + '</span>' +
      '<span class="nav-arrow">\u25BC</span>' +
    '</button>' +
    '<div class="nav-menu" role="menu"></div>';

  var menu = dd.querySelector('.nav-menu');
  for(var i = 0; i < pages.length; i++){
    var a = document.createElement('a');
    a.href = resolveHref(pages[i].href);
    a.textContent = pages[i].name;
    a.setAttribute('role', 'menuitem');
    if(pages[i].name === current) a.className = 'nav-active';
    menu.appendChild(a);
  }

  var trigger = dd.querySelector('.nav-trigger');
  trigger.addEventListener('click', function(e){
    e.stopPropagation();
    var open = dd.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', function(){
    dd.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });

  // Expose for pages to grab
  window._navDropdown = dd;
})();
