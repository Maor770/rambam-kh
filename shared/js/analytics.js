/* RambamAnalytics — localStorage-based usage tracking */
window.RambamAnalytics = (function(){
  var PREFIX = 'rambam_';

  function trackPageView(pageName){
    var key = PREFIX + 'views_' + pageName;
    try {
      var count = parseInt(localStorage.getItem(key) || '0', 10);
      localStorage.setItem(key, String(count + 1));
    } catch(e){}
  }

  function trackHalachaView(ch, n){
    var key = PREFIX + 'studied_' + ch + ':' + n;
    try {
      localStorage.setItem(key, String(Date.now()));
    } catch(e){}
  }

  function getStats(){
    var totalViews = 0;
    var halachotStudied = 0;
    var lastStudied = null;
    var viewsByPage = {};

    try {
      for(var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if(!key || !key.startsWith(PREFIX)) continue;

        var rest = key.slice(PREFIX.length);

        if(rest.startsWith('views_')){
          var page = rest.slice(6);
          var count = parseInt(localStorage.getItem(key) || '0', 10);
          viewsByPage[page] = count;
          totalViews += count;
        }

        if(rest.startsWith('studied_')){
          halachotStudied++;
          var ts = parseInt(localStorage.getItem(key) || '0', 10);
          if(!lastStudied || ts > lastStudied){
            lastStudied = ts;
          }
        }
      }
    } catch(e){}

    return {
      totalViews: totalViews,
      halachotStudied: halachotStudied,
      lastStudied: lastStudied ? new Date(lastStudied).toISOString() : null,
      viewsByPage: viewsByPage
    };
  }

  function getStudiedHalachot(){
    var result = [];
    try {
      for(var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if(!key) continue;
        var rest = key.startsWith(PREFIX) ? key.slice(PREFIX.length) : '';
        if(rest.startsWith('studied_')){
          result.push(rest.slice(8)); // "ch:n"
        }
      }
    } catch(e){}
    return result;
  }

  return {
    trackPageView: trackPageView,
    trackHalachaView: trackHalachaView,
    getStats: getStats,
    getStudiedHalachot: getStudiedHalachot
  };

})();
