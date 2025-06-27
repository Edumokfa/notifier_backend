const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { syncModels } = require('./models');
require('./controllers/cronController');

const { serverAdapter } = require('./bullBoard'); // importação

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/admin/queues', serverAdapter.getRouter());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/whatsapp', require('./routes/whatsappRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/template', require('./routes/templateRoutes'));
app.use('/api/messageConfig', require('./routes/messageConfigRoutes'));
app.use('/api/messageHistory', require('./routes/messageHistoryRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/email', require('./routes/mailRoutes'));


app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    //await syncModels(); 

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Bull Board: http://localhost:${PORT}/admin/queues`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
