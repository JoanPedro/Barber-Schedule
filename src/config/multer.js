import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path'; // Extname -> Retorna a extensão do arquivo.

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      // Req: Todos os dados da requisição do Express.
      // File: Todos os dados do arquivo: Tamanho, tipo, formato, nome..
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
