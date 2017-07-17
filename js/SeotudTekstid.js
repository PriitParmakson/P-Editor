function seaSeotudTekstiKasitlejad() {
  /*
    Dialoogi avamine, sulgemine, seotud tekstide otsimine
  */

  $('#SeotudTekstid').click(function () {
    $('#SeotudTekstideDialoog').removeClass('peidetud');
    $('#SeotudTekstid').addClass('disabled');
  });

  $('#SeotudTekstidSulge').click(function () {
    $('#SeotudTekstideDialoog').addClass('peidetud');
    $('#SeotudTekstid').removeClass('disabled');
    $('#LeitudSeosed').html('');
  });

  $('#SeotudTekstid').click(function () {
    /*
      Leia tekstisisestusalal oleva teksti seosed kõigi teiste tekstidega.
    */
    var koguja = '';
    tekstid.forEach(function (t2) {
      var seos = tuvastaSuhe(t, t2.Tekst);
      if (seos !== null) {
        koguja += '<span class="kesk">' + seos + (seos.length > 1 ? ' ↔ ' : ' ') + '</span>' + t2.Tekst + '<br>';
      } 
    });
    $('#LeitudSeosed').html(koguja);
  });

}
