import File from '../models/File';

class FileController {
  async store(req, res) {
    /* O Multer quando chamado ( get() ) disponibiliza dentro da requisição o
    atributo 'file', e dentro de file existe originalname e filename. */
    const { originalname: name, filename: path } = req.file;

    // Método Create para Criação de Arquivos dentro do DB a partir do Model File.
    // Sempre utilizar async e await quanto for manipulações com banco de dados.
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
