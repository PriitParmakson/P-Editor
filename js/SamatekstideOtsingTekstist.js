function seaSamatekstidTekstistKasitlejad() {
  /*
    Ava ja sulge dialoog, otsi
  */
  $('#SamatekstideOtsing').click(function() {
    $('#SamatekstidTekstistDialoog').removeClass('peidetud');
    $('#SamatekstideOtsing').addClass('disabled');
    $('#SamatekstidTekstistTekst').focus();
  });

  $('#SamatekstidTekstistSulge').click(function() {
    $('#SamatekstidTekstistDialoog').addClass('peidetud');
    $('#SamatekstideOtsing').removeClass('disabled');
    $('#SamatekstidTekstistTekst').val('');
    $('#SamatekstidTekstistTulemus').empty();
  });

  $('#SamatekstidTekstistOtsi').click(function() {
    var t = $('#SamatekstidTekstistTekst').val();
    var r = samatekstideOtsingTekstist(t);
    var r2 = '<span> | ';
    for (var i = 0; i < r.length; i++) {
      r2 = r2 + r[i] + ' | ';
    }
    r2 += '</span>'; 
    $('#SamatekstidTekstistTulemus').html(r2);
  });
}

function samatekstideOtsingTekstist(t) {
  /*
    Samatekstide otsing tekstist. Tagastab leitud samatekstide massiivi.
  */
  var sAlgus;
  var sLopp;
  var sTahti; // Tähti samatekstis
  var et;
  var jt;
  var lisatavTekst;

  var samatekstid = [];

  // Ühekordse kesktähega tekstide otsimine
  for (var i = 0; i < t.length; i++) {
    if (!taht(t.charCodeAt(i))) { continue; }
    et = i;
    jt = i;
    sTahti = 1;
    do {
      et = eelmineTaht(et, t);
      jt = jargmineTaht(jt, t);
      if (typeof et == 'number' && 
          typeof jt == 'number' &&
          t[et].toLowerCase() == t[jt].toLowerCase()) {
        sTahti += 2;
        sAlgus = et;
        sLopp = jt;
      }
    }
    while(typeof et == 'number' &&
      typeof jt == 'number' &&
      t[et].toLowerCase() == t[jt].toLowerCase());

    if (sTahti > 3) {
      lisatavTekst = t.substring(sAlgus, sLopp + 1);
      if (samatekstid.indexOf(lisatavTekst) < 0) {
        samatekstid.push(lisatavTekst);
      }
    }
  }

  // Kahekordse kesktähega tekstide otsimine
  for (var i = 0; i < t.length; i++) {
    sTahti = 0;
    et = i + 1;
    jt = i;
    do {
      et = eelmineTaht(et, t);
      jt = jargmineTaht(jt, t);
      if (typeof et == 'number' && 
          typeof jt == 'number' &&
          t[et].toLowerCase() == t[jt].toLowerCase()) {
        sTahti += 2;
        sAlgus = et;
        sLopp = jt;
      }
    }
    while(typeof et == 'number' &&
      typeof jt == 'number' &&
      t[et].toLowerCase() == t[jt].toLowerCase());

    if (sTahti > 3) {
      lisatavTekst = t.substring(sAlgus, sLopp + 1);
      if (samatekstid.indexOf(lisatavTekst) < 0) {
        samatekstid.push(lisatavTekst);
      }
    }
  }

  return samatekstid;
}

function eelmineTaht(i, t) {
  /*
   Leiab tekstis t positsioonist i eelmise tähe.
   Kui eelmist ei ole, siis tagastab false.
   Positsioonid 0-põhised.
  */
  var j = i - 1;
  while (j >= 0) {
    var c = t.charCodeAt(j);
    if (taht(c)) {
      return j
    }
    j -= 1;
  }
  return false
}

function jargmineTaht(i, t) {
  /*
    Leiab tekstis t positsioonist i järgmise tähe.
    Kui järgmist ei ole, siis tagastab false.
    Positsioonid 0-põhised.
  */
  var j = i + 1;
  while (j < t.length) {
    var c = t.charCodeAt(j);
    if (taht(c)) {
      return j
    }
    j += 1;
  }
  return false
}
