import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Informe nome, e-mail e senha.' });
    if (password.length < 8) return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    return res.status(201).json({ token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email, points: user.points } });
  } catch (error) { return res.status(500).json({ message: 'Não foi possível criar a conta.' }); }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  return res.json({ token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email, points: user.points } });
}

export async function me(req, res) {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  return res.json({ user: { id: user.id, name: user.name, email: user.email, points: user.points } });
}
