class User {
    constructor(name,gender,birth,country,email,password,photo,admin){
        this._id; 
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    };



    loadFromJson(data){
       for(let name in data){
            switch(name){
                case '_register':
                    this[name] = new Date(data[name]);
                    break;
                default:
                this.name = data[name];
            };
        };
    };

    save(){
        let users = User.preloadUsers();
        if(this.id > 0){
            users.map(u=>{
                if(u._id == this.id){
                    Object.assign(u,this);
                };
                return u;
            });
        }else{
            this._id = this.getNewId();
            users.push(this);
        };
        localStorage.setItem("users",JSON.stringify(users));
    };

    static preloadUsers(){
        let users = [];
        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    };
    getNewId(){
        let usersId = parseInt(localStorage.getItem("userId"));

        if(!usersId) usersId = 0;
        usersId++;
        localStorage.setItem("usersId",usersId);
        return usersId;
    };

    removeUser(){
        let users = User.preloadUsers();
        users.forEach((userData,index)=>{
            if(this._id == userData._id){
              users.splice(index,1);
            };
        });
        localStorage.setItem("users",JSON.stringify(users));
    };
    get id(){
        return this._id;
    };
    get name(){
        return this._name;
    };
    set name(value){
        this._name = value;
    };
    get gender(){
        return this._gender;
    };
    set gender(value){
        this._gender = value;
    };
    get birth(){
        return this._birth;
    };
    set birth(value){
        this._birth = value;
    };
    get country(){
        return this._country;
    };
    set country(value){
        this._country = value;
    };
    get email(){
        return this._email;
    };
    set email(value){
        this._email = value;
    };
    get password(){
        return this._password;
    };
    set password(value){
        this._password = value;
    };
    get photo(){
        return this._photo;
    };
    set photo(value){
        this._photo = value;
    };
    get admin(){
        return this._admin;
    };
    set admin(value){
        this._admin = value;
    };
    get register(){
        return this._register;
    };
    set register(value){
        this._register = value;
    };
};