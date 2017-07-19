function onSignIn(googleUser) {
  /*
    Google Sign-In
  
    "A GoogleUser object represents one user account."
    Arusaamatu, kuidas googleUser moodustatakse.
    GoogleUser kirjeldus vt: https://developers.google.com/identity/sign-in/web/reference#users 

  */
  kasutajaProfiil = googleUser.getBasicProfile();
  id_token = googleUser.getAuthResponse().id_token;
  kontrolliToken();
  autenditud = true;
  $('#Kasutaja').text(kasutajaProfiil.getGivenName());
  if (t.length > 1) {
    $('#Salvesta1').removeClass('disabled');
  }

  /*  
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  */

  // console.log("ID Token: " + id_token);
};

function kontrolliToken() {
  /*
    ID token-i kontrollimine serveris vt: https://developers.google.com/identity/sign-in/web/backend-auth
  */

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  var payload = parseJwt(id_token);
  console.log(payload);
}
