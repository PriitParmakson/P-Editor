function seaPuhvriKasitlejad() {
  /*
    Puhvridialoogi avamine ja sulgemine, rotatsioon tekstisisestusala ja puhvri vahel, puhvri tühjendamine
  */

  $('#AvaPuhverNupp').click(function () {
    $('#Puhvridialoog').removeClass('peidetud');
    $('#AvaPuhverNupp').addClass('disabled');
    LisaTekstPuhvrisse();
  });

  $('#SulgePuhverNupp').click(function () {
    $('#Puhvridialoog').addClass('peidetud');
    $('#AvaPuhverNupp').removeClass('disabled');
  });

  function LisaTekstPuhvrisse() {
    /*
      Kui tekstisisestusala ei ole tühi, siis
        lisa selle sisu puhvrisse
    */
    if (t.length > 1) {
      puhver.push({
        tekst: t,
        kuvaKesktahtYhekordselt: kuvaKesktahtYhekordselt
      });
      // Markeeri kuvatav tekst, kuid eemalda id-d
      var m = markeeriTekst(t).replace(/ id='.+?'/g, '');
      // Kuva puhvrisse lisatud tekst
      $('<p></p>')
        .html(m)
        .appendTo('#Puhvritekstid');
    }
  }

  $('#PuhverPush').click(function () {
    LisaTekstPuhvrisse();
  });

  $('#PuhverPop').click(function () {
    /*
      Kui puhver ei ole tühi, siis
        kanna viimati puhvrisse lisatud tekst tekstisisestusalasse 
    */
    if (puhver.length > 0) {
      var k = puhver.pop();
      t = k.tekst;
      kuvaKesktahtYhekordselt = k.kuvaKesktahtYhekordselt;
      kuvaTekst();
      $('#Puhvritekstid p:last-child')
        .remove();
    }
  });

  $('#PuhverPuhastaNupp').click(function () {
    puhver = [];
    $('#Puhvritekstid').empty();
  });

}