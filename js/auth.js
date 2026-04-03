let attempts = localStorage.getItem("attempts") || 0;

const form = document.getElementById("loginForm");

const status = document.getElementById("status");

const btn = document.getElementById("loginBtn");

const attemptsBox = document.getElementById("attempts");

const timeBox = document.getElementById("time");

const fingerprintBox = document.getElementById("fingerprint");

function updateInfo(){

attemptsBox.textContent =
"Failed attempts: " + attempts;

timeBox.textContent =
"Last attempt: " + new Date().toLocaleTimeString();

fingerprintBox.textContent =
"Client fingerprint: " +
btoa(navigator.userAgent).substring(0,16);

}

updateInfo();

form.addEventListener("submit",function(e){

e.preventDefault();

btn.disabled=true;

btn.textContent="Authenticating...";

status.textContent="Establishing secure channel...";

setTimeout(()=>{

status.textContent="Verifying credentials...";

},700);

setTimeout(()=>{

attempts++;

localStorage.setItem("attempts",attempts);

updateInfo();

btn.disabled=false;

btn.textContent="Authenticate";

if(attempts < 3){

status.textContent=
"Authentication failure: invalid credentials";

}

else if(attempts < 5){

status.textContent=
"Warning: multiple failed attempts detected";

}

else{

status.textContent=
"Security lockout triggered (temporary)";

btn.disabled=true;

setTimeout(()=>{

btn.disabled=false;

status.textContent=
"Security cooldown expired";

},20000);

}

},1600);

});