/* HebrewDate — Gregorian-to-Hebrew date converter
   Full Hebrew calendar algorithm with molad and dechiyot. */
window.HebrewDate = (function(){

  /* ---- Constants ---- */
  var CHALAKIM_PER_HOUR = 1080;
  var CHALAKIM_PER_DAY = 24 * CHALAKIM_PER_HOUR;       // 25920
  var CHALAKIM_PER_MONTH = 29 * CHALAKIM_PER_DAY + 12 * CHALAKIM_PER_HOUR + 793;
  // = 765433 chalakim (29d 12h 793ch)
  var CHALAKIM_PER_CYCLE = 235 * CHALAKIM_PER_MONTH;    // 19-year cycle

  // Molad of year 1 (BaHaRaD): Monday 5h 204ch = day 2, 5h, 204ch
  var MOLAD_EPOCH_DAY = 1;  // Monday = day 2 but we count from 0 for JD alignment
  var MOLAD_EPOCH_CHALAKIM = 5 * CHALAKIM_PER_HOUR + 204; // 5h 204ch

  // Hebrew month names
  var MONTHS = [
    'תשרי','חשוון','כסלו','טבת','שבט','אדר',
    'אדר א׳','אדר ב׳','ניסן','אייר','סיוון',
    'תמוז','אב','אלול'
  ];

  var GREG_MONTHS_HE = [
    'בינואר','בפברואר','במרץ','באפריל','במאי','ביוני',
    'ביולי','באוגוסט','בספטמבר','באוקטובר','בנובמבר','בדצמבר'
  ];

  /* ---- Leap year ---- */
  function isLeapYear(hy){
    return [3,6,8,11,14,17,19].indexOf(((hy - 1) % 19) + 1) !== -1;
  }

  /* ---- Number of months in a Hebrew year ---- */
  function monthsInYear(hy){
    return isLeapYear(hy) ? 13 : 12;
  }

  /* ---- Chalakim from epoch to start of Hebrew month count ---- */
  // Number of months elapsed from year 1 Tishrei to year hy Tishrei
  function monthsElapsed(hy){
    var cycles = Math.floor((hy - 1) / 19);
    var rem = ((hy - 1) % 19);
    var months = cycles * 235;
    // count leap months in remainder
    months += Math.floor((rem * 235 + 1) / 19);
    return months;
  }

  /* ---- Molad of Tishrei for Hebrew year hy ---- */
  // Returns total chalakim from reference epoch
  function moladTishrei(hy){
    var m = monthsElapsed(hy);
    var totalCh = MOLAD_EPOCH_CHALAKIM + m * CHALAKIM_PER_MONTH;
    return totalCh;
  }

  /* ---- Convert chalakim to day/hour/chalakim components ---- */
  function chalakimToComponents(ch){
    var days = Math.floor(ch / CHALAKIM_PER_DAY);
    var rem = ch - days * CHALAKIM_PER_DAY;
    var hours = Math.floor(rem / CHALAKIM_PER_HOUR);
    var parts = rem - hours * CHALAKIM_PER_HOUR;
    return { days: days, hours: hours, parts: parts };
  }

  /* ---- Day of week from chalakim (Sunday=0 .. Saturday=6) ---- */
  function dayOfWeek(totalCh){
    var comp = chalakimToComponents(totalCh);
    // Epoch day 1 = Monday (day 2). Days count from Sunday=0.
    return (comp.days + 1) % 7;  // +1 because epoch is Monday
  }

  /* ---- Apply Dechiyot (postponement rules) ---- */
  // Returns the day number (from epoch) of 1 Tishrei for Hebrew year hy
  function roshHashana(hy){
    var molad = moladTishrei(hy);
    var comp = chalakimToComponents(molad);
    var day = comp.days;
    var dow = (day + 1) % 7;  // day of week: 0=Sun...6=Sat. Epoch day=Monday
    var hours = comp.hours;
    var parts = comp.parts;

    // Dechiya 1: Lo ADU Rosh — if molad falls on Sun(0), Wed(3), or Fri(5), postpone
    // Dechiya 2: Molad Zaken — if molad is at or after 18h (noon), postpone
    var postpone = 0;

    // Molad Zaken: molad >= 18h (i.e., noon of the day, since hours count from 6pm)
    if(hours >= 18){
      postpone = 1;
    }

    // Apply first postponement
    day += postpone;
    dow = (day + 1) % 7;

    // Lo ADU: 1 Tishrei cannot fall on Sunday, Wednesday, or Friday
    if(dow === 0 || dow === 3 || dow === 5){
      day += 1;
      dow = (day + 1) % 7;
    }

    // Dechiya GaTRaD: In a non-leap year, if molad falls on Tuesday (dow=2)
    // at or after 9h 204ch, postpone to Thursday
    if(!postpone){
      var origDow = ((comp.days + 1) % 7);
      if(origDow === 2 && !isLeapYear(hy)){
        if(hours > 9 || (hours === 9 && parts >= 204)){
          // Molad is Tue >= 9h204ch in non-leap: postpone
          // Reset to original and add 2 to get Thursday
          day = comp.days + 2;
          dow = (day + 1) % 7;
        }
      }
    }

    // Dechiya BTU-TKPT: If in year FOLLOWING a leap year, molad falls on Monday (dow=1)
    // at or after 15h 589ch, postpone to Tuesday
    if(!postpone){
      var origDow2 = ((comp.days + 1) % 7);
      if(origDow2 === 1 && isLeapYear(hy - 1)){
        if(hours > 15 || (hours === 15 && parts >= 589)){
          day = comp.days + 1;
          dow = (day + 1) % 7;
        }
      }
    }

    // Final Lo ADU check after GaTRaD/BTU-TKPT
    dow = (day + 1) % 7;
    if(dow === 0 || dow === 3 || dow === 5){
      day += 1;
    }

    return day;
  }

  /* ---- Year length in days ---- */
  function yearLength(hy){
    return roshHashana(hy + 1) - roshHashana(hy);
  }

  /* ---- Year type: deficient(353/383), regular(354/384), full(355/385) ---- */
  function yearType(hy){
    var len = yearLength(hy);
    var base = isLeapYear(hy) ? 383 : 353;
    return len - base; // 0=deficient, 1=regular, 2=full
  }

  /* ---- Month lengths for a given Hebrew year ---- */
  function monthLengths(hy){
    var type = yearType(hy);
    var leap = isLeapYear(hy);
    // Tishrei(30), Cheshvan(29/30), Kislev(30/29), Tevet(29), Shevat(30)
    // Then Adar or Adar-I/Adar-II, Nisan(30), Iyyar(29), Sivan(30),
    // Tammuz(29), Av(30), Elul(29)
    var cheshvan = (type === 2) ? 30 : 29;  // full year: 30
    var kislev = (type === 0) ? 29 : 30;    // deficient year: 29

    var months = [30, cheshvan, kislev, 29, 30];

    if(leap){
      months.push(30); // Adar I
      months.push(29); // Adar II
    } else {
      months.push(29); // Adar
    }

    months.push(30, 29, 30, 29, 30, 29); // Nisan..Elul

    return months;
  }

  /* ---- Month names for a given year ---- */
  function monthNames(hy){
    if(isLeapYear(hy)){
      return ['תשרי','חשוון','כסלו','טבת','שבט','אדר א׳','אדר ב׳',
              'ניסן','אייר','סיוון','תמוז','אב','אלול'];
    }
    return ['תשרי','חשוון','כסלו','טבת','שבט','אדר',
            'ניסן','אייר','סיוון','תמוז','אב','אלול'];
  }

  /* ---- Julian Day Number from Gregorian date ---- */
  function gregorianToJD(year, month, day){
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y +
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  /* ---- JD of Hebrew epoch (1 Tishrei year 1) ---- */
  // The Hebrew epoch in Julian Day is approximately JD 347997
  // More precisely: 1 Tishrei 1 AM corresponds to October 7, 3761 BCE (proleptic Gregorian)
  // which is JD 347997.
  var HEBREW_EPOCH_JD = 347997;

  /* ---- Convert Hebrew year's Rosh Hashana to JD ---- */
  function roshHashanaJD(hy){
    return HEBREW_EPOCH_JD + roshHashana(hy);
  }

  /* ---- Gregorian to Hebrew ---- */
  function gregorianToHebrew(gyear, gmonth, gday){
    var jd = gregorianToJD(gyear, gmonth, gday);

    // Estimate Hebrew year
    var hy = gyear + 3761;
    // Adjust: if we're before Tishrei, might be previous year
    while(roshHashanaJD(hy + 1) <= jd){
      hy++;
    }
    while(roshHashanaJD(hy) > jd){
      hy--;
    }

    var dayInYear = jd - roshHashanaJD(hy);
    var lengths = monthLengths(hy);
    var names = monthNames(hy);

    var hmonth = 0;
    var remaining = dayInYear;
    for(var i = 0; i < lengths.length; i++){
      if(remaining < lengths[i]){
        hmonth = i;
        break;
      }
      remaining -= lengths[i];
    }

    var hday = remaining + 1;
    return { year: hy, month: hmonth, day: hday, monthName: names[hmonth] };
  }

  /* ---- Format Hebrew number (gematria) ---- */
  function hebrewNumeral(n){
    if(n <= 0) return '';
    var ones  = ['','א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳','ט׳'];
    var tens  = ['','י','כ','ל','מ','נ','ס','ע','פ','צ'];
    var hunds = ['','ק','ר','ש','ת','תק','תר','תש','תת','תתק'];

    // Special cases for 15 and 16
    if(n === 15) return 'ט״ו';
    if(n === 16) return 'ט״ז';

    if(n < 10) return ones[n].replace('׳','').replace('׳','') + '׳';

    var result = '';
    if(n >= 100){
      result += hunds[Math.floor(n / 100)];
      n = n % 100;
    }
    if(n >= 10){
      result += tens[Math.floor(n / 10)];
      n = n % 10;
    }
    // Special: 15 and 16 are handled above for full numbers,
    // but we also need to handle tens+ones for day formatting
    var onesStr = ['','א','ב','ג','ד','ה','ו','ז','ח','ט'];
    if(n > 0){
      result += onesStr[n];
    }

    // Insert gershayim before last letter
    if(result.length > 1){
      result = result.slice(0, -1) + '״' + result.slice(-1);
    } else {
      result = result + '׳';
    }

    return result;
  }

  /* ---- Format Hebrew year ---- */
  function hebrewYear(hy){
    // Drop the thousands: 5786 -> 786
    var short = hy % 1000;
    var thousands = Math.floor(hy / 1000);
    var thousandsStr = ['','א','ב','ג','ד','ה','ו'][thousands] || '';

    var result = thousandsStr + '׳';
    // Now format the hundreds+tens+ones
    var n = short;
    var hunds = ['','ק','ר','ש','ת','תק','תר','תש','תת','תתק'];
    var tens  = ['','י','כ','ל','מ','נ','ס','ע','פ','צ'];
    var onesStr = ['','א','ב','ג','ד','ה','ו','ז','ח','ט'];

    var str = '';
    if(n >= 100){
      str += hunds[Math.floor(n / 100)];
      n = n % 100;
    }
    if(n === 15){ str += 'טו'; n = 0; }
    else if(n === 16){ str += 'טז'; n = 0; }
    else {
      if(n >= 10){
        str += tens[Math.floor(n / 10)];
        n = n % 10;
      }
      if(n > 0){
        str += onesStr[n];
      }
    }

    // Insert gershayim before last char
    if(str.length > 1){
      str = str.slice(0, -1) + '״' + str.slice(-1);
    } else if(str.length === 1){
      str = str + '׳';
    }

    return result + str;
  }

  /* ---- Format day numeral ---- */
  function hebrewDay(d){
    return hebrewNumeral(d);
  }

  /* ---- Public API ---- */
  function today(){
    var now = new Date();
    var gy = now.getFullYear();
    var gm = now.getMonth() + 1;
    var gd = now.getDate();

    var heb = gregorianToHebrew(gy, gm, gd);
    var hebrewStr = hebrewDay(heb.day) + ' ' + heb.monthName + ' ' + hebrewYear(heb.year);
    var gregStr = gd + ' ' + GREG_MONTHS_HE[gm - 1] + ' ' + gy;

    return { hebrew: hebrewStr, gregorian: gregStr };
  }

  return {
    today: today,
    convert: gregorianToHebrew,
    formatDay: hebrewDay,
    formatYear: hebrewYear
  };

})();
