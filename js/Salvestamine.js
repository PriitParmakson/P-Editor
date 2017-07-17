function tekstSalvestuskujule(t) {
  /*
     Vii tekst salvestuskujule
     Koosta puhas tekst - eemalda kursorijoon ja kesktähe peegeltäht.
     Eeldab, et sisend t sisekujul tekst.
     Tagastab objekti kujul:
      { Tekst: <string>,
        Draft: <boolean>,
        Nimi: <string>,
        EPost: <string>,
        IDToken: <string>
      }
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

  // Kas on Draft?
  var draft = $('#draftNupp').prop('checked') ? true : false;

  // Autori nimi ja e-post
  var nimi = kasutajaProfiil.getName();
  var ePost = kasutajaProfiil.getEmail();

  return { Tekst: c, Draft: draft, Nimi: nimi, EPost: ePost, IDToken: id_token };
}

function salvestaTekst(s) {
  /*
   Salvesta Google töölehele
  */ 
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';

  // Tagastame jQuery deferred objekti
  return $.post(url, s,
    function() {
    });
}

function suleSalvestusdialoog() {
  /*
    Sule salvestusdialoog
  */
  $('#Salvestusdialoog').addClass('peidetud');
  aktiveeriTekstinupud();
  dialoogiseisund = 'N';
  $('#Tekst').focus();  
}

function seaSalvestuseKasitlejad() {
  /*
   Salvestusdialoogi avamine, salvestamine, dialoogi sulgemine
  */ 

  $('#Salvesta1').click(function() {
    // Salvestusdialoogi avamine
    if (dialoogiseisund == 'N') {
      $('#Salvestusdialoog').removeClass('peidetud');
      deaktiveeriTekstinupud();
      dialoogiseisund = 'S';
      /* Duplikaadikontroll
      */
      var s = tekstSalvestuskujule(t);
      var k1 = kanoonilineKuju(s.Tekst);
      // Sule teatepaan, kui see oli avatud
      $('#Teatetekst').html('');
      $('#Teatepaan').addClass('peidetud');
      tekstid.some(function(t2) {
        if (k1 == kanoonilineKuju(t2.Tekst)) {
          $('#Teatepaan').removeClass('peidetud');
          $('#Teatetekst').html('Duplikaattekst');
          return true;
        }
        else return false;
      });
      $('#draftNupp').focus();
    }
  });

  $('#Salvesta2').click(function() {
    var s = tekstSalvestuskujule(t);
    /* Salvestamine
    */
    salvestaTekst(s).done(function() {
      suleSalvestusdialoog();
      if (logimistase > 0) {
        console.log('#Salvesta2: salvestatud tekst: ' + s.Tekst);
      }
      // Uuenda tekstikogu
      // Lisada tekst
      tekstid.unshift(s);
      // Uuendada tekstide arvu
      $('#TeksteTekstikogus').text(tekstid.length.toString());

      // Uuenda tekstikogu, kui see on avatud
      if ($('#Tekstikogu').is(':visible')) {
        filtreeriJaKuvaTekstid();
      } 
      
    });
  });

  $('#Tyhista').click(function() {
    suleSalvestusdialoog();
  });
}
