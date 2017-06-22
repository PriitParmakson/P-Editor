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
    var v = ''; // Vastuste koguja
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
            v += s + ' ';
            if (kuvaPoordkuju) {
              var ymberpooratav = s.slice(0, s.length - otsistring.length);
              v += '<span class="poord">' + pooraYmber(ymberpooratav) + '</span> ';
            }
          }
          break;
        case 2:
          if (s.startsWith(otsistring)) {
            v += s + ' ';
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
    $('#OtsinguTulemus').html(v);
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
