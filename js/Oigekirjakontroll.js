// Õigekirjakontroll
function seaOigekirjakasitlejad() {
  $('#Oigekirjakontroll').click(function() {
    $('#Oigekirjadialoog').removeClass('peidetud');
    $('#Oigekirjakontroll').addClass('disabled');
    $('#KontrollitavTekst').focus();
  });

  $('#OigekiriSulge').click(function() {
    $('#Oigekirjadialoog').addClass('peidetud');
    $('#Oigekirjakontroll').removeClass('disabled');
  });

  $('#OigekiriKontrolli').click(function () {
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

