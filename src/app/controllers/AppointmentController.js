import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import File from '../models/File';
import Notification from '../schemas/Notification';
import User from '../models/User';

class AppointmentController {
  async index(req, res) {
    // --------------- Paginação --------------- //
    const { page } = req.query; // Por padrão: 1.

    // --------------- Listagem --------------- //
    const appointments = await Appointment.findAll({
      // Retorna todos os agendamentos validados e não cancelados.
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], // Ordena por data.
      limit: 20, // Listar no máximo 20 registros. 'Paginação'

      /* Como o padrão de page, no req.query é igual a 1, não pula nenhum dado,
      se tiver na página 2, pulará 20 dados... se tiver na página n, pulará n*10
      dados. */
      offset: (page - 1) * 20,
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
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
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

    if (appointment.user_id === provider_id) {
      return res
        .status(400)
        .json({ error: 'You cannot appointment with yourself.' });
    }

    // Realizar a notificação de agendamento para o prestador de serviços.
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      // dia  22  de  Junho, às  15:40h
      { locale: pt }
    );

    await Notification.create({
      // Exemplo: `Novo agendamento de Joan Pedro, para o dia 22 de junho às 22h.`
      content: `Novo agendamento de ${user.name}, para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // Busca dados dos agendamentos
    const appointment = await Appointment.findByPk(req.params.id);

    // Verifica se o usuário do agendamento é diferente do usuário autenticado.
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // Para cancelar, o usário deve estar pelo menos 2h antes do agendado.
    /* Quando solicitado os campos date do banco de dados, já vêm formatados,
    não em formato de string mas sim em formato de data. */
    const dateWithSub = subHours(appointment.date, 2); // Duas horas antes.

    /* Verifica:
     * appointment.date = 13:00h
     * dateWithSub = 11h
     * se now = 11:25h
     * O horário já passou, dateWithSub < que now.
     */
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel appointments 2hours in advance.' });
    }

    appointment.canceled_at = new Date(); // Horário exato do cancelamento.
    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
