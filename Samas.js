//
// Süntaksikontrollija: http://esprima.org/demo/validate.html

var t = "|"; // Tekst, kursoriga
var kuvaKeskelementYhekordselt = false;

var jLk = 1; // Jooksva lehekülje nr
var tLk = 8; // Tekste leheküljel
var tekstid; // Hoiab kõiki alla laetud tekste

var dialoogiseisund = 'N'; // 'S' - salvestamise dialoogis

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
  // tühik 32  , 44  . 46  - 45  ! 33  ? 63
  // ( 40  ) 41  : 58  ; 59  " 34
  var p = [32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34];
  var r = p.indexOf(charCode);
  return (r >= 0)
}

function kirjavm(char) {
  // Kontrollib, kas tärk on kirjavahemärk
  return (kirjavmKood(char.charCodeAt(0)))
}

function tahti(str) {
  // Tagastab tähtede arvu stringis. Ei arvesta punktuatsioone ja kursorijoont
  return str
    .split("")
    .filter(s => (! kirjavm(s)) && (s != "|"))
    .length;
}

function markeeriTekst() {
  // Tagastab markeeritud keskkohaga teksti
  // Markeerib punase värviga
  var acc = ""; // Tagastatav tekst, lisatud markeering

  if ((tahti(t) < 4)) {
    return t
  }

  var p = tahti(t) / 2; 
  var taheloendur = 0;

  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon või kursorijoon
    if (kirjavm(t[i]) || t[i] == "|") {
      acc = acc + t[i];
    }
    // Täht
    else {
      taheloendur++;
      // Esimene keskelement markeerida
      if (taheloendur == p) {
        acc = acc + "<span class='kesk'>" + 
          t[i] + "</span>";
      }
      // Teine keskelement...
      else if (taheloendur == p + 1) {
        if (kuvaKeskelementYhekordselt) {
          // ...mitte kuvada
        }
        else {
          // ...kuvada ja markeerida
          acc = acc + "<span class='kesk'>" + 
            t[i] + "</span>";
        }
      }
      // Kuvada tavaliselt
      else {
        acc = acc + t[i];
      }
    }
  }
  return acc
}

function kuvaTekst() {
  var mTekst = markeeriTekst();
  // console.log('Markeeritud tekst: ', mTekst);
  $('#Tekst').html(mTekst);
}

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
  // Kursori järel olev täht muudatakse vaiketäheks
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

function tootleEriklahv(keyCode) {
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  function tootleLeft() {
    if (keyCode == 37) { // Left
      if (tekstEnne.length == 0) {
        return
      }
      t = tekstEnne.substring(0, tekstEnne.length - 1) + "|" +
        tekstEnne.substring(tekstEnne.length - 1, tekstEnne.length) +
        tekstParast;
      kuvaTekst();
      return
    }
  }

  function tootleRight() {
    if (keyCode == 39) { // Right
      // Lõpus mõju ei ole
      if (tekstParast.length == 0) {
        return
      }
      t = tekstEnne + tekstParast.substring(0, 1) + "|" + 
        tekstParast.substring(1, tekstParast.length);
      kuvaTekst();
      return
    }
  }

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
    kuvaTekst();
  }

  // Selektor
  if (keyCode == 37) { // Left
    tootleLeft();
    return
  }
  if (keyCode == 39) { // Right
    tootleRight();
    return
  }
  if (keyCode == 8) { // Backspace
    tootleBackspace();
    return
  }
  if (keyCode == 46) { // Delete
    tootleDelete();
    return
  }
  if (keyCode == 33) { // PgUp
    kuvaKeskelementYhekordselt = true;
    kuvaTekst();
  }
  if (keyCode == 34) { // PgDn
    kuvaKeskelementYhekordselt = false;
    kuvaTekst();
  }
  if (keyCode == 38) { // Up
    suurtaheks();
  }
  if (keyCode == 40) { // Down
    vaiketaheks();
  } 
}

function lisaTahtVoiPunktuatsioon(chrCode) {
  var chrTyped = String.fromCharCode(chrCode);
  // console.log("chrTyped: ", chrTyped);
  var osad = t.split("|");
  var tekstEnne = osad[0]; // Tekst enne joont
  var tekstParast = osad[1]; // Tekst pärast joont
  var tE = tahti(tekstEnne); // Tähti enne osas
  var tP = tahti(tekstParast); // Tähti pärast osas
  var acc = ""; // Akumulaator
  var taheloendur = 0;

  // Kontrollib, kas märgikood on lubatute hulgas
  if  (!
        (ladinaTaht(chrCode) || tapiTaht(chrCode) ||
         veneTaht || kirjavmKood(chrCode)
        )
      ) {
    return
  }

  if (kirjavmKood(chrCode)) {
    t = tekstEnne + chrTyped + "|" + tekstParast;
  }
  // Tähe puhul lisada ka peegeltäht
  else if (tE == tP) {
    // Lisa peegelsümbol kohe joone taha
    t = tekstEnne + chrTyped + "|" + chrTyped + tekstParast;
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
          acc = acc + chrTyped;
        }
      }
    }
    t = tekstEnne + chrTyped + "|" + acc;
  }
  else if (tE > tP) {
    // Lisa peegeltäht tekstEnne-sse tähe tP + 1 ette
    for (var i = 0; i < tekstEnne.length; i++) {
      // Kui on täht..
      if (! kirjavm(tekstEnne[i])) {
        taheloendur++;
        // Lisada peegeltäht?
        if (taheloendur == tP + 1) {
          acc = acc + chrTyped;
        }
      }
      acc = acc + tekstEnne[i];
    }
    t = acc + chrTyped + "|" + tekstParast;
  }

  // console.log('Tekst: ', t);
  kuvaTekst();
} 

