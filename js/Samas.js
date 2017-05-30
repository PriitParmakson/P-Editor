/*
  Samatekstiredaktor (Editor for Palindromic Texts), Priit Parmakson, 2017. MIT Licence

*/

var logimistase = 0; 

// Globaalsed muutujad
var t = '|'; // Tekst
var kuvaKeskelementYhekordselt = false;
var tekstid; // Hoiab kõiki alla laetud tekste
var jLk = 1; // Jooksva lehekülje nr
var tLk = 20; // Tekste leheküljel
var dialoogiseisund = 'N'; // 'S' - salvestusdialoogis

// Tärgi või klahvi kindlakstegemise abifunktsioonid
function ladinaTaht(charCode) {
  // 97..122 (a..z) 65..90 (A..Z)
  return (
    (charCode >= 97 && charCode <= 122) || 
    (charCode >= 65 && charCode <= 90)
  )
}
function tapiTaht(charCode) {
  // õ ö ä ü 245 246 228 252
  // Õ Ö Ä Ü 213 214 196 220
  // š 353, Š 352
  // ž 382, Ž 381 
  return ([245, 246, 228, 252, 213, 214, 196,
    220, 353, 352, 382, 381].indexOf(charCode)
    != -1)
}
function veneTaht(charCode) {
  // 1024-1279
  return (charCode >= 1024 && charCode <= 1279)
}
function kirjavmKood(charCode) {
  // Kontrollib, kas charCode esitab lubatud 
  // kirjavahemärki
  // reavahetus 13, tühik 32  , 44  . 46  - 45  ! 33  ? 63
  // ( 40  ) 41  : 58  ; 59  " 34
  var p = [13, 32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34];
  var r = p.indexOf(charCode);
  return (r >= 0)
}
function keyCodeToHumanReadable(keyCode) {
  var keycodes = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    33: 'page_up',
    34: 'page_down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    91: 'command',
    93: 'right_click',
    106: 'numpad_*',
    107: 'numpad_+',
    109: 'numpad_-',
    110: 'numpad_.',
    111: 'numpad_/',
    144: 'num_lock',
    145: 'scroll_lock',
    182: 'my_computer',
    183: 'my_calculator',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'"
  }
  return (keycodes[keyCode] || 'tundmatu klahv')
}

