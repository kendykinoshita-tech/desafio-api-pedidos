const Order = require('../models/Order');
const Item = require('../models/Item');

//Autenticação
const jwt = require('jsonwebtoken');
const SECRET = 'chave'; 

module.exports = {
  async login(req, res) {
      const { user, password } = req.body;

      // Simulação de usuário (em um sistema real, buscaria no banco)
      if (user === 'admin' && password === '123') {
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: '1h' });
        return res.json({ auth: true, token: token });
      }

      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    },

  //Criar um novo pedido
  async store(req, res) {
    try {
      const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

      //Realiza o Mapping dos campos conforme solicitado no desafio
      const order = await Order.create({
        orderId: numeroPedido,    
        value: valorTotal,        
        creationDate: dataCriacao 
      });

      //Mapeia os itens do JSON para as colunas da tabela SQL
      const itemsMapped = items.map(item => ({
        productId: item.idItem,        
        quantity: item.quantidadeItem, 
        price: item.valorItem,         
        orderId: order.orderId
      }));

      await Item.bulkCreate(itemsMapped);
      return res.status(201).json({ message: "Pedido criado com sucesso!", orderId: order.orderId });
    } catch (err) {
      return res.status(400).json({ error: "Erro ao criar pedido: " + err.message });
    }
  },

  //Obter dados por parâmetro na URL
  async show(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, { 
        include: { model: Item } 
      });

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar pedido." });
    }
  },

  //Listar todos os pedidos
  async list(req, res) {
    try {
      const orders = await Order.findAll({ include: Item });
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar pedidos." });
    }
  },

  //Atualizar pedido 
  async update(req, res) {
    try {
      const { id } = req.params;
      const { valorTotal } = req.body;

      const [updated] = await Order.update({ value: valorTotal }, {
        where: { orderId: id }
      });

      if (updated) {
        return res.status(200).json({ message: "Pedido atualizado com sucesso!" });
      }
      return res.status(404).json({ error: "Pedido não encontrado para atualização." });
    } catch (err) {
      return res.status(400).json({ error: "Erro ao atualizar pedido." });
    }
  },

  //Deletar pedido
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Order.destroy({ where: { orderId: id } });

      if (deleted) {
        return res.status(200).json({ message: "Pedido removido com sucesso!" });
      }
      return res.status(404).json({ error: "Pedido não encontrado para remoção." });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar pedido." });
    }
  }
};