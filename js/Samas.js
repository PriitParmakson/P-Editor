/*
  Samatekstiredaktor (Editor for Palindromic Texts), Priit Parmakson, 2017. MIT Licence
*/

var logimistase = 1; 
/*
  Mida suurem, seda rohkem teavet konsoolile kuvatakse
  0
    - ei kuvata midagi
  1
    - seatud filter
    - salvestatud tekst
    - redaktoris kuvamiseks moodustatatud tekst
  2 
    - kasutaja klahvivajutus (KEYDOWN)
    - kasutaja sisestatud tärk (KEYPRESS)
    - tuvastatud kursori (caret) positsioon 
*/

// Globaalsed muutujad
/* Väljas #Tekst oleva teksti mudel */
var t = '|';
var kuvaKesktahtYhekordselt = false;
/* Hoiab kõiki allalaetud tekste
  Struktuur: { Tekst: <string>, Draft: <boolean> }
*/
var tekstid;
var jLk = 1; // Jooksva lehekülje nr
var tLk = 20; // Tekste leheküljel
var dialoogiseisund = 'N'; // 'S' - salvestusdialoogis

// Peaprogramm
function alusta() {
  // Initsialiseeri tooltip-id
  $('[data-toggle="tooltip"]').tooltip();

  seaRedaktoriKasitlejad();
  seaTekstinupukasitlejad();
  seaSalvestuseKasitlejad();
  seaInfopaaniKasitlejad();
  seaTeatepaaniKasitlejad();
  seaTekstikoguKasitlejad();
  seaFiltriKasitlejad();
  seaOigekirjakasitlejad();
  /* loeTutvustustekst();
  seaTutvustustekstiKasitlejad();
  */
  seaSamatekstidTekstistKasitlejad();
  seaSonastikuKasitlejad();
  seaSeotudTekstiKasitlejad();

  // Algustekst (kursor)
  kuvaTekst();
  $('#Tekst').focus();

  laeTekstid(); // Lae tekstid alla
}
