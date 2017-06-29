
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
    kum += 1; // Sest siseesituses on kesktäht alati kahekordselt
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
  if (logimistase > 1) {
    console.log('Kasutaja: ' + keyCodeToHumanReadable(keyCode) + ' - ' + teade);
  }

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
      t = tekstEnne + "|" + tekstParast.substring(1, tekstParast.length);
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
      t = suurtaheks(t);
      kuvaTekst();
      return
    case 40: // Down
      t = vaiketaheks(t);
      kuvaTekst();
      return
  }
}
function lisaTahtVoiPunktuatsioon(charCode) {
  // Lisa kasutaja sisestatud täht või kirjavahemärk
  // Kontrollib, kas märgikood on lubatute hulgas
  if (!
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
  if (logimistase > 1) {
    console.log('Kasutaja: ' + charTyped + ' ' + teade);
  }

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
    for (var i = 0; i < tekstParast.length; i++) {
      acc = acc + tekstParast[i];
      // Kui on täht..
      if (!kirjavm(tekstParast[i])) {
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
      if (!kirjavm(tekstEnne[i])) {
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
  t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
  kuvaTekst();
}
function seaRedaktoriKasitlejad() {
  /*
    Teksti muutvaid klahvivajutusi käsitletakse sündmuste 'keydown', 'keypress' ja 'paste' kaudu.
    Sündmus 'keydown' tekib klahvi vajutamisel esimesena.
    Seejärel tekib 'keypress'.
    Teksti navigeerivaid (caret-d muutvaid) sündmusi (vasakule,
    paremale) otseselt ei töötle, välja arvatud see, et nende toime blokeeritakse veateaterežiimis.
    Caret positsioon selgitatakse välja siis, kui kasutaja vajutab klahvi, mida töödeldakse.
  */

  $('#Tekst').on('keydown', function (e) {
    /* 
    Sündmuse KEYDOWN käsitleja. Püüame kinni eriklahvide 
     vajutused, mida tahame töödelda: 8 (Backspace), 46 (Delete), 
     33 (PgUp), 34 (PgDn), 38 (Up), 40 (Down). Nende vaikimisi 
     toiming tühistatakse ja vajutusi käsitletakse spetsiifiliselt.

     Märkus. Ctrl + klahv vajutustest tekib kaks KEYDOWN sündmust - esimene keyCode = 17 (Ctrl), seejärel keyCode = klahvi kood (tõeväärtus ctrlDown on mõlemal juhul tõene).
    */
    var keyCode = e.keyCode;
    var ctrlDown = e.ctrlKey||e.metaKey // Mac-i tugi

    /*
    Kui veateade on kuvatud (kasutaja ei ole seda sulgenud), siis klahvivajutused väljas #Tekst ei oma mõju.
    */
    if (!$('#Teatepaan').hasClass('peidetud')) {
      e.preventDefault();
      return
    }

    // Logimine
    if (logimistase > 1) {
      console.log('KEYDOWN:' + (ctrlDown ? ' Ctrl + ' : ' ') + keyCodeToHumanReadable(keyCode) + '(' + keyCode + ')');
    }

    // Kui Ctrl+c (keyCode 67) või Ctrl+v (keyCode 86), siis lase seda käsitleda vastavatel süsteemsetel sündmusekäsitlejatel
    if (ctrlDown && [67, 86].includes(keyCode)) { return }

    if ([8, 46, 33, 34, 38, 40].includes(keyCode)) {
      e.preventDefault();
      tootleEriklahv(keyCode);
    }
  });

  $('#Tekst').on('keypress', function (e) {
    /* 
      Sündmuse KEYPRESS käsitleja. Kui klahvivajutusest tekkis tärgikood, siis suunatakse tähe või punktuatsioonimärgi töötlusele. Kontroll, kas märgikood on lubatute hulgas, tehakse lisaTahtVoiPunktuatsioon-is. Vaikimisi toiming tõkestatakse.

      Sündmus KEYPRESS tekib ka Ctrl-kombinatsioonide vajutamisel.
    
      Kui Teatepaan on avatud (asetamise viga), siis ignoreeritakse.
    */
    var charCode = e.charCode;
    var ctrlDown = e.ctrlKey||e.metaKey // Mac-i tugi

    if (!$('#Teatepaan').hasClass('peidetud')) {
      // Asetamise veateade tuleb enne sulgeda
      e.preventDefault();
      return
    }

    // Võte reavahetuse (enter, keyCode 13) kinnipüüdmiseks ja töötlemiseks
    if (e.keyCode == 13) {
      charCode = 13;
    }

    // Logimine
    if (logimistase > 1) {
      if (ctrlDown) {
        console.log('KEYPRESS: Ctrl'); 
      }
      else {
        console.log('KEYPRESS: ' + String.fromCharCode(charCode) + ' (' + charCode + ')');
      }
    }

    // Ctrl-kombinatsioone tähesisestuseks ei loe
    if (!ctrlDown && charCode != null && charCode != 0) {
      e.preventDefault();
      lisaTahtVoiPunktuatsioon(charCode);
    }
  });

  $('#Tekst').on('paste', function (e) {
    /* Ctrl-V (Paste) töötleja
       Tavaline sirvija -> e.originalEvent.clipboardData
       Ebatavaline sirvija -> window.clipboardData
    */

    if (!$('#Teatepaan').hasClass('peidetud')) {
      // Asetamise veateade tuleb enne sulgeda
      e.preventDefault();
      return
    }    

    var clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
    var LisatavTekst = clipboardData.getData('text');
    /* Lasta vaikereaktsioonil toimuda. 
       Selleks:
       1) seada taimer, vt          https://stackoverflow.com/questions/4532473/is-there-an-event-that-occurs-after-paste.
       2) puhastada sisend kõrvalistest tärkidest. Eriti on vaja kõrvaldada &#8203; (Zero-Width Space)
       3) Kontrollida, kas asetamise tulemusena tekkinud tekst on samatekst.
       4) Kui ei ole, siis anda veateade ja sisendit mitte aktsepteerida.
       5) Oodata, kuni kasutaja vajutab veateatepaani sulgemisnupule.
       Taastada siseesituse põhjal toimingueelne tekst.
    */
    setTimeout(function() {
      var asetatudTekst = $('#Tekst').text();
      console.log('Asetatud tekst: ' + asetatudTekst);
      var puhastatudTekst = puhastaTekst(asetatudTekst);
      if (samatekst(puhastatudTekst)) {
        /* Moodusta siseesitus.  samuti lisa sisekursor (algusesse)
        */
        var siseEsituses = tekstistSiseesitusse(puhastatudTekst);
        t = siseEsituses.tekst;
        kuvaKesktahtYhekordselt = siseEsituses.kuvaKesktahtYhekordselt;
        kuvaTekst();
        aktiveeriTekstinupud();
      }
      else {
        $('#Teatetekst').text('Asetatud tekst ei ole samatekst.');
        $('#Teatepaan')
          .removeClass('peidetud');
        deaktiveeriTekstinupud();
      }
    }, 50);
  });

}
