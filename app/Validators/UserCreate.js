'use strict'

class UserCreate{
    get rules(){
        return {
            firstname: 'required|min:1|max:80',
            lastname: 'required|min:1|max:80',
            email: 'required|email|max:254|unique:users',
            password: 'required|min:4|max:60',
            repassword: 'required|same:password'
        }
    }

    get messages(){
        return {
            'firstname.required': 'Укажите имя',
            'firstname.max': 'Имя слишком длинное, больше 60-и символов',
            'lastname.required': 'Укажите фамилию',
            'lastname.max': 'Фамилия слишком длинная, больше 60-и символов',
            'email.required': 'Укажите email',
            'email.email': 'Проверьте адрес электронной почты',
            'email.max': 'Email должен быть не больше 255-и символов',
            'email.unique': 'Пользователь с данным адресом уже существует',
            'password.required': 'Укажите пароль',
            'password.min': 'Пароль должен быть больше пяти символов',
            'password.max': 'Пароль должен превышать 60-и символов',
            'repassword.required': 'Повторите пароль',
            'repassword.same': 'Пароли не совпадают'
        }
    }

    get sanitizationRules(){
        return {
            firstname: 'trim',
            lastname: 'trim',
            email: 'trim',
            password: 'trim',
            repassword: 'trim'
        }
    }

    fails(messages){
        console.dir(messages);
        this.ctx.response.redirect('back');
    }

    get validateAll () {
        return true
    }
}

module.exports = UserCreate;