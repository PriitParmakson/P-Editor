//
// Süntaksikontrollija: http://esprima.org/demo/validate.html

var t = "|"; // Tekst
var kuvaKeskelementYhekordselt = false;
var logiTekst = "";

function logi(str) {
  // Testimisel kasutatav logirida kuval
  $('#Logi').text(str);
} 

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

function kirjavmKood(charCode) {
  // Kontrollib, kas charCode esitab lubatud 
  // kirjavahemärki
  // tühik 32  , 44  . 46  - 45  ! 33  ? 63
  // ( 40  ) 41  : 58  ; 59  " 34
  var p = [32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34];
  var r = p.indexOf(charCode);
  return (r >= 0)
}

function kirjavm(char) {
  // Kontrollib, kas tärk on kirjavahemärk
  return (kirjavmKood(char.charCodeAt(0)))
}

function tahti(str) {
  // Tagastab tähtede arvu stringis. Ei arvesta punktuatsioone ja kursorijoont
  return str
    .split("")
    .filter(s => (! kirjavm(s)) && (s != "|"))
    .length;
}

function markeeriTekst() {
  // Tagastab markeeritud keskkohaga teksti
  var acc = ""; // Tagastatav tekst, lisatud markeering

  if ((tahti(t) < 4)) {
    return t
  }

  var p = tahti(t) / 2; 
  var taheloendur = 0;

  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon või kursorijoon
    if (kirjavm(t[i]) || t[i] == "|") {
      acc = acc + t[i];
    }
    // Täht
    else {
      taheloendur++;
      // Esimene keskelement markeerida
      if (taheloendur == p) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Teine keskelement...
      else if (taheloendur == p + 1) {
        if (kuvaKeskelementYhekordselt) {
          // ...mitte kuvada
        }
        else {
          // ...kuvada ja markeerida
          acc = acc + "<span class='kesk'>" + 
            t[i] + "</span>";
        }
      }
      // Kuvada tavaliselt
      else {
        acc = acc + t[i];
      }
    }
  }
  return acc
}

function kuvaTekst() {
  var mTekst = markeeriTekst();
  // console.log('Markeeritud tekst: ', mTekst);
  $('#Tekst').html(mTekst);
}

function suurtaheks() {
  // Kursori järel olev täht muudatakse suurtäheks
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return
  }
  var s = tekstParast[0].toUpperCase();
  t = tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
  kuvaTekst();
}

function vaiketaheks() {
  // Kursori järel olev täht muudatakse vaiketäheks
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return
  }
  var s = tekstParast[0].toLowerCase();
  t = tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
  kuvaTekst();
}

function tootleEriklahv(keyCode) {
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  function tootleLeft() {
    if (keyCode == 37) { // Left
      if (tekstEnne.length == 0) {
        return
      }
      t = tekstEnne.substring(0, tekstEnne.length - 1) + "|" +
        tekstEnne.substring(tekstEnne.length - 1, tekstEnne.length) +
        tekstParast;
      kuvaTekst();
      return
    }
  }

  function tootleRight() {
    if (keyCode == 39) { // Right
      // Lõpus mõju ei ole
      if (tekstParast.length == 0) {
        return
      }
      t = tekstEnne + tekstParast.substring(0, 1) + "|" + 
        tekstParast.substring(1, tekstParast.length);
      kuvaTekst();
      return
    }
  }

  function tootleBackspace() {

    // Teksti alguses mõju ei ole
    if (tE == 0) {
      return
    }
    // Eemaldatav täht või punktuatsioon
    var e = tekstEnne.substring(tekstEnne.length - 1, tekstEnne.length);
    // Punktuatsioon lihtsalt eemaldada
    if (kirjavm(e)) {
      t = tekstEnne.substring(0, tekstEnne.length - 1) + "|" + tekstParast;
    }
    // Eemaldan tähe tE koos selle peegeltähega
    else {
      // Läbin kogu teksti
      for (var i = 0; i < t.length; i++) {
        if (kirjavm(t[i]) || t[i] == "|") {
          acc = acc + t[i];
        }
        else {
          taheloendur++;
          if (taheloendur == tE ||
              taheloendur == tP + 1) {
            // Jätta vahele
          }
          else {
            acc = acc + t[i];
          }
        }
      }
      t = acc;
    }
    kuvaTekst();
  }

  function tootleDelete() {

    // Teksti lõpus mõju ei ole
    if (tP == 0) {
      return
    }
    // Eemaldatav täht või punktuatsioon
    var e = tekstParast[0];
    // Punktuatsioon lihtsalt eemaldada
    if (kirjavm(e)) {
      t = tekstEnne + "|"  + tekstParast.substring(1, tekstParast.length);
    }
    // Eemaldan tähe tE + 1 koos selle peegeltähega
    else {
      // Läbin kogu teksti
      for (var i = 0; i < t.length; i++) {
        if (kirjavm(t[i]) || t[i] == "|") {
          acc = acc + t[i];
        }
        else {
          taheloendur++;
          if (taheloendur == tE + 1 ||
              taheloendur == tP) {
            // Jätta vahele
          }
          else {
            acc = acc + t[i];
          }
        }
      }
      t = acc;
    }
    kuvaTekst();
  }

  // Selektor
  if (keyCode == 37) { // Left
    tootleLeft();
    return
  }
  if (keyCode == 39) { // Right
    tootleRight();
    return
  }
  if (keyCode == 8) { // Backspace
    tootleBackspace();
    return
  }
  if (keyCode == 46) { // Delete
    tootleDelete();
    return
  }
  if (keyCode == 33) { // PgUp
    kuvaKeskelementYhekordselt = true;
    kuvaTekst();
  }
  if (keyCode == 34) { // PgDn
    kuvaKeskelementYhekordselt = false;
    kuvaTekst();
  }
  if (keyCode == 38) { // Up
    suurtaheks();
  }
  if (keyCode == 40) { // Down
    vaiketaheks();
  } 
}

