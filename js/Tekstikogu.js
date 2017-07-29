'use strict';

function seaTekstikoguKasitlejad() {
  /*
    Tekstikogu funktsioonid: ava, sule, filtreeri
  */  

  $('#AvaTekstikogu').click(() => {
    if (!$('#AvaTekstikogu').hasClass('disabled')) {
      $('#Tekstikogu').removeClass('peidetud');
      $('#AvaTekstikogu').addClass('disabled');
      puhastaFilter();
      $('#Filtritekst').focus();
    }
  });

  /* Sule tekstikogu */  
  $('#FilterTyhista').click(() => {
    $('#Tekstikogu').addClass('peidetud');
    $('#AvaTekstikogu').removeClass('disabled');
    puhastaFilter();
    $('#Tekst').focus();
  });

  /* Muutus filtritekstis. Vt HTML5 input event 
    http://www.geedew.com/the-html5-input-event/ */
  $('#Filtritekst').on('input', (e) => filtreeriJaKuvaTekstid());

  /* Muutus piirajates */  
  $('.filtrivalik').on('click', (e) => filtreeriJaKuvaTekstid());

}

function puhastaFilter() {
  /*
    Lähtesta filter
  */
  $('#Filtritekst').val('');
  // Sea filtrivalikute algväärtused
  $('#RippuvTahtTekstiAlguses').prop('checked', false);
  $('#RippuvTahtTekstiLopus').prop('checked', false);
  $('#EsinebTekstis').prop('checked', false);
  $('#YhekordseltAlguses').prop('checked', false);
  $('#KeskelKahesSonas').prop('checked', false);
  $('#YhekordseltLopus').prop('checked', false);
  filtreeriJaKuvaTekstid();
}

function laeTekstid() {
  /*
    Laeb Google töölehelt "Samatekstid" kõik tekstid.
  */
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  $.get(url,
    function(data, status, xhr) {
      tekstid = data.Tekstid;
      // Kuva tekstide arv
      $('#TeksteTekstikogus').text(tekstid.length.toString());
      // Samatekstilisuse kontroll
      for (var i = 0; i < tekstid.length; i++) {
        if (!samatekst(tekstid[i].Tekst).on) {
          $('#Teatepaan').removeClass('peidetud');
          $('#Teatetekst').html($('#Teatetekst').html() + 'Ei ole samatekst: ' + tekstid[i].Tekst);
        }
      }
    }); 
}

function filtreeriJaKuvaTekstid() {
  /*
    Filtreeri vastavalt seatud filtrile ja kuva tekstikogu tekstid.
  */
  var filtritPole;
  if ($('#Filtritekst').val().length > 0) {
    filtritPole = false;
    var fL = $('#Filtritekst').val().toLowerCase();
    // Võta valikud
    var vasakul = $('#RippuvTahtTekstiAlguses').prop('checked');
    var paremal = $('#RippuvTahtTekstiLopus').prop('checked');
    var yhekordseltAlguses = $('#YhekordseltAlguses').prop('checked');
    var yhekordseltLopus = $('#YhekordseltLopus').prop('checked');
    var keskelKahesSonas = $('#KeskelKahesSonas').prop('checked');
    // Logi
    if (logimistase >= 1) {
      console.log('filtreeriJaKuvaTekstid: rakendan filtrit: ' +
        fL +
        (vasakul ? ': (Baa) ' : '') +
        (paremal ? ': (aaB) ' : '') +
        (yhekordseltAlguses ? ': (aa Baa) ' : '') +
        (yhekordseltLopus ? ': (aaB aa) ' : '') +
        (keskelKahesSonas ? ': (aaB Baa) ' : '')
      );
    }
  }
  else { 
    filtritPole = true;
  }

  // Puhasta eelmine
  $('#TekstikoguTekstid').empty();

  // Rakenda filter, kuva tekstid
  for (var i = 0; i < tekstid.length; i++) {
    var tekstL = tekstid[i].Tekst.toLowerCase();
    // Rakenda piirajad
    var ke = tuvastaKesktaht(tekstL); // Tagastab objekti
    if (
      filtritPole ||
      (
        // B aa 
        (vasakul && fL.length == 1 && tekstL.startsWith(fL + ' ')) ||
        // aa B
        (paremal && fL.length == 1 && tekstL.endsWith(' ' + fL)) ||
        // aa B aa  
        (yhekordseltAlguses && fL.length == 1 && ke.yhekordne && ke.sonaAlguses && fL == ke.taht) ||
        // aaB aa  
        (yhekordseltLopus && fL.length == 1 && ke.yhekordne &&ke.sonaLopus && fL == ke.taht) ||
        // aaB Baa
        (keskelKahesSonas && fL.length == 1 && !ke.yhekordne && ke.sonaAlguses && ke.sonaLopus && fL == ke.taht) ||
        // Lihtne sisalduvus  
        (!vasakul && !paremal && !yhekordseltAlguses && !yhekordseltLopus && !keskelKahesSonas && tekstL.includes(fL))
      )
        ) {
      var kirje = $('<p></p>')
        .addClass('kirje')
        .appendTo('#TekstikoguTekstid'); 
      // Märgendi Draft lisamine
      var kuvatavTekst = markeeriTekstikoguTekst(tekstid[i].Tekst);
      if (tekstid[i].Draft) {
        kuvatavTekst = kuvatavTekst + '<span class="margend">kavand</span>';
      }  
      var tekst = $('<span></span>')
        .attr('id', 't' + i.toString())
        .addClass('tekst')
        .html(kuvatavTekst)
        .appendTo(kirje);
    }
  }
}