// Samatekstitöötluse primitiivid
function kirjavm(char) {
  // Kontrollib, kas tärk on kirjavahemärk.
  // Kirjavahemärgiks loetakse ka reavahetusmärki (⏎).
  return (kirjavmKood(char.charCodeAt(0)) || char == '⏎')
}
function leiaTaht(str, index) {
  /* Tagastab:
   1) 'taht' - stringis str järjekorranumbriga index (1-põhine) tähe;
   2) 'sonaAlguses' - kas tähele eelnes kirjavahemärk (sh tühik või reavahetus) või täht on teksti alguses;
   3) 'sonaLopus' - kas tähele järgneb kirjavahemärk (sh tühik või reavahetus) või täht on teksti lõpus.
   Kirjavahemärke tähtede loendamisel ei arvesta.
   Ebaõige sisendi korral, sh ka siis, kui tekstis ei ole nii palju tähti, tagastab tühja stringi.
   Tähe registrit ei muuda.
  */
  if (typeof str === 'undefined' || str === null || typeof index !== 'number' || index > str.length || index < 1) {
    return { taht: '', sonaAlguses: false, sonaLopus: false }
  }
  var taheloendur = 0;
  var sonaAlguses = false;
  var eelmiseTaheIndex = null;
  for (var i = 0; i < str.length; i++) {
    if (!kirjavm(str[i])) {
      taheloendur += 1;
      if (taheloendur == index) {
        return {
          taht: str[i],
          sonaAlguses: (eelmiseTaheIndex === null || eelmiseTaheIndex < i - 1),
          sonaLopus: (i == str.length - 1 || kirjavm(str[i + 1]))
        };
      }
      else {
        eelmiseTaheIndex = i;
      }
    }
  }
  return { taht: '', sonaAlguses: false, sonaLopus: false }
}
function tahti(str) {
  // Tagastab tähtede arvu stringis. Ei arvesta kirjavahemärke ja kursorijoont
  return str
    .split("")
    .filter(s => (! kirjavm(s)) && (s != "|"))
    .length;
}
function samatekst(str) {
  // Kontrollib, kas str on samatekst
  if (typeof str === 'undefined' || str === null) {
    return false
  }
  if (str.length < 2) {
    return true
  }
  var algusest = 0;
  var lopust = str.length - 1;
  do {
    if (kirjavm(str[algusest])) {
      algusest += 1;
    }
    else if (kirjavm(str[lopust])) {
      lopust -= 1;
    }
    else if (str[algusest].toLowerCase() != str[lopust].toLowerCase()) {
      return false
    }
    else {
      algusest += 1;
      lopust -= 1;
    }
  } 
  while (algusest < lopust)
  return true  
}
function keskelement(str) {
  /* Tagastab:
   1) 'taht' - samateksti str keskelement,
   väiketähena;
   2) 'yhekordne' - kas keskelement on ühekordsena (tõeväärtus);
   3) 'sonaAlguses' - kas keskelement (kahekordse keskelemendi puhul - üks neist) on sõna alguses;
   4) 'sonaLopus' - kas keskelement (kahekordse keskelemendi puhul - üks neist) on sõna lõpus.
   Eeldab samateksti. Ei tohi sisaldada kursorit (|). 
   */
  if (typeof str === 'undefined' || str === null || str === '') {
    return false
  }
  var t = tahti(str);
  if (t == 0) {
    return false
  }
  if (t % 2 == 0) {
    // Keskelement on kahekordsena
    var k1 = leiaTaht(str, t / 2);
    var k2 = leiaTaht(str, t / 2 + 1); 
    return {
      taht: k1.taht.toLowerCase(),
      yhekordne: false,
      sonaAlguses: k1.sonaAlguses || k2.sonaAlguses,
      sonaLopus: k1.sonaLopus || k2.sonaLopus
    }
  } 
  else {
    // Keskelement on ühekordsena
    var k = leiaTaht(str, Math.ceil(t / 2));
    return {
      taht: k.taht.toLowerCase(),
      yhekordne: true,
      sonaAlguses: k.sonaAlguses,
      sonaLopus: k.sonaLopus
    }
  }
}
function eemaldaEsityhik(str) {
  // Eemaldab tühikud enne esimest tähte
  var eemalda = true;
  acc = '';
  for (var i = 0; i < str.length; i++) {
    if (eemalda && str.charCodeAt(i) == 32) {

    }
    else {
      acc += str[i]; 
      if (!kirjavm(str[i]) && str[i] != '|') {
        eemalda = false;
      }
    }
  }
  return acc;
}
// Teksti töötlemise abifunktsioonid
function markeeriTekstikoguTekst(t) {
  // Tagastab markeeritud keskkohaga teksti
  // Eeldatakse salvestamiseks puhastatud teksti (ei sisalda kursorit)
  var acc = ''; // Tagastatav tekst, lisatud markeering
  var m1 = null; // Esimese markeeritava tähe indeks (1-baas)
  var keskelementYhekordselt = null;

  var tTekstis = tahti(t);

  if ((tTekstis < 4)) {
    return t
  }

  // Mitmes täht (või tähed) markeerida?
  if (tTekstis % 2 == 0) {
    m1 = tTekstis / 2;
    keskelementYhekordselt = false;
  }
  else {
    m1 = Math.floor(tTekstis / 2) + 1;
    keskelementYhekordselt = true;
  }

  var taheloendur = 0;
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon
    if (kirjavm(t[i])) {
      // Asenda reavahetuse siseesituse sümbol <br> elemendiga
      if (t[i] == '⏎') {
        acc = acc + '<br>';
      }
      else {
        acc = acc + t[i];
      }
    }
    // Täht
    else {
      taheloendur++;
      // Esimene keskelement markeerida
      if (taheloendur == m1) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Teine keskelement...
      else if (taheloendur == m1 + 1 && !keskelementYhekordselt) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Kuvada tavaliselt
      else {
        acc = acc + t[i];
      }
    }
  }
  return acc
}
function markeeriTekst() {
  /* Tagastab HTML-i viidud, markeeritud kesktähtedega teksti.
  Kesktähed jagavad teksti 5 ossa. Tagastatava HTML-i struktuur:
    <p>
      tähed enne esimest kesktähte
      <span id='K1'> esimene kesktäht </span>
      kirjavahemärgid kesktähtede vahel
      <span id='K2'>(teine kesktäht)</span>
      tähed pärast teist kesktähte
    </p>
  
  Kursor jäetakse vahele. Tekstiosad võivad olla tühjad.
  */

  var koguja = ['', '', '', '', ''];
  // Koguja tekstiosadele A, K1, Kt, K2, B
  var mode = '0'; // Kogutava tekstiosa indeks (0-põhine)

  var p = tahti(t) / 2; // Alati täisarv, sest tekstis on mõlemad kesktähed, ka siis, kui kuvatakse ainult ühte.
  var taheloendur = 0;

  if (t.length == 1) {
    // Tühja teksti puhul lisa  0-pikkusega tühik. See on vajalik caret positsioneerimiseks.
    koguja[0] = '&#8203;'; 
  }
  else {
    // Kogu tekstiosad
    for (var i = 0; i < t.length; i++) {
      // Kursorijoon, ei esita markeeritud tekstis
      if (t[i] == '|') {
      }
      // Kirjavahemärk
      else if (kirjavm(t[i])) {
        if (t[i] == '⏎') {
          // koguja[mode] = '<br>'; ei sobi, sest caret positsioneerimine läheb keerukaks
          koguja[mode] = koguja[mode] + t[i];
        }
        else {
          koguja[mode] = koguja[mode] + t[i];
        }
      }
      // Täht
      else {
        taheloendur++;
        // Esimene keskelement markeerida
        if (taheloendur == p) {
          koguja[1] = t[i];
          mode = 2;  
        }
        // Teine keskelement...
        else if (taheloendur == p + 1) {
          if (kuvaKeskelementYhekordselt) {
            // ...mitte kuvada
          }
          else {
            // ...kuvada ja markeerida
            koguja[3] = t[i];
          }
          mode = 4;
        }
        // Kuvada tavaliselt
        else {
          koguja[mode] = koguja[mode] + t[i];
        }
      }
    }    
  }
  // Lisa markeering
  var m = 
    "<span id='A'>"  + koguja[0] + "</span>" +
    "<span id='K1' class='kesk'>" + koguja[1] + "</span>" +
    "<span id='Kt'>" + koguja[2] + "</span>" +
    "<span id='K2' class='kesk'>" + koguja[3] + "</span>" +
    "<span id='B'>"  + koguja[4];
  return m
}
function moodustaTekstiStruktuurKonsoolile() {
  // Silumise abivahend
  var h = $('#Tekst').html();
  var tagasta = h
    .replace(/<span id="\w{1,2}" class="kesk">/gi, '¦')
    .replace(/<span id="\w{1,2}">/gi, '¦')
    .replace(/<\/span>/gi, '') + '¦';
  return tagasta;
}

