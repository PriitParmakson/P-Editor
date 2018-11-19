'use strict';

const matriits = document.getElementById('Matriits');
const tekst = document.getElementById('Tekst');
const mE = document.getElementById('MatriitsiErinevused');
const tE = document.getElementById('TekstiErinevused');

function alusta() {

  $('#Uus').click(() => {
    matriits.textContent = '';
    tekst.textContent = '';
    mE.textContent = '';
    tE.textContent = '';
    matriits.focus();
  });

  $('#Vaheta').click(() => {
    [
      matriits.textContent,
      tekst.textContent,
      mE.textContent,
      tE.textContent
    ] =
      [
        tekst.textContent,
        matriits.textContent,
        tE.textContent,
        mE.textContent
      ];
    matriits.focus();
  });

  $('#Salvesta').click(() => {
    document.getElementById('Puhasala').textContent =
      matriits.textContent +
      '\r\n' +
      tekst.textContent;
  });

  matriits.addEventListener("keydown",
    (e) => {
      let charCode = e.charCode;
      // Ignoreeri Left arrow (37), Right arrow (39)
      if ([37, 39].includes(charCode)) {
        // NO OP
      } else if (e.keyCode == 33) { // PgUp
        e.preventDefault();
        muudaSuurust(matriits, 'suureks');
      } else if (e.keyCode == 34) { // PgDown
        e.preventDefault();
        muudaSuurust(matriits, 'väikseks');
      } else {
        uuendaErinevusi();
      }
    });

  tekst.addEventListener("keydown",
    (e) => {
      let charCode = e.charCode;
      // Ignoreeri Left arrow (37), Right arrow (39)
      if ([37, 39].includes(charCode)) {
        // NO OP
      } else if (e.keyCode == 33) { // PgUp
        e.preventDefault();
        muudaSuurust(tekst, 'suureks');
      } else if (e.keyCode == 34) { // PgDown
        e.preventDefault();
        muudaSuurust(tekst, 'väikseks');
      } else {
        uuendaErinevusi();
      }
    });

  matriits.focus();
}

function muudaSuurust(ala, suund) {
  if (document.getSelection().isCollapsed) {
    var r = document.getSelection().getRangeAt(0).startOffset;
    var t = ala.textContent;
    if (r < t.length) {
      let uusTekst =
        t.slice(0, r) +
        (suund == 'suureks' ?
          t.charAt(r).toUpperCase() :
          t.charAt(r).toLowerCase()
        ) +
        t.slice(r + 1);
      ala.textContent = uusTekst;
    }
    seaCaret(ala, r);
  }
}

function seaCaret(ala, pos) {
  var range = document.createRange();
  range.setStart(ala.childNodes[0], pos);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);
}

function massiivStringiks(m) {
  var s = '';
  for (let e in m) {
    s = s + m[e];
  }
  return s;
}

function kuvaErinevused(erinevused) {
  mE.textContent = massiivStringiks(erinevused.m0);
  tE.textContent = massiivStringiks(erinevused.t0);
}

function leiaErinevused(m, t) {
  let m0 = [];
  let t0 = [];
  // Valmista t tähtede sagedusmäpp
  let tMap = new Map([]);
  for (let c of t) {
    if (taht(c.charCodeAt(0))) {
      let taheEsinemisteArv = tMap.get(c);
      if (tMap.has(c)) {
        tMap.set(c, tMap.get(c) + 1);
      } else {
        tMap.set(c, 1);
      }
    }
  }
  // Läbi matriits
  for (let c of m) {
    if (taht(c.charCodeAt(0))) {
      if (tMap.has(c)) {
        let loendur = tMap.get(c);
        if (loendur > 0) {
          // Matriitsi täht esineb tekstis
          tMap.set(c, loendur - 1)
        } else {
          // Täht esineb matriitsis rohkem kordi kui tekstis
          m0.push(c);
        }
      }
      else {
        // Matriitsi täht ei esine tekstis
        m0.push(c);
      }
    }
  }
  // Läbi sagedusmäpp, moodusta t0
  for (let [key, value] of tMap) {
    if (value > 0) {
      for (let i = 1; i <= value; i++) {
        t0.push(key);
      }
    }
  }
  return { m0, t0 } // Property value shorthand
}

function uuendaErinevusi() {
  var m = matriits.textContent.toLowerCase();
  var t = tekst.textContent.toLowerCase();
  var erinevused = leiaErinevused(m, t);
  kuvaErinevused(erinevused);
}

