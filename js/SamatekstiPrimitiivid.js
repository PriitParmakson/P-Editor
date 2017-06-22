// Samatekstitöötluse primitiivid
function leiaTaht(str, index) {
  /* Tagastab objekti, mille struktuur on:
   1) 'taht' - stringis str järjekorranumbriga index (1-põhine) tähe;
   2) 'indeks' - leitud tähe kui tärgi indeks stringis (0-põhine);
   3) 'sonaAlguses' - kas tähele eelnes kirjavahemärk (sh tühik või reavahetus) või täht on teksti alguses;
   4) 'sonaLopus' - kas tähele järgneb kirjavahemärk (sh tühik või reavahetus) või täht on teksti lõpus.
   Kirjavahemärke tähtede loendamisel ei arvesta.
   Ebaõige sisendi korral, sh ka siis, kui tekstis ei ole nii palju tähti, tagastab tühja stringi, teised parameetrid false.
   Tähe registrit ei muuda.
  */
  if (typeof str === 'undefined' || str === null || typeof index !== 'number' || index > str.length || index < 1) {
    return { taht: '', indeks: false, sonaAlguses: false, sonaLopus: false }
  }
  var taheloendur = 0;
  var sonaAlguses = false;
  var eelmiseTaheIndex = null;
  for (var i = 0; i < str.length; i++) {
    if (!kirjavm(str[i])) {
      taheloendur += 1;
      if (taheloendur == index) {
        return {
          taht: str[i],
          indeks: i,
          sonaAlguses: (eelmiseTaheIndex === null || eelmiseTaheIndex < i - 1),
          sonaLopus: (i == str.length - 1 || kirjavm(str[i + 1]))
        };
      }
      else {
        eelmiseTaheIndex = i;
      }
    }
  }
  return { taht: '', indeks: false, sonaAlguses: false, sonaLopus: false }
}
function tahti(str) {
  /* Tagastab tähtede arvu stringis. Ei arvesta kirjavahemärke ja kursorijoont. Ei arvesta, kas kesktähte kuvatakse ühekordselt. Tagastatav väärtus on alati paarisarv. */
  return str
    .split("")
    .filter(s => (!kirjavm(s)) && (s != "|"))
    .length;
}
function samatekst(str) {
  /* Kontrollib, kas str on samatekst.
    - undefined, null, tühiteksti või ainult kirjavahemärkidest koosneva teksti puhul tagastab false
  */
  if (typeof str === 'undefined' || str === null) {
    return false
  }
  if (str.length == 0) { return false }
  var tahti = 0;
  var algusest = 0;
  var lopust = str.length - 1;
  do {
    if (kirjavm(str[algusest])) {
      algusest += 1;
    }
    else if (kirjavm(str[lopust])) {
      lopust -= 1;
    }
    else if (str[algusest].toLowerCase() != str[lopust].toLowerCase()) {
      return false
    }
    else {
      algusest += 1;
      lopust -= 1;
      if (algusest == lopust) {
        tahti += 1;
      }
      else {
        tahti += 2;
      }
    }
  }
  while (algusest < lopust)
  if (tahti > 0) {
    return true
  }
  else {
    return false
  }
}
function tuvastaKesktaht(str) {
  /* Tagastab objekti, mille struktuur on:
   1) 'taht' - samateksti str kesktäht,
   väiketähena;
   2) 'yhekordne' - kas kesktäht on ühekordsena (tõeväärtus);
   3) 'sonaAlguses' - kas kesktäht (kahekordse kesktähe puhul - üks neist) on sõna alguses;
   4) 'sonaLopus' - kas kesktäht (kahekordse kesktähe puhul - üks neist) on sõna lõpus.
   Eeldab samateksti. Ei tohi sisaldada kursorit (|). 
   */
  if (typeof str === 'undefined' || str === null || str === '') {
    return false
  }
  var t = tahti(str);
  if (t == 0) {
    return false
  }
  if (t % 2 == 0) {
    // Kesktäht on kahekordsena
    var k1 = leiaTaht(str, t / 2);
    var k2 = leiaTaht(str, t / 2 + 1);
    return {
      taht: k1.taht.toLowerCase(),
      yhekordne: false,
      sonaAlguses: k1.sonaAlguses || k2.sonaAlguses,
      sonaLopus: k1.sonaLopus || k2.sonaLopus
    }
  }
  else {
    // Kesktäht on ühekordsena
    var k = leiaTaht(str, Math.ceil(t / 2));
    return {
      taht: k.taht.toLowerCase(),
      yhekordne: true,
      sonaAlguses: k.sonaAlguses,
      sonaLopus: k.sonaLopus
    }
  }
}
function eemaldaLiigsedTyhikud(str, kuvaKesktahtYhekordselt) {
  /* Liigsed tühikud võivad tekkida teksti mitme redigeerimisoperatsiooni tulemusena: poolte vahetus, kustutamine (Backspace ja Delete), kesktähe muutmine ühekordseks. eemaldaLiigsedTyhikud kutsutakse välja pärast neid operatsioone. Tekst käiakse läbi ja liigsed tühikud kõrvaldatakse. Liigsed tühikud on: 1) teksti alguses olev tühik; 2) tühik, millele vahetult eelneb tühik; 3) tühik, mille ees on tühik ja kursor; 4) tühik, mille ees on mittekuvatav kesktäht ja viimase ees tühik (arvestada ka kursorit).

  Sisendiks on: 1) sisekujul tekst; 2) tõeväärtus, kas kesktähte käsitleda ühekordsena. 

  */
  var res = str
    .replace(/^ /, '')
    .replace(/^\| /, '|')
    .replace(/  /, ' ')
    .replace(/ \| /, ' |');
  return res;
}
function puhastaTekst(str) {
  /* Eemaldab tekstist kõik tärgid, mis ei kuulu defineeritud kirjavahemärkide ja tähtede hulka
  */
  return str
    .split("")
    .filter(s => kirjavm(s) || taht(s.charCodeAt(0)))
    .join('');
}
function tekstistSiseesitusse(str) {
  /* Eeldab samateksti. Lisab sisekursori (|) teksti algusesse.
    Arvestab, et siseesituses kesktäht esitatakse alati kahekordselt.
    Eemaldab liigsed tühikud.
    Tagastab objekti: { tekst: ..., kuvaKesktahtYhekordselt: boolean }
  */
  var kuvaKesktahtYhekordselt = (tahti(str) % 2 == 1);
  var t;
  if (kuvaKesktahtYhekordselt) {
    let kesktaht = leiaTaht(str, Math.ceil(tahti(str) / 2));
    t = str.substring(0, kesktaht.indeks) + kesktaht.taht + kesktaht.taht + str.substring(kesktaht.indeks + 1, str.length);
  } 
  else {
    t = str;
  }
  t = '|' + eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
  return { tekst: t, kuvaKesktahtYhekordselt: kuvaKesktahtYhekordselt };
}
function pooraYmber(str) {
  var r = '';
  for (var i = 0; i < str.length; i++) {
    r = str[i] + r;
  }
  return r
}
