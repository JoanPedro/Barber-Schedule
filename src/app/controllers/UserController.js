import User from '../models/User'; // Importa o Model padrão de Usuário.

class UserController {
  // Método Store para Criação de usuários.
  // Sempre utilizar async e await quanto for manipulações com banco de dados.
  async store(req, res) {
    // Os dados são passados pelo Body da Requisição. " req.body ".
    /* É passado diretamente o req.body, porque o Model de Usuário já define os
    possíveis campos necessários para realizar o cadastro de usuários. */
    const user = await User.create(req.body);

    return res.json(user);
  }
}

export default new UserController();
