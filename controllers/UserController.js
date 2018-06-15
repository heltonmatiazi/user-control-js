/* esse código é comentado no limiar da demência pra garantir 
que tudo que ele faz é claro e fácil de atualizar */

class UserController{
    constructor(formIdCreate,formIdUpdate,tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        // botão pressionado, iniciando processo de adicionar usuário
        this.onFormSubmit();
        this.onEdit();
    };

    // controle primário do formulário - botão submit
    onFormSubmit(){
        /*  => denota arrow function, resolve meu conflito de escopo, que não muda devido a ausência da
         palavra function */
        this.formEl.addEventListener("submit", (e) => {
            // impedindo o refresh da página
            e.preventDefault();
            // impedindo que vários forms sejam enviados caso o usuário aperte o botão suscessivas vezes
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true;
            // instanciando os valores do form
            let values = this.getFormValues(this.formEl);
            /* teste para abortar envio caso algum dos campos requeridos estejam vazios.
            evita o erro de cast da foto quando o isValid retorna false ao invés de um objeto */
            if(!values){
                return false;
            }
            // .then vai passar o resultado da promessa
            this.getPhoto(this.formEl).then(
                // arrow functions são usadas para não alterar o contexto do .this
                (content)=>{
                    values.photo = content;
                    /* gerando o objeto user com base nos inputs do usuario
                    e adicionando eles na tabela */ 
                    this.addLine(values);
                    // limpando o formulário
                    this.formEl.reset();
                    // reabilitando o botão
                    btn.disabled = false;
                },
                (e)=>{
                    console.error(e);
                });
        });
    };

    // salvando a imagem do usuário com fileReader
    getPhoto(formEl){
        // a promessa usa resolve para caso a função rode e reject caso não
        return new Promise((resolve,reject)=>{
            let fileReader = new FileReader();
            // separando a imagem passada no form com .filter()
            let elements = [...this.formEl.elements].filter(item=>{
                if (item.name === 'photo'){
                    return    item;
                };
            });
            // o .filter gera um novo array de elementos, aqui a imagem será selecionada
            let file = elements[0].files[0];
            // o onLoad é um metodo obrigatório do fileReader. Ele processa a imagem que foi transformada em
            // base64 pelo readAsDataURL
            fileReader.onload = ()=>{
                resolve(fileReader.result);
            };
            // isso não ser camelCase me deixa triggered
            fileReader.onerror = ()=>{
                reject(e);
            };
            // testando a existência de imagem 
            if(file){
            // o readAsDataURL passa o arquivo serializado para o onLoad
                fileReader.readAsDataURL(file);
                }else{
                    // nesse caso o usuário terá uma imagem padrão carregada
                    resolve('dist/img/boxed-bg.jpg');
                };
        });
    };

    getFormValues(formEl){
        // placeholder para usuário
        let user = {};
        let isValid = true;
        // controle primário do formulário - botão submit
        [...formEl.elements].forEach(function(field){
            // validating empty fields
            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){
              field.parentElement.classList.add('has-error');
              isValid = false;
            };
            //teste para determinar qual gender está checado. 
            if(field.name == 'gender' && field.checked){
                user[field.name] = field.value;
            // após o teste, seta todos os outros valores do objeto no forEach
            }else if(field.name =='admin') {
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            };
        });
        console.log(user);    
        // impedindo envio do formulário caso campo vazio seja detectado
        if(!isValid){
            return false;
        };
        // criando um objeto utilizando o modelo de user.js
        return  new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    };

    // adicionando novos usuários
    addLine(userData){
        let tr = document.createElement('tr');
        //criando o conjunto de data para o updateUserCount()
        tr.dataset.user = JSON.stringify(userData);
        //criando nova linha
        tr.innerHTML =
        `<td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${userData.name}</td>
        <td>${userData.email}</td>
        <td>${(userData.admin)?'Sim':'Não'}</td>
        <td>${Util.dateFormat(userData.register)}</td>
        <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>`; 
        

        this.addTrEvents(tr);

        // adicionando como filha do <td> na tabela
       this.tableEl.appendChild(tr); 
        //atualizando numero de usuários
        this.updateUserCount();
    };



    addTrEvents(tr){
        //controlando o press do botão EDIT
        tr.querySelector(".btn-edit").addEventListener('click',e=>{
            //gerando objeto com os dados do usuario selecionado
            let json = JSON.parse(tr.dataset.user);
           
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                //buscando os dados do objeto e os selecionando
                let field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+"]");
                //testando o tipo do campo
                if(field){
                   // testando o tipo do input para enviar para o form de edição
                    switch(field.type){
                        case 'file':
                            continue;
                            break;
                        //no caso do radio é necessário buscar o value do elemento para diferenciar o genero
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+
                                "][value="+json[name]+"]");
                                field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                        }
                    //populando o painel de update com os dados parseados pelo for in
                    field.value = json[name];
                };
            };
            //atualizando a foto
            this.formUpdateEl.querySelector(".photo").src = json._photo;
            //mostrando o formulário de update
            this.showPanelUpdate();
        });
    }
    //atualizando numero de usuários cadastrados no formulário
    updateUserCount(){
        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr=>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            // chamando direto da classe user pq o stringify faz ele perder o escopo
            if(user._admin){
                numberAdmin++;
            }
        });
        document.querySelector("#user-numbers").innerHTML = numberUsers;
        document.querySelector("#user-numbers-admin").innerHTML = numberAdmin;
    };

    //controle do botão de edição
    onEdit(){
        //botão cancelar edição - mostra o formulário de cadastrar
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click',e=>{
           this.showPanelCreate();
        });
        //botão de submit do formulário de edição
        this.formUpdateEl.addEventListener("submit",e=>{
            
            event.preventDefault();
            //desabilitando o botão caso o usuário seja trigger-happy
            let btn = this.formUpdateEl.querySelector("[type='submit']");
            btn.disabled = true;

            //resgatando o objeto editado pelo usuário
            let values = this.getFormValues(this.formUpdateEl);
            //usando dataset para encontrar a linha correta
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
            /*combina o objeto antigo com os novos valores inseridos pelo usuário
            a variável a esquerda (useOld) tem os valores de indice correspondente substituidos
             pela variável da direita (values) */
            let result = Object.assign({},userOld,values);
           
           
            this.getPhoto(this.formUpdateEl).then(
                // arrow functions são usadas para não alterar o contexto do .this
                (content)=>{
 
 

            
                     //se a foto estiver vazia, retorne ao valor anterior (foto default)
                    if(!values.photo) {
                        result._photo = userOld._photo;
                    }else{
                        result._photo = content;
                    }

                    //transformando em string para poder utilizar innerHTML
                    tr.dataset.user = JSON.stringify(result);

                    //editando os valores com os dados passados no json
                        tr.innerHTML = 
                        `<td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin)?'Sim':'Não'}</td>
                        <td>${Util.dateFormat(result._register)}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`; 
                    //atualiza a linha da tabela
                    this.addTrEvents(tr);
                    //atualiza o numero de usuários normais\admins
                    this.updateUserCount(); 
                    // limpando o formulário
                    this.formUpdateEl.reset();
                    // reabilitando o botão
                    btn.disabled = false;
                     //mostra o formulário de criar usuário
                    this.showPanelCreate();

                },
                (e)=>{
                    console.error(e);
                });
        });
    };
    //método para mostrar o formulário de criar usuário
    showPanelCreate(){
        document.querySelector("#box-user-update").style.display = "none";
        document.querySelector("#box-user-create").style.display = "block";
    };
    //metodo para mostrar o formulário de editar
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    };
};