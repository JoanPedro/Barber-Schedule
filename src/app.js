import express from 'express'; // Só é possível utilizar isso adicionando como
import path from 'path';
import routes from './routes'; // dependencias o sucrase. " Yarn add sucrase -D "
// Deve-se criar o arquivo nodemon.js e configuralo para aceitar JS sucrase!
// Configuração Inicial da Aplicação: Define os Middlewares e Rotas.
// Padrão para configuração de: Testes unitários e de Integração.
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // Habilita Requisição Body em JSON.

    /* Estático: Servem arquivos estáticos como html, imagens... arquivos
    processados diretamente pelo navegador. */
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
