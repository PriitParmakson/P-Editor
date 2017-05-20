/*
  Samatekstiredaktor (Editor for Palindromic Texts), Priit Parmakson, 2017. MIT Licence

  Käesolev fail on koopia (mitte tingimata ajakohane) Google-is hoitavast originaalfailist Code.gs

  Google Apps Script rakendus, mis teostab Google töölehele (Sheet) tekstide salvestamise ja sealt tekstide lugemise REST API kaudu.

 Teave
 -----
 * Google Apps Script
  - Web Apps: https://developers.google.com/apps-script/guides/web
  - teatmik: https://developers.google.com/apps-script/reference/spreadsheet/
 * Serving JSON from scripts - https://developers.google.com/apps-script/guides/content
 * Google töölehe kasutamine andmebaasina - Extending Google Sheets
   https://developers.google.com/apps-script/guides/sheets
 * Pöördumine töölehe poole skriptis - Spreadsheet service - allows scripts to create, access, and modify Google Sheets files. https://developers.google.com/apps-script/reference/spreadsheet/

 Google API Console
 ------------------
 Sheets API peab konsoolis sisse lülitama
 https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=project-id-1972906309436068154&duration=PT1H

*/


function doGet(e) {
  // Tagastab lehekülje p tekstid
  Logger.log('doGet e: ' + e.toString());
  var sheet = SpreadsheetApp.getActiveSheet();
  var koikTekstid = sheet.getDataRange().getValues();
  // Vt https://developers.google.com/apps-script/reference/spreadsheet/range#getValues()
  var tagastatavadTekstid = [];
  for (var i = 0; i < koikTekstid.length; i++) {
    tagastatavadTekstid.push({ Tekst: koikTekstid[i][0],
      Draft: koikTekstid[i][1] });
  } 
  var tagastatavKirje = { Tekstid: tagastatavadTekstid };
  return ContentService.createTextOutput(JSON.stringify(tagastatavKirje))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    Logger.log(e.toString());
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.insertRows(1); // Lisa algusse uus rida
    // var nextRow = sheet.getLastRow()+1; // get next row
    // Asenda <>, injection ründe vältimiseks
    var s = e.parameter['Tekst'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
    sheet.getRange(1, 1).setValue(s);
    if (e.parameter['Draft']) {
      sheet.getRange(1, 2).setValue(e.parameter['Draft']);
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
  