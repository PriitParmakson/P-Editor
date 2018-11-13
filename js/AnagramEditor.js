'use strict';

/* Kuvab klahvivajutuste koodid
*/

function alusta() {

  const matriits = document.getElementById('Matriits');
  const tekst = document.getElementById('Tekst');

  function uuendaErinevusi() {
    var m = matriits.textContent.toUpperCase();
    var t = tekst.textContent.toUpperCase();
    var erinevused = leiaErinevused(m, t);
    kuvaErinevused(erinevused);
  }

  /* matriits.addEventListener("focus",
    () => { alert('Fookus matriitsil') });
  tekst.addEventListener("focus",
    () => { alert('Fookus tekstil') }); */

  matriits.addEventListener("keyup",
    (e) => {
      let charCode = e.charCode;
      // Ignoreeri Left arrow (37), Right arrow (39)
      if ([37, 39].includes(charCode)) {
        // NO OP
      } else {
        uuendaErinevusi();
      }
    });

  tekst.addEventListener("keyup",
    (e) => {
      let charCode = e.charCode;
      // Ignoreeri Left arrow (37), Right arrow (39)
      if ([37, 39].includes(charCode)) {
        // NO OP
      } else {
        uuendaErinevusi();
      }
    });

}

function massiivStringiks(m) {
  var s = '';
  for (let e in m) {
    s = s + m[e];
  }
  return s;
}

function kuvaErinevused(erinevused) {
  var matriitsiErinevused = document.getElementById('MatriitsiErinevused');
  var tekstiErinevused = document.getElementById('TekstiErinevused');
  matriitsiErinevused.textContent = massiivStringiks(erinevused.m0);
  tekstiErinevused.textContent = massiivStringiks(erinevused.t0);
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

