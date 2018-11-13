'use strict';

/* Kuvab klahvivajutuste koodid
*/

function alusta() {

  const matriits = document.getElementById('Matriits');
  const tekst = document.getElementById('Tekst');

  /* matriits.addEventListener("focus",
    () => { alert('Fookus matriitsil') });
  tekst.addEventListener("focus",
    () => { alert('Fookus tekstil') }); */

  matriits.addEventListener("keypress",
    (e) => {
      let charCode = e.charCode;
      if (taht(charCode)) {
        e.preventDefault();
        lisaTahtMatriitsi(charCode);
      }
    });

}

lisaTahtMatriitsi(charCode) {
  
}

