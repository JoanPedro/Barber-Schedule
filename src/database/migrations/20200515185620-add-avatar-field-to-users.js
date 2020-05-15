module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // Tabela que vai receber nova coluna.
      'avatar_id', // Nome da nova coluna a ser adiciona na tabela 'users'.
      {
        type: Sequelize.INTEGER, // Inteiro por referenciar ao ID da IMAGEM.

        /* Passa o nome da tabela dentro de 'model' que é a tabela files,
        e a chave que é o ID da tabela files. Ou seja, todo avatar_id da tabela-
        usuários será também um ID contido na tabela files. */
        references: { model: 'files', key: 'id' }, // Foreign Key.
        onUpdate: 'CASCADE', // Se o avatar_id for atulizado, atualize tb na tabela usuários.
        onDelete: 'SET NULL', // Se deletado, diga que é nulo.
        allowNull: true,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('user', 'avatar_id');
  },
};
