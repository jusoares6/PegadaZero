import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import calculatorRoutes from './routes/calculatorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import tipRoutes from './routes/tipRoutes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', application: 'PegadaZero API' }));
app.use('/api/auth', authRoutes);
app.use('/api/calculations', calculatorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/tips', tipRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});
export default app;
