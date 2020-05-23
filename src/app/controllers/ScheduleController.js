import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      // userId sempre será passado após o usuário ser autenticado.
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      res.status(401).json({ error: 'User is not a provider.' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId, // Usuário autenticado.
        canceled_at: null, // Agendamentos não cancelados.
        date: {
          // Agendamentos Entre o Início e o Final do dia
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'], // Ordena por data.
    });

    return res.json(appointments);
  }
}
export default new ScheduleController();
