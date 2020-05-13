const express = require('express')
const routes = require('./routes')

// Configuração Inicial da Aplicação: Define os Middlewares e Rotas.
// Padrão para configuração de: Testes unitários e de Integração.

class App {
  constructor() {
    this.server = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.server.use(express.json()) // Habilita Requisição Body em JSON.
  }

  routes() {
    this.server.use(routes)
  }
}

module.exports = new App().server