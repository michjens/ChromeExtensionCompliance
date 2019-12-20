var sessionID;

var searchQuery = 'kaffe'
var data_search = {"sortCriteria":1,"queryText":`${searchQuery}`,"pageSize":5,"page":0,"lastSort":null,"startIndex":0}
var data_login = {"username": '', "password": '', rememberMe: true, languageCode: "da-DK"}



sendRequest('https://tigerstaging.tricommerce.dk/AuthenticationService/user/ensurecurrent', "");

// if(sessionID != "undefined"){
//   //sendRequest(`https://tigerstaging.tricommerce.dk/procurementService/${sessionID}/search/search`, data_search)
// }else{
//   document.write('nothing to see here');
//   document.write(sessionID);
// }
//sendRequest(`https://tigerstaging.tricommerce.dk/procurementService/${sessionID}/search/search`, data_search)





// chrome.cookies.get({ url: 'https://tigerstaging.tricommerce.dk', name: 'tricom-gs' },
//   function (cookie) {
//     if (cookie) {
//       var div=document.createElement("div"); 
//       document.body.appendChild(div); 
//       div.innerText="test123";
      //var data = {"username": '', "password": '', rememberMe: true, languageCode: "da-DK"}
      
//     }
//     else {
//       //cookie doesn't exist yet
//       console.log('cookie does not exist yet');
//       var div=document.createElement("div"); 
//       document.body.appendChild(div); 
//       div.innerText="123test";
//     }
// });

function sendRequest(url, data){

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  window.addEventListener('load', function(){
  })
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200){
      document.write(url);
      responseJSON = JSON.parse(this.response);
      document.write(this.response);

      sessionID = responseJSON['sessionId'];
      changeStuff(this.response);
    }
    else{
      console.log("waiting");
    }
  };
  data = JSON.stringify(data);
  xhr.send(data);


}

function changeStuff(response){
  if(response.includes("products")){
    var jsonResponse = JSON.parse(response);
    var img = document.createElement("img");
    document.body.appendChild(img);
    img.src=jsonResponse.products[0].image
    var img = document.createElement("img");
    document.body.appendChild(img);
    img.src=jsonResponse.products[1].image
    var img = document.createElement("img");
    document.body.appendChild(img);
    img.src=jsonResponse.products[2].image
    var img = document.createElement("img");
    document.body.appendChild(img);
    img.src=jsonResponse.products[3].image
    var img = document.createElement("img");
    document.body.appendChild(img);
    img.src=jsonResponse.products[4].image
    // for(i in jsonResponse.products){
      
    //   document.write(`<br><img src=${jsonResponse.products[i].image} alt=https://cdn0.iconfinder.com/data/icons/file-tools-line/50/error-512.png=><br>`);
    //   document.write(`Price excl: ${jsonResponse.products[i].items[0].price.amountExclTax},-</br>`);
    //   document.write(`Price incl: ${jsonResponse.products[i].items[0].price.amountInclTax},-</br>`);

    // }
    //document.write(jsonResponse.products[0].image + "<br />");
    
    
  }else{
    var div=document.createElement("div"); 
    document.body.appendChild(div); 
    div.innerText="test";
  }

}
