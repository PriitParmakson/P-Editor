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
  */
  try {
    Logger.log(e.toString());
    // Siia lisada ID tokeni kontroll
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.insertRows(1); // Lisa algusse uus rida
    // var nextRow = sheet.getLastRow()+1; // get next row
    // Asenda <>, injection ründe vältimiseks
    var s = e.parameter['Tekst'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
    sheet.getRange(1, 1).setValue(s);
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
  