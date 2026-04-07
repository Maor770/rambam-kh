/* GA4 Analytics — site-wide tracking + custom events */
(function(){
  var GA_ID = 'G-B0CQWP9MTK';

  /* ── gtag bootstrap ── */
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  /* ── Auto-detect page context from URL ── */
  var path = location.pathname;
  var pageName = '';

  if(/sotah_daf_(\d+)/.test(path)){
    pageName = 'sotah_daf_' + RegExp.$1;
    gtag('event', 'daf_view', { daf_number: parseInt(RegExp.$1, 10), page_name: pageName });
  } else if(/tanya_shmini_(\d+)/.test(path)){
    pageName = 'tanya_shmini_' + RegExp.$1;
    gtag('event', 'tanya_view', { lesson: RegExp.$1, page_name: pageName });
  } else if(/kiddush/.test(path)){
    pageName = path.indexOf('en.html') > -1 ? 'kiddush_en' : 'kiddush';
  } else if(/sotah/.test(path)){
    pageName = 'sotah_index';
  } else if(/tanya/.test(path)){
    pageName = 'tanya_index';
  } else if(/admin/.test(path)){
    pageName = 'admin';
  } else if(/\/en\//.test(path)){
    pageName = 'home_en';
  } else {
    pageName = 'home';
  }

  /* ── Public helper: track share button clicks ── */
  window.RambamGA = {
    trackShare: function(page, method){
      gtag('event', 'share_click', {
        page_name: page || pageName,
        share_method: method || 'unknown'
      });
    },
    trackHalachaView: function(chapter, halacha){
      gtag('event', 'halacha_view', {
        chapter: chapter,
        halacha: halacha,
        page_name: 'kiddush_ch' + chapter + '_h' + halacha
      });
    },
    trackBookmark: function(page){
      gtag('event', 'bookmark_add', { page_name: page || pageName });
    },
    trackFeedback: function(){
      gtag('event', 'feedback_submit', { page_name: pageName });
    },
    getPageName: function(){ return pageName; }
  };
})();
