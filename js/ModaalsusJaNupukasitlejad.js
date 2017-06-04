// Teksti eritoimingute modaalsusega seotud käsitlejad
function aktiveeriTekstinupud() {
  // Aktiveeri tekstitöötlusnupud, kuid mitte neid, mis
  // tühiteksti puhul ei oma mõtet
  if (t.length == 1) {
    $('#Poolednupp').addClass('disabled');
    $('#Uusnupp').addClass('disabled');
    $('#Salvesta1').addClass('disabled');
  } 
  else {
    $('#Poolednupp').removeClass('disabled');
    $('#Uusnupp').removeClass('disabled');
    $('#Salvesta1').removeClass('disabled');
  }
  // Ei puutu Infonuppu
}
function deaktiveeriTekstinupud() {
  $('#Poolednupp').addClass('disabled');
  $('#Uusnupp').addClass('disabled');
  $('#Salvesta1').addClass('disabled');
  // Ei puutu Infonuppu
}

function seaTekstinupukasitlejad() {
  // Sea sisestatava teksti käsitlejad
  $('#Poolednupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = vahetaPooled(t);
      kuvaKesktahtYhekordselt = false;
      t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
      kuvaTekst();
    }
  });

  $('#Uusnupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = "|";
      kuvaKesktahtYhekordselt = false;
      kuvaTekst();
    }
  });

  // Aktiveeri tekstiga seotud nupud
  aktiveeriTekstinupud();
}

// Teabepaani nupukäsitlejad
function seaInfopaaniKasitlejad() {
  // Infopaani käsitlejad
  $('#Info').click(function() {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(function() {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

// "Kooli" nupukäsitlejad
function seaKoolikasitlejad() {
  $('#Kool').click(function() {
    $('#Koolitekst').removeClass('peidetud');
    $('#Kool').addClass('disabled');
  });

  $('#KoolSulge').click(function() {
    $('#Koolitekst').addClass('peidetud');
    $('#Kool').removeClass('disabled');
  });
}
