import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    // 2020-05-18 11:56:22
    const searchDate = Number(date); // Garantir número inteiro.

    // Filtro para adquirir todos agendamentos na data 'date'
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, // Parâmetro que vem pela URL.
        canceled_at: null, // Agendamentos cancelados -> Horário disponível.
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // Todos horários disponíveis: Das 08h até 18h.
    const schedule = [
      '08:00', // 2020-05-18 08:00:00
      '09:00', // 2020-05-18 09:00:00
      '10:00', // 2020-05-18 10:00:00
      '11:00', // ...
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    // Percorre cada um dos horários dispoível e transforma em formato NTP.
    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0 // 2020-05-18 10:00:00, Horário formatado.
      );

      return {
        /* Retorna os horário dentro do array schedule. O Método map percorre
        um a um as posições do array, e para cada posição vai mapear o retorno em
        os dados que seguem: */
        time,

        // Formata o horário em: 2020-05-18T13:00:00-03:00 (Data, Hora, TimeZone).
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),

        available:
          // Verifica horário disponível após o horário atual.
          isAfter(value, new Date()) &&
          /* Verifica se os os horários n estão dentro de appointments! */
          !appointments.find(
            (appointmentsSchedule) =>
              format(appointmentsSchedule.date, 'HH:mm') === time
          ),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
