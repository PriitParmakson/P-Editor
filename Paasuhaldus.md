---
title: Pääsuhaldus
permalink: Paasuhaldus
---

- JWT standardsed parameetrid ja algoritmid vt: [https://www.iana.org/assignments/jose/jose.xhtml](https://www.iana.org/assignments/jose/jose.xhtml)
  - `kty` - key type, ``n` - modulus, `e` - exponent

Google Sign-In kliendi poolt saadetud autentimispäring:

`https://accounts.google.com/o/oauth2/iframerpc?action=issueToken&response_type=token id_token&scope=openid profile email&client_id=554561859935-1ojca8mj94fa41mebnjnhqvt83t4gdfj.apps.googleusercontent.com&login_hint=AJDLj6LTa5O4KBlL2EMOaQJWhP8K5LB9zHNZXIctOUFFi8jDl6dLVtAZC248rhZCEAoNasRBn7UPtgeulPyrQ5hyLyyB2nxqiEOOkn3QSmYPv8XMFXUn_30&ss_domain=https://priitparmakson.github.io&origin=https://priitparmakson.github.io`

vastus:

```JSON	
{
 "token_type": "Bearer"
 "access_token:	"ya29.GluNBPXTQAfMuz0Ntq520Kz3…KLNkzn3i4swPrl2rOiH-kyMU2gXJ"
 "scope":	"https://www.googleapis.com/au…plus.me openid email profile"
 "login_hint:	"AJDLj6LTa5O4KBlL2EMOaQJWhP8K5…B2nxqiEOOkn3QSmYPv8XMFXUn_30"
 "expires_in": "3600"
 "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6I…wD46zctSiKEcEEGRJzQo1BYDmpMg"
} 
```

Identiteeditoken (id_token):

```
eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1MTA3MjBjZDUyNDJiMzI4MTdiZDhjMjFkNTM3Mzg4ZWE5MGE1Y2UifQ.eyJhenAiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTQ1NjE4NTk5MzUtMW9qY2E4bWo5NGZhNDFtZWJuam5ocXZ0ODN0NGdkZmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1ODEyOTQ4NDQwMTc2MTY3MzEiLCJoZCI6InRsdS5lZSIsImVtYWlsIjoicHJpaXRwQHRsdS5lZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRVA0WTZyLU5kSUhacmhyaUNYWjZCUSIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MDA1NTI0OTAsImV4cCI6MTUwMDU1NjA5MCwibmFtZSI6IlByaWl0IFBhcm1ha3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLXV4ekJWRnlQc3hNL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FJNnlHWHhNRUU4Q3VkOGV3bUVlNU5ZYjZHZkQtS0VrM0Evczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlByaWl0IiwiZmFtaWx5X25hbWUiOiJQYXJtYWtzb24ifQ.fVZS-qyf-307Y5RstQ3_2c8koERY36-6-fc4vG_GiyFsArDhXPrKoCfmEoU3mtqz1jkKMywrqHPQ_kJvEIJcORSOaDmIQkDDbSW-JbEyVFjibgYo04q0j7nA9m9SYxoYnGCZVDa3VoXIhgJzC2SLPqVBa6cnTwDZNofI3DsHQLvzGPUr0dykNW9-pT2kFQKXnANblNAnRRz3dIdl2Aqr6N7L_rO0h0N9-4JHdzAztrVvIpWEc-Pq_EyOThpqRkKHvO8QItJ7VRm9WeENO9tBDRKjDH9pkKtCbRIWL-L3Wt_LUOHxDyd3AqnuHswD46zctSiKEcEEGRJzQo1BYDmpMg
```

Kasuta mõnda JWT parserit, nt [http://kjur.github.io/jsjws/mobile/tool_jwt.html#parser](http://kjur.github.io/jsjws/mobile/tool_jwt.html#parser).

Header

```json
{
 "typ": "JWT",
 "alg": "RS256",
 "kid": "2510720cd5242b32817bd8c21d537388ea90a5ce"
}
```

Payload

```json
{
 "azp": "554561859935-1ojca8mj94fa41mebnjnhqvt83t4gdfj.apps.googleusercontent.com",
 "aud": "554561859935-1ojca8mj94fa41mebnjnhqvt83t4gdfj.apps.googleusercontent.com",
 "sub": "111581294844017616731",
 "hd": "tlu.ee",
 "email": "priitp@tlu.ee",
 "email_verified": true,
 "at_hash": "EP4Y6r-NdIHZrhriCXZ6BQ",
 "iss": "accounts.google.com",
 "iat": 1500552490,
 "exp": 1500556090,
 "name": "Priit Parmakson",
 "picture": "https://lh6.googleusercontent.com/-uxzBVFyPsxM/AAAAAAAAAAI/AAAAAAAAAAA/AI6yGXxMEE8Cud8ewmEe5NYb6GfD-KEk3A/s96-c/photo.jpg",
 "given_name": "Priit",
 "family_name": "Parmakson"
}
```

Googlev API avalikud võtmed

- [JSON Web Key](https://tools.ietf.org/html/rfc7517) (JWK) vormingus: [https://www.googleapis.com/oauth2/v3/certs](https://www.googleapis.com/oauth2/v3/certs).
- PEM vormingus: [https://www.googleapis.com/oauth2/v1/certs](https://www.googleapis.com/oauth2/v1/certs) 

