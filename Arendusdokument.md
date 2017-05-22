---
title: Arendusdokument
---

# Samatekst 

Samatekstide (palindroomide) veebiredaktor ja pilves hoitav tekstikogu

Priit Parmakson, 2017. MIT litsents
 
##  Kasutatud

* Map of keycodes to human readable key names - https://github.com/micro-js/keycodes

## Teksti esitusvormingud

### Siseesitus  
* Sisemiselt hoitakse keskelementi alati kahekordselt. Teavet keskelemendi kordsuse kohta hoiab glob-ne muutuja `kuvaKeskelementYhekordselt`.
* Samuti hoitakse siseesituses kursori positsiooni (sümbol `|`).
* Reavahetus hoitakse sümboliga '⏎'.

`IT⏎⏎|Säh, hästi! `

`Samm|as` tähendab `Samas`, kui `kuvaKeskelementYhekordselt` = `true`

### Esitus tekstisisestusalal 

Nähtav:

`IT⏎⏎|Säh, hästi! `

`|` - tühitekst

* Kesktäht (või -tähed) esitatakse rõhutatult.
* Reavahetus esitatakse sümboliga `⏎`.
* Kuvatakse HTML-esituse abil.
  * Kuval esitatav tekst on jagatud viie `span`-elemendi vahel (võivad olla tühjad): `A`, `K1`, `Kt`, `K2`, `B`.
  * Tühiteksti puhul pannakse esimesse `span`-elementi (`A`) 0-pikkusega tühik, seda selleks, et div-element ei kollapseeruks.

`<span id='A'>IT⏎⏎Sä</span><span id='K1' class='kesk'>h</span><span id='Kt' class='kesk'>, </span><span id='K2'>h</span><span id='B'>ästi!</span>`

`<span id='A'>&#8203;</span><span id='K1'></span><span id='Kt'></span><span id='K2'></span><span id='B'></span>` - (0-pikkusega tühik)

### Esitus tekstikogus

`IT

Säh, hästi! `

* Kuval esitatakse keskelement (või -elemendid) rõhutatult.
* Reavahetus teostatakse.
* Kuvatakse HTML-esituse abil.

`<span id='A'>IT<br><br>Sä</span><span id='K1' class='kesk'>h</span><span id='Kt' class='kesk'>, </span><span id='K2'>h</span><span id='B'>ästi!</span>`

### Esitus pilvemälus
* Ühekordne keskelement esitatakse ühekordselt
* Reavahetus hoitakse sümboliga `⏎`.

`IT⏎⏎|Säh, hästi! `
 
## Tekstikogu
* Tekstid kuvatakse nummerdatult.
* Salvestamine
    * Toimub väikeses dialoogis, kus kontrollitakse, kas ikka tahetakse salvestada ja soovi korral määratakse, kas tekst on kavand. Salvestusdialoog on modaalse olemusega.
    * Salvestatakse Google Sheet-le, kasutades Google Sheets REST API-t.
    * Pilve salvestatakse puhta tekstina (rõhutusteta, keskelement ühekordselt, kui nii on määratud).
* Filtridialoog
  * Võib olla avatud samaaegselt teksti sisestuse alaga, kuna tekstisisestussündmusi püütakse tekstisisestusala.
  * Filtreerimisel ei jagata väljundit lehekülgedeks.
* Turvalisus
    * Injection-ründe kaitse. Google Sheet-iga seotud Google Apps Script-is kontrollitakse üle, et tekst ei sisalda HTML-i.
  
## Logimine
* Logitakse tekstiredigeerimist (elemendis `Tekst`)
    * nii kasutaja klahvivajutusi
    * kui ka programmi poolt väljastatud teksti.
* Tekstisisestuse logimine
    * Logiteade moodustatakse ühes kahest funktsioonist:
      * `lisaTahtVoiPunktuatsioon`
      * `tootleEriklahv`
    * Logiteade: "Kasutaja vajutas: " + klahvinimetus või tärk + tekstisisestusala seis
    * Tekstisisestusala analüüsitakse, lüüakse 5 `span`-elemendi kaupa tükkideks, näidatakse tuvastatud caret positsioon ja selle järgi seatud sisekursor.
  * Tekstiväljastuse logimine
    * Logitakse väljastatud tekst ja seatud caret positsioon.
    * Logiteade koostatakse funktsioonis `kuvaTekst`
  * Logitasemed:
    * `0` - logitakse tekstisisestus ja -väljastus
    * `1` - logitakse `keydown` ja `keypress` sündmused 

