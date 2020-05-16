import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      // Retorna todos os agendamentos validados e não cancelados.
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], // Ordena por data.
      attributes: ['id', 'date'],
      include: [
        /* Duplo Include de Relacionamento -> Inclui do model User, os providers e
        Inclui também do model File a imagem uploaded a partir dos providers. */
        // Inclui os dados relacionados do usuário que é Provider.
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File, // Inclui os dados relacionados com a Imagem Uploaded.
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    // Validação dos dados enviados.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { provider_id, date } = req.body;

    // Verifica se o provider_id é realmente de um Provider.
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers.' });
    }

    // Sempre pega o início da hora e formata a string de data para o formato ISO.
    // Se: 19:30:00 -> 19:00:00!
    const hourStart = startOfHour(parseISO(date));

    // Verifica se a data passada pelo usuário é anterior à data atual.
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past datas are not permitted.' });
    }

    // Varifica a disponibilidade de horário.
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id, // provider_id: provider_id.
        canceled_at: null, // Se o agendamento for cancelado, data estará disponível.
        date: hourStart, // Não permite horário quebrado. Sempre de 1 em 1 hora.
      },
    });

    // Horário não disponível.
    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment is not available' });
    }
    // Cria os agendamentos.
    const appointment = await Appointment.create({
      // Setado automaticamente pelo middleware de auteticação (auth -> userId).
      user_id: req.userId,
      provider_id,
      date: hourStart, // Não permite horário quebrado. Sempre de 1 em 1 hora.
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
