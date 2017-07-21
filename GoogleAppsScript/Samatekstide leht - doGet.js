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

