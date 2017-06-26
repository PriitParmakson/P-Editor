/*
  Samatekstiredaktor (Editor for Palindromic Texts), Priit Parmakson, 2017. MIT Licence
*/

var logimistase = 1; 
/*
  0 
    - seatud filter
    - salvestatud tekst
    - redaktoris kuvamiseks moodustatatud tekst
  1 
    - kasutaja klahvivajutus (KEYDOWN)
    - kasutaja sisestatud tark (KEYPRESS) 
*/

// Globaalsed muutujad
var t = '|'; // Tekst
var kuvaKesktahtYhekordselt = false;
var tekstid; /* Hoiab kõiki allalaetud tekste
  Struktuur: { Tekst:..., }
*/
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
