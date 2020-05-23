import Sequelize, { Model } from 'sequelize';

// Classe modelo de Usuários.
class File extends Model {
  static init(sequelize) {
    // Método Privado do File extend Model
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL, // Campo inexistente no Banco de Dados.
          get() {
            // Retorna a partir de uma chamada get().
            // Retorna a url da imagem a partir do seu path (caminho/nome)
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File; // Exporta a Classe File criada extendida do Model modelo.
