/* É uma nova entidade, mas não deixa de ser um Usuário. Criado por não ser
possível a existência de dois métodos Store, Index... */

import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // Retorna todos os usuários onde provider = true
      where: { provider: true },

      // Faz com que retorne somente estas informações listadas.
      attributes: ['id', 'name', 'email', 'avatar_id'],

      // Inclue o retono das informações do Relacionamento com o model File.
      // Chama pelo codinome 'avatar', definido no model User.
      include: [
        {
          model: File,
          as: 'avatar',
          // Retorna somente name e path do model File.
          /* Como a url depende da variável 'path', é obrigatório incluir o
          retorno de 'path'. */
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
