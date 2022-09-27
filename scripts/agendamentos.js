const urlGetUser = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe';
const urlTasks = 'https://ctd-todo-api.herokuapp.com/v1/tasks';
const jwt = JSON.parse(localStorage.getItem('login')).jwt;

const novaTarefa = document.getElementById('novaTarea');
const skeleton = document.getElementById('skeleton');
const tarefasPendentes = document.querySelector('.tarefas-pendentes');
const tarefasTerminadas = document.querySelector('.tarefas-terminadas');
const closeApp = document.getElementById('closeApp');
const formNovaTarefa = document.querySelector('.nova-tarefa')
const userinfo = document.querySelector('.user-info p');

// metodo para obter nome do usuario
const carregaUsuario = function() {
   const settings = {
      method: 'GET',
      headers: {
         authorization: jwt
      },
   };

   fetch(urlGetUser, settings)
      .then(response => {
         // if (response.status === 201) {
         return response.json()
            // }
            // throw response;
      })
      .then(res => {
         atualizaNome(res.firstName, res.lastName);
      })
      .catch(err => {
         alert("Falha no login!")
      });
}

// funcao ira atualizar nome no userinfo
const atualizaNome = function(firstname, lastname) {
   userinfo.innerHTML = firstname + ' ' + lastname;
}

// metodo para obter lista de tarefas
const carregaTasks = function() {
   const settings = {
      method: 'GET',
      headers: {
         authorization: jwt
      }
   };

   fetch(urlTasks, settings)
      .then(response => response.json())
      .then(tasks => {
         

         renderizarTasks(tasks);

      })
      .catch(err => {
         alert("Falha no login!")
      });
}

// renderiza tarefas na tela
const renderizarTasks = function(tasks) {
   // remove visualização do skeleton
   skeleton.style.display = 'none';

   // listar as tarefas
   tarefasPendentes.innerHTML = '';
   tarefasTerminadas.innerHTML = '';

   tasks.forEach(task => {
      let date = new Date(task.createdAt);
      date.toLocaleDateString('pt-BR');

      
      date = date.getDate() +
         "/" + (date.getMonth() + 1) +
         "/" + date.getFullYear();

      if (task.completed) {
         tarefasTerminadas.innerHTML += templateTask(task, date);
      } else {
         tarefasPendentes.innerHTML += templateTask(task, date);
      }
   });
}

// retorna template tarefa
const templateTask = function(task, date) {
   let template = '';

   if (task.completed) {
      template = `
         <li class="tarefa" id="id${task.id}">
            <div class="done"></div>
            <div class="descricao">
            <p class="nome">${task.description}</p>
            <div>
               <button onclick="backTask(${task.id}, true)"><i class="fas fa-undo-alt change"></i></button>
               <button onclick="removeTask(${task.id})"><i class="far fa-trash-alt"></i></button>
            </div>
            </div>
         </li>
         `;
   } else {
      template = `
         <li class="tarefa">
            <div class="not-done" onclick="clickTask(${task.id}, false)"></div>
            <div class="descricao">
               <p class="nome">${task.description}</p>
               <p class="timestamp">Criada em: ${date}</p>
            </div>
         </li>      
      `;
   }

   return template;
}

// metodo para criar nova tarefa
const criarTask = function() {
   if (novaTarefa.value == ''){
      novaTarefa.setAttribute("style", "border-color: red", "color: red")
      novaTarefa.focus();
   } else{
      novaTarefa.setAttribute("style", "border-color: lightgray", "color: black")
      const data = {
         description: novaTarefa.value,
         completed: false
      };
   
      const settings = {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
            Authorization: jwt
         },
         body: JSON.stringify(data)
      };
   
      Swal.fire({
         // position: 'top-end',
         icon: 'success',
         title: 'Tarefa adicionada!',
         showConfirmButton: false,
         timer: 900
       })
   
      fetch(urlTasks, settings)
         .then(response => {
            // if (response.status === 201) {
            return response.json()
               // }
               // throw response;
         })
         .then(res => {
            carregaTasks();
            novaTarefa.value = '';
         })
         .catch(err => {
            alert("Falha no login!")
         });
   }
}

// metodo handle status tarefa
function clickTask(id, completed) {
   Swal.fire({
      title: 'Tem certeza?',
      text: "Você quer concluir esta tarefa?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, por favor!'
    }).then((result) => {
      if (result.isConfirmed) {
         const data = {
            completed: !completed
         };
         const settings = {
            method: 'PUT',
            headers: {
               'content-type': 'application/json',
               authorization: jwt
            },
            body: JSON.stringify(data)
         }
      
         fetch(urlTasks + '/' + id, settings)
            .then(response => {
               return response.json()
            })
            .then(task => {
               carregaTasks();
            })
            Swal.fire({
               // position: 'top-end',
               icon: 'success',
               title: 'Tarefa concluída!',
               showConfirmButton: false,
               timer: 1500
             })
      }
    })    

}

// metodo handle status tarefa
function backTask(id, completed) {
   Swal.fire({
      title: 'Tem certeza?',
      text: "Você deseja retomar essa tarefa?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, por favor!'
    }).then((result) => {
      if (result.isConfirmed) {
         const data = {
            completed: !completed
         };
         const settings = {
            method: 'PUT',
            headers: {
               'content-type': 'application/json',
               authorization: jwt
            },
            body: JSON.stringify(data)
         }
      
         fetch(urlTasks + '/' + id, settings)
            .then(response => {
               return response.json()
            })
            .then(task => {
               carregaTasks();
            })
            Swal.fire({
               icon: 'success',
               title: 'Tarefa retomada!',
               showConfirmButton: false,
               timer: 1500
             })
      }
    })    

}

// metodo delete tarefa
function removeTask(id) {

   Swal.fire({
      title: 'Tem certeza?',
      text: "Você não será capaz de reverter isso",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, por favor!'
    }).then((result) => {
      if (result.isConfirmed) {
         const settings = {
            method: 'DELETE',
            headers: {
               'content-type': 'application/json',
               authorization: jwt
            }
         }
      
         fetch(urlTasks + '/' + id, settings)
            .then(response => {
               return response.json()
            }) 
            .then(task => {
              carregaTasks();
            })
        Swal.fire(
          'Deletada!',
          'A tarefa foi excluida.',
          'success'
        )
      }
    })
 
}

// fechar sessao
closeApp.addEventListener('click', function(ev) {
   ev.preventDefault();
   localStorage.removeItem('login');
   location.href = "index.html";
})

// adiciona evento de criar ao tarefa ao botan "+"
formNovaTarefa.addEventListener('submit', function(ev) {
   ev.preventDefault();
   criarTask();
})

// ao carregar a janela
window.addEventListener('load', function() {
   // obtem usuario
   carregaUsuario();

   // listar as tarefas
   carregaTasks();
});