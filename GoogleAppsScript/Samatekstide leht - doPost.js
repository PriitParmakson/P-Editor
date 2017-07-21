/* Vt:
  Google Sheet töölehte kasutatakse samatekstide andmebaasina.
  Iga kirje tabeli eraldi reas, struktuuriga:
       (1)     (2)       (3)          (4)
     Tekst   Draft?  Autori nimi  Autori e-post
     
     Google Apps Script utiliidid vt:
     https://developers.google.com/apps-script/reference/utilities/utilities   
*/

function byteArrayToString(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  var bA = Utilities.base64Decode(base64);
  var s = byteArrayToString(bA);
  return JSON.parse(s);
};

function valideeriToken(IDToken) {
  /* Siia lisada ID tokeni kontroll
    tokeninfo endpoint-i kasutades, vt
    https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
    ja kasutades Google Apps Script URL Fetch teenust, vt
    https://developers.google.com/apps-script/reference/url-fetch/      
  */
  var u = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' +
    IDToken;
  var options = { muteHttpExceptions: true };
  var response = UrlFetchApp.fetch(u, options);
  return response;
}

function test() {
  console.log('Test. ID tokeni valideerimispäring');
  var IDToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVjMjk5YzFhZWI3MGE4YzdiZmVjMDRjNGUxNmUwODAyMDE3ZTA2MDYifQ.eyJhenAiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1ODEyOTQ4NDQwMTc2MTY3MzEiLCJoZCI6InRsdS5lZSIsImVtYWlsIjoicHJpaXRwQHRsdS5lZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiODFXOHpCLUlBNF9qLVgwSGdzbkh6USIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MDA2NDE5MjYsImV4cCI6MTUwMDY0NTUyNiwibmFtZSI6IlByaWl0IFBhcm1ha3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLXV4ekJWRnlQc3hNL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FJNnlHWHhNRUU4Q3VkOGV3bUVlNU5ZYjZHZkQtS0VrM0Evczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlByaWl0IiwiZmFtaWx5X25hbWUiOiJQYXJtYWtzb24ifQ.JoL42MM23RIPcKW6Crf1l-mv6gWmFVV8Ed11S9L7s4AMiH2XXXrkcOuaFHOs6K_tJcPUOktWsBmP081KFRIg2p_HsB34HadQ7OaZrHxzK5A8dBeBKqfVXLd8KC7ybvzWRedJTgbF6WJcY_HNxXE7zYCUdDPcwew42uwETjrXD0sR6HRWII-HfA0hixSnayvPIoxng5EcLSwRnXdEm9J-NazC4dANZFdkoW0Fm7y7a-ITWh6IL78C7X9KzuDhV3wIqeyFV9xAb6RyF50cAkbnSCgIDsXqTkRfT5iNy0t17DsFS7gdukW14lKj7HuaRND8NUOH2a7eWKe8lsKROTBP_g';
  var valideerimisvastus = valideeriToken(IDToken);
  var logi = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logi");
  logi.getRange(2, 1).setValue(valideerimisvastus);
  var v = JSON.parse(valideerimisvastus);
  logi.getRange(3, 1).setValue(v.name);
}

function doPost(e) {
  /*
  Saadetakse objekt kujul:
      { Tekst: <string>,
        Draft: <boolean>,
        IDToken: <string>
      }
  Salvestatakse neli esimest.
  Murdskriptimise vältimiseks saadetud tekst puhastatakse.
  */

  try {
    /* Logimine eraldi lehel: Logi */
    var logi = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logi");
    logi.insertRows(1); // Lisa algusse uus rida
    logi.getRange(1, 1).setValue(teeAjatempel());
    
    /* ID tokeni valideerimine */
    var IDToken = e.parameter['IDToken'];
    logi.getRange(1, 1).setValue(IDToken);
    var valideerimisvastus = valideeriToken(IDToken);
    var v = JSON.parse(valideerimisvastus);
    logi.getRange(1, 2).setValue(JSON.stringify(v.name));
    logi.getRange(1, 3).setValue(JSON.stringify(v.email));
    /* Kontrolli audience */
    const CLIENT_ID = '554561859935-1ojca8mj94fa41mebnjnhqvt83t4gdfj.apps.googleusercontent.com';
    if (v.aud !== CLIENT_ID) {
      logi.getRange(1, 4).setValue('aud NOT OK');
      return ContentService
        .createTextOutput(JSON.stringify({"result":"error",
        "error": 'aud NOT OK'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      logi.getRange(1, 4).setValue('aud OK');
    }
    
    /* Siia saab lisada kontrolli salvestamisõiguse kohta */
    var sheet = SpreadsheetApp.getActiveSheet();        
    var payload = parseJwt(IDToken);
    var autoriNimi = payload.name;
    var autoriEpost = payload.email;    
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
    sheet.getRange(1, 3).setValue(autoriNimi);    
    sheet.getRange(1, 4).setValue(autoriEpost);    
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

