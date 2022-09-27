const inputEmail = document.getElementById('inputEmail');
const labelEmail = document.querySelector("#labelEmail");

const inputPassword = document.getElementById('inputPassword');
const labelPassword = document.querySelector("#labelPassword");

const errorMsg = document.querySelector("#errorMsg");

const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const urlLogin = 'http://localhost:8080/login';

//const bcrypt = require("bcrypt");

function entrar(ev) {

   //let email = inputEmail.value.toLowerCase();
   //inputEmail.value = email;
   let pass = inputPassword.value
   //const hashedPassword = bcrypt.hashSync(pass, bcrypt.genSaltSync());

   // iniciou o processo de registro
   //if (regexMail.test(email)) {
   if (true) {
      const data = {
         //email: email,
         //email: inputEmail.value,
         //password: pass,
         email: "admin",
         password: "admin"

      };

      const settings = {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify(data),
      };

      fetch(urlLogin, settings)
         .then(response => {
            if (response.status === 200) {
               //return response.json()
               return response
            }
            throw response;
         })
         .then(info => {
            //localStorage.setItem('login', JSON.stringify({ email: email, jwt: info.jwt }));
            console.log("CHeguei" + info.jwt)
            localStorage.setItem('login', info.jwt);
            // ocultarSpinner();
            mostrarSpinner();
            //location.href = 'agendamentos.html';
         })
         .catch(err => {
            ocultarSpinner();
            errorLogin()
         });
   } else {
      ocultarSpinner();
      errorLogin()
   }
}

function errorLogin() {
   inputEmail.setAttribute('style', 'border-color:red')
   labelEmail.setAttribute('style', 'color:red')

   inputPassword.setAttribute('style', 'border-color:red')
   labelPassword.setAttribute('style', 'color:red')

   errorMsg.setAttribute('style', 'display: block')
   errorMsg.innerHTML = `Email ou Senha incorretos!`

   inputEmail.focus()
}