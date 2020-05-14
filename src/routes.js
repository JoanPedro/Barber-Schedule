import { Router } from 'express'; // Importa o padrão Router do Express.

// Importa o Controller de usuários
import UserController from './app/controllers/UserController';

const routes = new Router(); // Cria uma nova instância de Router do Express.

// Registra o Middleware de Cadastro de Usuário -> UserController
routes.post('/users', UserController.store);

export default routes;
