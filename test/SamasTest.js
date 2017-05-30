function jooksutaTestid() {
  // Testide käivitaja
  eemaldaEsityhikTestid();
  vahetaPooledTestid();
  leiaTahtTestid();
  keskelementTestid();
  samatekstTestid();
}

function eemaldaEsityhikTestid() {
  kuvaFunktsiooniNimetus('eemaldaEsityhik');
  test(eemaldaEsityhik('| abba'), '|abba', 'Kursor ees');
  test(eemaldaEsityhik(' a|bba'), 'a|bba', 'Kursor ees');
}

function vahetaPooledTestid() {
  kuvaFunktsiooniNimetus('vahetaPooled');
  test(vahetaPooled('|'), '|', 'Tühitekst');
  test(vahetaPooled('ab|ba'), '|baab', 'Lihtne');
  test(vahetaPooled('a b|b, a'), '|b, aa b', 'Kirjavahemärkidega');
  test(vahetaPooled('ab| ba'), '| baab', 'Esitühiku kõrvaldamine');
}

function keskelementTestid() {
  kuvaFunktsiooniNimetus('keskelement');
  // taht, yhekordne, sonaAlguses
  test(keskelement(), false, 'Argument puudu');
  test(keskelement(''), false, 'Tühitekst');
  test(keskelement(' !(),.'), false, 'Ainult kirjavahemärgid');
  test(keskelement('a').taht, 'a', 'Ühetähetekst, täht');
  test(keskelement('a').yhekordne, true, 'Ühetähetekst, ühekordne');
  test(keskelement('a').sonaAlguses, true, 'Ühetähetekst, ühekordne, sonaAlguses');
  test(keskelement('aa').taht, 'a', 'Kahetähetekst, täht');
  test(keskelement('aa').yhekordne, false, 'Kahetähetekst, yhekordne');
  test(keskelement('aa').sonaAlguses, true, 'Kahetähetekst, sonaAlguses');
  test(keskelement('aba').taht, 'b', 'Ühekordse keskelemendiga samatekst, taht');
  test(keskelement('aba').yhekordne, true, 'Ühekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('aba').sonaAlguses, false, 'Ühekordse keskelemendiga samatekst, sonaAlguses');
  test(keskelement('abba').taht, 'b', 'Kahekordse keskelemendiga samatekst, taht');
  test(keskelement('abba').yhekordne, false, 'Kahekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('Ajate luulu, luuletaja!').taht, 'u', 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, taht');
  test(keskelement('Ajate luulu, luuletaja!').yhekordne, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('Ajate luulu, luuletaja!').sonaAlguses, false, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = false');
  test(keskelement('Ajate luulu, luuletaja!').sonaLopus, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaLopus = true');
  test(keskelement('Ajate luul uluuletaja!').sonaAlguses, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = true');
  test(keskelement('Kiiremini.. inim-e-riik?').taht, 'i', 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, taht');
  test(keskelement('Kiiremini.. inim-e-riik?').yhekordne, false, 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, yhekordne = false');
  test(keskelement('Eakas teema.⏎Teretame.⏎Etsakae!').taht, 'r', 'Reavahetustega tekstis');
}

function leiaTahtTestid() {
  kuvaFunktsiooniNimetus('leiaTaht');
  test(leiaTaht().taht, '', 'Argumendid puudu');
  test(leiaTaht('a').taht, '', 'Osa argumente puudu');
  test(leiaTaht('a', '1').taht, '', 'index ei ole number');
  test(leiaTaht('a', 2).taht, '', 'index liiga suur');
  test(leiaTaht('a', -1).taht, '', 'index liiga väike');
  test(leiaTaht('abc', 2).taht, 'b', 'Lihtne otsing, taht');
  test(leiaTaht('abc', 2).sonaAlguses, false, 'Lihtne otsing, sõna alguses? Ei');
  test(leiaTaht('abc', 2).sonaLopus, false, 'Lihtne otsing, sõna lõpus? Ei');
  test(leiaTaht('a bc', 2).sonaAlguses, true, 'Lihtne otsing, sõna alguses? Jah');
  test(leiaTaht('a bc', 1).sonaLopus, true, 'Lihtne otsing, sõna lõpus? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).taht, 'l', 'Otsing kirjavahemärkidega stringis, taht');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).sonaAlguses, true, 'Otsing kirjavahemärkidega stringis, sõna alguses? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 10).sonaAlguses, false, 'Otsing kirjavahemärkidega stringis, sõna alguses? Ei');
  test(leiaTaht('Eakas teema.⏎Teretame.⏎Etsakae!', 11).taht, 'T', 'Otsing reavahetustega tekstis');
  test(leiaTaht('Eakas teema.⏎Teretame.⏎Etsakae!', 11).sonaAlguses, true, 'Otsing reavahetustega tekstis, sõna alguses? Jah');
}

function samatekstTestid() {
  kuvaFunktsiooniNimetus('samatekst');
  test(samatekst(), false, 'str puudu');
  test(samatekst(''), true, 'Tühitekst');
  test(samatekst('a'), true, 'Ühetähetekst');
  test(samatekst(' '), true, 'Ühe kirjavahemärgi tekst');
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
  $('<p></p>')
    .text(fN)
    .appendTo('#Testitulemused');
}

function test(testResult, expectedResult, testTitle) {
  // Testitulemiste raporteerija
  var tulemus = testResult === expectedResult;
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
}

