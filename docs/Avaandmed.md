
Iga rahva suurim vara on tema keel. Keele sees: keeletunnetus, keele „meel“, grammatika, sõnavara. 
Sõnavaras võime eristada kolme suur osa: nn üldised sõnad, kohanimed ja isikunimed.

Keeleandmeid kasutatakse mitmeti. Ka avaandmetena.

Avaandmed minu kui andmekasutaja seisukohast on andmed, mida:
- saab interneti kaudu oma arvutisse alla laadida
- kellegi käest luba küsimata
- kellelegi andmete kasutamise kohta aru andmata
- kellelegi taotlust esitamata, „andmete omanikuga ühendust võtmata“
- kasutades standardset REST protokolli
- kasutades lihtsat ja standardset JSON andmevormingut
- ühekorraga ja täies ulatuses.

Kuidas on lood eesti keele avaandmetega? Kas ja kuidas eesti sõnad, kohanimed ja isikunimed on avaandmetena kättesaadavad?

Sõnad. Autoriteetseim eesti keele elektrooniline sõnakogu on Eesti Keele Instituudi (EKI) peetav õigekeelsussõnaraamat [1]. Kahjuks on ÕS-i masinloetavale kasutamisele seatud tõkked. Andes päringu, näiteks k*, saame vastuse Leitud 8198 artiklit, väljastan 100. Korraga esitatakse kuni 100 sõna. Sõnastiku allalaadimise võimalust aga üldse ei pakuta.

Kohanimesid pakutakse kahes kohas. EKI kohanimeandmebaas [2] sisaldab 45602 eesti kohanime. Korraga väljastatakse kuni 750 nime. Maa-ameti peetav kohanimeregister [3] on infotehnoloogiliselt võimekam. Päringu tulemused on CSV vormingus ja täies ulatuses allalaaditavad.

Isikunimed. Rahvastikuregister pakub teabevärava eesti.ee kaudu nimede statistika päringut. Kahjuks piirdub see ühe ees- või ees- ja perekonnanime peale vastavate nimede arvu andmisega. Kindlasti on kusagil ka erinevaid nimestatistilisi väljavõtteid. Terviklikku eesti isikunimede andmebaasi avalikult kättesaadavana ei leia.

Kuidas siis minusugusele harrastusfiloloogile kättesaadavat sõnakogu – mis hõlmaks ka kohanimesid – moodustada? Üritasin ÕS-i veebilehelt andmeid kraapimisprogrammiga kätte saada. See nõuab küllaltki spetsiifilisi oskusi. Esiteks ei saa andmekorjet teha tavalises veebisirvijas Javascripti jooksutades, sest ÕS-i veebilehel ei ole teise domeeni päringu tugi (cross-origin resource sharing, CORS, [5]) sisse lülitatud. Ilma selleta aga korjepäringuid ei teenindata. Sellest saab mööda, kui päring saata serverisse paigaldatud programmist. Rentisin pilves virtuaalse Node.js serveri [6]  ja lasin sealt käima programmi, mis erinevaid tähekombinatsioone genereerides hakkas ÕS-i veebilehele saatma päringuid, vastuseks saadud HTML-tekstist eraldas sõnad ja kogus need andmebaasi. ÕS-i veebisait on seadistatud nii, et samalt võrguaadressilt tihedalt saabuvaid päringuid tõlgendab ründena. Automaatse pidurdusalgoritmiga lüükase ründaja ees uks kinni. Sellest saab üle kui päringuid saata veidi pikema intervalliga. Päringuseeria täitmine võttis aega kümme minutit. Saadud HTML-st tuleb sõnad välja eristada. See ei ole kerge, sest HTML on mõeldud inimkasutajale ja andmete struktuuri tuleb kõigepealt uurida. Kui andmete struktuur on enam-vähem selge, siis tuleb Regex-i (andmete filtreerimise mustripõhise keele) [7] abil huvipakkuvad andmed eraldada, koondada ja teisendada edasiseks kasutamiseks sobivale kujule. Suure töö tulemusena õnnestus kokku saada ja JSON-massiiviks teha 46586 sõna.

Kohanimede kättesaamisega olid omad probleemid. Maa-ameti veebilehelt saab andmed küll kergesti ja täies koosseisus kätte – 199 601 nime, kuid minu eesmärgist vaadates on neis palju kordusi. Sama nimi võib olla kasutuses jõe, küla, paiga, bussipeatuse jm tähistamiseks. Duplikaatide väljasõelumine ei ole lihtne. Seda saaks kergesti teha Exceli töölehel andmeid sorteerides ja natuke valemitega mängides. Kuid Excel võimaldab töölehele asetada ainult kuni 64 000 rida. Tükikaupa sortides ja ühitades, Excelit ja Regex-i kombineeritult kasutades sain 74 178 kohanime.

Seega eesti sõnavarast moodustavad kohanimed 60% ja „tavalised“ sõnad 40%.

Kokkuvõttes, kui ideaalist rääkida, siis eesti sõnavara tänapäevasel kujul (praktiliselt piiranguteta REST API-de, JSON-vormingus) avaandmetena kättesaamise võimalust ei ole. Maa-amet jõuab ideaalile siiski päris lähedale. 

[1] http://www.eki.ee/dict/qs/
[2] https://www.eki.ee/knab/knab.htm
[3] http://xgis.maaamet.ee/knravalik/
[4] https://www.eesti.ee/portaal/rrteenus.nimede_stat
[5] https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/ 
[6] Heroku https://www.heroku.com/
[7] https://en.wikipedia.org/wiki/Regular_expression


