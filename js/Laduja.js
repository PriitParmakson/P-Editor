function veneTaht(charCode) {
  /* Kontrollib, kas charCode on vahemikus
   1024-1279
  */
  return (charCode >= 1024 && charCode <= 1279)
}

function koostaSagedusmapp(t) {
  // Valmista t tähtede sagedusmäpp
  let tMap = new Map([]);
  for (let c of t) {
    if (veneTaht(c.charCodeAt(0))) {
      if (tMap.has(c)) {
        tMap.set(c, tMap.get(c) + 1);
      } else {
        tMap.set(c, 1);
      }
    }
  }
  return tMap;
}

function kuvaSagedusmapp(m) {
  var s = '';
  for (let [k, v] of m) {
    s = s + k + ':' + v + ' ';
  }
  console.log(s);
}

function sagedusmappKompakt(m) {
  var s = '';
  for (let [k, v] of m) {
    for (var i = 0; i < v; i++) {
      s = s + k;
    }
  }
  return s;
}

function kuvaLahend(sm) {
  var s = '';
  for (let e of sm) {
    s = s + sd[e] + ' ';
  }
  console.log(s);
}

function proovi(valitud, i, m) {
  var j = i + 1;

  // Kontrolli, kas on jõutud sõnade lõpuni
  if (j === sd.length) {
    if (debug) {
      console.log('sõnade lõpp');
    }
    return
  }

  // Kuva seis (silumiseks)
  var s = '';
  // Kuva valitud sõnad
  for (let e of valitud) {
    s = s + sd[e] + ' ';
  }
  // Kuva kasutada olevad sõnad ja käesolev sõna
  s = s + '< ' + sagedusmappKompakt(m) + ' > ' + sd[j] + '? ';

  // Kontrolli, kas sõna j mahub
  var mahub = true;
  // Arvuta ühtlasi uus kasutada olevate tähtede sagedusmäpp
  var mLahutatud =  new Map(m); // Mäpi kopeerimise võte
  for (let [k, v] of sm[j]) {
    let ve = mLahutatud.get(k);
    if (ve >= v) {
      mLahutatud.set(k, ve - v);
    }
    else {
      mahub = false;
      break;
    }
  }
  if (mahub) {
    if (debug) {
      console.log(s + ' mahub');
    }
    // Kas on veel kasutamata tähti?
    var tyhi = true;
    for (let [k, v] of mLahutatud) {
      if (v !== 0) {
        tyhi = false;
      }
    }
    var valitudUus = valitud.slice(); // Massiivi kopeerimise võte
    valitudUus.push(j);
    // Kui tühi, siis üks lahend on leitud
    if (tyhi) {
      kuvaLahend(valitudUus);
    }
    else {
      // Proovi edasi, sõna kaasates
      proovi(valitudUus, j, mLahutatud);
    }
    // Sõna mahub, kuid proovi ka järgmisi sõnu
    proovi(valitud, j, m);
  }
  else {
    if (debug) {
      console.log(s + ' ei mahu');
    }
    // Sõna ei mahu, kuid proovi järgmiste sõnadega
    proovi(valitud, j, m);
  }
}

t = 'УСКОРЕННЫЙ КУРС РУССКОГО';
var m = koostaSagedusmapp(t);
kuvaSagedusmapp(m);

