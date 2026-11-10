import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Mission from '../models/Mission.js';
import Tip from '../models/Tip.js';

await connectDatabase();
await Mission.deleteMany({});
await Tip.deleteMany({});
await Mission.insertMany([
  { title: 'Um dia sem carro', description: 'Faça um trajeto curto a pé, de bicicleta ou transporte público.', points: 20 },
  { title: 'Refeição consciente', description: 'Substitua uma refeição com carne por uma opção vegetal.', points: 15 },
  { title: 'Economize energia', description: 'Desligue luzes e aparelhos que não estiver usando durante o dia.', points: 10 }
]);
await Tip.insertMany([
  { title: 'Repense pequenos trajetos', content: 'Para deslocamentos curtos, considere caminhar, pedalar ou usar transporte coletivo quando possível.', category: 'Transporte' },
  { title: 'Evite desperdício de alimentos', content: 'Planeje as compras e aproveite os alimentos integralmente para reduzir resíduos.', category: 'Alimentação' },
  { title: 'Consumo consciente de energia', content: 'Apague as luzes ao sair e evite manter equipamentos ligados sem necessidade.', category: 'Energia' }
]);
console.log('Dados iniciais inseridos.');
await mongoose.disconnect();
