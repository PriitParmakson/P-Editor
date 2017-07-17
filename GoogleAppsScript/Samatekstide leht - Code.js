/* Vt:
  Google Sheet töölehte kasutatakse samatekstide andmebaasina.
  Iga kirje tabeli eraldi reas, struktuuriga:
       (1)     (2)       (3)          (4)
     Tekst   Draft?  Autori nimi  Autori e-post
*/

function doGet(e) {
  /*
  Tagastab kõik tekstid.
  Iga tekst on kujul:
      { Tekst: <string>,
        Draft: <boolean>,
        Nimi: <string>      }
  */
  Logger.log('doGet e: ' + e.toString());
  var sheet = SpreadsheetApp.getActiveSheet();
  var koikTekstid = sheet.getDataRange().getValues();
  // Vt https://developers.google.com/apps-script/reference/spreadsheet/range#getValues()
  var tagastatavadTekstid = [];
  for (var i = 0; i < koikTekstid.length; i++) {
    tagastatavadTekstid.push({
      Tekst: koikTekstid[i][0],
      Draft: koikTekstid[i][1],
      Nimi: koikTekstid[i][2]
    });
  } 
  var tagastatavKirje = { Tekstid: tagastatavadTekstid };
  return ContentService.createTextOutput(JSON.stringify(tagastatavKirje))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  /*
  Saadetakse objekt kujul:
      { Tekst: <string>,
        Draft: <boolean>,
        Nimi: <string>,
        EPost: <string>,
        IDToken: <string>
      }
  Salvestatakse neli esimest.
  Murdskriptimise vältimiseks saadetud tekst puhastatakse.
  */
  try {
    Logger.log(e.toString());
    // Siia lisada ID tokeni kontroll
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.insertRows(1); // Lisa algusse uus rida
    // var nextRow = sheet.getLastRow()+1; // get next row
    // Puhasta saadetud tekst
    var s = e.parameter['Tekst'];
    var p = ''; // Puhastatud tekst
    for (var i = 0; i < s.length; i++) {
      if (taht(s.charCodeAt(i)) || kirjavmKood(s.charCodeAt(i))) {
        p += s[i];
      }
    }
    sheet.getRange(1, 1).setValue(p);
    if (e.parameter['Draft']) {
      sheet.getRange(1, 2).setValue(e.parameter['Draft']);
    }
    sheet.getRange(1, 3).setValue(e.parameter['Nimi']);    
    sheet.getRange(1, 4).setValue(e.parameter['EPost']);    
    return ContentService // Return json success results
      .createTextOutput(
      JSON.stringify({ "result":"success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) { // if error return this
    Logger.log(error);
    return ContentService
      .createTextOutput(JSON.stringify({"result":"error", "error": e}))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
