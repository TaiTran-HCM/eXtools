// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');
const PATH = {
  LOGIN : "authentication/login.html",
  REGISTER : "authentication/register.html"
};

const pathname = window.location.pathname;
const re = /.+\/html\/(.+)/g;
const currentPath = re.exec(pathname)[1];
console.log(currentPath);

window.addEventListener('DOMContentLoaded', () => {
  handlePage();
});

function handlePage() {

  if (currentPath === PATH.LOGIN) {
      loginPage();
  };
};

function loginPage() {
  console.log("Loading script for login page");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');
  const password = urlParams.get('password');
  const form = document.getElementById("form-login");

  function addLoading() {
    form.classList.add("loading");
    document.getElementById('direct-sign-up').setAttribute("hidden", "true");
  };

  function removeLoading() {
    form.classList.remove("loading");
    document.getElementById('direct-sign-up').removeAttribute("hidden");
  };

  if (email !== null && password !== null) {
    body = {
      "user_name": email,
      "password": password
    };
    addLoading();
    ipcRenderer.invoke('getUserProfile', body);
    ipcRenderer.on('getUserProfile', (event, res) => {
      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        ipcRenderer.invoke('reDirect', "html/main_app.html");
      }
      removeLoading();
    })
  }
}

// function button() {
//   const button_mail = document.getElementById("button-mail")
//   const button_mail_google = document.getElementById("button-mail-google")
//   const button_clicked = document.getElementById("button-clicked")
//   const generation_temp_mail = document.getElementById("generation-temp-mail")
//   const to_sign_up = document.getElementById("direct-sign-up")
  
//   if (button_mail) {
//     button_mail.addEventListener('click', () => {
//       button_clicked.innerText = "Button Mail"
//       ipcRenderer.invoke('direct temp mail')
//     })
//   }

//   if (button_mail_google) {
//     button_mail_google.addEventListener('click', () => {
//       button_clicked.innerText = "Button Mail Google"
//       ipcRenderer.invoke('direct temp mail google')
//     })
//   }

//   if (generation_temp_mail) {
//     generation_temp_mail.addEventListener('click', () => {
//       ipcRenderer.invoke('send api create temp mail', "1").then((result) => {
//         console.log(result)
//       })
//     })
//   }

//   if (to_sign_up) {
//     to_sign_up.addEventListener('click', () => {
//       ipcRenderer.invoke('direct to sign up')
//     })
//   }
// }