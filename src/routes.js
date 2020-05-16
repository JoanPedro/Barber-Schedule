import { Router } from 'express'; // Importa o padrão Router do Express.
import multer from 'multer';
import multerConfig from './config/multer';

// Importa o Controller de usuários.
import UserController from './app/controllers/UserController';
// Importa o Controller de sessão.
import SessionController from './app/controllers/SessionController';
// Importa o Middleware de Autorização e Agendamento
import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
// Importa o Controller de Upload de arquivos.
import FileController from './app/controllers/FileController';
// Importa o Controller de Prestadores de Serviços.
// OBS. Apesar de ser também um usuário, a entidade é outra.
import ProviderController from './app/controllers/ProviderController';
// Importa o Controller responsável pelas Notificações aos Providers.
import NotificationController from './app/controllers/NotificationController';

const routes = new Router(); // Cria uma nova instância de Router do Express.
const upload = multer(multerConfig);

// ------------------------ Usuário ------------------------------------------ //
// Registra o Controller de Cadastro de Usuário (store) -> UserController.
routes.post('/users', UserController.store);

// Registra o Controller de Atualização de dados (update) -> UserController.
// Rota só permitida para usuários autenticados -> authMiddleware.
routes.put('/users', authMiddleware, UserController.update);
// --------------------------------------------------------------------------- //

// ------------------------ Sessão de Autenticação --------------------------- //
// Registra o Controller para fazer o Sign in na aplicação -> SessionController.
routes.post('/sessions', SessionController.store);
// ------------------------ Sessão de Agendamento -----------------------------//
// Registra o Controle para fazer o agendamento na aplicação -> AppointmentController.
routes.get('/appointments', authMiddleware, AppointmentController.index);
routes.post('/appointments', authMiddleware, AppointmentController.store);
// ---------------------- Sessão de Agenda do Prestador -----------------------//
routes.get('/schedule', authMiddleware, ScheduleController.index);
// --------------------------------------------------------------------------- //

// ------------------------- Rota Upload de Arquivos ------------------------- //
// Rota para Upload de arquivos, com Controller (store) -> FileController.
routes.post(
  '/files',
  authMiddleware,
  upload.single('file'),
  FileController.store
);
// --------------------------------------------------------------------------- //

// ------------------------- Prestadores de Serviço -------------------------- //
// Regista o Controller de Prestadores de Serviço () -> ProviderController.
routes.get('/providers', authMiddleware, ProviderController.index);

// ------------------------ Notificações de Serviços ------------------------- //
routes.get('/notifications', authMiddleware, NotificationController.index);
export default routes;
