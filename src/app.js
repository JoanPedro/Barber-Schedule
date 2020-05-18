import 'dotenv/config';

import express from 'express'; // Só é possível utilizar isso adicionando como
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
// Deve ser importado antes das rotas. Para entrar no middleware.
import 'express-async-errors';
import routes from './routes'; // dependencias o sucrase. " Yarn add sucrase -D "
// Deve-se criar o arquivo nodemon.js e configuralo para aceitar JS sucrase!
// Configuração Inicial da Aplicação: Define os Middlewares e Rotas.
// Padrão para configuração de: Testes unitários e de Integração.
import './database';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
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
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // Middleware para tratamento de excessões.
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        // Erro de servidor.
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
