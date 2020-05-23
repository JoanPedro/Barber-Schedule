// Middleware de autenticação para verificar se o usuário está autenticado.
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Local onde está o segredo do Token.
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // Adquire o Bearer Token

  // Verifica se o token foi passado para requisição via Header (Bearer).
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  /* O Header retorna uma string: "Beader asfhaopsifhiaoephai", utilizar o split
  para retornar um array com 2 informações: Bearer e a outra parte do Token.
  Como não será utilizado o bearer, somente o [, token] basta. */
  const /* [bearer, token] */ [, token] = authHeader.split(' ');

  try {
    /* Como o jwt.verify possui um padrão antigo de Callback, utiliza-se o
    promisify para fazer um parse de callback para promise e utilizar
    o Async await */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    /* Se for decodificado com sucesso, como o SessionController passou o ID do
    usuário pro jwt.sign, o decoded  vai possuir dentro dele (Objeto) o ID
    passado. */

    req.userId = decoded.id; // Retorna o ID do usuário autorizado.

    return next(); // Por ser um middleware, é necessário para executar o Controller.
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid!' });
  }
};
