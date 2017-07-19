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
      { nimetus: <string>,
        vaartus: <string> }
  Kui Meetrika esineb, siis väärtus kirjutatakse üle; kui 
  Meetrikat töölehel ei ole, siis lisatakse.
  */
  try {
    Logger.log(e.toString());
    // Siia lisada ID tokeni kontroll
    var nimetus = e.parameter['nimetus'];
    var vaartus = e.parameter['vaartus'];
    var sheet = SpreadsheetApp.getActiveSheet();
    var andmetabel = sheet.getDataRange().getValues();  
    var olemasolev = false;
    var leitudMRida;
    // Uus väärtus olemasolevale meetrikale?
    for (var i = 0; i < sheet.getLastRow(); i++) {
      if (andmetabel[i][0] == nimetus) {
        olemasolev = true;
        leitudMRida = i;
        break;
      }
    }
    if (olemasolev) {
      sheet.getRange(leitudMRida + 1, 2).setValue(vaartus);
    } else {
      var uusRida = sheet.getLastRow()+1; // get next row
      sheet.getRange(uusRida, 1).setValue(nimetus);
      sheet.getRange(uusRida, 2).setValue(vaartus);
    }  
      
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


