function teeAjatempel() {
  /*
    Tagastab ajatempli kujul 21.07.2017 16:47:22
  */  
// Create a date object with the current time
  var now = new Date();
// Create an array with the current month, day and time
  var date = [ now.getDate(), now.getMonth() + 1, now.getFullYear() ];
// If day and month are less than 10, add a zero
  if (date[0] < 10) {
    date[0] = '0' + date[0];
  }
  if (date[1] < 10) {
    date[1] = '0' + date[1];
  }
// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
// Return the formatted string
  return date.join(".") + " " + time.join(":");
}

function testT() {
  var logi = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logi");
  logi.getRange(2, 1).setValue(teeAjatempel());
}

// Tärgi või klahvi kindlakstegemise abifunktsioonid
function ladinaTaht(charCode) {
  // 97..122 (a..z) 65..90 (A..Z)
  return (
    (charCode >= 97 && charCode <= 122) || 
    (charCode >= 65 && charCode <= 90)
  )
}
function tapiTaht(charCode) {
  // õ ö ä ü 245 246 228 252
  // Õ Ö Ä Ü 213 214 196 220
  // š 353, Š 352
  // ž 382, Ž 381 
  return ([245, 246, 228, 252, 213, 214, 196,
    220, 353, 352, 382, 381].indexOf(charCode)
    != -1)
}
function veneTaht(charCode) {
  // 1024-1279
  return (charCode >= 1024 && charCode <= 1279)
}
function taht(charCode) {
  return ladinaTaht(charCode) || tapiTaht(charCode) || veneTaht(charCode)
}
function kirjavmKood(charCode) {
  // Kontrollib, kas charCode esitab lubatud 
  // kirjavahemärki
  // kaldkriips (reavahetuse tähis) 47, tühik 32  , 44  . 46  - 45  ! 33  ? 63
  // ( 40  ) 41  : 58  ; 59  " 34
  var p = [47, 32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34];
  var r = p.indexOf(charCode);
  return (r >= 0)
}
