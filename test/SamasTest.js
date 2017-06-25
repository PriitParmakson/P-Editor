var edukaidTeste = 0;
var mitteedukaidTeste = 0;

function jooksutaTestid() {
  /* Testide käivitaja

  */
  // SalvestuseEksperiment();
  kanoonilineKujuTestid();
  puhastaTekstTestid();
  tekstistSiseesitusseTestid();
  samatekstideOtsingTekstistTestid();
  eemaldaLiigsedTyhikudTestid();
  vahetaPooledTestid();
  leiaTahtTestid();
  tuvastaKesktahtTestid();
  samatekstTestid();

  kuvaStatistika();
}

function kanoonilineKujuTestid() {
  kuvaFunktsiooniNimetus('kanoonilineKuju');
  test(kanoonilineKuju('Abitu iba!'), 'abituiba', 'Lihtne test');
}

function puhastaTekstTestid() {
  kuvaFunktsiooniNimetus('puhastaTekst');
  test(puhastaTekst('kirik'), 'kirik', 'Zero-Width Space');
  test(puhastaTekst('`´ab,.'), 'ab,.', 'Lihtne test');
}

function tekstistSiseesitusseTestid() {
  kuvaFunktsiooniNimetus('tekstistSiseesitusse');
  test(tekstistSiseesitusse('a b a').tekst, '|a bb a', 'Lihtne test');
  test(tekstistSiseesitusse('a b a').kuvaKesktahtYhekordselt, true, 'Kesktähe test');
  test(tekstistSiseesitusse(' a, b b  a').tekst, '|a, b b a', 'Tühikute eemaldamine');
  test(tekstistSiseesitusse(' a, b b  a').kuvaKesktahtYhekordselt, false, 'Tühikute eemaldamine');
}

function samatekstideOtsingTekstistTestid() {
  kuvaFunktsiooniNimetus('samatekstideOtsingTekstist');
  test(samatekstideOtsingTekstist('iba abi'), ['iba abi'], 'iba abi');
  test(samatekstideOtsingTekstist('aba cdc'), [], 'aba cdc');
  test(samatekstideOtsingTekstist('jamaib ,a . abi kkk'), ['ib ,a . abi'], 'jamaib ,a . abi kkk');
  kuvaFunktsiooniNimetus('eelmineTaht');
  test(eelmineTaht(0, 'A, bce. f'), false, 'Alguses');
  test(eelmineTaht(8, 'A, bce. f'), 5, 'Lopus');
  test(eelmineTaht(3, 'A, bce. f'), 0, 'Keskel, üle kirjavahemärgi');
  kuvaFunktsiooniNimetus('jargmineTaht');
  test(jargmineTaht(0, 'A, bce. f'), 3, 'Alguses');
  test(jargmineTaht(8, 'A, bce. f'), false, 'Lopus');
  test(jargmineTaht(3, 'A, bce. f'), 4, 'Keskel');
  test(jargmineTaht(5, 'A, bce. f'), 8, 'Keskel, üle kirjavahemärgi');
}

function eemaldaLiigsedTyhikudTestid() {
  kuvaFunktsiooniNimetus('eemaldaLiigsedTyhikud');
  test(eemaldaLiigsedTyhikud('| abba', false), '|abba', 'Kursor ees');
  test(eemaldaLiigsedTyhikud(' a|bba', false), 'a|bba', 'Ees');
  test(eemaldaLiigsedTyhikud('a | bba', false), 'a |bba', 'Keskel, 2-kordne');
}

function vahetaPooledTestid() {
  kuvaFunktsiooniNimetus('vahetaPooled');
  test(vahetaPooled('|'), '|', 'Tühitekst');
  test(vahetaPooled('ab|ba'), '|baab', 'Lihtne');
  test(vahetaPooled('a b|b, a'), '|b, aa b', 'Kirjavahemärkidega');
  test(vahetaPooled('ab| ba'), '| baab', 'Esitühiku kõrvaldamine');
}

