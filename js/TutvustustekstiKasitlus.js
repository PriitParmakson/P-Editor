function loeTutvustustekst() {
  /* Loe GitHub-st fail docs/Tutvustus.md,
  eemalda front matter, teisenda HTML-ks ja
  aseta elementi #KoolitekstSisemine.
  Ei pea tegema läbi serveri, sest GitHub API toetab CORS-i.
  Vastuse struktuur vt: https://developer.github.com/v3/repos/contents/#get-contents.
  sisu (t.content) on base64-kodeeritud
  */
  var u = 'https://api.github.com/repos/PriitParmakson/Samatekst/contents/docs/Tutvustus.md';
  $.ajax(u, {
    method: 'GET',
    success: function (saadudAndmed) {
      // base64 -> UTF-8
      var t = b64DecodeUnicode(saadudAndmed.content);
      // Eemalda front matter
      if (t.startsWith('---')) {
        var p = t.indexOf('---', 3);
        var pt = t.slice(p + 4);
        console.log('Loetud: ' + pt.length);
        // Teisenda HTML-ks
        var md = new Remarkable({
          html: true, // Enable HTML tags in source
        });
        htmlTekst = md.render(pt);
        // Kuva HTML
        $('#KoolitekstSisemine').html(htmlTekst);
      }
    }
  });
}

function seaTutvustustekstiKasitlejad() {

  // "Kooli" nupukäsitlejad
  $('#Kool').click(function () {
    $('#Koolitekst').removeClass('peidetud');
    $('#Kool').addClass('disabled');
  });

  $('#KoolSulge').click(function () {
    $('#Koolitekst').addClass('peidetud');
    $('#Kool').removeClass('disabled');
  });
}
