import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
const PORT = process.env.PORT || 3000;
try {
  await connectDatabase();
  app.listen(PORT, () => console.log(`PegadaZero API rodando em http://localhost:${PORT}`));
} catch (error) {
  console.error('Falha ao iniciar a aplicação:', error.message);
  process.exit(1);
}
