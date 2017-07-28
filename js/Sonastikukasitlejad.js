'use strict';

function seaSonastikuKasitlejad() {
  /*
    Sõnastikudialoogi avamine ja sulgemine, otsing
  */

  $('#Sonastik').click(() => {
    $('#Sonastikudialoog').removeClass('peidetud');
    $('#Sonastik').addClass('disabled');
    $('#SonuSonastikus').html(
      '<span class="Loendur">' + 
      sonastik.length.toString() +
      '</span> sõna, <span class="Loendur">' +
      kohanimed.length.toString() +
      '</span> kohanime');
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
    Sõnastik koosneb kahest osast: 1) ÕS-ipõhine ja 2) kohanimeregistri põhine.
  */
  var v = ''; // Vastuste koguja
  var otsiRegexiga = $('#Regulaaravaldis').prop('checked');
  var otsiKohanimedest = $('#OtsiKohanimedest').prop('checked');

  /*
    Sõnastik, kust otsida (ÕS või kohanimeregister). Kopeerimine pole efektiivne, perspektiivis leida parem lahendus.
  */
  var kustOtsida = (otsiKohanimedest) ? kohanimed : sonastik;

  if (otsiRegexiga) {
    var otsivRegex = $('#Otsistring').val();
    for (var i = 0; i < kustOtsida.length; i++) {
      var s = kustOtsida[i];
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
    for (var i = 0; i < kustOtsida.length; i++) {
      var s = kustOtsida[i];
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
