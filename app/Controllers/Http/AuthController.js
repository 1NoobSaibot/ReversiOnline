'use strict'

const Env = use('Env');
const User = use('App/Models/User');

class AuthController {
    loginShow({view}){
        return view.render('auth.login');
    }

    async login({auth, request, response}){
        let { login, password } = request.all();

        try {
            let user = await User.findBy('email', login);

            if(user){
                await auth.remember(true).attempt(user.email, password);
                return view.render('welcome', {url: Env.get('APP_URL')});
            }
        } catch {}

        return response.redirect('back');
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

        console.log(`Register Successfully! User ${firstname} ${lastname} was added.`);
        return view.render('auth.register', {success:true});
    }

    async logout({auth, response}){
        try{
            await auth.logout();
        }catch{}
        response.redirect('auth/login');
    }
}

module.exports = AuthController
