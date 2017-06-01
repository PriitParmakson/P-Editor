function eelmineTaht(i, t) {
  /* Leiab tekstis t positsioonist i eelmise tähe.
     Kui eelmist ei ole, siis tagastab false.
     Positsioonid 0-põhised. */
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
  /* Leiab tekstis t positsioonist i järgmise tähe.
     Kui järgmist ei ole, siis tagastab false.
     Positsioonid 0-põhised. */
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

function samatekstideOtsingTekstist(t) {
  /* Samatekstide otsing tekstist. Tagastab leitud samatekstide massiivi. */
  var sAlgus;
  var sLopp;
  var sTahti; // Tähti samatekstis
  var et;
  var jt;
  var lisatavTekst;

  var samatekstid = [];

  // Ühekordse kesktähega tekstide otsimine
  for (var i = 0; i < t.length; i++) {
    if (!taht(t[i])) { continue; }
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
