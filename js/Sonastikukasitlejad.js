'use strict';

var otsiajalugu = [];

function seaSonastikuKasitlejad() {
  /*
    Sõnastikudialoogi avamine ja sulgemine, otsing
  */

  $('#KuvaPoordkuju').prop('checked', true);
  $('#Regulaaravaldis').prop('checked', false);
  $('#OtsiKohanimedest').prop('checked', false);

  $('#Sonastik').click(() => {
    $('#Sonastikudialoog').removeClass('peidetud');
    $('#Sonastik').addClass('disabled');
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

  $('#EelmineOtsing').click(() => {
    if (otsiajalugu.length > 0) {
      // Võta eelmine otsing
      var eO = otsiajalugu.pop(); 
      $('#Otsistring').val(eO.otsistring);
      $('#KuvaPoordkuju').prop('checked', eO.kuvaPoordkuju);
      $('#Regulaaravaldis').prop('checked', eO.otsiRegexiga);
      $('#OtsiKohanimedest').prop('checked', eO.otsiKohanimedest);
      // Soorita eelmine otsing
      otsiSonastikust();
      if (otsiajalugu.length == 0) {
        $('#EelmineOtsing').addClass('disabled');
      }
    }
  });

}

function otsiSonastikust() {
  /*
    Otsib sõnastikust, kas lihtsa otsistringi (lubatud kujud: <string>, <string>*, *<string>) või Regex-i alusel.
    Otsimise käivitamiseks on kaks moodust: vajutada Enter otsistringi väljas või vajutada nuppu 'OtsiSonastikust'.
    Sõnastik koosneb kahest osast: 1) ÕS-ipõhine ja 2) kohanimeregistri põhine.
  */
 var otsistring = $('#Otsistring').val();
 var kuvaPoordkuju = $('#KuvaPoordkuju').prop('checked');
 var otsiRegexiga = $('#Regulaaravaldis').prop('checked');
 var otsiKohanimedest = $('#OtsiKohanimedest').prop('checked');
 var v = ''; // Vastuste koguja

  // lisa otsing otsiajalukku
  otsiajalugu.push({
    otsistring: otsistring,
    kuvaPoordkuju: kuvaPoordkuju,
    otsiRegexiga: otsiRegexiga,
    otsiKohanimedest: otsiKohanimedest
  });
  $('#EelmineOtsing').removeClass('disabled');

  /*
    Sõnastik, kust otsida (ÕS või kohanimeregister). Kopeerimine pole efektiivne, perspektiivis leida parem lahendus.
  */
  var kustOtsida = (otsiKohanimedest) ? kohanimed : sonastik;

  if (otsiRegexiga) {
    for (var i = 0; i < kustOtsida.length; i++) {
      var s = kustOtsida[i];
      if (s.match(otsistring) != null) {
        v += s + ' ';
      }
    }
  } else {
    let otsireziim; /* 1, 2 või 3 vastavalt kas otsistring algab või lõpeb tärniga või on tärnita */
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
