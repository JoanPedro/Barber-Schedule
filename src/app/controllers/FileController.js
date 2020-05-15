import File from '../models/File';

class FileController {
  async store(req, res) {
    // O Multer implanta dentro da requisição o atributo file.
    const { originalname: name, filename: path } = req.file;

    // Método Store para Criação de Arquivos dentro do DB.
    // Sempre utilizar async e await quanto for manipulações com banco de dados.
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
