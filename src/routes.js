import { Router } from 'express'; // Importa o padrão Router do Express.

// Importa o Controller de usuários.
import UserController from './app/controllers/UserController';
// Importa o Controller de sessão.
import SessionController from './app/controllers/SessionController';

const routes = new Router(); // Cria uma nova instância de Router do Express.

// Registra o Middleware de Cadastro de Usuário -> UserController.
routes.post('/users', UserController.store);

// Registra o Middleware para fazer o Sign in na aplicação -> SessionController.
routes.post('/sessions', SessionController.store);

export default routes;
