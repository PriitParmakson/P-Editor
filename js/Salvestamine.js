'use strict';

function seaSalvestuseKasitlejad() {
  /*
   Salvestusdialoogi avamine, salvestamine, dialoogi sulgemine
  */ 
  $('#Salvesta1').click(() => avaSalvestusdialoog());
  $('#Salvesta2').click(() => salvestaTekst());
  $('#Tyhista').click(() => suleSalvestusdialoog());
}

function avaSalvestusdialoog() {
  /*
   Salvestusdialoogi avamine
  */
  if (!$('#Salvestusdialoog').is(':visible')) {
    $('#Salvestusdialoog').removeClass('peidetud');
    $('#Salvesta2').removeClass('disabled');
    deaktiveeriTekstinupud();
    var s = tekstSalvestuskujule(t);
    /* Duplikaadikontroll
    */
    var k1 = kanoonilineKuju(s.Tekst);
    tekstid.some(function (t2) {
      if (k1 == kanoonilineKuju(t2.Tekst)) {
        kuvaTeade('Duplikaattekst');
        $('#Salvesta2').addClass('disabled');
        return true;
      }
      else return false;
    });
    $('#draftNupp').focus();
  }
}

function salvestaTekst() {
  /*
   Salvesta Google töölehele
  */ 
  if ($(this).hasClass('disabled')) {
    return;
  }
  var s = tekstSalvestuskujule(t);
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  var postDeferred = $.post(url, s);
  postDeferred.done(function(data, status) {
    console.log('salvestaTekst: POST vastus: data: ' + data.toString());
    console.log('salvestaTekst: POST vastus: status: ' + status);
    // Töötle jQuery vastus
    if (status !== 'success') {
      kuvaTeade('Salvestamine ebaõnnestus. Staatus: ' + status);
      console.log('Salvestamine ebaõnnestus. Staatus: ' + status);
      return
    }
    // Töötle töölehe vastus
    var vastus = JSON.parse(data);
    if (vastus.result == 'success') {
      kuvaTeade('Salvestatud');
      if (logimistase > 0) {
        console.log('salvestaTekst: salvestatud tekst: ' + s.Tekst);
      }
    } else { 
      kuvaTeade('Salvestamine ebaõnnestus. Viga: ' + vastus.error);
      console.log('Salvestamine ebaõnnestus. Viga: ' + vastus.error);
      return
    }
    suleSalvestusdialoog();

    // Uuenda tekstikogu
    // Lisada tekst
    tekstid.unshift(s);
    // Uuendada tekstide arvu
    $('#TeksteTekstikogus').text(tekstid.length.toString());
    // Uuenda tekstikogu kuva, kui see on avatud
    if ($('#Tekstikogu').is(':visible')) {
      filtreeriJaKuvaTekstid();
    } 
    
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
