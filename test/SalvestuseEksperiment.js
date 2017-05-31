function SalvestuseEksperiment() {
  /* Salvesta Google töölehele
     Alternatiiv fetch API kasutamisega
  */
  var url = 'https://script.google.com/macros/s/AKfycbzjP4j2ZDOl4MQmcZxqDSimA59pg9yGNkpt2mQKRxUfN3GzuaU/exec';

  /* var fetchPromise1 = fetch(url,
    { method: 'GET' });

  fetchPromise1
    .then( response => {
        console.log(response.status);
        if(response.status == 200) return response.json();
        else throw new Error('GET päring ebaõnnestus');
    })
    .then( response => {
        console.log(response);
        // ...
    })
    .catch(function(error) {
        console.log(error);
    }); */

  /* Objekti teisendamiseks JSON-kujule kasutada JSON.stringify-d, mitte toString()-i */
  var keha = JSON.stringify({ Tekst: 'TEST', Draft: false });
  console.log(keha);
  var fetchPromise2 = fetch(url,
    { method: 'POST',
      headers: {
        // 'Accept': 'application/json, text/plain, */*',
        // 'Content-Type': 'application/json'
      },
      body: keha });

  fetchPromise2
    .then( response => {
        console.log(response.status);
        if(response.status == 200) {
          /* .json on objekti Body meetod. Response objekt implementeerib seda. Tagastab lubaduse, mis täitub siis, kui keha - kui striim - on lõpuni loetud. */ 
          return response.json(); 
        }
        else throw new Error('POST päring ebaõnnestus');
    })
    .then( response => {
        /* Keha lugemise lubaduse töötlemine */
        console.log(JSON.stringify(response));
    })
    .catch(function(error) {
        console.log(error.toString());
    });


}
