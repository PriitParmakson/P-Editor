var logi = '';

function lisaLogisse(kirje) {
  logi = logi + '\n' + kirje;  
}

function reverseString(str) {
  /*  Tagastab ümberpööratud stringi
  */
  if (str === undefined) {
    return '';
  }
  else if (str === '') {
    return '';
  }
  else {
    return str.split('').reverse().join('');
  }
}

function yhisosa(a, b) {
  /* Leiab sõnede a ja b ühisosa. Ühisosa on defineeritud kui pikim sõne, mis ühtib sõnepaari (a, b) ühe liikme lõpuga ja teise algusega.
  
  Teiste sõnadega, kui v1, v2, v3 on sõned (võivad olla tühjad), siis
  a ja b ühisosa on v2, selline, et
    (v1 + v2 == a) && (v2 + v3 == b) || 
    (v1 + v2 == b) && (v2 + v3 == a) &&
    (v2 !== '') ja v2.length on maksimaalne
    
    Meetod: "libistame" a üle b. Jätame meelde maksimaalse v2.
    Algseis:
      aaaaaa
            bbbbbbbbb
    Lõppseis:
                     aaaaaa
            bbbbbbbbb
    Koordinaattelje 0-punkt on a alguspositsioonis.        
    
  */
  var pa = 0;
  const pb = a.length;
  var pikim = {
    yl: '',
    aE: null, aP: null,
    bE: null, bP: null
  };
  do {
    pa++;
    const ylA = Math.max(pa, pb); // ülekatte algus
    const ylL = Math.min(pa + a.length - 1, pb + b.length - 1); // ülekatte lõpp
    const ylPikkus = ylL - ylA + 1;
    const aYlekattes = a.substring(ylA - pa, ylL + 1 - pa);
    const aE = a.substring(0, ylA - pa); // a osa enne ülekatet
    const aP = a.substr(ylL + 1 - pa); // a osa pärast ülekatet
    const bYlekattes = b.substring(ylA - pb, ylL + 1 - pb);
    const bE = b.substring(0, ylA - pb); // b osa enne ülekatet
    const bP = b.substr(ylL + 1 - pb); // b osa pärast ülekatet
    /* lisaLogisse(aE + '|' + aYlekattes + '|' + aP + 
              ' - ' + 
              bE + '|' + bYlekattes + '|' + bP); */
    if (aYlekattes == bYlekattes) {
      if (ylPikkus > pikim.yl.length) {
        pikim.yl = aYlekattes;
        pikim.aE = aE;
        pikim.aP = aP;
        pikim.bE = bE;
        pikim.bP = bP;
      }
    }  
  } while (pa < a.length + b.length - 1);
  return pikim;
}

function test(testiId, a, b, yl, aE, aP, bE, bP) {
  /* Testib ühisosa leidmist
  */
  const t = yhisosa(a, b);
  if ((t.yl == yl) && 
      (t.aE == aE) && (t.aP == aP) && 
      (t.bE == bE) && (t.bP == bP)) {
    lisaLogisse(testiId + ': OK');  
  } else {
    lisaLogisse(testiId + ': NOK: Saadud t: ' + JSON.stringify(t));
  }
}

function ylekatteTestid() {
  test('Test 1', 'iba', 'iba', 'iba', '', '', '', '');
  test('Test 2', 'viba', 'iba', 'iba', 'v', '', '', '');
  test('Test 3', 'ibajutt', 'iba', 'iba', '', 'jutt', '', '');
  test('Test 4', 'vibalik', 'iba', 'iba', 'v', 'lik', '', '');
  test('Test 5', 'abi', 'abistaja', 'abi', '', '', '', 'staja');
  test('Test 6', 'aja', 'abistaja', 'aja', '', '', 'abist', '');
  test('Test 7', 'ajab', 'abistaja', 'aja', '', 'b', 'abist', '');
  test('Test 8', 'ist', 'abistaja', 'ist', '', '', 'ab', 'aja');
  alert(logi);
}

function leiaYlekatted(sonad) {
  /* Sisendiks on sõnade massiiv.
    Pöörab iga sõna ümber ja leiab ülekatted (pikkusega > 2)
    kõigi sõnadega.
    Vastused tagastab massiivina.
  */
  sonad.forEach((s1) => {
    const a = reverseString(s1);
    sonad.forEach((s2) => {
      if (s1 !== s2) {
        const t = yhisosa(a, s2);
        if (t.yl.length > 2) {
          const osa1 = (t.aE == '' ? '' : (t.aE + '-')) +
                t.yl +
                (t.aP == '' ? '' : ('-' + t.aP)); 
          const osa2 = (t.bE == '' ? '' : (t.bE + '-')) +
                t.yl +
                (t.bP == '' ? '' : ('-' + t.bP)); 
          lisaLogisse( osa1 + ' ...' + osa2);
        }
      }
    });
  });
} 

var sonad = ['vikatiga', 'kivi', 'igavik'];
leiaYlekatted(sonad);
alert(logi);