// Spetsiifilised operatsioonid tekstiga
function suurtaheks() {
  // Kursori järel olev täht muudatakse suurtäheks
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return
  }
  var s = tekstParast[0].toUpperCase();
  t = tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
  kuvaTekst();
}
function vaiketaheks() {
  // Kursori järel olev täht muudetakse väiketäheks
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  // Kursor teksti lõpus?
  if (tekstParast.length == 0) {
    return
  }
  var s = tekstParast[0].toLowerCase();
  t = tekstEnne + "|" + s +
    tekstParast.substring(1, tekstParast.length);
  kuvaTekst();
}
function vahetaPooled(t) {
  // Eeldab parameetris t sisekujul teksti (kesktäht kahekordselt). Tagastab teksti, milles pooled on vahetatud. Kui pooltevahetusega sattus esimeseks sümboliks tühik, siis see eemaldatakse.
  var p = tahti(t) / 2;
  if (p < 2) {
    return t
  }
  var taheloendur = 0;
  var esimesePooleLopp;
  // Leia keskkoht
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon kanna üle
    if (! (kirjavm(t[i]) && t[i] != "|") ) {
      taheloendur++;
      if (taheloendur == p) {
        esimesePooleLopp = i;
        break;
      }
    }
  }
  var a = t.slice(0, esimesePooleLopp + 1);
  var b = t.slice(esimesePooleLopp + 1);
  return b + a;
}

// Tekstikogu funktsioonid: laadimine, kuvamine, navigeerimine
function laeTekstid() {
  // Laeb Google töölehelt "Samatekstid" kõik tekstid ja kuvab esimese lehekülje (valmistab ette DOM-i, tekstikogu alla võib olla peidetud). 
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  $.get(url,
    function(data, status, xhr) {
      $('#Tekstikogu').empty();
      tekstid = data.Tekstid;
      // Kuva saadud tekstid
      kuvaLehekylg(1);
    }); 
}
function kuvaLehekylg(p) {
  // Kuvab massiivist 'tekstid' lehekülje p, DOM elementi 'Tekstikogu'
  // Ühtlasi uuendab sirvimispaneeli 'Sirvimine'
  // Kui lehekülje p tekste ei ole, siis ei tee midagi
  if (p < 1 || tekstid.length < tLk * (p - 1) + 1) {
    return
  }
  // Kuva tekstid
  // Puhasta eelmine
  $('#Tekstikogu').empty();
  // Massiiv tekstid on indekseeritud 0-alusel
  for (var i = tLk * (p - 1);
           i < tLk * p && i < tekstid.length; i++) {
    var kirje = $('<p></p>')
      .addClass('kirje')
      .appendTo('#Tekstikogu'); 
    // Märgendi Draft lisamine
    var kuvatavTekst =
      '<span class="tekstinr">' +
      (tekstid.length - i).toString() +
      '</span>' + 
      '.&nbsp;&nbsp;&nbsp;&nbsp;' +
      markeeriTekstikoguTekst(tekstid[i].Tekst);
    if (tekstid[i].Draft) {
      kuvatavTekst = kuvatavTekst + '<span class="margend">kavand</span>';
    }  
    var tekst = $('<span></span>')
      .attr('id', 't' + i.toString())
      .addClass('tekst')
      .html(kuvatavTekst)
      .appendTo(kirje);
  }
  jLk = p;
  // Uuenda sirvimispaneeli
  if (p > 1) {
    $('#FirstPage').removeClass('disabled')
    $('#PrevPage').removeClass('disabled')
  }
  else {
    $('#FirstPage').addClass('disabled')
    $('#PrevPage').addClass('disabled')
  }
  $('#PageNo').text(jLk.toString());
  if (p * tLk < tekstid.length) {
    $('#LastPage').removeClass('disabled')
    $('#NextPage').removeClass('disabled')
  }
  else {
    $('#LastPage').addClass('disabled')
    $('#NextPage').addClass('disabled')
  }
}  
function seaTekstikoguKasitlejad() {
  $('#AvaTekstikogu').click(function () {
    $('#Tekstikogu').toggle();
    if ($('#Tekstikogu').is(':visible')) {
      $('#Otsi').removeClass('disabled');
      $('#Sirvimine').removeClass('disabled');
    }
    else {
      $('#Otsi').addClass('disabled');
      $('#Sirvimine').addClass('disabled');
    }
  });

  // Sirvimisnuppude käsitlejad
  $('#FirstPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(1); 
    }  
  });
  
  $('#NextPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk + 1);
    }
  });
  
  $('#PrevPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk - 1);
    }
  });
  
  $('#LastPage').click(function () {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(Math.ceil(tekstid.length / tLk));
    }
  });
}

