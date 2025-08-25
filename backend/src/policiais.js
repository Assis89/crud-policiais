import express from 'express';
import { pool } from './db.js';
import bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';

const router = express.Router();
const SALT_ROUNDS = 10;

// Criptografia simples para data de nascimento
function encrypt(text) {
  return Buffer.from(text).toString('base64');
}
function decrypt(text) {
  return Buffer.from(text, 'base64').toString('utf8');
}

// POST /policiais
router.post('/', async (req, res, next) => {
  try {
    const { rg_civil, rg_militar, cpf: cpfValue, data_nascimento, matricula } = req.body;
    if (!rg_civil || !rg_militar || !cpfValue || !data_nascimento || !matricula) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    if (!cpf.isValid(cpfValue)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }
    const hashedMatricula = await bcrypt.hash(matricula, SALT_ROUNDS);
    const encryptedDataNasc = encrypt(data_nascimento);
    const [result] = await pool.query(
      'INSERT INTO policiais (rg_civil, rg_militar, cpf, data_nascimento, matricula) VALUES (?, ?, ?, ?, ?)',
      [rg_civil, rg_militar, cpfValue, encryptedDataNasc, hashedMatricula]
    );
    res.status(201).json({ message: 'Policial cadastrado com sucesso!', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'RG civil, RG militar ou CPF já cadastrados.' });
    }
    next(err);
  }
});

// GET /policiais
router.get('/', async (req, res, next) => {
  try {
    const { cpf: cpfFilter, rg } = req.query;
    let query = 'SELECT * FROM policiais';
    let params = [];
    if (cpfFilter) {
      query += ' WHERE cpf = ?';
      params.push(cpfFilter);
    } else if (rg) {
      query += ' WHERE rg_civil = ? OR rg_militar = ?';
      params.push(rg, rg);
    }
    const [rows] = await pool.query(query, params);
    const policiais = await Promise.all(rows.map(async (p) => {
      // Descriptografar data_nascimento
      const data_nascimento = decrypt(p.data_nascimento);
      // Descriptografar matrícula (bcrypt não permite reversão, então retornamos um placeholder)
      return {
        id: p.id,
        rg_civil: p.rg_civil,
        rg_militar: p.rg_militar,
        cpf: p.cpf,
        data_nascimento,
        matricula: '[protegida]'
      };
    }));
    res.json(policiais);
  } catch (err) {
    next(err);
  }
});

export default router;
