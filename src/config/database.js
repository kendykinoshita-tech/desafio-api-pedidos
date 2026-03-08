const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('api_pedidos', 'meu_usuario', 'minha_senha', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
  logging: false 
});
module.exports = sequelize;