// Tekstikogu filtreerimise (tekstide otsimise) funktsioonid
function seaFilter(klopsatudValik) {
  var fL = $('#Filtritekst').val().toLowerCase();
  // Võta valikud
  var vasakul = $('#FilterVasakul').prop('checked');
  var paremal = $('#FilterParemal').prop('checked');
  var keskel = $('#FilterKeskel').prop('checked');
  var yhekordseltAlguses = $('#YhekordseltAlguses').prop('checked');
  var yhekordseltLopus = $('#YhekordseltLopus').prop('checked');
  var keskelKahesSonas = $('#KeskelKahesSonas').prop('checked');
  // Arvesta, et kui klõpsati valikukasti, siis see
  // ei ole veel ümber seatud
  switch (klopsatudValik) {
    case '#FilterVasakul':
      vasakul = !vasakul;
      break 
    case '#FilterParemal':
      paremal = !paremal;
      break 
    case '#FilterKeskel':
      keskel = !keskel;
      break
    case '#YhekordseltAlguses':
      yhekordseltAlguses = ! yhekordseltAlguses;
      break
    case '#YhekordseltLopus':
      yhekordseltLopus = ! yhekordseltLopus;
      break
    case '#KeskelKahesSonas':
      keskelKahesSonas = ! keskelKahesSonas;
      break
    case 'Salvestati': // Salvestati uus tekst; uuenda filtrit
      break
    default:
      console.log('VIGA: Filtri seadmisel.');   
  }
  console.log('Filter: ' +
    fL +
    (vasakul ? ': (Baa) ' : '') +
    (paremal ? ': (aaB) ' : '') +
    (keskel ? ': K ' : '') +
    (yhekordseltAlguses ? ': (aa Baa) ' : '') +
    (yhekordseltLopus ? ': (aaB aa) ' : '') +
    (keskelKahesSonas ? ': (aaB Baa) ' : '')
  );
  // Puhasta eelmine
  $('#Tekstikogu').empty();
  for (var i = 0; i < tekstid.length; i++) {
    var tekstL = tekstid[i].Tekst.toLowerCase();
    // Rakenda piirajad
    var ke = keskelement(tekstL);
    if (
        // Baa 
        (vasakul && tekstL.startsWith(fL)) ||
        // aaB
        (paremal && tekstL.endsWith(fL)) ||
        // aa Baa  
        (yhekordseltAlguses && fL.length == 1 && ke.yhekordne && ke.sonaAlguses && fL == ke.taht) ||
        // aaB aa  
        (yhekordseltLopus && fL.length == 1 && ke.yhekordne &&ke.sonaLopus && fL == ke.taht) ||
        // aaB Baa
        (keskelKahesSonas && fL.length == 1 && !ke.yhekordne && ke.sonaAlguses && ke.sonaLopus && fL == ke.taht) ||
        //   
        (!vasakul && !paremal && !yhekordseltAlguses && !yhekordseltLopus && !keskelKahesSonas && tekstL.includes(fL))
        ) {
      var kirje = $('<p></p>')
        .addClass('kirje')
        .appendTo('#Tekstikogu'); 
      // Märgendi Draft lisamine
      var kuvatavTekst = markeeriTekstikoguTekst(tekstid[i].Tekst);
      if (tekstid[i].Draft) {
        kuvatavTekst = kuvatavTekst + '<span class="margend">kavand</span>';
      }  
      var tekst = $('<span></span>')
        .attr('id', 't' + i.toString())
        .addClass('tekst')
        .html(kuvatavTekst)
        .appendTo(kirje);
    }
  }
}
function seaFiltriKasitlejad() {
  // Sea filtrivalikute algväärtused
  $('#FilterVasakul').prop('checked', false);
  $('#FilterParemal').prop('checked', false);
  $('#FilterKeskel').prop('checked', false);
  $('#YhekordseltAlguses').prop('checked', false);
  $('#KeskelKahesSonas').prop('checked', false);
  $('#YhekordseltLopus').prop('checked', false);

  // Filtridialoogi käsitlejad
  $('#Otsi').click(function() {
    $('#Filtridialoog').toggle();
    $('#Sirvimine').addClass('disabled');
    $('#Filtritekst').val('').focus();
    $('#Otsi').addClass('disabled');
    seaFilter($(this).attr('id'));
  });

  $('#FilterTyhista').click(function() {
    // Eemalda filter, sule filtridialoog, eemalda filtritekst ja fokusseeri tekstile
    // Taasta sirvimine
    $('#Sirvimine').removeClass('disabled');
    kuvaLehekylg(jLk);
    $('#Filtridialoog').toggle();
    $('#Filtritekst').val('');
    $('#Tekst').focus();
    $('#Otsi').removeClass('disabled');
  });
  
  // Vt HTML5 input event 
  // http://www.geedew.com/the-html5-input-event/ 
  $('#Filtritekst').on('input', function(e){
    seaFilter($(this).attr('id'));
  });

  $('.filtrivalik').on('click', function(e){
    seaFilter($(this).attr('id'));
  });
}