function tuvastaKesktahtTestid() {
  kuvaFunktsiooniNimetus('tuvastaKesktaht');
  // taht, yhekordne, sonaAlguses, sonaLopus
  test(tuvastaKesktaht('Seal! Laes!').taht, 'l', 'Seal laes 1');
  test(tuvastaKesktaht('Seal! Laes!').yhekordne, false, 'Seal laes 2');
  test(tuvastaKesktaht('Seal! Laes!').sonaAlguses, true, 'Seal laes 3');
  test(tuvastaKesktaht('Seal! Laes!').sonaLopus, true, 'Seal laes 4');
  test(tuvastaKesktaht(), false, 'Argument puudu');
  test(tuvastaKesktaht(''), false, 'Tühitekst');
  test(tuvastaKesktaht(' !(),.'), false, 'Ainult kirjavahemärgid');
  test(tuvastaKesktaht('a').taht, 'a', 'Ühetähetekst, täht');
  test(tuvastaKesktaht('a').yhekordne, true, 'Ühetähetekst, ühekordne');
  test(tuvastaKesktaht('a').sonaAlguses, true, 'Ühetähetekst, ühekordne, sonaAlguses');
  test(tuvastaKesktaht('aa').taht, 'a', 'Kahetähetekst, täht');
  test(tuvastaKesktaht('aa').yhekordne, false, 'Kahetähetekst, yhekordne');
  test(tuvastaKesktaht('aa').sonaAlguses, true, 'Kahetähetekst, sonaAlguses');
  test(tuvastaKesktaht('aba').taht, 'b', 'Ühekordse keskelemendiga samatekst, taht');
  test(tuvastaKesktaht('aba').yhekordne, true, 'Ühekordse keskelemendiga samatekst, yhekordne');
  test(tuvastaKesktaht('aba').sonaAlguses, false, 'Ühekordse keskelemendiga samatekst, sonaAlguses');
  test(tuvastaKesktaht('abba').taht, 'b', 'Kahekordse keskelemendiga samatekst, taht');
  test(tuvastaKesktaht('abba').yhekordne, false, 'Kahekordse keskelemendiga samatekst, yhekordne');
  test(tuvastaKesktaht('Ajate luulu, luuletaja!').taht, 'u', 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, taht');
  test(tuvastaKesktaht('Ajate luulu, luuletaja!').yhekordne, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, yhekordne');
  test(tuvastaKesktaht('Ajate luulu, luuletaja!').sonaAlguses, false, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = false');
  test(tuvastaKesktaht('Ajate luulu, luuletaja!').sonaLopus, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaLopus = true');
  test(tuvastaKesktaht('Ajate luul uluuletaja!').sonaAlguses, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = true');
  test(tuvastaKesktaht('Kiiremini.. inim-e-riik?').taht, 'i', 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, taht');
  test(tuvastaKesktaht('Kiiremini.. inim-e-riik?').yhekordne, false, 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, yhekordne = false');
  test(tuvastaKesktaht('Eakas teema.⏎Teretame.⏎Etsakae!').taht, 'r', 'Reavahetustega tekstis');
}

function leiaTahtTestid() {
  kuvaFunktsiooniNimetus('leiaTaht');
  test(leiaTaht().taht, '', 'Argumendid puudu');
  test(leiaTaht('a').taht, '', 'Osa argumente puudu');
  test(leiaTaht('a', '1').taht, '', 'index ei ole number');
  test(leiaTaht('a', 2).taht, '', 'index liiga suur');
  test(leiaTaht('a', -1).taht, '', 'index liiga väike');
  test(leiaTaht('abc', 2).taht, 'b', 'Lihtne otsing, taht');
  test(leiaTaht('abc', 2).indeks, 1, 'Lihtne otsing, taht');
  test(leiaTaht('abc', 2).sonaAlguses, false, 'Lihtne otsing, sõna alguses? Ei');
  test(leiaTaht('abc', 2).sonaLopus, false, 'Lihtne otsing, sõna lõpus? Ei');
  test(leiaTaht('a bc', 2).sonaAlguses, true, 'Lihtne otsing, sõna alguses? Jah');
  test(leiaTaht('a bc', 1).sonaLopus, true, 'Lihtne otsing, sõna lõpus? Jah');
  test(leiaTaht('a bc', 1).indeks, 0, 'Lihtne otsing, sõna lõpus? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).taht, 'l', 'Otsing kirjavahemärkidega stringis, taht');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).indeks, 13, 'Otsing kirjavahemärkidega stringis, taht');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).sonaAlguses, true, 'Otsing kirjavahemärkidega stringis, sõna alguses? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 10).sonaAlguses, false, 'Otsing kirjavahemärkidega stringis, sõna alguses? Ei');
  test(leiaTaht('Eakas teema.⏎Teretame.⏎Etsakae!', 11).taht, 'T', 'Otsing reavahetustega tekstis');
  test(leiaTaht('Eakas teema.⏎Teretame.⏎Etsakae!', 11).sonaAlguses, true, 'Otsing reavahetustega tekstis, sõna alguses? Jah');
}

function samatekstTestid() {
  kuvaFunktsiooniNimetus('samatekst');
  test(samatekst(), false, 'str puudu');
  test(samatekst(''), false, 'Tühitekst');
  test(samatekst('a'), true, 'Ühetähetekst');
  test(samatekst(' '), false, 'Ühe kirjavahemärgi tekst');
  test(samatekst('aa'), true, 'Kahetäheline samatekst');
  test(samatekst('ab'), false, 'Kahetäheline mittesamatekst');
  test(samatekst('a a.'), true, 'Kahetäheline samatekst kirjavahemärkidega');
  test(samatekst('aba'), true, 'Ühekordse keskelemendiga lühike samatekst');
  test(samatekst('Ajate luulu, luuletaja!'), true, 'Pikem ühekordse keskelemendiga samatekst kirjavahemärkidega');
  test(samatekst('Kiiremini.. inim-e-riik?'), true, 'Pikem kahekordse keskelemendiga samatekst kirjavahemärkidega');
  test(samatekst('Kiireminx.. inim-e-riik?'), false, 'Pikem mittesamatekst kirjavahemärkidega');
  test(samatekst('Eakas teema.⏎Teretame.⏎Etsakae!'), true, 'Reavahetusega tekst');
}

function kuvaFunktsiooniNimetus(fN) {
  $('<hr>')
    .appendTo('#Testitulemused');
  $('<p></p>')
    .text(fN)
    .appendTo('#Testitulemused');
}

function test(testResult, expectedResult, testTitle) {
  /* Testitulemuste raporteerija

  */
  var tulemus;
  if (isArray(expectedResult)) {
    tulemus = arraysEqual(expectedResult, testResult);
  }
  else {
    tulemus = testResult === expectedResult;
  }
  if (!tulemus) {
    console.log('oodatud: ' + expectedResult.toString() + ' saadud: ' + testResult.toString());
  }
  var tulemuserida = $('<div></div>')
    .addClass('tulemuserida')
    .addClass('d-flex justify-content-start')
    .appendTo('#Testitulemused');
  var ring = $('<div>&nbsp;</div>')
    .addClass('ring')
    .appendTo(tulemuserida);
  if (tulemus) {
    ring.addClass('edukas');
  }
  else {
    ring.addClass('ebaedukas');
  }
  var tekstiosa = $('<div></div')
    .addClass('tekstiosa')
    .text(testTitle)
    .appendTo(tulemuserida);
  if (tulemus) {
    edukaidTeste += 1;
  }
  else {
    mitteedukaidTeste = +1;
  }
}

function kuvaStatistika() {
  $('<p></p>')
    .text('TESTE: edukaid: ' + edukaidTeste.toString() + '  mitteedukaid: ' + mitteedukaidTeste.toString())  
    .prependTo('#Testitulemused');
}

function arraysEqual(a, b) {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return a.length === b.length && a.every((el, ix) => el === b[ix]);
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'; 
}