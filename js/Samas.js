/*
  Samatekstiredaktor (Editor for Palindromic Texts), Priit Parmakson, 2017. MIT Licence

*/

var logimistase = 0; 

// Globaalsed muutujad
var t = '|'; // Tekst
var kuvaKesktahtYhekordselt = false;
var tekstid; // Hoiab kõiki alla laetud tekste
var jLk = 1; // Jooksva lehekülje nr
var tLk = 20; // Tekste leheküljel
var dialoogiseisund = 'N'; // 'S' - salvestusdialoogis

// Teksti eritoimingute modaalsuse funktsioonid
function aktiveeriTekstinupud() {
  // Aktiveeri tekstitöötlusnupud, kuid mitte neid, mis
  // tühiteksti puhul ei oma mõtet
  if (t.length == 1) {
    $('#Poolednupp').addClass('disabled');
    $('#Uusnupp').addClass('disabled');
    $('#Salvesta1').addClass('disabled');
  } 
  else {
    $('#Poolednupp').removeClass('disabled');
    $('#Uusnupp').removeClass('disabled');
    $('#Salvesta1').removeClass('disabled');
  }
  // Ei puutu Infonuppu
}
function deaktiveeriTekstinupud() {
  $('#Poolednupp').addClass('disabled');
  $('#Uusnupp').addClass('disabled');
  $('#Salvesta1').addClass('disabled');
  // Ei puutu Infonuppu
}

// Teksti kuvamise funktsioonid
function kuvaTekst() {
  // Markeerib ja kuvab teksti, seab caret ja väljastab silumiseks vastava teate konsoolile.
  var mTekst = markeeriTekst();
  $('#Tekst').html(mTekst);
  var caretSeadmiseTeade = seaCaret(t.indexOf('|'));
  // Standardne logimine
  console.log('Programm: ' + moodustaTekstiStruktuurKonsoolile() + caretSeadmiseTeade);
}
function seaCaret(pos) {
  /* Seab kursori (caret) kuvatud tekstis. Tagastab vastava logiteate.
  - Positsioonid on nummerdatud 0-st. 0-positsioon on enne esimest tähte.
  - Arvestada, et pos ei arvesta, et kesktäht võib olla ühekordselt.
  */

  // Leia span element ja positsioon selle tekstis, kuhu caret panna
  var tipuIDd = ['A', 'K1', 'Kt', 'K2', 'B']; 
  var kumPikkus = 0;
  var otsitavTipp;
  var posTipus;
  for (var i = 0; i < tipuIDd.length; i++) {
    var tipuPikkus = $('#' + tipuIDd[i]).html().length;
    if (pos <= kumPikkus + tipuPikkus) {
      otsitavTipp = tipuIDd[i];
      posTipus = pos - kumPikkus;
      break 
    }
    kumPikkus = kumPikkus + tipuPikkus;
    if (tipuIDd[i] == 'K2' && tipuPikkus == 0) {
      kumPikkus += 1;
    }
  }

  // Sea caret
  var range = document.createRange();
  var el = document.getElementById(otsitavTipp);
  range.setStart(el.childNodes[0], posTipus);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);

  return ' caret: ' + otsitavTipp + ', ' + posTipus;
}

