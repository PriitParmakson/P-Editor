// Teksti töötlemise abifunktsioonid
function markeeriTekstikoguTekst(t) {
  // Tagastab markeeritud keskkohaga teksti
  // Eeldatakse salvestamiseks puhastatud teksti (ei sisalda kursorit)
  var acc = ''; // Tagastatav tekst, lisatud markeering
  var m1 = null; // Esimese markeeritava tähe indeks (1-baas)
  var keskelementYhekordselt = null;

  var tTekstis = tahti(t);

  if ((tTekstis < 4)) {
    return t
  }

  // Mitmes täht (või tähed) markeerida?
  if (tTekstis % 2 == 0) {
    m1 = tTekstis / 2;
    keskelementYhekordselt = false;
  }
  else {
    m1 = Math.floor(tTekstis / 2) + 1;
    keskelementYhekordselt = true;
  }

  var taheloendur = 0;
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon
    if (kirjavm(t[i])) {
      // Asenda reavahetuse siseesituse sümbol <br> elemendiga
      if (t[i] == '⏎') {
        acc = acc + '<br>';
      }
      else {
        acc = acc + t[i];
      }
    }
    // Täht
    else {
      taheloendur++;
      // Esimene keskelement markeerida
      if (taheloendur == m1) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Teine keskelement...
      else if (taheloendur == m1 + 1 && !keskelementYhekordselt) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Kuvada tavaliselt
      else {
        acc = acc + t[i];
      }
    }
  }
  return acc
}
function markeeriTekst() {
  /* Tagastab HTML-i viidud, markeeritud kesktähtedega teksti.
  Kesktähed jagavad teksti 5 ossa. Tagastatava HTML-i struktuur:
    <p>
      tähed enne esimest kesktähte
      <span id='K1'> esimene kesktäht </span>
      kirjavahemärgid kesktähtede vahel
      <span id='K2'>(teine kesktäht)</span>
      tähed pärast teist kesktähte
    </p>
  
  Kursor jäetakse vahele. Tekstiosad võivad olla tühjad.
  */

  var koguja = ['', '', '', '', ''];
  // Koguja tekstiosadele A, K1, Kt, K2, B
  var mode = '0'; // Kogutava tekstiosa indeks (0-põhine)

  var p = tahti(t) / 2; // Alati täisarv, sest tekstis on mõlemad kesktähed, ka siis, kui kuvatakse ainult ühte.
  var taheloendur = 0;

  if (t.length == 1) {
    // Tühja teksti puhul lisa  0-pikkusega tühik. See on vajalik caret positsioneerimiseks.
    koguja[0] = '&#8203;'; 
  }
  else {
    // Kogu tekstiosad
    for (var i = 0; i < t.length; i++) {
      // Kursorijoon, ei esita markeeritud tekstis
      if (t[i] == '|') {
      }
      // Kirjavahemärk
      else if (kirjavm(t[i])) {
        if (t[i] == '⏎') {
          // koguja[mode] = '<br>'; ei sobi, sest caret positsioneerimine läheb keerukaks
          koguja[mode] = koguja[mode] + t[i];
        }
        else {
          koguja[mode] = koguja[mode] + t[i];
        }
      }
      // Täht
      else {
        taheloendur++;
        // Esimene keskelement markeerida
        if (taheloendur == p) {
          koguja[1] = t[i];
          mode = 2;  
        }
        // Teine keskelement...
        else if (taheloendur == p + 1) {
          if (kuvaKesktahtYhekordselt) {
            // ...mitte kuvada
          }
          else {
            // ...kuvada ja markeerida
            koguja[3] = t[i];
          }
          mode = 4;
        }
        // Kuvada tavaliselt
        else {
          koguja[mode] = koguja[mode] + t[i];
        }
      }
    }    
  }
  // Lisa markeering
  var m = 
    "<span id='A'>"  + koguja[0] + "</span>" +
    "<span id='K1' class='kesk'>" + koguja[1] + "</span>" +
    "<span id='Kt'>" + koguja[2] + "</span>" +
    "<span id='K2' class='kesk'>" + koguja[3] + "</span>" +
    "<span id='B'>"  + koguja[4];
  return m
}
function moodustaTekstiStruktuurKonsoolile() {
  // Silumise abivahend
  var h = $('#Tekst').html();
  var tagasta = h
    .replace(/<span id="\w{1,2}" class="kesk">/gi, '¦')
    .replace(/<span id="\w{1,2}">/gi, '¦')
    .replace(/<\/span>/gi, '') + '¦';
  return tagasta;
}

// Spetsiifilised operatsioonid tekstiga
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
  // Kursori järel olev täht muudetakse väiketäheks
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
function vahetaPooled(t) {
  // Eeldab parameetris t sisekujul teksti (kesktäht kahekordselt). Tagastab teksti, milles pooled on vahetatud. Kui pooltevahetusega sattus esimeseks sümboliks tühik, siis see eemaldatakse.
  var p = tahti(t) / 2;
  if (p < 2) {
    return t
  }
  var taheloendur = 0;
  var esimesePooleLopp;
  // Leia keskkoht
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon kanna üle
    if (! (kirjavm(t[i]) && t[i] != "|") ) {
      taheloendur++;
      if (taheloendur == p) {
        esimesePooleLopp = i;
        break;
      }
    }
  }
  var a = t.slice(0, esimesePooleLopp + 1);
  var b = t.slice(esimesePooleLopp + 1);
  return b + a;
}
