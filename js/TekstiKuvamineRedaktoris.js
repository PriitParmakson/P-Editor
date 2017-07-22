/* Teksti kuvamise funktsioonid:
  kuvaTekst()
  markeeriTekst()
  seaCaret()
*/

function kuvaTekst() {
  /*
   Markeerib ja kuvab teksti, seab caret ja väljastab silumiseks vastava teate konsoolile.
  */ 
  var mTekst = markeeriTekst(t, kuvaKesktahtYhekordselt);
  $('#Tekst').html(mTekst);
  seaCaret(t.indexOf('|'));
  // Logimine
  if (logimistase > 0) {
    console.log('kuvaTekst: kuvan teksti: ' + moodustaTekstiStruktuurKonsoolile());
  }
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

function markeeriTekst(markeeritavTekst, kuvaKesktahtYhekordselt) {
  /* Sisendiks on sisekujul tekst ja märge, kas kesktähte kuvatakse
    ühekordselt. Tagastab HTML-i viidud, markeeritud kesktähtedega teksti. Kesktähed jagavad teksti 5 ossa. Tagastatava HTML-i struktuur:
    <p>
      <span id='A'>tähed enne esimest kesktähte</span>
      <span id='K1'> esimene kesktäht </span>
      <span id='Kt'>kirjavahemärgid kesktähtede vahel</span>
      <span id='K2'>(teine kesktäht)</span>
      <span id='B'>tähed pärast teist kesktähte</span>
    </p>
    Kursor jäetakse vahele. Tekstiosad võivad olla tühjad.
    Ei sõltu ega mõjuta globaalseid muutujaid.
  */

  var koguja = ['', '', '', '', ''];
  // Koguja tekstiosadele A, K1, Kt, K2, B
  var mode = '0'; // Kogutava tekstiosa indeks (0-põhine)

  var p = tahti(markeeritavTekst) / 2; // Alati täisarv, sest tekstis on mõlemad kesktähed, ka siis, kui kuvatakse ainult ühte.
  var taheloendur = 0;

  if (markeeritavTekst.length == 1) {
    // Tühja teksti puhul lisa  0-pikkusega tühik. See on vajalik caret positsioneerimiseks.
    koguja[0] = '&#8203;'; 
  }
  else {
    // Kogu tekstiosad
    for (var i = 0; i < markeeritavTekst.length; i++) {
      // Kursorijoon, ei esita markeeritud tekstis
      if (markeeritavTekst[i] == '|') {
      }
      // Kirjavahemärk
      else if (kirjavm(markeeritavTekst[i])) {
        if (markeeritavTekst[i] == '/') {
          // koguja[mode] = '<br>'; ei sobi, sest caret positsioneerimine läheb keerukaks
          koguja[mode] = koguja[mode] + markeeritavTekst[i];
        }
        else {
          koguja[mode] = koguja[mode] + markeeritavTekst[i];
        }
      }
      // Täht
      else {
        taheloendur++;
        // Esimene kesktäht markeerida
        if (taheloendur == p) {
          koguja[1] = markeeritavTekst[i];
          mode = 2;  
        }
        // Teine kesktäht...
        else if (taheloendur == p + 1) {
          if (kuvaKesktahtYhekordselt) {
            // ...mitte kuvada
          }
          else {
            // ...kuvada ja markeerida
            koguja[3] = markeeritavTekst[i];
          }
          mode = 4;
        }
        // Kuvada tavaliselt
        else {
          koguja[mode] = koguja[mode] + markeeritavTekst[i];
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

function seaCaret(pos) {
  /* Seab kursori (caret) kuvatud tekstis. Väljastab vastava logiteate.
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
    /* Tühja tippu ei saa caret-d seada
    */
    if (tipuPikkus > 0 && pos <= kumPikkus + tipuPikkus) {
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

  if (logimistase > 0) {
    console.log('seaCaret:' + ' seatud caret tippu ' + otsitavTipp + ', positsiooni ' + posTipus);
  }

  return;
}