function vahetaPooled() {
  var p = tahti(t) / 2;
  if (p < 2) {
    return
  }
  var taheloendur = 0;
  var esimesePooleLopp;
  // Leia keskkoht
  for (var i = 0; i < t.length; i++) {
    // Punktuatsioon kanna üle
    if (! (kirjavm(t[i]) || t[i] == "|") ) {
      taheloendur++;
      if (taheloendur == p) {
        esimesePooleLopp = i;
        break;
      }
    }
  }
  var a = t.substring(0, i + 1);
  var b = t.substring(i + 1, t.length);
  t = b + a;
  kuvaKeskelementYhekordselt = false;
  kuvaTekst();
}

function kuvaLehekylg(p) {
  // Kuvab massiivist tekstid lehekülje p, DOM elementi 'Lugemik'
  // Ühtlasi uuendab sirvimispaneeli 'Sirvimine'
  // Kui lehekülje p tekste ei ole, siis ei tee midagi
  if (p < 1 || tekstid.length < tLk * (p - 1) + 1) {
    return
  }
  // Kuva tekstid
  // Puhasta eelmine
  $('#Lugemik').empty();
  // Massiiv tekstid on indekseeritud 0-alusel
  for (var i = tLk * (p - 1);
           i < tLk * p && i < tekstid.length; i++) {
    var kirje = $('<p></p>')
      .addClass('kirje')
      .appendTo('#Lugemik'); 
    // Märgendi Draft lisamine
    var kuvatavTekst = tekstid[i].Tekst;
    if (tekstid[i].Draft) {
      kuvatavTekst = kuvatavTekst + '<span class="margend">Kavand</span>';
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

function laeTekstid() {
  // Laeb Google töölehelt "Samatekstid" lehekülje p
  // tekste 
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';
  $.get(url,
    function(data, status, xhr) {
      $('#Lugemik').empty();
      tekstid = data.Tekstid;
      // Kuva saadud tekstid
      kuvaLehekylg(1);
    }); 
}

function salvestusdialoog() {
}

function salvestaTekst() {
  // Koosta puhas tekst
  // Eemalda kursorijoon ja kesktähe peegeltäht
  var peegeltaheNr = tahti(t) / 2 + 1;
  var taheloendur = 0;
  var c = ''; // Puhas tekst
  for (var i = 0; i < t.length; i++) {
    if (kirjavm(t[i])) {
      c = c + t[i];
    }
    else if (t[i] == "|") {
      // Jäta vahele
    }
    else {
      taheloendur++;
      // Jäta peegeltäht vahele?
      if (kuvaKeskelementYhekordselt) {
        if (taheloendur != peegeltaheNr) {
          c = c + t[i];
        }
      }
      else {
        c = c + t[i];
      }
    }
  }

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
      // Uuenda lugemikku
      // Sünkroonimise probleem - ei ilmu kohe. Seetõttu pilvest mitte
      // lugeda.
      // Lisada tekst
      var u = { Tekst: a, Draft: b };
      console.log("Lisada tekst: " + u.toString());
      tekstid.unshift(u);
      tekstid[0].Tekst = c;
      kuvaLehekylg(1);
    });
}

function alusta() {
  // Initsialiseeri tooltip-id
  $('[data-toggle="tooltip"]').tooltip();

  // Sisestatava teksti käsitlejad

  $('#Poolednupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      vahetaPooled();
    }
  });

  $('#Uusnupp').click(function() {
    if (dialoogiseisund == 'N') {
      $('#Tekst').focus();
      t = "|";
      kuvaKeskelementYhekordselt = false;
      logiTekst = "";
      kuvaTekst();
    }
  });

  $('#Salvesta1').click(function() {
    if (dialoogiseisund == 'N') {
      // Ava salvestusdialoog
      $('#Salvestusdialoog').toggle();
      dialoogiseisund = 'S';
      $('#draftNupp').focus();
    }
  });

  $('#Salvesta2').click(function() {
    salvestaTekst();
  });

  $('#Tyhista').click(function() {
    // Sule salvestusdialoog
    $('#Salvestusdialoog').toggle();
    dialoogiseisund = 'N';
    $('#Tekst').focus();
  });

  // Lugemiku sirvimisnuppude käsitlejad
  $('#FirstPage').click(function() {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(1); 
    }  
  });
  
  $('#NextPage').click(function() {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk + 1);
    }
  });
  
  $('#PrevPage').click(function() {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(jLk - 1);
    }
  });
  
  $('#LastPage').click(function() {
    if (dialoogiseisund == 'N') {
      kuvaLehekylg(Math.ceil(tekstid.length / tLk));
    }
  });
  
  // Tekstisisestuse käsitleja
  $(document).keypress(function(e) {
    var evt = e ? e : event;
    e.stopPropagation();
    e.preventDefault();
    var charCode = evt.charCode;
    var keyCode = evt.keyCode;

    if (charCode != null && charCode != 0) {
      // Sisestatud täht
      lisaTahtVoiPunktuatsioon(charCode);
    }
    else if (evt.keyCode != null) {
      // Vajutatud eriklahv
      tootleEriklahv(keyCode);
    }
  });

  // Algustekst (kursor)
  $('#Tekst').text(t);
  laeTekstid(); // Lae tekstid alla
  $('#Tekst').focus();
}
