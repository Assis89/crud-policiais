import express from 'express';
import dotenv from 'dotenv';
import policiaisRouter from './policiais.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/policiais', policiaisRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
