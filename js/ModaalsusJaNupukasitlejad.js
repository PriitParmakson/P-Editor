'use strict';

function deaktiveeriTekstinupud() {
  /*
    Tekstiga tehtavate eritoimingute (uue teksti alustamine, poolte vahetamine, salvestusdialoogi avamine, seotud tekstide kuvamine) nuppude deaktiveerimine.
    Nupud deaktiveeritakse kui:
    1) avatakse salvestusdialoog;
    2) asetatud tekst ei ole samatekst (edasiliikumiseks tuleb veateatepaan sulgeda);
    Ei puutu Infonuppu.
  */
  $('#Uusnupp').addClass('disabled');
  $('#Poolednupp').addClass('disabled');
  $('#Salvesta1').addClass('disabled');
  $('#SeotudTekstid').addClass('disabled');
}

function aktiveeriTekstinupud() {
  /* Aktiveeri tekstitöötlusnupud, kuid mitte neid, mis tühiteksti puhul ei oma mõtet või ei ole lubatud autentimata kasutajale
  */
  if (t.length == 1) {
    $('#Poolednupp').addClass('disabled');
    $('#Uusnupp').addClass('disabled');
    $('#Salvesta1').addClass('disabled');
    $('#SeotudTekstid').addClass('disabled');
  }
  else {
    $('#Poolednupp').removeClass('disabled');
    $('#Uusnupp').removeClass('disabled');
    if (autenditud) {
      $('#Salvesta1').removeClass('disabled');
    }
    $('#SeotudTekstid').removeClass('disabled');
  }
  // Ei puutu Infonuppu
}

function seaTekstinupukasitlejad() {
  /*
    Sea sisestatava teksti käsitlejad ('Uus', 'Vaheta pooled')
  */

  $('#Uusnupp').click(() => {
    if (!$('#Salvestusdialoog').is(':visible')) {
      $('#Tekst').focus();
      t = "|";
      kuvaKesktahtYhekordselt = false;
      kuvaTekst();
    }
  });

  $('#Poolednupp').click(() => {
    if (!$('#Salvestusdialoog').is(':visible')) {
      $('#Tekst').focus();
      t = vahetaPooled(t);
      kuvaKesktahtYhekordselt = false;
      t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
      kuvaTekst();
    }
  });

  // Aktiveeri tekstiga seotud nupud
  aktiveeriTekstinupud();
}

function kuvaTeade(teade, teateTyyp) {
  /*
    Avab teatepaani ja kuvab teate, HTML-na.
    Oluline: sisend peab olema murdskriptimise seisukohalt
    kontrollitud ja vajadusel puhastatud.
    Deaktiveerib tekstitöötlusnupud. See tähendab, et kasutaja
    peab teate sulgema, enne kui edasi saab minna.
    Teate tüüp p.o kas 'OK' või 'NOK'. Vastavalt seatakse
    teate taustavärv (roheline või punane). Kui teatetüüp ei ole
    määratud, siis kuvatakse teade neutraalse taustavärviga.
  */
  $('#Teatepaan').removeClass('OKteade NOKteade');
  if (teateTyyp) {
    if (teateTyyp == 'OK') {
      $('#Teatepaan').addClass('OKteade');
    } else if (teateTyyp == 'NOK') {
      $('#Teatepaan').addClass('NOKteade');
    } 
  }
  
  $('#Teatepaan').removeClass('peidetud');
  $('#Teatetekst').html(teade);
  deaktiveeriTekstinupud();  
}

function seaTeatepaaniKasitlejad() {
  /*
    Teatepaani sulgemine
  */
  $('#TeatepaanSulge').click(() => {
    $('#Teatepaan').addClass('peidetud');
    /* Kui salvestusdialoog on avatud, siis sulge see */
    $('#Salvestusdialoog').addClass('peidetud');
    kuvaTekst();
    aktiveeriTekstinupud();
    $('#Tekst').focus();
  });
}

function seaInfopaaniKasitlejad() {
  /*
    Infopaani käsitlejad: avamine, sulgemine
  */  
  $('#Info').click(() => {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(() => {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

