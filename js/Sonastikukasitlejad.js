'use strict';

function seaSonastikuKasitlejad() {
  /*
    Sõnastikudialoogi avamine ja sulgemine, otsing
  */

  $('#Sonastik').click(() => {
    $('#Sonastikudialoog').removeClass('peidetud');
    $('#Sonastik').addClass('disabled');
    $('#SonuSonastikus').text(sonastik.length.toString());
    $('#Otsistring').focus();
  });

  $('#SonastikSulge').click(() => {
    $('#Sonastikudialoog').addClass('peidetud');
    $('#Sonastik').removeClass('disabled');
    $('#OtsinguTulemus').text('');
    $('#Otsistring').val('');
  });

  $('#Otsistring').on('keypress', function (e) {
    if (e.keyCode == 13) { // Enter vajutatud
      otsiSonastikust();
    }
  });

  $('#OtsiSonastikust').click(() => {
    otsiSonastikust();
  });

}  

function otsiSonastikust() {
  /*
    Otsib sõnastikust, kas lihtsa otsistringi (lubatud kujud: <string>, <string>*, *<string>) või Regex-i alusel.
    Otsimise käivitamiseks on kaks moodust: vajutada Enter otsistringi väljas või vajutada nuppu 'OtsiSonastikust'.
  */
  var v = ''; // Vastuste koguja
  var otsiRegexiga = $('#Regulaaravaldis').prop('checked');

  if (otsiRegexiga) {
    var otsivRegex = $('#Otsistring').val();
    for (var i = 0; i < sonastik.length; i++) {
      var s = sonastik[i];
      if (s.match(otsivRegex) != null) {
        v += s + ' ';
      }
    }
  } else {
    var otsireziim;
    var otsistring = $('#Otsistring').val();
    var kuvaPoordkuju = $('#KuvaPoordkuju').prop('checked');
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
    for (var i = 0; i < sonastik.length; i++) {
      var s = sonastik[i];
      switch (otsireziim) {
        case 1:
          if (s.endsWith(otsistring)) {
            /* Otsistring kuvada väljatoodult */
            v += s.substr(0, s.length - otsistring.length) + '<span class="kesk">' + otsistring + '</span> ';
            if (kuvaPoordkuju) {
              var ymberpooratav = s.slice(0, s.length - otsistring.length);
              v += '<span class="poord">' + pooraYmber(ymberpooratav) + '</span> ';
            }
          }
          break;
        case 2:
          if (s.startsWith(otsistring)) {
            v += '<span class="kesk">' + otsistring + '</span>' + s.substr(otsistring.length) + ' ';
            if (kuvaPoordkuju) {
              var ymberpooratav = s.slice(otsistring.length);
              v += '<span class="poord">' + pooraYmber(ymberpooratav) + '</span> ';
            }
          }
          break;
        case 3:
          if (s.includes(otsistring)) {
            v += s + ' ';
            if (kuvaPoordkuju) {
              v += '<span class="poord">' + pooraYmber(s) + '</span> ';
            }
          }
          break;
        default:
          break;
      }
    }
  }
  $('#OtsinguTulemus').html(v);
}
