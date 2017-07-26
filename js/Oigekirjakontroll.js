'use strict';

function seaOigekirjakasitlejad() {
/*
  Õigekirjakontroll: ava dialoog, kontrolli, sulge dialoog
*/  
  $('#Oigekirjakontroll').click(function() {
    $('#Oigekirjadialoog').removeClass('peidetud');
    $('#Oigekirjakontroll').addClass('disabled');
    $('#KontrollitavTekst').focus();
  });

  $('#OigekiriSulge').click(function() {
    $('#Oigekirjadialoog').addClass('peidetud');
    $('#Oigekirjakontroll').removeClass('disabled');
  });

  $('#OigekiriKontrolli').click(() => {
    var t;
    var k = $('#KontrollitavTekst').val();
    if (samatekst(k).on) {
      t = 'on samatekst';
    }
    else {
      t = 'ei ole samatekst';
    }
    $('#KontrolliTulemus').text(t);
  });
}

