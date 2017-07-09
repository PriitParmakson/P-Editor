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
function kanoonilineKuju(str) {
  /* Eemaldab kõik kirjavahemärgid jm sümbolid, mis ei ole tähed,
     teisendab väiketähtedeks.
  */
  if (typeof str === 'undefined' || str === null) {
    return false
  }
  if (str.length == 0) { return false }
  var k = '';
  for (var i = 0; i < str.length; i++) {
    if (taht(str.charCodeAt(i))) {
      k += str[i].toLowerCase();
    }
  }
  return k;
}
function samatekst(str) {
  /* Kontrollib, kas str on samatekst.
    - undefined, null, tühiteksti või ainult kirjavahemärkidest koosneva teksti puhul tagastab false.
    Tagastab objekti:
    { on: <boolean> [, mittepeegelpaar: [ <nr>, <nr> ] ] }
  */
  if (typeof str === 'undefined' || str === null) {
    return { on: false }
  }
  if (str.length == 0) { return { on: false } }
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
      return { on: false, mittepeegelpaar: [algusest, lopust] }
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
    return { on: true }
  }
  else {
    return { on: false }
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
function pikimYhineAlamsone(s1, s2) {
  /*
    After: https://github.com/mirkokiefer/longest-common-substring
    Tagastab objekti { startString1: .., startString2: .., length: .. }
  */
  function indexMap(list) {
    var map = {}
    list.forEach(function(each, i) {
      map[each] = map[each] || []
      map[each].push(i)
    })
    return map
  }

  var seq1 = s1.split('');  
  var seq2 = s2.split('');  
  var result = {startString1:0, startString2:0, length:0}
  var indexMapBefore = indexMap(seq1)
  var previousOverlap = []
  seq2.forEach(function(eachAfter, indexAfter) {
    var overlapLength
    var overlap = []
    var indexesBefore = indexMapBefore[eachAfter] || []
    indexesBefore.forEach(function(indexBefore) {
      overlapLength = ((indexBefore && previousOverlap[indexBefore-1]) || 0) + 1;
      if (overlapLength > result.length) {
        result.length = overlapLength;
        result.startString1 = indexBefore - overlapLength + 1;
        result.startString2 = indexAfter - overlapLength + 1;
      }
      overlap[indexBefore] = overlapLength
    })
    previousOverlap = overlap
  })
  return result
}

function tuvastaSuhe(s1, s2) {
  /*
    1) Viib mõlemad tekstid kanoonilisele kujule.
    1a) Kui emb-kumb kanooniline kuju on tühi, siis tagastab väärtuse null.
    2) Kui s1 ja s2 kanoonilised kujud ühtivad, siis ütleme, et s1 ja s2 on võrdväärsed ja tähistame seda s1 = s2. Funktsioon tagastab sellisel juhul väärtuse '='.
    3) s1 ja s2 on suhtes eeltekst-järeltekst <=> s1 pooltekst (ilma kesktäheta) sisaldub s2-s. Sedapidi suhet tähistame s1 < s2 ja funktsioon tagastab väärtuse '<'.
    4) Vastupidist suhet tähistame s1 > s2. Funktsioon tagastab sellisel juhul väärtuse '>'.
    5) Leiab pikima ühise alamsõne. Kui selle pikkus on vähemalt 4, siis tagastab selle alamsõne.
    6) Kui ühtki ülalnimetatud suhet ei tuvastatud, siis tagastab funktsioon väärtuse null.
  */
  var k1 = kanoonilineKuju(s1);
  var k2 = kanoonilineKuju(s2);
  if (k1.length == 0 || k2.length == 0) {
    return null
  }
  if (k1 == k2) {
    return '=' // Võrdväärsed
  }
  var p1 = k1.substr(0, Math.floor(k1.length / 2)); 
  var p2 = k2.substr(0, Math.floor(k2.length / 2));
  if (k2.includes(p1) && k1.length < k2.length) {
    return '<' // s1 on s2 eellane
  }
  if (k1.includes(p2) && k1.length > k2.length) {
    return '>' // s2 on s1 eellane
  }
  var y = pikimYhineAlamsone(k1, k2);
  if (y.length >= 4) {
    return k1.substr(y.startString1, y.length);
  }
  return null
}