function lisaTahtVoiPunktuatsioon(chrCode) {
  var chrTyped = String.fromCharCode(chrCode);
  // console.log("chrTyped: ", chrTyped);
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  // Kontrollib, kas märgikood on lubatute hulgas
  if  (!
        (ladinaTaht(chrCode) || tapiTaht(chrCode) ||
         veneTaht || kirjavmKood(chrCode)
        )
      ) {
    return
  }

  if (kirjavmKood(chrCode)) {
    t = tekstEnne + chrTyped + "|" + tekstParast;
  }
  // Tähe puhul lisada ka peegeltäht
  else if (tE == tP) {
    // Lisa peegelsümbol kohe joone taha
    t = tekstEnne + chrTyped + "|" + chrTyped + tekstParast;
  }
  else if (tE < tP) {
    // Lisa peegeltäht tekstParast-sse
    // tähe tP - tE järele
    // console.log('tE, tP: ', tE, tP);
    for (var i = 0; i < tekstParast.length; i++) {
      acc = acc + tekstParast[i];
      // Kui on täht..
      if (! kirjavm(tekstParast[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP - tE) {
          acc = acc + chrTyped;
        }
      }
    }
    t = tekstEnne + chrTyped + "|" + acc;
  }
  else if (tE > tP) {
    // Lisa peegeltäht tekstEnne-sse tähe tP + 1 ette
    for (var i = 0; i < tekstEnne.length; i++) {
      // Kui on täht..
      if (! kirjavm(tekstEnne[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP + 1) {
          acc = acc + chrTyped;
        }
      }
      acc = acc + tekstEnne[i];
    }
    t = acc + chrTyped + "|" + tekstParast;
  }

  // console.log('Tekst: ', t);
  kuvaTekst();
} 

function lisaTekstLogisse() {
  // Eemalda kursorijoon ja kesktähe peegeltäht
  var peegeltaheNr = tahti(t) / 2 + 1;
  var taheloendur = 0;
  var c = '';
  for (var i = 0; i < t.length; i++) {
    if (kirjavm(t[i])) {
      c = c + t[i];
    }
    else if (t[i] == "|") {
      // Jäta vahele
    }
    else {
      taheloendur++;
      // Jäta peegeltäht vahele?
      if (kuvaKeskelementYhekordselt) {
        if (taheloendur != peegeltaheNr) {
          c = c + t[i];
        }
      }
      else {
        c = c + t[i];
      }
    }
  }
  logiTekst = c + '<br>' + logiTekst;
  $('#Logi').html(logiTekst);
}

function vahetaPooled() {
  var p = tahti(t) / 2;
  if (p < 2) {
    return
  }
  var taheloendur = 0;
  var esimesePooleLopp;
  // Leia keskkoht
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon kanna üle
    if (! (kirjavm(t[i]) || t[i] == "|") ) {
      taheloendur++;
      if (taheloendur == p) {
        esimesePooleLopp = i;
        break;
      }
    }
  }
  var a = t.substring(0, i + 1);
  var b = t.substring(i + 1, t.length);
  t = b + a;
  kuvaKeskelementYhekordselt = false;
  kuvaTekst();
}

function keypressHandler(e) {
  var evt = e ? e : event;
  var charCode = evt.charCode;
  var keyCode = evt.keyCode;

  if (charCode != null && charCode != 0) {
    // Sisestatud täht
    console.log(charCode);
    lisaTahtVoiPunktuatsioon(charCode);
  }
  else if (evt.keyCode != null) {
    // Vajutatud eriklahv
    tootleEriklahv(keyCode);
  }
  
}

function alusta() {
  // Valmis teksti logimine - käsitleja
  $('#Loginupp').click(function() {
    $(this).blur();
    lisaTekstLogisse();
  });

  $('#Poolednupp').click(function() {
    $(this).blur();
    vahetaPooled();
  });

  $('#Uusnupp').click(function() {
    $(this).blur();
    t = "|";
    kuvaKeskelementYhekordselt = false;
    logiTekst = "";
    kuvaTekst();

  });

  $('#Infonupp').click(function() {
    $('#Infopaan').toggle();
  });

  $('#0').click(function() {
    $('#t0').toggle();
  });

  $('#1').click(function() {
    $('#t1').toggle();
  });

  $('#2').click(function() {
    $('#t2').toggle();
  });

  $('#3').click(function() {
    $('#t3').toggle();
  });

  // Tekstisisestuse käsitleja
  document.onkeypress=keypressHandler;
  $('#Tekst').text(t);
}
