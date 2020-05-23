import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // Pega todos os jobs e armazena dentro da queue.
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          // Para cada fila, armazena no Redis.
          redis: redisConfig,
        }),
        handle, // Processamento do JOB ou qualquer tarefa em background.
      };
    });
  }

  // Adiciona novos itens dentro da fila.
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Para cada adição de jobs dentro da fila, ocorrerá um processamento em background.
  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      // Escutando se ocorre erros, e depois processa.
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
