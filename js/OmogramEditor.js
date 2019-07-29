'use strict';

const silu = true; // Kas väljastada silumisteavet konsoolile?

const t1 = document.getElementById('Tekstiala1');
const t2 = document.getElementById('Tekstiala2');

// Tekstialade siseesitused
var s1 = '';
var s2 = '';

function alusta() {
  seaNupukasitlejad();
  seaKlahvikasitlejad();
  // Sea fookus esimesele tekstialale.
  t1.focus();
}

function seaNupukasitlejad() {
  // Uue omogrammi alustamine
  $('#Uus').click(() => {
    t1.innerText = '';
    t2.innerText = '';
    t1.focus();
  });

  // Omogrammiridade vahetamine
  $('#Vaheta').click(() => {
    [
      t1.innerText,
      t2.innerText
    ] =
      [
        t2.innerText,
        t1.innerText
      ];
    t1.focus();
  });

  // Kanna omogramm puhasalasse
  $('#Salvesta').click(() => {
    document.getElementById('Puhasala').innerText =
      t1.innerText +
      '\r\n' +
      t2.innerText;
  });

}

function seaKlahvikasitlejad() {

  // Sea sündmuse KEYDOWN käsitlejad
  t1.addEventListener(
    "keydown",
    (e) => {
      keydownKasitleja(e, t1);
    }
  );
  t2.addEventListener(
    "keydown",
    (e) => {
      keydownKasitleja(e, t2);
    }
  );
  // Sea sündmuse KEYPRESS käsitlejad
  t1.addEventListener(
    "keypress",
    (e) => {
      keypressKasitleja(e, t1);
    }
  );
  t2.addEventListener(
    "keypress",
    (e) => {
      keypressKasitleja(e, t2);
    }
  );

}

function keypressKasitleja(e, tekstiala) {
  /*
    Püüab kinni tähe lisamise ja lisab tähe ka teise teksti.
    Kasutame sündmust KEYPRESS, kuna KEYDOWN ei erista vene
    tähti. KEYPRESS on küll deprecated, kuid üleminek ei lähe
    kiirelt (vt https://stackoverflow.com/questions/52882144/replacement-for-deprecated-keypress-dom-event).
    e - klahvivajutuse kontekst
    tekstiala - tekstiala, kus klahvi vajutati
  */
  console.log('keypressKasitleja:', 'Vajutatud', e.key);
  if (taht(e.keyCode)) {
    // Kajasta tähe lisamine teises tekstialas.
    var tt = teineTekstiala(tekstiala);
    var l = tahtiTekstikursorini(tekstiala);
    var sisu = tt.innerText;
    var uussisu;
    if (l == 0) { // Lisatakse teksti alguses
      uussisu = String.fromCharCode(e.keyCode).toLowerCase() +
        sisu;
    }
    else {
      var s = leiaTaheTargipos(l, tt.innerText);
      // Lisa täht teise tekstialasse.
      uussisu = sisu.slice(0, s + 1) +
      String.fromCharCode(e.keyCode).toLowerCase() +
      sisu.slice(s + 1);
    }
    tt.innerText = uussisu;
  }
}

function keydownKasitleja(e, tekstiala) {
  /*
    Püüa kinni ja täida eritähendusega klahvivajutused:
    - PgUp (keykode 33) - muuda fookuses olev täht suurtäheks
    - PgDown (keycode 34) - muuda fookuses olev täht väiketäheks
    - Up (keycode 38) - vii fookus ülemisse tekstialasse
    - Down (keycode 40) - vii fookus alumisse tekstialasse
      Backspace (keycode 8) - kajasta kustutamine teises tekstialas
      Delete (keycode 46) - kajasta kustutamine teises tekstialas
      <tähteklahv> - kajasta tähe lisamine teises tekstialas
    e - klahvivajutuse kontekst
    tekstiala - tekstiala, kus klahvi vajutati
  */
  if (silu) {
    console.log('keydownKasitleja:', tekstiala.id,
      'vajutatud:',
      keyCodeToHumanReadable(e.keyCode), '(' + e.keyCode + ')'
    );
  }
  switch (e.keyCode) {

    case 33: // PgUp
      e.preventDefault();
      muudaTaheSuurust(tekstiala, 'suureks');
      break;

    case 34: // PgDown
      e.preventDefault();
      muudaTaheSuurust(tekstiala, 'väikseks');
      break;

    case 38: // Up
      e.preventDefault();
      if (tekstiala == t2) {
        viiFookusTeiseleTekstialale(t2, t1);
      }
      break;

    case 40: // Down
      e.preventDefault();
      if (tekstiala == t1) {
        viiFookusTeiseleTekstialale(t1, t2);
      }
      break;

    case 8: // Backspace
      // Kajasta tärgi kustutamine teises tekstialas
      // pos - Tekstikursori pos-n, mille eest kustutakse
      var pos = document.getSelection().getRangeAt(0).startOffset;
      if (pos == 0) { // Teksti alguses
        return
      }
      var symbolToBeDeleted = tekstiala.innerText[pos - 1];
      console.log('keydownKasitleja:',
        'BACKSPACE', tekstiala.innerText,
        'pos-s', pos,
        'eemaldatakse', symbolToBeDeleted
      );
      // Kui eemaldatakse täht, siis eemalda see ka teisest tekstist
      if (taht(tekstiala.innerText.charCodeAt(pos - 1))) {
        var l = tahtiTekstikursorini(tekstiala);
        console.log('keydownKasitleja:', 'Kustutatakse täht', l);
        var tt = teineTekstiala(tekstiala);
        var s = leiaTaheTargipos(l, tt.innerText);
        console.log('keydownKasitleja:', 'Teisest kustutatakse tärk', s);
        var sisu = tt.innerText;
        var uussisu = sisu.slice(0, s) +
          sisu.slice(s + 1);
        tt.innerText = uussisu;
      }
      break;

    case 46: // Delete
      // Kajasta tärgi kustutamine teises tekstialas
      // pos - Tekstikursori positsioon, mille järelt kustutakse
      var pos = document.getSelection().getRangeAt(0).startOffset;
      if (pos == tekstiala.innerText.length) { // Teksti lõpus
        return
      }
      var symbolToBeDeleted = tekstiala.innerText[pos];
      console.log('keydownKasitleja:',
        'DEL', tekstiala.innerText,
        'pos-s', pos,
        'eemaldatakse', symbolToBeDeleted
      );
      // Kui eemaldatakse täht, siis eemalda see ka teisest tekstist
      if (taht(tekstiala.innerText.charCodeAt(pos))) {
        var l = tahtiTekstikursorini(tekstiala) + 1;
        console.log('keydownKasitleja:', 'Kustutatakse täht', l);
        var tt = teineTekstiala(tekstiala);
        var s = leiaTaheTargipos(l, tt.innerText);
        console.log('keydownKasitleja:', tt.id, 'kustutatakse tärk', s);
        // Lisa täht teise tekstialasse.
        var sisu = tt.innerText;
        var uussisu = sisu.slice(0, s) +
          sisu.slice(s + 1);
        tt.innerText = uussisu;
      }
      break;
  }
}