sd = [
  "СОСНОГОРСК", "КОНСЕНСУС", "РОСКОСНЫЙ", "КРЫСЕНОК", "КУРНОСЫЙ", "НЕУГОРНО", "ГОНОКОКК", "НЕКОСНЫЙ", "КОНГРЕСС", "СКУСНЫЙ", "КУРЕНОК", "РУССКОЕ", "РЫСЕНОК", "КЕССОНЫ", "НОСОРОГ", "КЕНГУРУ", "КОСОГОР", "КОРЕЙКО", "УГРОРУС", "ГОРСКОЕ", "ГЕККОНЫ", "ГУРЕНКО", "УГРЕНОК", "РЕСУРСЫ", "СЕНОКОС", "КОНКУРС", "УГОРНЫЙ", "РЫСОГОН", "ГУСЕНОК", "УГОННЫЙ", "КОРОНЕР", "КСЕРОКС", "УРЕНГОЙ", "КОНОГОН", "ЙОНКЕРС", "ГРУСНОЙ", "КОРНЕЙ", "СНОСОК", "ОРЕГОН", "РЕСУРС", "ГОРНЫЙ", "СЕННОЙ", "СНУКЕР", "КУРСОР", "КСЕРКС", "КЕССОН", "КСЕНОН", "ГУРОНЫ", "КУСКУС", "СОСКОК", "ОГОНЕК", "СЕНСОР", "КУНГУР", "УЙГУРЫ", "ОКУРОК", "ЙОНСОН", "УСЫНОК", "СНУРОК", "СКОРЫЙ", "ОКОРОК", "РОКОКО", "СОННОЕ", "КРОКУС", "УОРНЕР", "УОРРЕН", "КРОНОС", "НЕЙРОН", "ГУСЕЙН",  "НЕГРЫ",  "СОРОК",  "НОРОК",  "НОСОК",  "ГУННЫ",  "ГУРОН",  "ГЕРОН",  "КРОНЫ", "НЫРОК", "РЫНОК",  "ГЕРОЙ",  "СЫРОЙ",  "НОГОЙ", "ГОНОР",  "КУРСК",  "СОСНЫ",  "СЕРЫЙ",  "КОНУС", "СУКНО",  "КОНЕК",  "КОКОС", "ЕННЫЙ",  "РОКЕР",  "СУГОЙ",  "КУСОК",  "КОСОЙ",  "НЕРОН",  "УКСУС",  "СУРОК",  "КРОСС",  "СЫРОК", "ГУРЕЙ",  "УЙГУР",  "ГРОЙС",  "УСЕЙН", "ГОНОК",  "КОНГО", "ГОЙКО",  "СЫНОК",  "ОКРУГ",  "ОНОРЕ", "ГОРЕ", "ЕГОР",  "КОКС", "СКОК",  "КУКУ",  "СНОС",  "РУНЫ",  "СЫРО",  "ГРОК",  "ОКЕЙ", "ГЕРР",  "ГЕНЫ",  "СНЕГ",  "НЕГР",  "КРЕН",  "УКОР", "УРОК", "УКУС", "СГОН",  "УГРЫ", "ГУРУ",  "РУНО", "УРОН",  "ОКНО",  "НЕОН",  "КОНЫ", "СССР", "ЙОКО",  "КРОЙ",  "НЫНЕ",  "ОРСК",  "СРОК",  "КУРС",  "КРЫС",  "КРУГ",  "СОУС",  "КЕКС",  "КОНГ",  "СЫСК",  "ГОРЫ",  "ГУРО", "УГОР",  "ЕЙСК",  "СЕКС",  "РЕЙС",  "ГНОЙ",  "КУРЫ",  "РЕК",  "ГОН", "НГО", "НОГ",  "КУР", "РУК",  "КНР", "ГРУ",  "РОЙ", "ГУС",  "УСЫ", "СЫР",  "ОСЫ",  "ОГО",  "ЕГО",  "ГЕЙ",  "СНЫ", "СЫН", "КУЙ",  "СОК",  "РОК", "ОКО",  "ЙОН",  "ГОЙ", "ЙОГ",  "СЕЙ",  "ЙЕН",  "ООН",  "НОС",  "СОН",  "РОГ",  "НО", "ОН",  "НУ",  "СЕ",  "НЕ", "ЕЙ", "ОЙ"];

// koosta sõnade sagedusmäpid
sm = [];
for (let s of sd) {
  sm.push(koostaSagedusmapp(s));
}

var debug = false;

proovi([], -1, m);
