function markeeriTekstikoguTekst(t) {
  /*
   Tagastab markeeritud keskkohaga teksti
   Eeldatakse salvestamiseks puhastatud teksti (ei sisalda kursorit).
  */
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
      if (t[i] == '/') {
        acc = acc + '<br>';
      }
      else {
        acc = acc + t[i];
      }
    }
    // Täht
    else {
      taheloendur++;
      // Esimene kesktäht markeerida
      if (taheloendur == m1) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Teine kesktäht...
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

function moodustaTekstiStruktuurKonsoolile() {
  /*
   Silumise abivahend
  */ 
  var h = $('#Tekst').html();
  var tagasta = h
    .replace(/<span id="\w{1,2}" class="kesk">/gi, '¦')
    .replace(/<span id="\w{1,2}">/gi, '¦')
    .replace(/<\/span>/gi, '') + '¦';
  return tagasta;
}

function suurtaheks(t) {
  /* Kursori järel olev täht muudetakse suurtäheks
     Sisendis eeldab siseesituse kursorit ('|') sisaldavat teksti.
     Ei sõltu globaalsetest muutujatest.
  */
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return t
  }
  var s = tekstParast[0].toUpperCase();
  return tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
}

function vaiketaheks(t) {
  /* Kursori järel olev täht muudetakse väiketäheks.
     Sisendis eeldab siseesituse kursorit ('|') sisaldavat teksti.
     Ei sõltu globaalsetest muutujatest.
  */
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return t
  }
  var s = tekstParast[0].toLowerCase();
  return tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
}

function vahetaPooled(t) {
  /*
   Eeldab parameetris t sisekujul teksti (kesktäht kahekordselt). Tagastab teksti, milles pooled on vahetatud. Kui pooltevahetusega sattus esimeseks sümboliks tühik, siis see eemaldatakse.
  */
  var p = tahti(t) / 2;
  if (p < 2) {
    return t
  }
  var taheloendur = 0;
  var esimesePooleLopp;
  // Leia keskkoht
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon kanna üle
    if (taht(t.charCodeAt(i))) {
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