// Teksti redigeerimisega seotud funktsioonid
function tuvastaCaretJaSeaSisekursor() {
    // Selgita välja caret positsioon, sest kasutaja võib olnud seda muutnud, sea vastavalt sisemine kursor ja tagasta vastav teade.

    // Tühja teksti puhul ei oma mõtet.
    // Arvesta ka, et tühja teksti puhul on esimeses span-elemendis 0-pikkusega tühik (et hoida div-elemendi mõõtmeid).
    if (t.length == 1) {
      return '(tühitekst)'
    }

    // Leia span element, kus valik algab ja valiku alguspositsioon selles elemendis
    var r = document.getSelection().getRangeAt(0);
    var algusSpan = r.startContainer.parentNode.id;
    var algusPos = r.startOffset;
    console.log(algusSpan.toString() + ':' + algusPos.toString());

    // Leia positsioon, kuhu sisemine kursor (|) liigutada.
    var tipuIDd = ['A', 'K1', 'Kt', 'K2', 'B']; 
    var kum = 0; // Kumulatiivne positsioon
    for (var i = 0; i < tipuIDd.length; i++) {
      if (tipuIDd[i] == algusSpan) {
        kum += algusPos;
        break 
      } 
      else {
        kum += $('#' + tipuIDd[i]).text().length;
      }
    }
    if (algusSpan == 'B' && kuvaKesktahtYhekordselt) {
      kum += 1; // Sest siseesituses on keskelement alati kahekordselt
    }
    // Aseta sisemine kursor positsioonile kum
    t = t.replace('|', '');
    if (kum == 0) {
      t = '|' + t;
    }
    else {
      t = t.replace(new RegExp('.{' + kum + '}'), '$&' + '|');
    }
    var teade = 'Tuvastatud caret (' + algusSpan + ',' + algusPos + '), seatud sisekursor: ' + t;
    return teade
}
function tootleEriklahv(keyCode) {

  var teade = tuvastaCaretJaSeaSisekursor();
  // Standardne logimine
  console.log('Kasutaja: ' + keyCodeToHumanReadable(keyCode) + ' - ' + teade);

  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

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
    aktiveeriTekstinupud(); // Kas see on vajalik? Ja kui tekkis tühitekst?
    t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
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
    aktiveeriTekstinupud();
    t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
    kuvaTekst();
  }

  switch (keyCode) {
    case 8: // Backspace
      tootleBackspace();
      return
    case 46: // Delete
      tootleDelete();
      return
    case 33: // PgUp
      kuvaKesktahtYhekordselt = true;
      kuvaTekst();
      return
    case 34: // PgDn
      kuvaKesktahtYhekordselt = false;
      kuvaTekst();
      return
    case 38: // Up
      suurtaheks();
      return
    case 40: // Down
      vaiketaheks();
      return
  }
}
function lisaTahtVoiPunktuatsioon(charCode) {
  // Lisa kasutaja sisestatud täht või kirjavahemärk
  // Kontrollib, kas märgikood on lubatute hulgas
  if  (!
        (ladinaTaht(charCode) || tapiTaht(charCode) ||
         veneTaht(charCode) || kirjavmKood(charCode)
        )
      ) {
    return
  }

  var teade = tuvastaCaretJaSeaSisekursor();

  // Enter vajutus asenda siseesituses tärgiga ⏎.
  var charTyped = charCode == 13 ? '⏎' : String.fromCharCode(charCode);

  // Standardne logimine
  console.log('Kasutaja: ' + charTyped + ' ' + teade);

  // Sisestatud tärgi lisamine siseesitusse
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  // Mitut tühikut järjest mitte lubada, sest nende kuvamine vajaks teistsugust lahendust
  if (charCode == 32 && tE > 0 && tekstEnne.charCodeAt(tekstEnne.length - 1) == 32) {
    return
  }

  if (kirjavmKood(charCode)) {
    t = tekstEnne + charTyped + "|" + tekstParast;
  }
  // Tähe puhul lisada ka peegeltäht
  else if (tE == tP) {
    // Lisa peegelsümbol kohe joone taha
    t = tekstEnne + charTyped + "|" + charTyped + tekstParast;
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
          acc = acc + charTyped;
        }
      }
    }
    t = tekstEnne + charTyped + "|" + acc;
  }
  else if (tE > tP) {
    // Lisa peegeltäht tekstEnne-sse tähe tP + 1 ette
    for (var i = 0; i < tekstEnne.length; i++) {
      // Kui on täht..
      if (! kirjavm(tekstEnne[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP + 1) {
          acc = acc + charTyped;
        }
      }
      acc = acc + tekstEnne[i];
    }
    t = acc + charTyped + "|" + tekstParast;
  }

  aktiveeriTekstinupud();
  // console.log('Tekst: ', t);
  t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
  kuvaTekst();
} 
function seaTekstisisestuseKasitlejad() {
  /*
    * Teksti muutvaid klahvivajutusi käsitletakse sündmuste 'keydown' ja  'keypress' kaudu. (Hiljem võib lisada sündmuse 'paste').
    * Sündmus 'keydown' tekib klahvi vajutamisel esimesena.
      Seejärel tekib 'keypress'.
    * Teksti navigeerivaid (caret-d muutvaid) sündmusi (vasakule, paremale) otseselt ei töötle. Caret positsioon selgitatakse välja siis, kui kasutaja vajutab klahvi, mida töödeldakse.

  */

  /* Sündmuse 'keydown' käsitleja. Püüame kinni eriklahvide vajutused, mida tahame töödelda: 8 (Backspace), 46 (Delete), 33 (PgUp), 34 (PgDn), 38 (Up), 40 (Down). Nende vaikimisi toiming tühistatakse.
  */
  $('#Tekst').on('keydown', function(e) {
    var keyCode = e.keyCode;

    // Standardne logimine
    if (logimistase == 1) {
      console.log('keydown: ' + keyCodeToHumanReadable(keyCode) + '(' + keyCode + ')');
    }

    if ([8, 46, 33, 34, 38, 40].includes(keyCode)) {
      e.preventDefault();
      tootleEriklahv(keyCode);
    }
    // var ctrlDown = e.ctrlKey||e.metaKey // Mac-i tugi
    // Kui Ctrl+v, siis lase seda käsitleda paste sündmuse käsitlejal
    // if (ctrlDown && keyCode == 86) { return }
  });

  /* Sündmuse 'keypress' käsitleja. Kui klahvivajutusest tekkis tärgikood, siis suunatakse tähe või punktuatsioonimärgi töötlusele. Kontroll, kas märgikood on lubatute hulgas, tehakse lisaTahtVoiPunktuatsioon-is. Vaikimisi toiming tõkestatakse. */
  $('#Tekst').on('keypress', function(e) {
    var charCode = e.charCode;

    // Võte reavahetuse (enter, keyCode 13) kinnipüüdmiseks ja töötlemiseks
    if (e.keyCode == 13) {
      charCode = 13;
    }

    // Standardne logimine
    if (logimistase == 1) {
      console.log('keypress: ' + String.fromCharCode(charCode) + '(' + charCode + ')');
    }

    if (charCode != null && charCode != 0) {
      e.preventDefault();
      lisaTahtVoiPunktuatsioon(charCode);
    }
  });

  // Ctrl-V (Paste) töötleja
  $('#Tekst').on('paste', function(e) {
    console.log('paste');
    // common browser -> e.originalEvent.clipboardData
    // uncommon browser -> window.clipboardData
    var clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('text');
    console.log('pasted data: ' + pastedData);
    e.preventDefault(); // We are already handling the data from the clipboard, we do not want it inserted into the document
  });
}
function seaTekstinupukasitlejad() {
  // Sea sisestatava teksti käsitlejad
  $('#Poolednupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = vahetaPooled(t);
      kuvaKesktahtYhekordselt = false;
      t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
      kuvaTekst();
    }
  });

  $('#Uusnupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = "|";
      kuvaKesktahtYhekordselt = false;
      kuvaTekst();
    }
  });

  // Aktiveeri tekstiga seotud nupud
  aktiveeriTekstinupud();
}

