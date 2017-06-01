// Samatekstitöötluse primitiivid
function leiaTaht(str, index) {
  /* Tagastab:
   1) 'taht' - stringis str järjekorranumbriga index (1-põhine) tähe;
   2) 'sonaAlguses' - kas tähele eelnes kirjavahemärk (sh tühik või reavahetus) või täht on teksti alguses;
   3) 'sonaLopus' - kas tähele järgneb kirjavahemärk (sh tühik või reavahetus) või täht on teksti lõpus.
   Kirjavahemärke tähtede loendamisel ei arvesta.
   Ebaõige sisendi korral, sh ka siis, kui tekstis ei ole nii palju tähti, tagastab tühja stringi.
   Tähe registrit ei muuda.
  */
  if (typeof str === 'undefined' || str === null || typeof index !== 'number' || index > str.length || index < 1) {
    return { taht: '', sonaAlguses: false, sonaLopus: false }
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
          sonaAlguses: (eelmiseTaheIndex === null || eelmiseTaheIndex < i - 1),
          sonaLopus: (i == str.length - 1 || kirjavm(str[i + 1]))
        };
      }
      else {
        eelmiseTaheIndex = i;
      }
    }
  }
  return { taht: '', sonaAlguses: false, sonaLopus: false }
}
function tahti(str) {
  /* Tagastab tähtede arvu stringis. Ei arvesta kirjavahemärke ja kursorijoont. Ei arvesta, kas kesktähte kuvatakse ühekordselt. Tagastatav väärtus on alati paarisarv. */
  return str
    .split("")
    .filter(s => (! kirjavm(s)) && (s != "|"))
    .length;
}
function samatekst(str) {
  // Kontrollib, kas str on samatekst
  if (typeof str === 'undefined' || str === null) {
    return false
  }
  if (str.length < 2) {
    return true
  }
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
    }
  } 
  while (algusest < lopust)
  return true  
}
function keskelement(str) {
  /* Tagastab:
   1) 'taht' - samateksti str keskelement,
   väiketähena;
   2) 'yhekordne' - kas keskelement on ühekordsena (tõeväärtus);
   3) 'sonaAlguses' - kas keskelement (kahekordse keskelemendi puhul - üks neist) on sõna alguses;
   4) 'sonaLopus' - kas keskelement (kahekordse keskelemendi puhul - üks neist) on sõna lõpus.
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
    // Keskelement on kahekordsena
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
    // Keskelement on ühekordsena
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
