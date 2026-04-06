/**
 * Sotah Daily — חישוב דף יומי למסכת סוטה
 * מבוסס על ספירת העומר: ט״ז ניסן (יום 1) = דף א׳ (שער), עד ה׳ סיוון (יום 49) = דף מ״ט
 */
var SotahDaily = (function(){
  var HEB = {1:'א',2:'ב',3:'ג',4:'ד',5:'ה',6:'ו',7:'ז',8:'ח',9:'ט',10:'י',
    11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט',20:'כ',
    21:'כא',22:'כב',23:'כג',24:'כד',25:'כה',26:'כו',27:'כז',28:'כח',29:'כט',30:'ל',
    31:'לא',32:'לב',33:'לג',34:'לד',35:'לה',36:'לו',37:'לז',38:'לח',39:'לט',40:'מ',
    41:'מא',42:'מב',43:'מג',44:'מד',45:'מה',46:'מו',47:'מז',48:'מח',49:'מט'};

  /**
   * Calculate today's daf based on Sefirat HaOmer.
   * 16 Nissan = day 1 = daf 1 (sha'ar)
   * 17 Nissan = day 2 = daf 2
   * ...
   * 5 Sivan = day 49 = daf 49
   *
   * Outside the Omer period, returns null.
   */
  function todaysDaf(tz){
    if(!window.HebrewDate) return null;
    var d = HebrewDate.today(tz);
    // Get Hebrew date components
    var heb = HebrewDate.convert(d.gYear, d.gMonth, d.gDay);
    var omerDay = getOmerDay(heb);
    if(omerDay === null) return null;
    return omerDay; // daf = omer day (1-49)
  }

  /**
   * Get the Omer day (1-49) from a Hebrew date, or null if outside Omer.
   * Omer: 16 Nissan through 5 Sivan
   * Nissan is month index 6 (non-leap) or 7 (leap) in our monthNames array,
   * but we use monthName for matching.
   */
  function getOmerDay(heb){
    var month = heb.monthName;
    var day = heb.day;

    if(month === 'ניסן'){
      if(day >= 16 && day <= 30) return day - 15; // 16->1, 30->15
      return null;
    }
    if(month === 'אייר'){
      return 15 + day; // 1->16, 29->44
    }
    if(month === 'סיוון'){
      if(day <= 5) return 44 + day; // 1->45, 5->49
      return null;
    }
    return null;
  }

  function todaysDafHeb(tz){
    var daf = todaysDaf(tz);
    return daf ? (HEB[daf] || '') : '';
  }

  function dafUrl(daf){
    if(daf < 2) return null; // daf 1 (sha'ar) has no page
    var n = daf < 10 ? '0' + daf : '' + daf;
    return 'sotah_daf_' + n + '.html';
  }

  function todaysDafUrl(tz){
    var daf = todaysDaf(tz);
    if(!daf) return null;
    return dafUrl(daf);
  }

  function dafForDate(gYear, gMonth, gDay){
    if(!window.HebrewDate) return null;
    var heb = HebrewDate.convert(gYear, gMonth, gDay);
    var omerDay = getOmerDay(heb);
    return omerDay;
  }

  return {
    todaysDaf: todaysDaf,
    todaysDafHeb: todaysDafHeb,
    todaysDafUrl: todaysDafUrl,
    dafForDate: dafForDate,
    dafUrl: dafUrl,
    getOmerDay: getOmerDay,
    HEB: HEB
  };
})();
