'use strict'

const User = use('App/Models/User');

class AuthController {
    loginShow({view}){
        return view.render('auth.login');
    }
    
    registerShow({view}){
        return view.render('auth.register');
    }

    async register({request, view}){
        const {firstname, lastname, email, password } = request.all();

        const user = await User.create({
            firstname, lastname, email, password
        });
        await user.save();

        return view.render('auth.register', {success:true});
    }
}

module.exports = AuthController
