import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Classe modelo de Usuários.
class User extends Model {
  static init(sequelize) {
    // Método Privado do User extend Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Nunca existirá na Base de dados.
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
      /* Antes de qualquer usuário ser salvo (Criado ou editado) a função criada
      Será executada de forma automática. */
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
    /* password: Digitado e this.password_hash é a senha
      já criptografada pelo cadastro */
  }
}

export default User; // Exporta a Classe User criada extendida do Model modelo.
