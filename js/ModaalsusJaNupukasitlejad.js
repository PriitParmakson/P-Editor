function deaktiveeriTekstinupud() {
  /*
    Tekstiga tehtavate eritoimingute (uue teksti alustamine, poolte vahetamine, salvestusdialoogi avamine, seotud tekstide kuvamine) nuppude deaktiveerimine.
    Nupud deaktiveeritakse kui:
    1) avatakse salvestusdialoog;
    2) asetatud tekst ei ole samatekst (edasiliikumiseks tuleb veateatepaan sulgeda);
  */
  $('#Uusnupp').addClass('disabled');
  $('#Poolednupp').addClass('disabled');
  $('#Salvesta1').addClass('disabled');
  $('#SeotudTekstid').addClass('disabled');
  // Ei puutu Infonuppu
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

  $('#Uusnupp').click(function () {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = "|";
      kuvaKesktahtYhekordselt = false;
      kuvaTekst();
    }
  });

  $('#Poolednupp').click(function () {
    if (dialoogiseisund == 'N') {
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

function seaTeatepaaniKasitlejad() {
  /*
    Teatepaani avamine ja sulgemine
  */
  // Teatepaani sulgemine
  $('#TeatepaanSulge').click(function() {
    $('#Teatepaan').addClass('peidetud');
    /* Kui salvestusdialoog on avatud, siis sulge see */
    $('#Salvestusdialoog').addClass('peidetud');
    dialoogiseisund = 'N';
    kuvaTekst();
    aktiveeriTekstinupud();
    $('#Tekst').focus();
  });
}

function seaInfopaaniKasitlejad() {
  /*
    Infopaani käsitlejad: avamine, sulgemine
  */  
  $('#Info').click(function () {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(function () {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

