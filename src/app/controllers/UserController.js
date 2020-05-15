// Middleware utilizado na rota /users para criação de usuários.
import * as Yup from 'yup'; // Como não possui nenhum export default...

import User from '../models/User'; // Importa o Model padrão de Usuário.

class UserController {
  async store(req, res) {
    /* Utiliza-se o Yup como Validação de dados. De acordo com o Model e o que o
      Usuário irá informar. */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // Método Store para Criação de usuários.
    // Sempre utilizar async e await quanto for manipulações com banco de dados.
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
    /* Utiliza-se o Yup como Validação de dados. De acordo com o Model e o que o
      Usuário irá informar. */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ) /* Se o oldPassword for informado, torna o campo password required. O
          Condicional informa se: oldPassword foi informado? Torne o campo reque-
          rido, caso não informado, simplesmente pule para o próximo campo */,
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ) /* Validação se a senha está sendo inserida é realmente a que o usuário
        deseja. Fazedo o confirmPassword se referir para o oldPassword, e veri-
        ficar se o password é igual ao confirmPassword. */,
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Verifica se o Email que está atualizando é igual ao anterior.
    if (email !== user.email) {
      // Verifica a existência do usuário pelo email, já que foi definido como único.
      const userExists = await User.findOne({
        where: { email /* email: email */ },
      });

      // Se o usuário já existir...
      if (userExists) {
        return res.status(400).json({ error: 'User alredy exists.' });
      }
    }

    /* Verifica se a senha antiga é igual à senha cadastrada anteriormente.
    Pode ser que o usuário só esteja querendo realizar a mudança do nome, ou
    email. Desta forma, só verificará se a senha anterior condiz, se ele infor-
    mar a senha anterior dele. */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
