// Equipe 4
// Lucas Rosa
// Guilherme Brasil Tourinho
// Joaderson Felipe Silva Barbosa
// Everton Silverio
// Eduardo Russo

// Utilizar no exercício:
// validação [x] | normalização [x] | location | localStorage

const labelName = document.querySelector("#labelName");
const nome = document.getElementById("nome");
let validName = false;

const labelNickName = document.querySelector("#labelNickName");
const sobrenome = document.getElementById("sobrenome");
let validNickname = false;

const labelCpf = document.querySelector("#labelCpf");
const cpf = document.getElementById("cpf");
let validCpf = false;

const labelPassword = document.querySelector("#labelPassword")
const password = document.getElementById("password");
let validPassword = false;

const labelEmail = document.querySelector("#labelEmail");
const email = document.getElementById("email");
let validEmail = false;

const labelRepassword = document.querySelector("#labelRepassword")
const password2 = document.getElementById("password2");
let validrepassword = false;

const errorMsg = document.querySelector("#errorMsg")
const successMsg = document.querySelector("#successMsg")

const regexCRO = /(^\d{6}\-\d{1}$)/;
const regexCPF = /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/;
const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


// normalização email
// email.value = email.value.toLowerCase();

// validações do formulario
// nome
nome.addEventListener('keyup', () => {
   if (nome.value.length <= 2) {
      labelName.setAttribute("style", "color:red")
      labelName.innerHTML = "Insira ao menos 3 caracters!"
      nome.setAttribute("style", "border-color: red", "color: red")
      nome.focus();
   } else {
      labelName.setAttribute("style", "color:black")
      labelName.innerHTML = "Nome:"
      nome.setAttribute("style", "border-color: green")
      validName = true;
   }
})

// sobrenome
sobrenome.addEventListener('keyup', () => {
      if (sobrenome.value.length <= 2 || sobrenome.value.length > 50) {
         labelNickName.setAttribute("style", "color:red")
         labelNickName.innerHTML = "Insira ao menos 3 caracters!"
         sobrenome.setAttribute("style", "border-color: red", "color: red")
         sobrenome.focus();
      } else {
         labelNickName.setAttribute("style", "color:black")
         labelNickName.innerHTML = "Sobrenome:"
         sobrenome.setAttribute("style", "border-color: green")
         validNickname = true;
      }
   })
   // email
   function validateEmail(mail) {
      if (regexMail.test(mail.value)) {
         labelEmail.setAttribute("style", "color:black")
         labelEmail.innerHTML = "Email:"
         email.setAttribute("style", "border-color: green")
         validEmail = true;
      } else {
         labelEmail.setAttribute("style", "color:red")
         labelEmail.innerHTML = "Email invalido!"
         email.setAttribute("style", "border-color: red", "color: red")
      }
   }
   // cpf
   function validateCPF(cpf) {
      if (regexCPF.test(cpf.value)) {
         labelCpf.setAttribute("style", "color:black")
         labelCpf.innerHTML = "CPF:"
         cpf.setAttribute("style", "border-color: green")
         validCpf = true;
      } else {
         labelCpf.setAttribute("style", "color:red")
         labelCpf.innerHTML = "CPF invalido!"
         cpf.setAttribute("style", "border-color: red", "color: red")
   }
}
// password
password.addEventListener('keyup', () => {
      if (password.value.length <= 5) {
         labelPassword.setAttribute("style", "color:red")
         labelPassword.innerHTML = "Insira ao menos 6 caracters!"
         password.setAttribute("style", "border-color: red", "color: red")
      } else {
         labelPassword.setAttribute("style", "color:black")
         labelPassword.innerHTML = "Senha:"
         password.setAttribute("style", "border-color: green")
         validPassword = true;
      }
   })
   // repetir a senha
password2.addEventListener('keyup', () => {
   if (password2.value != password.value) {
      labelRepassword.setAttribute("style", "color:red")
      labelRepassword.innerHTML = "Senha não corresponde!"
      password2.setAttribute("style", "border-color: red", "color: red")
      password2.focus();
   } else if (password2.value == "") {
      password2.setAttribute("style", "border-color: red", "color: red")
      nome.focus();
   } else {
      labelRepassword.setAttribute("style", "color:black")
      labelRepassword.innerHTML = "Repetir senha:"
      password2.setAttribute("style", "border-color: green")
      validrepassword = true;
   }
})

function criarUsuario() {
   
   if (validName && validNickname && validEmail && validPassword && validrepassword) {

      // configuracao da API, encontrada na tarefa de criar Usuario.
      let configuracaoRequisicao = {
         method: 'POST',
         body: JSON.stringify({
            //name: nome.value + sobrenome.value,
            //lastName: sobrenome.value,
            username: nome.value,
            password: password.value,
            email: email.value,
            userRoles: "ROLE_PATIENT"
         }),
         headers: {
            'Content-type': 'application/json'
         },
      };

      // Chamando a API
      fetch("http://localhost:8080/login/cadastro", configuracaoRequisicao)
         .then((response) => {
            // verifica se o status se é 201, que é o status ok. Se não entra no catch.
            if (response.status == 200) {
               return response.json()
            }
            /* Se o código for diferente de sucesso (201), lança um throw para que a execução caia no Catch() */
            throw response;
         })
         .then(function(resposta) {
            cadastroSucesso(nome.value, sobrenome.value, email.value, resposta.jwt)
            mostrarSpinner();
         })
         .catch(error => {
            ocultarSpinner();
            cadastroErro(error)
         });
      // success message delayed to pretend it is signing user up
      successMsg.setAttribute('style', 'display: block');
      successMsg.innerHTML = ('Cadastrando usuário...');
      errorMsg.setAttribute('style', 'display: none');
      errorMsg.innerHTML = '';
   }
   // error msg if the user do not enter valid information 
   else {
      ocultarSpinner();

      errorMsg.setAttribute("style", "display: block");
      errorMsg.innerHTML = ('Preencha os campos corretamente!');
      successMsg.innerHTML = '';
      successMsg.setAttribute('style', 'display: none');
      nome.focus();
   }

}

function cadastroSucesso(nome, sobrenome, email, jsonRecebido) {
   localStorage.setItem("user", JSON.stringify({
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      token: jsonRecebido
   }))

   // Redireciona pagina inicial para login
   setTimeout(() => {
      window.location.href = 'index.html'
   }, 3000);
}

function cadastroErro(statusRecebido) {
   console.log("Erro ao cadastrar");
   console.log(statusRecebido)
}