import express from 'express';
import { pool } from './db.js';
import crypto from 'crypto';
import { cpf } from 'cpf-cnpj-validator';

const router = express.Router();
const ALGO = 'aes-256-gcm';
const KEY_HEX = process.env.ENCRYPTION_KEY || '';
if (!KEY_HEX || KEY_HEX.length !== 64) {
  // Chave inválida: log suave para orientar configuração
  console.warn('ENCRYPTION_KEY ausente ou inválida. Defina uma chave HEX de 32 bytes (64 chars) no .env');
}
const KEY = KEY_HEX && KEY_HEX.length === 64 ? Buffer.from(KEY_HEX, 'hex') : crypto.randomBytes(32);

// Util: criptografa texto (utf8) e retorna Buffer com layout [IV(12)][TAG(16)][CIPHERTEXT]
function encryptToBuffer(plainText) {
  const text = typeof plainText === 'string' ? plainText : String(plainText ?? '');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

// Resiliente a dados legados: se o buffer for curto (<28) ou inválido, retorna como texto puro.
function decryptFromBuffer(bufLike) {
  if (bufLike == null) return '';
  const buf = Buffer.isBuffer(bufLike) ? bufLike : Buffer.from(bufLike);
  // Formato esperado: IV(12) + TAG(16) + CIPHERTEXT(>=0) => mínimo 28 bytes
  if (buf.length < 28) {
    // Provavelmente dado legado salvo em texto puro
    return buf.toString('utf8');
  }
  try {
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    if (tag.length !== 16) {
      return buf.toString('utf8');
    }
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString('utf8');
  } catch (e) {
    console.warn('Falha ao decifrar campo, retornando texto bruto:', e.message);
    return buf.toString('utf8');
  }
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
    const encryptedMatricula = encryptToBuffer(matricula);
    const encryptedDataNasc = encryptToBuffer(data_nascimento);
    const [result] = await pool.query(
      'INSERT INTO policiais (rg_civil, rg_militar, cpf, data_nascimento, matricula) VALUES (?, ?, ?, ?, ?)',
      [rg_civil, rg_militar, cpfValue, encryptedDataNasc, encryptedMatricula]
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
      const data_nascimento = decryptFromBuffer(p.data_nascimento);
      const matricula = decryptFromBuffer(p.matricula);
      return {
        id: p.id,
        rg_civil: p.rg_civil,
        rg_militar: p.rg_militar,
        cpf: p.cpf,
        data_nascimento,
        matricula
      };
    }));
    res.json(policiais);
  } catch (err) {
    next(err);
  }
});

export default router;