// Uue teksti salvestamise funktsioonid
function salvestaTekst() {
  // Koosta puhas tekst ja samuti tekst duplikaadi kontrolliks
  // Eemalda kursorijoon ja kesktähe peegeltäht
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
      if (kuvaKeskelementYhekordselt) {
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

  // Salvesta Google töölehele
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  $.post(url,
    { Tekst: c, Draft: draft },
    function() {
      console.log('Saadetud tekst:' + c);
      // Allolevate vahemuutujatega töötab, kuid miks, on ebaselge
      var a = c;
      var b = draft;
      // Uuenda tekstikogu
      // Sünkroonimise probleem - ei ilmu kohe. Seetõttu pilvest mitte
      // lugeda.
      // Lisada tekst
      var u = { Tekst: a, Draft: b };
      console.log("Lisada tekst: " + u.toString());
      tekstid.unshift(u);
      tekstid[0].Tekst = c;
    });
}
function suleSalvestusdialoog() {
  // Sule salvestusdialoog
  $('#Salvestusdialoog').toggle();
  aktiveeriTekstinupud();
  dialoogiseisund = 'N';
  $('#Tekst').focus();  
}
function seaSalvestuseKasitlejad() {
  // Salvestusdialoogi käsitlejad
  $('#Salvesta1').click(function() {
    if (dialoogiseisund == 'N') {
      // Ava salvestusdialoog
      $('#Salvestusdialoog').toggle();
      deaktiveeriTekstinupud();
      dialoogiseisund = 'S';
      $('#draftNupp').focus();
    }
  });

  $('#Salvesta2').click(function() {
    salvestaTekst();
    suleSalvestusdialoog();
    // Uuenda filtrit, kui see on avatud
    if ($('#Filtridialoog').is(':visible')) {
      seaFilter('Salvestati');
    }
    else if ($('#Tekstikogu').is(':visible')) {
      kuvaLehekylg(1);
    } 
  });

  $('#Tyhista').click(function() {
    suleSalvestusdialoog();
  });
}

// Teksti eritoimingute modaalsuse funktsioonid
function aktiveeriTekstinupud() {
  // Aktiveeri tekstitöötlusnupud, kuid mitte neid, mis
  // tühiteksti puhul ei oma mõtet
  if (t.length == 1) {
    $('#Poolednupp').addClass('disabled');
    $('#Uusnupp').addClass('disabled');
    $('#Salvesta1').addClass('disabled');
  } 
  else {
    $('#Poolednupp').removeClass('disabled');
    $('#Uusnupp').removeClass('disabled');
    $('#Salvesta1').removeClass('disabled');
  }
  // Ei puutu Infonuppu
}
function deaktiveeriTekstinupud() {
  $('#Poolednupp').addClass('disabled');
  $('#Uusnupp').addClass('disabled');
  $('#Salvesta1').addClass('disabled');
  // Ei puutu Infonuppu
}

// Teksti kuvamise funktsioonid
function kuvaTekst() {
  // Markeerib ja kuvab teksti, seab caret ja väljastab silumiseks vastava teate konsoolile.
  var mTekst = markeeriTekst();
  $('#Tekst').html(mTekst);
  var caretSeadmiseTeade = seaCaret(t.indexOf('|'));
  // Standardne logimine
  console.log('Programm: ' + moodustaTekstiStruktuurKonsoolile() + caretSeadmiseTeade);
}
function seaCaret(pos) {
  /* Seab kursori (caret) kuvatud tekstis. Tagastab vastava logiteate.
  - Positsioonid on nummerdatud 0-st. 0-positsioon on enne esimest tähte.
  - Arvestada, et pos ei arvesta, et kesktäht võib olla ühekordselt.
  */

  // Leia span element ja positsioon selle tekstis, kuhu caret panna
  var tipuIDd = ['A', 'K1', 'Kt', 'K2', 'B']; 
  var kumPikkus = 0;
  var otsitavTipp;
  var posTipus;
  for (var i = 0; i < tipuIDd.length; i++) {
    var tipuPikkus = $('#' + tipuIDd[i]).html().length;
    if (pos <= kumPikkus + tipuPikkus) {
      otsitavTipp = tipuIDd[i];
      posTipus = pos - kumPikkus;
      break 
    }
    kumPikkus = kumPikkus + tipuPikkus;
    if (tipuIDd[i] == 'K2' && tipuPikkus == 0) {
      kumPikkus += 1;
    }
  }

  // Sea caret
  var range = document.createRange();
  var el = document.getElementById(otsitavTipp);
  range.setStart(el.childNodes[0], posTipus);
  range.collapse(true); // Lõpp ühtib algusega
  var valik = document.getSelection();
  valik.removeAllRanges();
  valik.addRange(range);

  return ' caret: ' + otsitavTipp + ', ' + posTipus;
}

// Teksti redigeerimisega seotud funktsioonid
function tuvastaCaretJaSeaSisekursor() {
    // Selgita välja caret positsioon, sest kasutaja võib olnud seda muutnud, sea vastavalt sisemine kursor ja tagasta vastav teade.

    // Tühja teksti puhul ei oma mõtet.
    // Arvesta ka, et tühja teksti puhul on esimeses span-elemendis 0-pikkusega tühik (et hoida div-elemendi mõõtmeid).
    if (t.length == 1) {
      return '(tühitekst)'
    }

    // Leia span element, kus valik algab ja valiku alguspositsioon selles elemendis
    var r = document.getSelection().getRangeAt(0);
    var algusSpan = r.startContainer.parentNode.id;
    var algusPos = r.startOffset;
    console.log(algusSpan.toString() + ':' + algusPos.toString());

    // Leia positsioon, kuhu sisemine kursor (|) liigutada.
    var tipuIDd = ['A', 'K1', 'Kt', 'K2', 'B']; 
    var kum = 0; // Kumulatiivne positsioon
    for (var i = 0; i < tipuIDd.length; i++) {
      if (tipuIDd[i] == algusSpan) {
        kum += algusPos;
        break 
      } 
      else {
        kum += $('#' + tipuIDd[i]).text().length;
      }
    }
    if (algusSpan == 'B' && kuvaKeskelementYhekordselt) {
      kum += 1; // Sest siseesituses on keskelement alati kahekordselt
    }
    // Aseta sisemine kursor positsioonile kum
    t = t.replace('|', '');
    if (kum == 0) {
      t = '|' + t;
    }
    else {
      t = t.replace(new RegExp('.{' + kum + '}'), '$&' + '|');
    }
    var teade = 'Tuvastatud caret (' + algusSpan + ',' + algusPos + '), seatud sisekursor: ' + t;
    return teade
}
function tootleEriklahv(keyCode) {

  var teade = tuvastaCaretJaSeaSisekursor();
  // Standardne logimine
  console.log('Kasutaja: ' + keyCodeToHumanReadable(keyCode) + ' - ' + teade);

  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  function tootleBackspace() {

    // Teksti alguses mõju ei ole
    if (tE == 0) {
      return
    }
    // Eemaldatav täht või punktuatsioon
    var e = tekstEnne.substring(tekstEnne.length - 1, tekstEnne.length);
    // Punktuatsioon lihtsalt eemaldada
    if (kirjavm(e)) {
      t = tekstEnne.substring(0, tekstEnne.length - 1) + "|" + tekstParast;
    }
    // Eemaldan tähe tE koos selle peegeltähega
    else {
      // Läbin kogu teksti
      for (var i = 0; i < t.length; i++) {
        if (kirjavm(t[i]) || t[i] == "|") {
          acc = acc + t[i];
        }
        else {
          taheloendur++;
          if (taheloendur == tE ||
              taheloendur == tP + 1) {
            // Jätta vahele
          }
          else {
            acc = acc + t[i];
          }
        }
      }
      t = acc;
    }
    aktiveeriTekstinupud(); // Kas see on vajalik? Ja kui tekkis tühitekst?
    t = eemaldaEsityhik(t);
    kuvaTekst();
  }

  function tootleDelete() {

    // Teksti lõpus mõju ei ole
    if (tP == 0) {
      return
    }
    // Eemaldatav täht või punktuatsioon
    var e = tekstParast[0];
    // Punktuatsioon lihtsalt eemaldada
    if (kirjavm(e)) {
      t = tekstEnne + "|"  + tekstParast.substring(1, tekstParast.length);
    }
    // Eemaldan tähe tE + 1 koos selle peegeltähega
    else {
      // Läbin kogu teksti
      for (var i = 0; i < t.length; i++) {
        if (kirjavm(t[i]) || t[i] == "|") {
          acc = acc + t[i];
        }
        else {
          taheloendur++;
          if (taheloendur == tE + 1 ||
              taheloendur == tP) {
            // Jätta vahele
          }
          else {
            acc = acc + t[i];
          }
        }
      }
      t = acc;
    }
    aktiveeriTekstinupud();
    t = eemaldaEsityhik(t);
    kuvaTekst();
  }

  switch (keyCode) {
    case 8: // Backspace
      tootleBackspace();
      return
    case 46: // Delete
      tootleDelete();
      return
    case 33: // PgUp
      kuvaKeskelementYhekordselt = true;
      kuvaTekst();
      return
    case 34: // PgDn
      kuvaKeskelementYhekordselt = false;
      kuvaTekst();
      return
    case 38: // Up
      suurtaheks();
      return
    case 40: // Down
      vaiketaheks();
      return
  }
}
function lisaTahtVoiPunktuatsioon(charCode) {
  // Lisa kasutaja sisestatud täht või kirjavahemärk
  // Kontrollib, kas märgikood on lubatute hulgas
  if  (!
        (ladinaTaht(charCode) || tapiTaht(charCode) ||
         veneTaht(charCode) || kirjavmKood(charCode)
        )
      ) {
    return
  }

  var teade = tuvastaCaretJaSeaSisekursor();

  // Enter vajutus asenda siseesituses tärgiga ⏎.
  var charTyped = charCode == 13 ? '⏎' : String.fromCharCode(charCode);

  // Standardne logimine
  console.log('Kasutaja: ' + charTyped + ' ' + teade);

  // Sisestatud tärgi lisamine siseesitusse
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  // Mitut tühikut järjest mitte lubada, sest nende kuvamine vajaks teistsugust lahendust
  if (charCode == 32 && tE > 0 && tekstEnne.charCodeAt(tekstEnne.length - 1) == 32) {
    return
  }

  if (kirjavmKood(charCode)) {
    t = tekstEnne + charTyped + "|" + tekstParast;
  }
  // Tähe puhul lisada ka peegeltäht
  else if (tE == tP) {
    // Lisa peegelsümbol kohe joone taha
    t = tekstEnne + charTyped + "|" + charTyped + tekstParast;
  }
  else if (tE < tP) {
    // Lisa peegeltäht tekstParast-sse
    // tähe tP - tE järele
    // console.log('tE, tP: ', tE, tP);
    for (var i = 0; i < tekstParast.length; i++) {
      acc = acc + tekstParast[i];
      // Kui on täht..
      if (! kirjavm(tekstParast[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP - tE) {
          acc = acc + charTyped;
        }
      }
    }
    t = tekstEnne + charTyped + "|" + acc;
  }
  else if (tE > tP) {
    // Lisa peegeltäht tekstEnne-sse tähe tP + 1 ette
    for (var i = 0; i < tekstEnne.length; i++) {
      // Kui on täht..
      if (! kirjavm(tekstEnne[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP + 1) {
          acc = acc + charTyped;
        }
      }
      acc = acc + tekstEnne[i];
    }
    t = acc + charTyped + "|" + tekstParast;
  }

  aktiveeriTekstinupud();
  // console.log('Tekst: ', t);
  t = eemaldaEsityhik(t);
  kuvaTekst();
} 
function seaTekstisisestuseKasitlejad() {
  /*
    * Teksti muutvaid klahvivajutusi käsitletakse sündmuste 'keydown' ja  'keypress' kaudu. (Hiljem võib lisada sündmuse 'paste').
    * Sündmus 'keydown' tekib klahvi vajutamisel esimesena.
      Seejärel tekib 'keypress'.
    * Teksti navigeerivaid (caret-d muutvaid) sündmusi (vasakule, paremale) otseselt ei töötle. Caret positsioon selgitatakse välja siis, kui kasutaja vajutab klahvi, mida töödeldakse.

  */

  /* Sündmuse 'keydown' käsitleja. Püüame kinni eriklahvide vajutused, mida tahame töödelda: 8 (Backspace), 46 (Delete), 33 (PgUp), 34 (PgDn), 38 (Up), 40 (Down). Nende vaikimisi toiming tühistatakse.
  */
  $('#Tekst').on('keydown', function(e) {
    var keyCode = e.keyCode;

    // Standardne logimine
    if (logimistase == 1) {
      console.log('keydown: ' + keyCodeToHumanReadable(keyCode) + '(' + keyCode + ')');
    }

    if ([8, 46, 33, 34, 38, 40].includes(keyCode)) {
      e.preventDefault();
      tootleEriklahv(keyCode);
    }
    // var ctrlDown = e.ctrlKey||e.metaKey // Mac-i tugi
    // Kui Ctrl+v, siis lase seda käsitleda paste sündmuse käsitlejal
    // if (ctrlDown && keyCode == 86) { return }
  });

  /* Sündmuse 'keypress' käsitleja. Kui klahvivajutusest tekkis tärgikood, siis suunatakse tähe või punktuatsioonimärgi töötlusele. Kontroll, kas märgikood on lubatute hulgas, tehakse lisaTahtVoiPunktuatsioon-is. Vaikimisi toiming tõkestatakse. */
  $('#Tekst').on('keypress', function(e) {
    var charCode = e.charCode;

    // Võte reavahetuse (enter, keyCode 13) kinnipüüdmiseks ja töötlemiseks
    if (e.keyCode == 13) {
      charCode = 13;
    }

    // Standardne logimine
    if (logimistase == 1) {
      console.log('keypress: ' + String.fromCharCode(charCode) + '(' + charCode + ')');
    }

    if (charCode != null && charCode != 0) {
      e.preventDefault();
      lisaTahtVoiPunktuatsioon(charCode);
    }
  });

  // Ctrl-V (Paste) töötleja
  $('#Tekst').on('paste', function(e) {
    console.log('paste');
    // common browser -> e.originalEvent.clipboardData
    // uncommon browser -> window.clipboardData
    var clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('text');
    console.log('pasted data: ' + pastedData);
    e.preventDefault(); // We are already handling the data from the clipboard, we do not want it inserted into the document
  });
}
function seaTekstinupukasitlejad() {
  // Sea sisestatava teksti käsitlejad
  $('#Poolednupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = vahetaPooled(t);
      kuvaKeskelementYhekordselt = false;
      t = eemaldaEsityhik(t);
      kuvaTekst();
    }
  });

  $('#Uusnupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = "|";
      kuvaKeskelementYhekordselt = false;
      kuvaTekst();
    }
  });

  // Aktiveeri tekstiga seotud nupud
  aktiveeriTekstinupud();
}

