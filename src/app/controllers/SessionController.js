// Controller para criar uma sessão.
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email /* email: email */ } });

    // Verifica se o usuário existe. Se não existe...
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }
    // Usuário existe -> Verifica se a senha está correta. Se não estiver...
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    // Se o usuário existir e a senha estiver correta...
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      /* Parâmetro ID caso queira acessar novamente, HASH único e expiração.
       */
    });
  }
}

export default new SessionController();