function leiaTaheTargipos(n, t) {
  /*
   Leia n-nda tähe indeks tärgijadas t. n <= 0 korral tagasta undefined.
  */
  if (n <= 0) {
    return undefined
  }
  var s = 0; // Tärgipositsioon (algab 0-st)
  var l = 0; // Täheloendur
  for (var i = 0; i < t.length; i++) {
    s = i;
    if (taht(t.charCodeAt(i))) {
      l++;
      if (l == n) { // Jõutud on sama täheni, millel või mille järel on fookus lähtetekstis
        break;
      }
    }
  }
  console.log('leiaTaheTargiPos:',
    t, 'tähe', n, 'tärgipos on', s);
  return s;
}

function tahtiTekstikursorini(t) {
  /*
   Leia mitu tähte sisaldub tekstialas t kuni tekstikursorini (vilkuva püstkriipsuni) 
  */
  var s = t.innerText; // Tekstisisu
  if (s.length == 0) {
    return 0;
  }
  var fookuseIndeks = document.getSelection().getRangeAt(0).startOffset;
  if (fookuseIndeks == s.length) {
    return s.length;
  }
  var n = 0; // Tähtede loendur
  var j = 0;
  while (j < s.length && j < fookuseIndeks) {
    j++;
    if (taht(s.charCodeAt(j - 1))) {
      n++;
    }
  }
  if (silu) {
    console.log('tahtiTekstikursorini:', s, n);
  }
  return n;
}

function viiFookusTeiseleTekstialale(ts, tt) {
  /*
    Sea fookus teisele tekstialale. Sealjuures sea fookus tähele, mis
    vastab alliktekstiala fookuses sümbolile lähimale eelmisele või samale tähele.
    Parameetrid:
    - ts - lähtetekstiala - ala, kust fookus viiakse (Source)
    - tt - lõpptekstiala - ala, kuhu fookus viiakse (Target)
  */
  // Leia mitu tähte sisaldub tekstis kuni fookuses sümbolini (k.a)
  var n = tahtiTekstikursorini(ts);

  // Leia vastava tähe tärgipos-n teise tekstiala tekstis.
  var targiPos = leiaTaheTargipos(n, tt.innerText);
  if (silu) {
    console.log('viiFookusTeiseleTekstialale: Sea fookus',
      tt.id,
      'positsiooni: ', targiPos);
  }

  // Vii fookus teisele tekstialale ja seal vastavale tähele
  tt.focus();
  seaCaret(tt, targiPos);
}

function muudaTaheSuurust(ala, suund) {
  /*
    Muuda kursori kohal olev sümbol suur- või väiketäheks.
    Parameetrid:
    - ala - tekstiala, kus muuta
    - suund - "suureks" muudab suurtäheks, muu väärtus + väiketäheks.
    Muutust ei tehta "kohapeal"
  */
  if (document.getSelection().isCollapsed) {
    // r - fookuses sümboli indeks
    var r = document.getSelection().getRangeAt(0).startOffset;
    var t = ala.innerText;
    if (r < t.length) {
      let uusTekst =
        t.slice(0, r) +
        (suund == 'suureks' ?
          t.charAt(r).toUpperCase() :
          t.charAt(r).toLowerCase()
        ) +
        t.slice(r + 1);
      ala.innerText = uusTekst;
    }
    seaCaret(ala, r);
  }
}

function seaCaret(tekstiala, pos) {
  var valik, range;
  console.log('seaCaret: ', tekstiala.id, 'pos:', pos);
  var range = document.createRange();
  range.setStart(tekstiala.childNodes[0], pos);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);
}

function teineTekstiala(t) {
  /*
    Tagastab tekstialade paari (t1, t2) teise liikme id
  */
  if (t == t1) {
    return t2
  }
  else if (t == t2) {
    return t1
  }
  else { // Ebakorrektne sisend
    console.log('VIGA: teineTekstiala: Ebakorrektne sisend.');
    return undefined;
  }
}

function massiivStringiks(m) {
  var s = '';
  for (let e in m) {
    s = s + m[e];
  }
  return s;
}