// Abiteabe funktsioon
function seaInfopaaniKasitlejad() {
  // Infopaani käsitlejad
  $('#Info').click(function() {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(function() {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

// Õigekirjakontroll
function seaOigekirjakasitlejad() {
  $('#Oigekirjakontroll').click(function() {
    $('#Oigekirjadialoog').removeClass('peidetud');
    $('#Oigekirjakontroll').addClass('disabled');
  });

  $('#OigekiriSulge').click(function() {
    $('#Oigekirjadialoog').addClass('peidetud');
    $('#Oigekirjakontroll').removeClass('disabled');
  });

  $('#OigekiriKontrolli').click(function() {
    var k = $('#KontrollitavTekst').val();
    var t = samatekst(k) ? 'on samatekst' : 'ei ole samatekst';
    $('#KontrolliTulemus').text(t);
  });
}

// Kool
function seaKoolikasitlejad() {
  $('#Kool').click(function() {
    $('#Koolitekst').removeClass('peidetud');
    $('#Kool').addClass('disabled');
  });

  $('#KoolSulge').click(function() {
    $('#Koolitekst').addClass('peidetud');
    $('#Kool').removeClass('disabled');
  });
}

// Peaprogramm
function alusta() {
  // Initsialiseeri tooltip-id
  $('[data-toggle="tooltip"]').tooltip();

  seaTekstisisestuseKasitlejad();
  seaTekstinupukasitlejad();
  seaSalvestuseKasitlejad();
  seaInfopaaniKasitlejad();
  seaTekstikoguKasitlejad();
  seaFiltriKasitlejad();
  seaOigekirjakasitlejad();
  seaKoolikasitlejad();

  // Algustekst (kursor)
  kuvaTekst();
  $('#Tekst').focus();

  laeTekstid(); // Lae tekstid alla
}
