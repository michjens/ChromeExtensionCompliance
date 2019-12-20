var authenticating = document.getElementById('auth');
var loaderCircle = document.getElementById('loaderCircle');
var usernameLabel = document.getElementById('usernameLabel');
var passwordLabel = document.getElementById('passwordLabel');
var inputUsername = document.getElementById('inputUsername');
var inputPassword = document.getElementById('inputPassword');
var loginButton = document.getElementById('loginButton');
var b1 = document.getElementById('b1');
var logInStatus = document.getElementById('logInStatus');
var postLogin = [b1, logInStatus]
var loginPageElements = [usernameLabel, passwordLabel, loginButton, inputPassword, inputUsername];
var authElements = [loaderCircle, authenticating];
var sessionID;
var urlBase;
var input = document.getElementById("inputPassword");
  input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("loginButton").click();
  }
});

changeUI(postLogin, "none");
changeUI(loginPageElements, "none");



function changeUI(elements, action){
  for(i in elements){
    elements[i].style.display = action;
  }
}

init("");

function init(data){
  const url = chrome.runtime.getURL('data/config.json');
  fetch(url)
    .then((response) => response.json())
    .then((json) => urlBase = json.urlBase)
    .then((urlBase) => checkCookie(urlBase));
}

function checkCookie(urlBase){
  chrome.cookies.get({ url: urlBase, name: 'tricom-gs' },
    function (cookie) {
      if (cookie) {
        sendRequest(urlBase + '/AuthenticationService/user/ensurecurrent', "");
        console.log('cookie exists')
      }
      else {
        changeUI(authElements, "none");
        changeUI(loginPageElements, "block")
        console.log('cookie does not exist yet');
      }
  });
}

b1.onclick = function(element){
  changeUI(postLogin, 'none');
  changeUI(loginPageElements, 'block');
  var cookieURL = urlBase.slice(8, urlBase.length);
  chrome.cookies.getAll({domain: cookieURL}, function(cookies) {
    for(var i=0; i<cookies.length;i++) {
        chrome.cookies.remove({url: urlBase + cookies[i].path, name: cookies[i].name});
    }
});  
}

loginButton.onclick = function(element){
  login(element);
}

function login(element){
  var inputUsername = document.getElementById('inputUsername').value;
  var inputPassword = document.getElementById('inputPassword').value;
  changeUI(loginPageElements, "none");
  changeUI(authElements, "block");
  var data = {"username": inputUsername, "password": inputPassword, rememberMe: true, languageCode: "da-DK"}
  sendRequest(urlBase + '/AuthenticationService/0/authentication/authenticate', data)
}

function sendRequest(url, data){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  window.addEventListener('load', function(){
  })
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200){
      responseJSON = JSON.parse(this.response);
      sessionID = responseJSON['sessionId'];
      changeUI(authElements, "none");
      changeUI(postLogin, "block");
    }
    else if(xhr.status === 401){
      changeUI(authElements, "none");
      changeUI(loginPageElements, "block");
    }
    else{
    }
  };
  data = JSON.stringify(data);
  xhr.send(data);
}
