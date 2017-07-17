/* 
  Google Sheet tööleht hoiab meetrikate väärtusi
*/

function doGet(e) {
  /*
  Tagastab kõigi meetrikate väärtused
  */
  var sheet = SpreadsheetApp.getActiveSheet();
  var andmetabel = sheet.getDataRange().getValues();
  var meetrikateMassiiv = [];
  for (var i = 0; i < andmetabel.length; i++) {
    meetrikateMassiiv.push({
      Meetrika: andmetabel[i][0],
      Väärtus: andmetabel[i][1]
    });
  } 
  var tagastatavKirje = { Meetrikad: meetrikateMassiiv };
  return ContentService.createTextOutput(JSON.stringify(tagastatavKirje))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  /*
  Saadetakse objekt kujul:
      { Meetrika: <string>,
        Väärtus: <string>
      }
  Kui Meetrika esineb, siis väärtus kirjutatakse üle; kui 
  Meetrikat töölehel ei ole, siis lisatakse.
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



