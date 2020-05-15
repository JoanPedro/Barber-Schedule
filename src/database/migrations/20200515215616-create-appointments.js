module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.INTEGER, // Inteiro por referenciar ao ID do usuário.

        /* Passa o nome da tabela dentro de 'model' que é a tabela user,
        e a chave que é o ID da tabela user. Ou seja, todo id relacional da tabela user,
        será também um ID contido na tabela appointments. */
        references: { model: 'users', key: 'id' }, // Foreign Key.
        onUpdate: 'CASCADE', // Se o usuário for atulizado, atualize tb na tabela appointment.
        onDelete: 'SET NULL', // Se deletado, mantenha nulo.
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER, // Inteiro por referenciar ao ID do Prestador.

        /* Passa o nome da tabela dentro de 'model' que é a tabela user,
        e a chave que é o ID da coluna provider. Ou seja, todo provider_id relacional da tabela user,
        será também um provider_id contido na tabela appointments. */
        references: { model: 'users', key: 'id' }, // Foreign Key.
        onUpdate: 'CASCADE', // Se o usuário for atulizado, atualize tb na tabela appointment.
        onDelete: 'SET NULL', // Se deletado, mantenha nulo.
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('appointments');
  },
};
