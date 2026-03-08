const express = require('express');
const sequelize = require('./src/config/database');
const Order = require('./src/models/Order');
const Item = require('./src/models/Item');
const OrderController = require('./src/controllers/OrderController');

const app = express();
app.use(express.json());

// Relações 
Order.hasMany(Item, { foreignKey: 'orderId' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

//Definicao de rotas

//Criar pedido
app.post('/order', OrderController.store);

//Obter pedido por parâmetro na URL (Obrigatório)
app.get('/order/:id', OrderController.show);

//Listar todos os pedidos (Opcional)
app.get('/order/list', OrderController.list);

//Atualizar pedido (Opcional)
app.put('/order/:id', OrderController.update);

//Deletar pedido (Opcional)
app.delete('/order/:id', OrderController.delete);

//Sincronizar e Rodar
sequelize.sync().then(() => {
  app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
}); 