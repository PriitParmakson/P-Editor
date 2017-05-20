function jooksutaTestid() {
  // Testide käivitaja
  leiaTahtTestid();
  keskelementTestid();
  samatekstTestid();
}

function keskelementTestid() {
  kuvaFunktsiooniNimetus('keskelement');
  // taht, yhekordne, sonaAlguses
  test(keskelement(), false, 'Argument puudu');
  test(keskelement(''), false, 'Tühitekst');
  test(keskelement(' !(),.'), false, 'Ainult kirjavahemärgid');
  test(keskelement('a').taht, 'a', 'Ühetähetekst, täht');
  test(keskelement('a').yhekordne, true, 'Ühetähetekst, ühekordne');
  test(keskelement('a').sonaAlguses, false, 'Ühetähetekst, ühekordne, sonaAlguses');
  test(keskelement('aa').taht, 'a', 'Kahetähetekst, täht');
  test(keskelement('aa').yhekordne, false, 'Kahetähetekst, yhekordne');
  test(keskelement('aa').sonaAlguses, false, 'Kahetähetekst, sonaAlguses');
  test(keskelement('aba').taht, 'b', 'Ühekordse keskelemendiga samatekst, taht');
  test(keskelement('aba').yhekordne, true, 'Ühekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('aba').sonaAlguses, false, 'Ühekordse keskelemendiga samatekst, sonaAlguses');
  test(keskelement('abba').taht, 'b', 'Kahekordse keskelemendiga samatekst, taht');
  test(keskelement('abba').yhekordne, false, 'Kahekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('Ajate luulu, luuletaja!').taht, 'u', 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, taht');
  test(keskelement('Ajate luulu, luuletaja!').yhekordne, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, yhekordne');
  test(keskelement('Ajate luulu, luuletaja!').sonaAlguses, false, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = false');
  test(keskelement('Ajate luul uluuletaja!').sonaAlguses, true, 'Kirjavahemärkidega, ühekordse keskelemendiga samatekst, sonaAlguses = true');
  test(keskelement('Kiiremini.. inim-e-riik?').taht, 'i', 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, taht');
  test(keskelement('Kiiremini.. inim-e-riik?').yhekordne, false, 'Kirjavahemärkidega, kahekordse keskelemendiga samatekst, yhekordne = false');
}

function leiaTahtTestid() {
  kuvaFunktsiooniNimetus('leiaTaht');
  test(leiaTaht().taht, '', 'Argumendid puudu');
  test(leiaTaht('a').taht, '', 'Osa argumente puudu');
  test(leiaTaht('a', '1').taht, '', 'index ei ole number');
  test(leiaTaht('a', 2).taht, '', 'index liiga suur');
  test(leiaTaht('a', -1).taht, '', 'index liiga väike');
  test(leiaTaht('abc', 2).taht, 'b', 'Lihtne otsing, taht');
  test(leiaTaht('abc', 2).eelmineOliTyhik, false, 'Lihtne otsing, eelmine oli tühik? Ei');
  test(leiaTaht('a bc', 2).eelmineOliTyhik, true, 'Lihtne otsing, eelmine oli tühik? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).taht, 'l', 'Otsing kirjavahemärkidega stringis, taht');
  test(leiaTaht('Ajate luulu, luuletaja!', 11).eelmineOliTyhik, true, 'Otsing kirjavahemärkidega stringis, eelmine oli tühik? Jah');
  test(leiaTaht('Ajate luulu, luuletaja!', 10).eelmineOliTyhik, false, 'Otsing kirjavahemärkidega stringis, eelmine oli tühik? Ei');
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
}

function kuvaFunktsiooniNimetus(fN) {
  $('<p></p>')
    .text(fN)
    .appendTo('#Testitulemused');
}

function test(testResult, expectedResult, testTitle) {
  // Testitulemiste raporteerija
  var tulemus = testResult === expectedResult;
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

