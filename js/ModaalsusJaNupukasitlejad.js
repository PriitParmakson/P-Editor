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
  $('#Poolednupp').click(function () {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = vahetaPooled(t);
      kuvaKesktahtYhekordselt = false;
      t = eemaldaLiigsedTyhikud(t, kuvaKesktahtYhekordselt);
      kuvaTekst();
    }
  });

  $('#Uusnupp').click(function () {
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

function seaTeatepaaniKasitlejad() {
  $('#TeatepaanSulge').click(function() {
    $('#Teatepaan').addClass('peidetud');
    kuvaTekst();
    aktiveeriTekstinupud();
    $('#Tekst').focus();
  });
}

// Teabepaani nupukäsitlejad
function seaInfopaaniKasitlejad() {
  // Infopaani käsitlejad
  $('#Info').click(function () {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(function () {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

/*
*/
function seaSonastikuKasitlejad() {
  $('#Sonastik').click(function () {
    $('#Sonastikudialoog').removeClass('peidetud');
    $('#Sonastik').addClass('disabled');
  });

  $('#SonastikSulge').click(function () {
    $('#Sonastikudialoog').addClass('peidetud');
    $('#Sonastik').removeClass('disabled');
    $('#OtsinguTulemus').text('');
    $('#Otsistring').val('');
  });

  /* Otsistringis lubatud kujud: <string>, <string>*, *<string>.
    Otsimise käivitamiseks on kaks moodust: vajutada Enter otsistringi väljas või vajutada nuppu 'OtsiSonastikust'
  */

  function teeOtsing() {
    var otsistring = $('#Otsistring').val();
    var otsireziim;
    if (otsistring.startsWith('*')) {
      otsireziim = 1;
      otsistring = otsistring.substr(1);
    }
    else if (otsistring.endsWith('*')) {
      otsireziim = 2;
      otsistring = otsistring.substr(0, otsistring.length - 1);
    }
    else {
      otsireziim = 3; 
    }
    var v = ''; // Vastuste koguja
    for (var i = 0; i < sonastik.length; i++) {
      switch (otsireziim) {
        case 1:
          if (sonastik[i].endsWith(otsistring)) {
            v += sonastik[i] + ' ';
          }
          break;
        case 2:
          if (sonastik[i].startsWith(otsistring)) {
            v += sonastik[i] + ' ';
          }
          break;
        case 3:
          if (sonastik[i].includes(otsistring)) {
            v += sonastik[i] + ' ';
          }
          break;      
        default:
          break;
      }
    }
    $('#OtsinguTulemus').text(v);
  }

  $('#Otsistring').on('keypress', function (e) {
    if (e.keyCode == 13) { // Enter vajutatud
      teeOtsing();
    }
  });

  $('#OtsiSonastikust').click(function () {
    teeOtsing();
  });

}  
