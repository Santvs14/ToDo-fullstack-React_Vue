// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todosRouter = require('./routes/RouteTodos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// rutas
app.use('/api/todos', todosRouter);

// conectar a mongo y arrancar servidor
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> {
  console.log('Conectado a MongoDB');
  app.listen(PORT, ()=> console.log(`Servidor escuchando en http://localhost:${PORT}`));
})
.catch((err)=> {
  console.error('Error conectando a MongoDB:', err.message);
});
