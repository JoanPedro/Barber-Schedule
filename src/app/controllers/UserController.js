// Middleware utilizado na rota /users para criação de usuários.

import User from '../models/User'; // Importa o Model padrão de Usuário.

class UserController {
  // Método Store para Criação de usuários.
  // Sempre utilizar async e await quanto for manipulações com banco de dados.
  async store(req, res) {
    const userInfo = req.body;
    // Verifica a existência do usuário pelo email, já que foi definido como único.
    const userExists = await User.findOne({ where: { email: userInfo.email } });

    // Se o usuário já existir...
    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists.' });
    }

    // Se o usuário não existir...(Pseudo-Else do if)
    // Os dados são passados pelo Body da Requisição. " req.body ".
    /* É passado diretamente o req.body, porque o Model de Usuário já define os
    possíveis campos necessários para realizar o cadastro de usuários. */
    const { id, name, email, provider } = await User.create(userInfo);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }
}

export default new UserController();
