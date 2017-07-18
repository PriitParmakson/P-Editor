Näppimisest, konfimisest ja tööriistade isetegemisest.

Koodi kirjutamisel tekib varem või hiljem vajadus funktsioonide (komponentide, meetodite, „tükkide“) kirjeldused kokku koguda ja teha neist kataloog (API dokumentatsioon või lihtsalt Javadoc). See võib olla isegi lepingulise koodidokumenteerimise nõudena MFN-i (mittefunktsionaalsetesse nõuetesse) sisse kirjutatud.

Javascripti maailmas on Javadoc-i analoogiks JSDoc. „JSDoc is the de facto standard for documenting JavaScript code“, kirjutab autoriteetne Javascripti autoriteet (http://2ality.com/2011/08/jsdoc-intro.html).

Oma hobiprojektis tekkis samuti tunne, et vaja oleks funktsioonide (neid on u 70) kataloogi. JSDoc-i uurides (http://usejsdoc.org/) aga otsustasin, et kirjutan dokumentatsioonigeneraatori ise. Siin see on:

https://priitparmakson.github.io/Samatekst/Funktsioonikataloog.html 

(funktsiooninimele klõpsates avaneb funktsiooni tekstist ekstraheeritud päisekommentaar)

Kulus üks päev. Mida võitsin?
- JSDoc-is on miljon suvandit – ma ei pea neid tundma õppima
- JSDoc nõuab npm-i, viimane omakorda Node.js-i jne – ma ei pea nende paigaldamisega tegelema
- JSDoc-is on ulatuslik taagide süsteem, mis moodustab sisuliselt omaette keelekihi – ma ei pea seda tundma õppima [Klassikalises artiklis P Landin (1966) The next 700 programming languages http://www.thecorememory.com/Next_700.pdf kirjutati, et juba siis jõudis iga raamistiku või tööriista arendaja välja uue (sageli universaalkeelest nõrgema) keeleni.]
- JSDoc-i tuleb jooksutada oma masinas, genereeritud dokumentatsioon üles panna – ma ei pea sellega tegelema, sest omatehtud vahend töötab dünaamiliselt veebisirvijas, võttes analüüsitava koodi GitHubi avalikust koodirepost
- ma ei pea tegelema JSDoc-i versiooniuuendustega
- ma ei pea tegelema JSDoc-i bugide ja kriiksudega
- ma saan aru, mida minu tööriist teeb
- ma ei pea JSDoc-i paigaldama
- ma ei pea JSDoc-i konfigureerima
- ma ei pea tegelema JSDoc-i ökosüsteemi jälgimisega (JSDoc-i formaati toetavat muidki tööriistu)
jne

Mida kaotasin?
- kõvasti pusimist oli asünkroonsete päringute koordineerimisega (Javascripti lubadused, keerukus sellest, et Javascriptis HTTP päringuid tegeva fetch()-ga loetaks fail alles puhvrisse, sealt tuleb see veelkord välja lugeda – ja see on ka asünkroonne operatsioon. [Asünkroonsete päringute teema ei ole Javascriptis paiga loksunud ja teema on tõeliselt keeruline.] 
- kõvasti pusimist Regex-ga – aga Regex on sõnetöötluses A ja O – iga programmeerija peaks seda tundma.

Kokkuvõttes aga, kuna tegu on programmeerija töövahendiga, siis asünkroonseid päringuid ja Regex-it on vaja niikuinii ja need – vastupidiselt JSDoc-le on laialt kasutatavad oskused.

Samuti õppisin seda, et iga asi maksab. JSDoc-i võin võtta, seda näppida, midagi saavutada, siis tüdineda. JSDoc on tasuta – tundub, et kulu nagu ei ole. Kas ikka on? 
Omatehtud tööriista hoian ehk hoolikamalt. Võin seda edasi arendada – lähtudes oma vajadustest. Või kui ei soovi või vajadus pole enam nii pakiline (paljud vajadused ongi illusoorsed, nn feel-good või edevusest aetud vajadused – „You have written JavaScript code that is to be used by others and need a nice-looking HTML documentation of its API.“ http://2ality.com/2011/08/jsdoc-intro.html - kas „nice documentation“ on üldse nii üliväga oluline?), siis võin ka mitte.

Jah, tegelesin programmeerimisega, samas, kui „turul on saadaval häid vabavaralisi valmislahendusi“. Mida küll on vaja tundma õppima, kohandada, paigaldada, seadistada, liidestada, hooldada, uuendada. Kõik see tundub nagu lihtne. Kui aga analüüsime, mida need valmislahendused kaasa toovad, siis ei ole asi enam alati nii ühene.
