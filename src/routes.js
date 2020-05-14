import { Router } from 'express'; // Importa o padrão Router do Express.

// Importa o Controller de usuários.
import UserController from './app/controllers/UserController';
// Importa o Controller de sessão.
import SessionController from './app/controllers/SessionController';
// Importa o Middleware de Autorização
import authMiddleware from './app/middlewares/auth';

const routes = new Router(); // Cria uma nova instância de Router do Express.

// Registra o Controller de Cadastro de Usuário (store) -> UserController.
routes.post('/users', UserController.store);

// Registra o Controller de Atualização de dados (update) -> UserController.
// Rota só permitida para usuários autenticados -> authMiddleware.
routes.put('/users', authMiddleware, UserController.update);

// Registra o Controller para fazer o Sign in na aplicação -> SessionController.
routes.post('/sessions', SessionController.store);

export default routes;
