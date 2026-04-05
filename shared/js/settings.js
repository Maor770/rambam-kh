/* RambamSettings — localStorage manager */
window.RambamSettings = (function(){
  const PREFIX = 'rambam_';
  const DEFAULTS = {
    fontSize: 1.1,
    language: 'he',
    theme: 'light',
    dailyStudyMode: '1ch',
    lastStudied: null,
    bookmarks: {}
  };

  function get(key){
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if(raw === null) return DEFAULTS[key] !== undefined ? DEFAULTS[key] : null;
      return JSON.parse(raw);
    } catch(e){ return DEFAULTS[key] !== undefined ? DEFAULTS[key] : null; }
  }

  function set(key, value){
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch(e){}
  }

  function getAll(){
    const result = {};
    Object.keys(DEFAULTS).forEach(k => { result[k] = get(k); });
    return result;
  }

  function reset(){
    Object.keys(localStorage).forEach(k => {
      if(k.startsWith(PREFIX)) localStorage.removeItem(k);
    });
  }

  function applyTheme(){
    const theme = get('theme');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  }

  return { get, set, getAll, reset, applyTheme, DEFAULTS };
})();
