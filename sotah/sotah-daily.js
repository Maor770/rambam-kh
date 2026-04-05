/**
 * Sotah Daily — חישוב דף יומי למסכת סוטה
 * מחזור: 48 ימים (דף ב עד דף מט)
 */
var SotahDaily = (function(){
  var HEB = {2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט',10:'י',
    11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט',20:'כ',
    21:'כא',22:'כב',23:'כג',24:'כד',25:'כה',26:'כו',27:'כז',28:'כח',29:'כט',30:'ל',
    31:'לא',32:'לב',33:'לג',34:'לד',35:'לה',36:'לו',37:'לז',38:'לח',39:'לט',40:'מ',
    41:'מא',42:'מב',43:'מג',44:'מד',45:'מה',46:'מו',47:'מז',48:'מח',49:'מט'};

  // Cycle start date: 1 Nissan 5785 = March 30, 2025
  var CYCLE_START = new Date(2025, 2, 30); // month is 0-indexed
  var CYCLE_LENGTH = 48; // daf 2 through 49

  function daysSince(start){
    var now = new Date();
    now.setHours(0,0,0,0);
    var s = new Date(start);
    s.setHours(0,0,0,0);
    return Math.floor((now - s) / 86400000);
  }

  function todaysDaf(){
    var days = daysSince(CYCLE_START);
    var daf = 2 + ((days % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    return daf;
  }

  function todaysDafHeb(){
    return HEB[todaysDaf()] || '';
  }

  function dafUrl(daf){
    var n = daf < 10 ? '0' + daf : '' + daf;
    return 'sotah_daf_' + n + '.html';
  }

  function todaysDafUrl(){
    return dafUrl(todaysDaf());
  }

  return {
    todaysDaf: todaysDaf,
    todaysDafHeb: todaysDafHeb,
    todaysDafUrl: todaysDafUrl,
    dafUrl: dafUrl,
    HEB: HEB
  };
})();
