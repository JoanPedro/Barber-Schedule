import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // Retorna todos os usuários onde provider = true
      where: { provider: true },

      // Retorna somente estas informações listadas.
      attributes: ['id', 'name', 'email', 'avatar_id'],

      // Inclue o retono das informações do Relacionamento com o model File.
      // Chama pelo codinome 'avatar', definido no model User.
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'], // Retorna somente name e path do model File.
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
