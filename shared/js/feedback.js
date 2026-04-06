/* Feedback floating button + modal — auto-injects into any page */
(function(){
  var style = document.createElement('style');
  style.textContent =
    '.feedback-fab{position:fixed;bottom:24px;left:24px;width:52px;height:52px;border-radius:50%;' +
    'background:linear-gradient(135deg,var(--gold),var(--sun,#e6a817));color:#fff;border:none;cursor:pointer;' +
    'z-index:90;box-shadow:0 4px 16px rgba(0,0,0,.25);font-size:1.5rem;display:flex;align-items:center;' +
    'justify-content:center;transition:transform .2s,box-shadow .2s}' +
    '.feedback-fab:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(0,0,0,.3)}' +
    '.feedback-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;' +
    'align-items:center;justify-content:center}' +
    '.feedback-overlay.open{display:flex}' +
    '.feedback-modal{background:var(--card,#fff);border-radius:var(--r,12px);padding:1.5rem;width:90%;' +
    'max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,.3);direction:rtl;position:relative}' +
    '.feedback-modal h2{font-family:"Google Sans",var(--font-body);color:var(--gold);margin:0 0 .75rem;font-size:1.3rem}' +
    '.feedback-modal label{display:block;font-size:.85rem;color:var(--txt2,#666);margin-bottom:.25rem;margin-top:.75rem}' +
    '.feedback-modal input,.feedback-modal textarea{width:100%;padding:.6rem .75rem;border:1px solid var(--border,#ddd);' +
    'border-radius:8px;font-size:.95rem;font-family:inherit;background:var(--bg,#fff);color:var(--txt,#333);' +
    'box-sizing:border-box;transition:border-color .2s}' +
    '.feedback-modal input:focus,.feedback-modal textarea:focus{outline:none;border-color:var(--gold)}' +
    '.feedback-modal textarea{min-height:100px;resize:vertical}' +
    '.feedback-actions{display:flex;gap:.5rem;margin-top:1rem;justify-content:flex-start}' +
    '.feedback-btn{padding:.55rem 1.2rem;border-radius:8px;border:none;cursor:pointer;font-size:.9rem;' +
    'font-family:inherit;font-weight:500;transition:opacity .2s}' +
    '.feedback-btn:hover{opacity:.85}' +
    '.feedback-btn-send{background:linear-gradient(135deg,var(--gold),var(--sun,#e6a817));color:#fff}' +
    '.feedback-btn-cancel{background:var(--border,#ddd);color:var(--txt,#333)}' +
    '.feedback-close{position:absolute;top:.75rem;left:.75rem;background:none;border:none;font-size:1.3rem;' +
    'color:var(--txt3,#999);cursor:pointer;width:32px;height:32px;display:flex;align-items:center;' +
    'justify-content:center;border-radius:50%;transition:background .2s}' +
    '.feedback-close:hover{background:var(--border,#eee)}';
  document.head.appendChild(style);

  var container = document.createElement('div');
  container.innerHTML =
    '<button class="feedback-fab" aria-label="\u05DE\u05E9\u05D5\u05D1" title="\u05E9\u05DC\u05D7 \u05DE\u05E9\u05D5\u05D1">\uD83D\uDCAC</button>' +
    '<div class="feedback-overlay">' +
      '<div class="feedback-modal">' +
        '<button class="feedback-close" aria-label="\u05E1\u05D2\u05D5\u05E8">&times;</button>' +
        '<h2>\u2709 \u05E9\u05DC\u05D7 \u05DE\u05E9\u05D5\u05D1</h2>' +
        '<form action="https://formsubmit.co/chanoch@maor.org" method="POST">' +
          '<input type="hidden" name="_subject" value="\u05DE\u05E9\u05D5\u05D1 \u05D7\u05D3\u05E9 \u05DE\u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9">' +
          '<input type="hidden" name="_captcha" value="false">' +
          '<input type="hidden" name="_next" value="">' +
          '<label>\u05E9\u05DD (\u05DC\u05D0 \u05D7\u05D5\u05D1\u05D4)</label>' +
          '<input type="text" name="name" placeholder="\u05D4\u05E9\u05DD \u05E9\u05DC\u05DA">' +
          '<label>\u05E2\u05DE\u05D5\u05D3</label>' +
          '<input type="text" name="page" readonly>' +
          '<label>\u05D4\u05DE\u05E9\u05D5\u05D1 \u05E9\u05DC\u05DA</label>' +
          '<textarea name="message" required placeholder="\u05DB\u05EA\u05D5\u05D1 \u05DB\u05D0\u05DF \u05D4\u05E2\u05E8\u05D4, \u05D4\u05E6\u05E2\u05D4, \u05D0\u05D5 \u05D3\u05D9\u05D5\u05D5\u05D7 \u05E2\u05DC \u05D1\u05D0\u05D2..."></textarea>' +
          '<div class="feedback-actions">' +
            '<button type="submit" class="feedback-btn feedback-btn-send">\u05E9\u05DC\u05D7</button>' +
            '<button type="button" class="feedback-btn feedback-btn-cancel">\u05D1\u05D9\u05D8\u05D5\u05DC</button>' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div>';

  var fab = container.querySelector('.feedback-fab');
  var overlay = container.querySelector('.feedback-overlay');
  var form = overlay.querySelector('form');
  var pageField = form.querySelector('input[name="page"]');

  form.querySelector('input[name="_next"]').value = window.location.href;

  function open(){
    pageField.value = document.title + ' \u2014 ' + window.location.pathname;
    overlay.classList.add('open');
  }
  function close(){
    overlay.classList.remove('open');
  }

  fab.addEventListener('click', open);
  overlay.querySelector('.feedback-close').addEventListener('click', close);
  overlay.querySelector('.feedback-btn-cancel').addEventListener('click', close);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) close();
  });

  while(container.firstChild) document.body.appendChild(container.firstChild);
})();
