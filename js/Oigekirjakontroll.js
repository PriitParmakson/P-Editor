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

  $('#OigekiriKontrolli').click(function() {
    var k = $('#KontrollitavTekst').val();
    var t = samatekst(k) ? 'on samatekst' : 'ei ole samatekst';
    $('#KontrolliTulemus').text(t);
  });
}

