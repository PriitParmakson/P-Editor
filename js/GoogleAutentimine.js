function onSignIn(googleUser) {
  /*
    Google Sign-In
  */
  kasutajaProfiil = googleUser.getBasicProfile();
  id_token = googleUser.getAuthResponse().id_token;
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
