function pikimYhineTahejada(s1, s2, yhised1, yhised2) {
  /*
    Sisendiks on kaks kanoonilisel kujul samateksti.
    Leiab ja tagastab objektina: {
      pikimyhinetahejada: <kanooniliste kujude põhjal>
      yhised1: <tõeväärtuste massiiv, mis kirjeldab millised s1
        tähed kuuluvad ühisjadasse>
      yhised2: <sama s2 jaoks>
    }
    Aluseks: Alexis Lagante
    https://gist.github.com/alexishacks/725df6db4432cd29cd43 
  */
  var result = [];
  for (var i = 0; i <= s1.length; i++) {
    result.push([]);
    for (var j = 0; j <= s2.length; j++) {
      var currValue = 0;
      if (i == 0 || j == 0) {
        currValue = 0;
      } else if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
        currValue = result[i - 1][j - 1] + 1;
      } else {
        currValue = Math.max(result[i][j - 1], result[i - 1][j]);
      }
      result[i].push(currValue);
    }
  }

  var i = s1.length;
  var j = s2.length;

  var yhised1 = [];
  var yhised2 = [];

  var s3 = '';
  while (result[i][j] > 0) {
    if (s1.charAt(i - 1) == s2.charAt(j - 1) &&
      (result[i - 1][j - 1] + 1 == result[i][j])) {
      s3 = s1.charAt(i - 1) + s3;
      i = i - 1;
      j = j - 1;
      yhised1.push(true);
      yhised2.push(true);
    } else if (result[i - 1][j] > result[i][j - 1]) {
      i = i - 1;
      yhised1.push(false);
    }
    else {
      j = j - 1;
      yhised2.push(false);
    }
  }

  return {
    pikimyhinetahejada: s3,
    yhised1: yhised1,
    yhised2: yhised2
  };
}

