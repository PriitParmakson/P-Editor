// Uue teksti salvestamise funktsioonid

function tekstSalvestuskujule(t) {
  /* Vii tekst salvestuskujule
     Koosta puhas tekst - eemalda kursorijoon ja kesktähe peegeltäht.
     Eeldab, et sisend t sisekujul tekst.
     Tagastab objekti kujul: { Tekst: c, Draft: draft }
  */
  var peegeltaheNr = tahti(t) / 2 + 1;
  var taheloendur = 0;
  var c = ''; // Puhas tekst
  var d = ''; // Tekst duplikaadi kontrolliks
  for (var i = 0; i < t.length; i++) {
    if (kirjavm(t[i])) {
      c += t[i];
    }
    else if (t[i] == "|") {
      // Jäta vahele
    }
    else {
      taheloendur++;
      // Jäta peegeltäht vahele?
      if (kuvaKesktahtYhekordselt) {
        if (taheloendur != peegeltaheNr) {
          c += t[i];
          d += t[i];
        }
      }
      else {
        c += t[i];
        d += t[i];
      }
    }
  }
  // Eemalda algus- ja lõputühikud
  c = c.trim();

  // Kontrolli duplikaati
  // Vaja mõelda, kuidas see efektiivselt teostada.

  // Kas on Draft?
  var draft = $('#draftNupp').prop('checked') ? true : false;

  return { Tekst: c, Draft: draft };
}

function salvestaTekst(s) {
  // Salvesta Google töölehele
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';

  // Tagastame jQuery deferred objekti
  return $.post(url, s,
    function() {
    });
}

function suleSalvestusdialoog() {
  // Sule salvestusdialoog
  $('#Salvestusdialoog').addClass('peidetud');
  aktiveeriTekstinupud();
  dialoogiseisund = 'N';
  $('#Tekst').focus();  
}

function seaSalvestuseKasitlejad() {
  // Salvestusdialoogi käsitlejad
  $('#Salvesta1').click(function() {
    // Ava salvestusdialoog 
    if (dialoogiseisund == 'N') {
      $('#Salvestusdialoog').removeClass('peidetud');
      deaktiveeriTekstinupud();
      dialoogiseisund = 'S';
      $('#draftNupp').focus();
    }
  });

  $('#Salvesta2').click(function() {
    var s = tekstSalvestuskujule(t);
    salvestaTekst(s).done(function() {
      suleSalvestusdialoog();
      console.log('Salvestatud tekst: ' + s.Tekst);
      // Uuenda tekstikogu
      // Lisada tekst
      tekstid.unshift(s);

      // Uuenda filtrit, kui see on avatud
      if ($('#Filtridialoog').is(':visible')) {
        seaFilter('Salvestati');
      }
      else if ($('#Tekstikogu').is(':visible')) {
        kuvaLehekylg(1);
      } 
      
    });
  });

  $('#Tyhista').click(function() {
    suleSalvestusdialoog();
  });
}