// Abiteabe funktsioon
function seaInfopaaniKasitlejad() {
  // Infopaani käsitlejad
  $('#Info').click(function() {
    $('#Infopaan').removeClass('peidetud');
    $('#Info').addClass('disabled');
  });

  $('#InfopaanSulge').click(function() {
    $('#Infopaan').addClass('peidetud');
    $('#Info').removeClass('disabled');
  });
}

// Õigekirjakontroll
function seaOigekirjakasitlejad() {
  $('#Oigekirjakontroll').click(function() {
    $('#Oigekirjadialoog').removeClass('peidetud');
    $('#Oigekirjakontroll').addClass('disabled');
  });

  $('#OigekiriSulge').click(function() {
    $('#Oigekirjadialoog').addClass('peidetud');
    $('#Oigekirjakontroll').removeClass('disabled');
  });

  $('#OigekiriKontrolli').click(function() {
    var k = $('#KontrollitavTekst').val();
    var t = samatekst(k) ? 'on samatekst' : 'ei ole samatekst';
    $('#KontrolliTulemus').text(t);
  });
}

// Kool
function seaKoolikasitlejad() {
  $('#Kool').click(function() {
    $('#Koolitekst').removeClass('peidetud');
    $('#Kool').addClass('disabled');
  });

  $('#KoolSulge').click(function() {
    $('#Koolitekst').addClass('peidetud');
    $('#Kool').removeClass('disabled');
  });
}

// Peaprogramm
function alusta() {
  // Initsialiseeri tooltip-id
  $('[data-toggle="tooltip"]').tooltip();

  seaTekstisisestuseKasitlejad();
  seaTekstinupukasitlejad();
  seaSalvestuseKasitlejad();
  seaInfopaaniKasitlejad();
  seaTekstikoguKasitlejad();
  seaFiltriKasitlejad();
  seaOigekirjakasitlejad();
  seaKoolikasitlejad();

  // Algustekst (kursor)
  kuvaTekst();
  $('#Tekst').focus();

  laeTekstid(); // Lae tekstid alla
}
