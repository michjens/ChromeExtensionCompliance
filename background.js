// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var sessionID;
var searchQuery;

var data_login = {"username": '', "password": '', rememberMe: true, languageCode: "da-DK"}
var responseJSON;
var searchResponse;
var statusText;
var data_search;
var request_refresh;
var urlBase;
var cookieExists;

init();


function init(){
  const url = chrome.runtime.getURL('data/config.json');
  fetch(url)
    .then((response) => response.json())
    .then((json) => urlBase = json.urlBase)
    .then((urlBase) => sendRequest(urlBase+"/AuthenticationService/user/ensurecurrent", ""))
    .then(() => checkCookie(urlBase));
}

function getQueryVariable(url, variable)
{
    var query = url.split("?")[1];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

chrome.runtime.onInstalled.addListener(function() {
  console.log("Installed")
  });


chrome.webRequest.onCompleted.addListener(
  function(request){
    console.log(cookieExists)
    if(cookieExists == true){
      searchQuery = getQueryVariable(request.url, "q")
      data_search = {"sortCriteria":1,"queryText":`${searchQuery}`,"pageSize":3,"page":0,"lastSort":null,"startIndex":0}
      console.log(searchQuery)
      console.log(sessionID);
      verifySearchAndInject(sessionID);
    }
  },
  {urls: ["https://*.google.com/search*"]}
);

function verifySearchAndInject(sessionID){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", urlBase+`/procurementService/${sessionID}/search/search`, true);
  console.log(data_search);
  xhr.setRequestHeader("Content-Type", "application/json");
  window.addEventListener('load', function(){
  })
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200){
      if(this.response.includes("products")){
        console.log(JSON.parse(this.response))
        injectHTML(this.response);
    }
    }
    else if(xhr.status === 401){
      console.log('401')
      init();
    }else{
      console.log("waiting for searchQuery");
    }
  };
  
  data_search = JSON.stringify(data_search);
  xhr.send(data_search);

}

function checkCookie(urlBase){
  chrome.cookies.get({ url: urlBase, name: 'tricom-gs' }, function (cookie) {
     if (cookie) {
       cookieExists = true;
       console.log('cookie exists');  
     }
     else {
       cookieExists = false;
       console.log('no cookie')
      }
    });

}

function sendRequest(url, data){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  window.addEventListener('load', function(){
  })
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200){
      console.log(xhr.readyState);
      console.log(xhr.status);
      console.log(url);
      responseJSON = JSON.parse(this.response);
      sessionID = responseJSON['sessionId'];
      console.log(sessionID);
      
    }  
  };
  data = JSON.stringify(data);
  xhr.send(data);
}

function injectHTML(response){
  var jsonResponse = JSON.parse(response);
  var text = "";
  var productID = "";
    for(var i=0; i <= jsonResponse.products.length-1; i++){
      console.log(urlBase + `/shell/#/s/${sessionID}/tigerprocurement/search?sortCriteria=1&queryText=${searchQuery}`);
      productID = jsonResponse.products[i].id;
      console.log(productID);
      text = text + `<a href=${urlBase}/shell/#/s/${sessionID}/tigerprocurement/product/${jsonResponse.products[i].id} title='${jsonResponse.products[i].name}'>`
      text = text + `<img style='float:left;width:100px' id='img${i}' src=${jsonResponse.products[i].image}></a>`
      text = text + `Unit: ${jsonResponse.products[i].items[0].price.unitName} </br>`
      text = text + `Price excl: ${jsonResponse.products[i].items[0].price.amountExclTax},-</br>`
      text = text + `Price incl: ${jsonResponse.products[i].items[0].price.amountInclTax},-</br></br></a>`    
}
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'console.log("Created"); var div = document.createElement("div");div.style.width = "125px";div.style.height = "100px";div.style.right = "30px";div.style.top = "200px";div.style.position = "absolute"; div.innerHTML = "' + text + '";document.body.appendChild(div);'});
          
          
    });
}

