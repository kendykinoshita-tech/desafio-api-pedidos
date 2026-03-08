const express = require('express');
const jwt = require('jsonwebtoken'); // Importante: instale com 'npm install jsonwebtoken'
const sequelize = require('./src/config/database');
const Order = require('./src/models/Order');
const Item = require('./src/models/Item');
const OrderController = require('./src/controllers/OrderController');

const app = express();
app.use(express.json());

const SECRET = 'chave';

//AUTENTICAÇÃO
// Esta função protege as rotas e só deixa passar quem enviar o Token correto no Header
function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
  
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar token.' });
    
    req.userId = decoded.userId;
    next();
  });
}

//RELAÇÕES
Order.hasMany(Item, { foreignKey: 'orderId' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

//ROTAS

//Rota de Login (Pública: gera o token para usar nas outras)
app.post('/login', OrderController.login);

//Criar pedido
app.post('/order', verifyJWT, OrderController.store);

//Obter pedido por ID 
app.get('/order/:id', verifyJWT, OrderController.show);

//Listar todos os pedidos 
app.get('/order/list', verifyJWT, OrderController.list);

//Atualizar pedido 
app.put('/order/:id', verifyJWT, OrderController.update);

//Deletar pedido 
app.delete('/order/:id', verifyJWT, OrderController.delete);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000 com JWT'));
});