## Testimine
* Funktsioonitestimise automatiseerimiseks on lehe `SamasTest.html`; testid pannakse kirja failis `SamasTest.js`.

## Tähtsamad funktsioonid
* Kasutaja tegevused elemendis `Tekst` püütakse kinni sündmustega `keydown` ja `keypress`, kust suunatakse tähtede ja punktuatsioonisümbolite töötlemisele (`lisaTahtVoiPunktuatsioon`) või eriklahvivajutuste töötlemisele (`tootleEriklahv`).

## Töövahendid
* Javascripti süntaksikontrollija: [http://esprima.org/demo/validate.html](http://esprima.org/demo/validate.html)
* HTML validaator: [https://validator.w3.org/nu/#file](https://validator.w3.org/nu/#file) (Firefox-i kontekstimenüüst )

  Teave
  -----
  * Kõigi HTML veebi-API-de nimekiri: [https://developer.mozilla.org/en-US/docs/Web/](https://developer.mozilla.org/en-US/docs/Web/)
  * HTML sündmuste kohta: [https://www.w3schools.com/tags/ref_eventattributes.asp](https://www.w3schools.com/tags/ref_eventattributes.asp)
  * JQuery sündmusekäsitlejate seadmine: [https://www.w3schools.com/jquery/jquery_events.asp](https://www.w3schools.com/jquery/jquery_events.asp)
  * DOM `Node` objekt: [https://www.w3schools.com/xml/dom_node.asp](https://www.w3schools.com/xml/dom_node.asp)
  * jQuery-ga tippudele ligipääsemine: [https://api.jquery.com/get/](https://api.jquery.com/get/)

## Sündmused
* Tähesisestuse töötlemiseks on `keypress` parem kui `keydown`, sest `keypress` näitab, milline tärk sisestati (eristab suur- ja väiketähti). `keydown` näitab millist klahvi vajutati.
  * Väga hea seletus: [http://stackoverflow.com/questions/1367700/whats-the-difference-between-keydown-and-keypress-in-net](http://stackoverflow.com/questions/1367700/whats-the-difference-between-keydown-and-keypress-in-net)

## Miks ei kasuta input elementi
* `Input` elemendis vt: setSelectionRange() HTML veebi-APIs HTMLInputElement - https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
* JQuery-s ei ole `oninput` võimalust, vt
   http://stackoverflow.com/questions/11189136/fire-oninput-event-with-jquery 
* Vt ka http://stackoverflow.com/questions/9906885/detect-backspace-and-del-on-input-event 

## Mitmesugust
* Arvesta ka Mac-i `metakey`-ga: http://stackoverflow.com/questions/2903991/how-to-detect-ctrlv-ctrlc-using-javascript
* `break` lause ei tööta Javascript `forEach`-ga.
* Tärgi asetamine stringi - vt http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index

## Ctrl+V (Paste) käsitlemine
* Praegu ei tööta
* Vt https://www.w3.org/TR/clipboard-apis/
* Vt `onpaste` sündmus https://www.w3schools.com/jsref/event_onpaste.asp
* Kasutatud on: http://stackoverflow.com/questions/6902455/how-do-i-capture-the-input-value-on-a-paste-event

## Caret (kursori) paigutamine contenteditable div elemendis
* `Range` - The Range interface represents a fragment of a document that can contain nodes and parts of text nodes. Vt https://developer.mozilla.org/en-US/docs/Web/API/Range
* Vt: http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
* `document.createRange()` vt: https://developer.mozilla.org/en-US/docs/Web/API/Document/createRange
* `Range` objekt vt: https://developer.mozilla.org/en-US/docs/Web/API/Range
* `Selection` objekt vt: https://developer.mozilla.org/en-US/docs/Web/API/Selection
* Caret paigutamine tühja teksti - kasuta 0-pikkusega tühikut, vt: http://stackoverflow.com/questions/4063144/setting-the-caret-position-to-an-empty-node-inside-a-contenteditable-element
