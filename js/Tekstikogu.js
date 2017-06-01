// Tekstikogu funktsioonid: laadimine, kuvamine, navigeerimine
function laeTekstid() {
  // Laeb Google töölehelt "Samatekstid" kõik tekstid ja kuvab esimese lehekülje (valmistab ette DOM-i, tekstikogu alla võib olla peidetud). 
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  $.get(url,
    function(data, status, xhr) {
      $('#Tekstikogu').empty();
      tekstid = data.Tekstid;
      // Kuva saadud tekstid
      kuvaLehekylg(1);
    }); 
}
function kuvaLehekylg(p) {
  // Kuvab massiivist 'tekstid' lehekülje p, DOM elementi 'Tekstikogu'
  // Ühtlasi uuendab sirvimispaneeli 'Sirvimine'
  // Kui lehekülje p tekste ei ole, siis ei tee midagi
  if (p < 1 || tekstid.length < tLk * (p - 1) + 1) {
    return
  }
  // Kuva tekstid
  // Puhasta eelmine
  $('#Tekstikogu').empty();
  // Massiiv tekstid on indekseeritud 0-alusel
  for (var i = tLk * (p - 1);
           i < tLk * p && i < tekstid.length; i++) {
    var kirje = $('<p></p>')
      .addClass('kirje')
      .appendTo('#Tekstikogu'); 
    // Märgendi Draft lisamine
    var kuvatavTekst =
      '<span class="tekstinr">' +
      (tekstid.length - i).toString() +
      '</span>' + 
      '.&nbsp;&nbsp;&nbsp;&nbsp;' +
      markeeriTekstikoguTekst(tekstid[i].Tekst);
    if (tekstid[i].Draft) {
      kuvatavTekst = kuvatavTekst + '<span class="margend">kavand</span>';
    }  
    var tekst = $('<span></span>')
      .attr('id', 't' + i.toString())
      .addClass('tekst')
      .html(kuvatavTekst)
      .appendTo(kirje);
  }
  jLk = p;
  // Uuenda sirvimispaneeli
  if (p > 1) {
    $('#FirstPage').removeClass('disabled')
    $('#PrevPage').removeClass('disabled')
  }
  else {
    $('#FirstPage').addClass('disabled')
    $('#PrevPage').addClass('disabled')
  }
  $('#PageNo').text(jLk.toString());
  if (p * tLk < tekstid.length) {
    $('#LastPage').removeClass('disabled')
    $('#NextPage').removeClass('disabled')
  }
  else {
    $('#LastPage').addClass('disabled')
    $('#NextPage').addClass('disabled')
  }
}  
function seaTekstikoguKasitlejad() {
  $('#AvaTekstikogu').click(function () {
    // Ava tekstikogu
    if ($('#Tekstikogu').hasClass('peidetud')) {
      $('#Tekstikogu').removeClass('peidetud');
      $('#Otsi').removeClass('disabled');
      $('#Sirvimine').removeClass('peidetud');
    }
    // Sule tekstikogu
    else {
      $('#Tekstikogu').addClass('peidetud');
      // Kui filtridialoog on avatud, siis sule ka see
      if ($('#Filtridialoog').is(':visible')) {
        suleFilter();
      } 
      // Sule tekstikogu
      $('#Otsi').addClass('disabled');
      $('#Sirvimine').addClass('peidetud');
    }
  });

  // Sirvimisnuppude käsitlejad
  $('#FirstPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(1); 
    }  
  });
  
  $('#NextPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk + 1);
    }
  });
  
  $('#PrevPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk - 1);
    }
  });
  
  $('#LastPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(Math.ceil(tekstid.length / tLk));
    }
  });
}

