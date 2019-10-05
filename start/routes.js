'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.group(()=>{
    Route.get('login', 'AuthController.loginShow');
    Route.post('login', 'AuthController.login');
    Route.get('register', 'AuthController.registerShow');
    Route.post('register', 'AuthController.register').validator('UserCreate');
    Route.post('logout', 'AuthController.logout');
}).prefix('auth');

Route.group(()=>{
    Route.get('play', 'GuestController.play');
}).prefix('guest');

Route.group(()=>{
    Route.get('simple/board', 'GameController.board');
    Route.get('simple/move', 'GameController.move');
    Route.get('simple/start', 'GameController.start');
    Route.get('simple/cpumove', 'GameController.cpuMove');
    Route.get('simple/game', 'GameController.game');
}).prefix('game');

