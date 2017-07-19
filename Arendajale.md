---
title: Arendajale
permalink: Arendajale
layout: Tekstid
---

# Arendajale 
{: .no_toc}

Samatekstide (palindroomide) veebiredaktor ja pilves hoitav tekstikogu

- Repo: [https://priitparmakson.github.io/Samatekst/](https://priitparmakson.github.io/Samatekst/)

- [Funktsioonikataloog](https://priitparmakson.github.io/Samatekst/Funktsioonikataloog.html)

- [Koodimeetrikad](https://priitparmakson.github.io/Samatekst/Meetrikad.html)

- Taustatekste
  - [Näppimisest, konfimisest ja tööriistade isetegemisest](docs/Nappimisest)

<!-- - TOC
{:toc}  -->

## Arhitektuur

- Klient:
  - Javascript/Bootstrap4
    - koodihoidla: GitHub
    - arendusvahend: Visual Studio Code
- Server:
  - Google Apps
    - programmeerimiskeel: Google Apps Script
    - arendusvahend: Google Apps Script Editor
- Andmebaas:
  - Google Sheet
- Autentimine:
  - Google Sign-In (OAuth 2.0)
- Dokumentatsioon:
  - GitHub Pages (github.io, Jekyll)

<a target href='resource/ARHITEKTUUR.png'>Arhitektuurijoonis</a>

## Funktsionaalsed omadused (Mida tarkvara teeb?)

- 1 Samatekstide mõiste ja terminite tutvustus, koos näidetega ("Mis on samatekst?"
- 2 Samatekstiredaktor
  - 2.1 Samateksti sisestamisel programm hoiab teksti kogu aeg samatekstina
    - 2.1.1 Lisab või kustutab ise peegeltähe
  - 2.2 Tekst võib sisaldada kirjavahemärke.
  - 2.3 Teksti saab kustutada (`Backspace` ja `Delete` ühe tärgi kaupa).
  - 2.4 Tekstis saab liikuda ja kursorit seada.
  - 2.5 Tekstisisestusalasse saab teksti asetada (Ctrl+V).
    - 2.5.2 Teksti asetamisel kontrollib teksti vastavust samateksti reeglitele
  - 2.6 Kesktäht (-tähed) kuvatakse rõhutatult.
  - 2.7 Samateksti pooled saab vahetada.
  - 2.8 Saab alustada uut samateksti.
  - 2.9 Teksti saab salvestada pilvemällu.
    - 2.9.1 Salvestamisel saab märkida, kas tekst on kavand.
- 3 Samatekstilisuse kontroll
  - 3.1 Eraldi saab kontrollida, kas tekst on samatekst
- 4 Tekstikogu
  - 4.1 Saab lehitseda salvestatud tekste.
  - 4.2 Salvestatud tekste saab otsida.
    - 4.2.1 Tähekombinatsiooni sisaldumise järgi
    - 4.2.2 Kesktähe kaudu.
- 5 Infopaanil pakutakse väikest abiteksti
- 6 Sõnastik ligi 47 000 sõnaga
  - 6.1 Sõnastikust saab otsida
    - 6.1.1 Otsistringi ja *-i abil
    - 6.1.2 Võimalus kuvada otsitulemused ka pöördkujul
- 7 Seotud tekstide kuvamine
  - 7.1 Samaväärsed tekstid (`=`)
  - 7.2 Eellased (`>`) ja järglased (`<`)
  - 7.3 Ühise alamsõne järgi (pikkusega vähemalt 4) 
- 8 Teksti samatekstilisuse kontroll
  - 8.1 Saab asetada või sisestada teksti ja kontrollida selle vastavust samateksti reeglitele
- 9 nn Arhiivkogu - valik samatekste
- 10 Google kontoga sisselogimine
  - salvestamisõigus ainult autenditud kasutajal
  - salvestatakse autori nimi ja e-posti aadress  

## Teksti esitusvormingud

Suur osa funktsionaalsusest on seotud samatekstide teisendamisega ühest esitusest (kujust) teise. Samatekst võib olla mitmes erinevas esituses:

1. kasutajale nähtav esitus tekstisisestusalal (`#Tekst`)
2. siseesitus
3. HTML-esitus kuvamiseks tekstisisestusalal
4. pilveesitus (salvestatud kuju)
5. esitus tekstikogus ja arhiivkogus
6. HTML-esitus kuvamiseks tekstikogus
7. esitus sirvija konsoolil (logimine silumise eesmärgil). 

Tähtsamad teisendused:

```
        Esitus teksti-     (1)
        sisestusalal   +------->  Siseesitus
            ^                         +
            |                     +   |
            | (2)                 |   |
            +           (2)       |   | (3)
            HTML   <---------------+   |
                                      |
                                      v
            HTML    <------------+ Pilveesitus
            +           (4)
            |
            | (4)
            v
        Tekstikogu
        esitus

```

(1) kasutaja sisestab tekstisisestusalal; klahvivajutused püütakse sündmuste `keydown` ja `keypress` abil kinni, filtreeritakse (lubatud tähed ja kirjavahemärgid), tehakse kindlaks kursori (ingl _caret_) asukoht. Sisestatavat teksti hoitakse sisekujul.

(2) Tähe lisamisel lisab programm automaatselt peegeltähe ja uuendab tekstisisestusalal olevat teksti. 

(3) Kasutaja saab teksti salvestada. Programm teisendab salvestatava teksti pilveesitusse.

(4) Salvestatud tekste saab sirvida ja otsida. Salvestatud tekstid esitatakse kuval HTML abil.

### Siseesitus  
* Sisemiselt hoitakse kesktähte alati kahekordselt. Teavet kesktähe kordsuse kohta hoiab globaalne muutuja `kuvaKeskelementYhekordselt`.
* Samuti hoitakse siseesituses kursori positsiooni (sümbol `|`).
* Reavahetus hoitakse sümboliga `/`.

Näiteks: `IT//|Säh, hästi! `

`Samma|s` tähendab `Samas`, kui `kuvaKeskelementYhekordselt` = `true`

### Esitus tekstisisestusalal 

Nähtav:

`IT//|Säh, hästi! `

`|` - tühitekst

* Kesktäht (või -tähed) esitatakse rõhutatult.
* Reavahetus esitatakse sümboliga `/`.
* Kuvatakse HTML-esituse abil.
  * Kuval esitatav tekst on jagatud viie `span`-elemendi vahel (võivad olla tühjad): `A`, `K1`, `Kt`, `K2`, `B`.
  * Tühiteksti puhul pannakse esimesse `span`-elementi (`A`) 0-pikkusega tühik (`&#8203;`), seda selleks, et tekstisisestusala `div`-element ei kollapseeruks.

Näited:

`<span id='A'>IT//Sä</span><span id='K1' class='kesk'>h</span><span id='Kt' class='kesk'>, </span><span id='K2'>h</span><span id='B'>ästi!</span>`

`<span id='A'>&#8203;</span><span id='K1'></span><span id='Kt'></span><span id='K2'></span><span id='B'></span>` - tühiteksti esitamine 0-pikkusega tühiku abil

### Esitus tekstikogus

Näide:

```
IT

Säh, hästi!
```

* Kuval esitatakse kesktäht (või -tähed) rõhutatult.
* Reavahetus teostatakse, `<br>`-elemendi abil.
* Kuvatakse HTML-esituse abil. Näide:

`<span id='A'>IT<br><br>Sä</span><span id='K1' class='kesk'>h</span><span id='Kt' class='kesk'>, </span><span id='K2'>h</span><span id='B'>ästi!</span>`

### Esitus pilvemälus
* Ühekordne kesktäht esitatakse ühekordselt
* Reavahetus hoitakse sümboliga `/`. Näide:

`IT//Säh, hästi! `
 
## Tekstikogu
* Salvestamine
    * Toimub väikeses dialoogis, kus kontrollitakse, kas ikka tahetakse salvestada ja soovi korral määratakse, kas tekst on kavand. Salvestusdialoog on modaalse olemusega.
    * Salvestatakse Google Sheet-le, kasutades Google Sheets REST API-t.
    * Pilve salvestatakse puhta tekstina (rõhutusteta, kesktäht ühekordselt, kui nii on määratud).
    * Kontrollitakse, kas sama tekst on juba olemas.
* Filtri- e otsidialoog
  * Võib olla avatud samaaegselt teksti sisestuse alaga, kuna tekstisisestussündmusi püütakse tekstisisestusalas.
  * Filtreerimisel ei jagata väljundit lehekülgedeks.
* Turvalisus
    * Injection-ründe kaitse. Google Sheet-iga seotud serverirakenduses (Google Apps Script-is) kontrollitakse üle, et tekst ei sisalda HTML-i.
    * samuti kontrollitakse API poolel, et HTTP POST-päringuga salvestamiseks saadetud tekst on tõesti samatekst. <span class='todo'>TO DO</span>
  
## Logimine
* Logitakse:
    * tekstiredigeerimist (elemendis `Tekst`)
      * nii kasutaja klahvivajutusi
      * kui ka programmi poolt väljastatud teksti
    * filtri seadmist (otsistring + piiravad tingimused)
* Logitasemed:
  * `0` - ei logita midagi
  * `1` - logitakse tekstisisestus ja -väljastus
  * `2` - lisaks eelmisele logitakse `keydown` ja `keypress` sündmused jm
* Logimise sisselülitamine:
  * `logimistase = 2;` sirvija konsoolil 
  * vaikimisi on logimistase 1 
* Logikirje algab funktsiooni nimega  

## Testimine
* Funktsioonitestimise automatiseerimiseks on leht `SamasTest.html`; testid pannakse kirja failis `SamasTest.js`.

## Redaktori tööpõhimõte

### Kasutaja sisendi kinnipüüdmine
* Kasutaja tegevused tekstisisestusväljas (elemendis `Tekst`) püütakse kinni sündmuste `keydown`,  `keypress` ja `paste` jälgimisega ja töötlemisega.

```
                           #Tekst
                    (tekstisisestusväli)  
                              ↓
       keydown             keypress             paste
                    (sündmusekäsitlejad) 
          ↓                    ↓                
 tootleEriklahv(keyCode)  lisaTahtVoiPunktuatsioon(charCode)
          ↓                    ↓                
    tootleBackspace()
    tootleDelete()
    kuvaKesktahtYhekordselt = true
    kuvaKesktahtYhekordselt = false
    suurtaheks()
    vaiketaheks()
          ↓                    ↓                
    kuvaTekst()
```

Sündmuse `keydown` käsitleja püüab kinni eriklahvivajutused, mida redaktoris tavapärasest eriliselt töödeldakse: `8` (`Backspace`), `46` (`Delete`), `33` (`PgUp`), `34` (`PgDn`), `38` (`Up`), `40` (`Down`). Nende vaikimisi toiming tühistatakse ja vajutusi käsitletakse tavapärasest erinevalt. Suunab eriklahvivajutuste töötlemiseks funktsiooni `tootleEriklahv`.

Sündmuse `keypress` käsitleja suunab kasutaja sisestatud tärgi töötlemiseks funktsiooni `lisaTahtVoiPunktuatsioon`.

Sündmuse `paste` käsitleja puhastab asetatava teksti kõrvalistest tärkidest ja kontrollib, kas asetamise tulemusena tekkinud tekst on samatekst. Kui ei ole, siis annab veateate ja sisendit ei aktsepteeri.

Kasutaja sisendi töötlemiseks on vaja tuvastada ka kursori (_caret_) positsioon. Seda teeb funktsioon `tuvastaCaretJaSeaSisekursor`.

### Teksti kuvamine

* HTML kujule teisendavad `markeeriTekst` ja `markeeriTekstikoguTekst`.
* Tekstisisestusala _caret_ positsiooni seab funktsioon `seaCaret`.
* Kuvatakse ka tähtede arv tekstis.

## Töövahendid
* Javascripti parimad praktikad: [https://github.com/wearehive/project-guidelines](https://github.com/wearehive/project-guidelines)
* Javascripti süntaksikontrollija: [http://esprima.org/demo/validate.html](http://esprima.org/demo/validate.html)
* HTML validaator: [https://validator.w3.org/nu/#file](https://validator.w3.org/nu/#file) (Firefox-i kontekstimenüüst )

## Märkmed

### Teave
* Kõigi HTML veebi-API-de nimekiri: [https://developer.mozilla.org/en-US/docs/Web/](https://developer.mozilla.org/en-US/docs/Web/)
* HTML sündmuste kohta: [https://www.w3schools.com/tags/ref_eventattributes.asp](https://www.w3schools.com/tags/ref_eventattributes.asp)
* JQuery sündmusekäsitlejate seadmine: [https://www.w3schools.com/jquery/jquery_events.asp](https://www.w3schools.com/jquery/jquery_events.asp)
* DOM `Node` objekt: [https://www.w3schools.com/xml/dom_node.asp](https://www.w3schools.com/xml/dom_node.asp)
* jQuery-ga tippudele ligipääsemine: [https://api.jquery.com/get/](https://api.jquery.com/get/)

### Sündmused
* Tähesisestuse töötlemiseks on `keypress` parem kui `keydown`, sest `keypress` näitab, milline tärk sisestati (eristab suur- ja väiketähti). `keydown` näitab millist klahvi vajutati.
* Väga hea seletus: [http://stackoverflow.com/questions/1367700/whats-the-difference-between-keydown-and-keypress-in-net](http://stackoverflow.com/questions/1367700/whats-the-difference-between-keydown-and-keypress-in-net)

### Nuppude töötlus
* Kasutajaliidese alade peitmiseks `style='display: none;'`; nähtavale toomine ja peitmine vastavalt JQuery `show`, `hide` ja `toggle`.
* Nuppude mitteaktiivseks tegemine klassiga `disabled`.

### Miks ei kasuta input elementi
* `Input` elemendis vt: setSelectionRange() HTML veebi-APIs HTMLInputElement - https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
* JQuery-s ei ole `oninput` võimalust, vt
   http://stackoverflow.com/questions/11189136/fire-oninput-event-with-jquery 
* Vt ka http://stackoverflow.com/questions/9906885/detect-backspace-and-del-on-input-event 

### Mitmesugust
* Arvesta ka Mac-i `metakey`-ga: http://stackoverflow.com/questions/2903991/how-to-detect-ctrlv-ctrlc-using-javascript
* `break` lause ei tööta Javascript `forEach`-ga.
* Tärgi asetamine stringi - vt http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index

### Ctrl+V (Paste) käsitlemine
* Vt https://www.w3.org/TR/clipboard-apis/
* Vt `onpaste` sündmus https://www.w3schools.com/jsref/event_onpaste.asp
* Kasutatud on: http://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event

### Caret (kursori) paigutamine contenteditable div elemendis
* `Range` - The Range interface represents a fragment of a document that can contain nodes and parts of text nodes. Vt https://developer.mozilla.org/en-US/docs/Web/API/Range
* Vt: http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
* `document.createRange()` vt: https://developer.mozilla.org/en-US/docs/Web/API/Document/createRange
* `Range` objekt vt: https://developer.mozilla.org/en-US/docs/Web/API/Range
* `Selection` objekt vt: https://developer.mozilla.org/en-US/docs/Web/API/Selection
* Caret paigutamine tühja teksti - kasuta 0-pikkusega tühikut, vt: http://stackoverflow.com/questions/4063144/setting-the-caret-position-to-an-empty-node-inside-a-contenteditable-element

## Visuaalne hierarhia

<a target href='resource/VisuaalneHierarhia.PNG'>Visuaalne hierarhia (joonis)</a>

## Autentimine

* Google Sign-In for Websites: [https://developers.google.com/identity/sign-in/web/](https://developers.google.com/identity/sign-in/web/)

## Meetrikad

- Koodimeetrikad on esitatud mõõdikulauana: [Meetrikad.html](https://priitparmakson.github.io/Samatekst/Meetrikad.html).
- Meetrikaid hoitakse [Google Sheet-l](https://docs.google.com/spreadsheets/d/1NpfIfh1jSoiBjUBaqaFpOcFGWshvx1L5OsR8-BGsoCY/edit#gid=0). Google Sheet pakub oma andmeid REST API kaudu, JSON-vormingus.

