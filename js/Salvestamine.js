function tekstSalvestuskujule(t) {
  /*
     Vii tekst salvestuskujule
     Koosta puhas tekst - eemalda kursorijoon ja kesktähe peegeltäht.
     Eeldab, et sisend t sisekujul tekst.
     Tagastab objekti kujul:
      { Tekst: <string>,
        Draft: <boolean>,
        IDToken: <string>
      }
  */
  var peegeltaheNr = tahti(t) / 2 + 1;
  var taheloendur = 0;
  var c = ''; // Puhas tekst
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
        }
      }
      else {
        c += t[i];
      }
    }
  }
  // Eemalda algus- ja lõputühikud
  c = c.trim();

  // Kas on Draft?
  var draft = $('#draftNupp').prop('checked') ? true : false;

  /* ID token on oluline võtta iga kord enne salvestamist, sest see aegub tunniga. */  
  var id_token = kasutaja.getAuthResponse().id_token;

  return { Tekst: c, Draft: draft, IDToken: id_token };
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
  $('#Tekst').focus();  
}

function seaSalvestuseKasitlejad() {
  /*
   Salvestusdialoogi avamine, salvestamine, dialoogi sulgemine
  */ 

  $('#Salvesta1').click(function() {
    // Salvestusdialoogi avamine
    if (!$('#Salvestusdialoog').is(':visible')) {
      $('#Salvestusdialoog').removeClass('peidetud');
      $('#Salvesta2').removeClass('disabled');
      deaktiveeriTekstinupud();
      var s = tekstSalvestuskujule(t);
      /* Duplikaadikontroll
      */
      var k1 = kanoonilineKuju(s.Tekst);
      // Sule teatepaan, kui see oli avatud
      $('#Teatetekst').html('');
      $('#Teatepaan').addClass('peidetud');
      tekstid.some(function (t2) {
        console.log(kanoonilineKuju(t2.Tekst));
        if (k1 == kanoonilineKuju(t2.Tekst)) {
          $('#Teatepaan').removeClass('peidetud');
          $('#Teatetekst').html('Duplikaattekst');
          $('#Salvesta2').addClass('disabled');
          return true;
        }
        else return false;
      });
      $('#draftNupp').focus();
    }
  });

  $('#Salvesta2').click(function () {
    if ($(this).hasClass('disabled')) {
      return;
    }
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
