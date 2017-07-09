
// Teksti kuvamise funktsioonid
function kuvaTekst() {
  // Markeerib ja kuvab teksti, seab caret ja väljastab silumiseks vastava teate konsoolile.
  var mTekst = markeeriTekst();
  $('#Tekst').html(mTekst);
  var caretSeadmiseTeade = seaCaret(t.indexOf('|'));
  // Standardne logimine
  console.log('Programm: ' + moodustaTekstiStruktuurKonsoolile() + caretSeadmiseTeade);
  /* Uuenda täheloendurit */
  var tahti = kanoonilineKuju(t).length;
  var loenduritekst;
  if (tahti == 0) {
    loenduritekst = '&nbsp;&nbsp;&nbsp;'
  }
  else {
    loenduritekst = tahti.toString();
  }
  $('#Taheloendur').html(loenduritekst);
}
function seaCaret(pos) {
  /* Seab kursori (caret) kuvatud tekstis. Tagastab vastava logiteate.
  - Positsioonid on nummerdatud 0-st. 0-positsioon on enne esimest tähte.
  - Arvestada, et pos ei arvesta, et kesktäht võib olla ühekordselt.
  */

  // Leia span element ja positsioon selle tekstis, kuhu caret panna
  var tipuIDd = ['A', 'K1', 'Kt', 'K2', 'B']; 
  var kumPikkus = 0;
  var otsitavTipp;
  var posTipus;
  for (var i = 0; i < tipuIDd.length; i++) {
    var tipuPikkus = $('#' + tipuIDd[i]).html().length;
    if (pos <= kumPikkus + tipuPikkus) {
      otsitavTipp = tipuIDd[i];
      posTipus = pos - kumPikkus;
      break 
    }
    kumPikkus = kumPikkus + tipuPikkus;
    if (tipuIDd[i] == 'K2' && tipuPikkus == 0) {
      kumPikkus += 1;
    }
  }

  // Sea caret
  var range = document.createRange();
  var el = document.getElementById(otsitavTipp);
  range.setStart(el.childNodes[0], posTipus);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);

  return ' caret: ' + otsitavTipp + ', ' + posTipus;
}
