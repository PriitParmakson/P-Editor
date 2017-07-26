'use strict';

/*
  Programmi eesmärgiks on läbi testida Google Sign-In ID token-i valideerimine.

  Google Sign-In on OpenID Connect-i sertifitseeritud teostus.

  Kasutame Google ametlikult toetatud tarkvara Google APIs Node.js Client
  https://github.com/google/google-auth-library-nodejs
  
  Google APIs Node.js Client
  https://github.com/google/google-api-nodejs-client 

  Loodud on Google API projekt "Samatekst", vt
  https://console.developers.google.com/apis/credentials?project=project-id-1972906309436068154
  mille all on antud CLIENT-ID-d kahele rakendusele:
  'Samatekstiredaktor' ja 'Apps Script'

*/
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var CLIENT_ID = '554561859935-1ojca8mj94fa41mebnjnhqvt83t4gdfj.apps.googleusercontent.com';
var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1MTA3MjBjZDUyNDJiMzI4MTdiZDhjMjFkNTM3Mzg4ZWE5MGE1Y2UifQ.eyJhenAiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1ODEyOTQ4NDQwMTc2MTY3MzEiLCJoZCI6InRsdS5lZSIsImVtYWlsIjoicHJpaXRwQHRsdS5lZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRVA0WTZyLU5kSUhacmhyaUNYWjZCUSIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MDA1NTI0OTAsImV4cCI6MTUwMDU1NjA5MCwibmFtZSI6IlByaWl0IFBhcm1ha3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLXV4ekJWRnlQc3hNL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FJNnlHWHhNRUU4Q3VkOGV3bUVlNU5ZYjZHZkQtS0VrM0Evczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlByaWl0IiwiZmFtaWx5X25hbWUiOiJQYXJtYWtzb24ifQ.fVZS-qyf-307Y5RstQ3_2c8koERY36-6-fc4vG_GiyFsArDhXPrKoCfmEoU3mtqz1jkKMywrqHPQ_kJvEIJcORSOaDmIQkDDbSW-JbEyVFjibgYo04q0j7nA9m9SYxoYnGCZVDa3VoXIhgJzC2SLPqVBa6cnTwDZNofI3DsHQLvzGPUr0dykNW9-pT2kFQKXnANblNAnRRz3dIdl2Aqr6N7L_rO0h0N9-4JHdzAztrVvIpWEc-Pq_EyOThpqRkKHvO8QItJ7VRm9WeENO9tBDRKjDH9pkKtCbRIWL-L3Wt_LUOHxDyd3AqnuHswD46zctSiKEcEEGRJzQo1BYDmpMg';
var client = new auth.OAuth2(CLIENT_ID, '', '');
client.verifyIdToken(
    token,
    CLIENT_ID,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });