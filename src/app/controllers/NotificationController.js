import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications.' });
    }

    // Find -> MongoDB queries.
    // Ordena por data ('createdAt) -> Um atributo do retorno do MongoDB.
    // Impoe um limit de 20 resultados -> Limit().
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' }) // Esquema de PILHA!! O último é o primeiro.
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
