// Tekstikogu filtreerimise (tekstide otsimise) funktsioonid
function seaFilter(klopsatudValik) {
  var fL = $('#Filtritekst').val().toLowerCase();
  // Võta valikud
  var vasakul = $('#RippuvTahtTekstiAlguses').prop('checked');
  var paremal = $('#RippuvTahtTekstiLopus').prop('checked');
  var yhekordseltAlguses = $('#YhekordseltAlguses').prop('checked');
  var yhekordseltLopus = $('#YhekordseltLopus').prop('checked');
  var keskelKahesSonas = $('#KeskelKahesSonas').prop('checked');
  console.log('Filter: ' +
    fL +
    (vasakul ? ': (Baa) ' : '') +
    (paremal ? ': (aaB) ' : '') +
    (yhekordseltAlguses ? ': (aa Baa) ' : '') +
    (yhekordseltLopus ? ': (aaB aa) ' : '') +
    (keskelKahesSonas ? ': (aaB Baa) ' : '')
  );
  // Puhasta eelmine
  $('#Tekstikogu').empty();
  for (var i = 0; i < tekstid.length; i++) {
    var tekstL = tekstid[i].Tekst.toLowerCase();
    // Rakenda piirajad
    var ke = tuvastaKesktaht(tekstL).taht;
    if (
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
        ) {
      var kirje = $('<p></p>')
        .addClass('kirje')
        .appendTo('#Tekstikogu'); 
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
function suleFilter() {
  /* Eemalda filter, sule filtridialoog, eemalda filtritekst ja fokusseeri tekstile. Taasta sirvimine */
  $('#Sirvimine').removeClass('peidetud');
  kuvaLehekylg(jLk);
  $('#Filtridialoog').addClass('peidetud');
  $('#Filtritekst').val('');
  $('#Tekst').focus();
  $('#Otsi').removeClass('disabled');
}
function seaFiltriKasitlejad() {
  // Sea filtrivalikute algväärtused
  $('#RippuvTahtTekstiAlguses').prop('checked', false);
  $('#RippuvTahtTekstiLopus').prop('checked', false);
  $('#EsinebTekstis').prop('checked', false);
  $('#YhekordseltAlguses').prop('checked', false);
  $('#KeskelKahesSonas').prop('checked', false);
  $('#YhekordseltLopus').prop('checked', false);

  // Filtridialoogi käsitlejad
  $('#Otsi').click(function() {
    if (!$('#Otsi').hasClass('disabled')) {
      $('#Filtridialoog').removeClass('peidetud');
      $('#Sirvimine').addClass('peidetud');
      $('#Filtritekst').val('').focus();
      $('#Otsi').addClass('disabled');
      seaFilter($(this).attr('id'));
    }
  });

  $('#FilterTyhista').click(function() {
    suleFilter();
  });
  
  // Vt HTML5 input event 
  // http://www.geedew.com/the-html5-input-event/ 
  $('#Filtritekst').on('input', function(e){
    seaFilter($(this).attr('id'));
  });

  $('.filtrivalik').on('click', function(e){
    seaFilter($(this).attr('id'));
  });
}

