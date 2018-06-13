class UserController{
   
    constructor(formId,tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.OnFormSubmit();
    }

    //    controle primário do formulário - botão submit
    OnFormSubmit(){
        /*  => denota arrow function, resolve meu conflito de escopo, que não muda devido a ausência da
         palavra function */
        this.formEl.addEventListener("submit", (e) => {
            // impedindo o refresh da página
            e.preventDefault();
            /* gerando o objeto user com base nos inputs do usuario
            e adicionando eles na tabela */ 
            this.addLine(this.getFormValues());
        });
    };


    getFormValues(){
        // placeholder para usuário
        let user = {};
        // controle primário do formulário - botão submit
        [...this.formEl.elements].forEach(function(field){
            //teste para determinar qual gender está checado. 
            if(field.name == 'gender' && field.checked){
                user[field.name] = field.value;
            // após o teste, seto todos os outros valores do objeto no forEach
            }else{
                user[field.name] = field.value;
            }
        });
        console.log(user);    
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
    }

    // adicionando novos usuários
    addLine(userData){
       this.tableEl.innerHTML = ` 
        <tr>
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${userData.name}</td>
            <td>${userData.email}</td>
            <td>${userData.admin}</td>
            <td>${userData.birth}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
    </tr>`;
    };
}