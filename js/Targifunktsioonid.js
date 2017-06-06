// Tärgi või klahvi kindlakstegemise abifunktsioonid
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
function taht(charCode) {
  return ladinaTaht(charCode) || tapiTaht(charCode) || veneTaht()
}
function kirjavm(char) {
  // Kontrollib, kas tärk on kirjavahemärk.
  // Kirjavahemärgiks loetakse ka reavahetusmärki (⏎).
  return (kirjavmKood(char.charCodeAt(0)) || char == '⏎')
}
function kirjavmKood(charCode) {
  // Kontrollib, kas charCode esitab lubatud 
  // kirjavahemärki
  // reavahetus 13, tühik 32  , 44  . 46  - 45  ! 33  ? 63
  // ( 40  ) 41  : 58  ; 59  " 34
  var p = [13, 32, 46, 44, 45, 33, 63, 40, 41, 58, 59, 34];
  var r = p.indexOf(charCode);
  return (r >= 0)
}
function keyCodeToHumanReadable(keyCode) {
  var keycodes = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    33: 'page_up',
    34: 'page_down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    91: 'command',
    93: 'right_click',
    106: 'numpad_*',
    107: 'numpad_+',
    109: 'numpad_-',
    110: 'numpad_.',
    111: 'numpad_/',
    144: 'num_lock',
    145: 'scroll_lock',
    182: 'my_computer',
    183: 'my_calculator',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'"
  }
  return (keycodes[keyCode] || '')
}
