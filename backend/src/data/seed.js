import dns from 'node:dns';

dns.setServers(['8.8.8.8']);

import 'dotenv/config';
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Mission from '../models/Mission.js';
import Tip from '../models/Tip.js';

await connectDatabase();

const missions = [
  {
    title: 'Um dia sem carro',
    description: 'Faça um trajeto curto a pé, de bicicleta ou transporte público.',
    points: 20
  },
  {
    title: 'Refeição consciente',
    description: 'Substitua uma refeição com carne por uma opção vegetal.',
    points: 15
  },
  {
    title: 'Economize energia',
    description: 'Desligue luzes e aparelhos que não estiver usando durante o dia.',
    points: 10
  },
  {
    title: 'Banho consciente',
    description: 'Reduza o tempo do seu banho para economizar água e energia.',
    points: 15
  },
  {
    title: 'Separe seus resíduos',
    description: 'Separe corretamente os materiais recicláveis dos resíduos comuns.',
    points: 15
  },
  {
    title: 'Evite descartáveis',
    description: 'Utilize copos, garrafas ou utensílios reutilizáveis durante o dia.',
    points: 20
  },
  {
    title: 'Reutilize antes de comprar',
    description: 'Encontre uma nova utilidade para algum objeto antes de comprar outro.',
    points: 15
  },
  {
    title: 'Economize água na rotina',
    description: 'Feche a torneira enquanto escova os dentes ou lava a louça.',
    points: 10
  },
  {
    title: 'Compre de produtores locais',
    description: 'Priorize um alimento ou produto de um fornecedor da sua região.',
    points: 20
  },
  {
    title: 'Leve sua própria sacola',
    description: 'Utilize uma sacola reutilizável nas suas compras.',
    points: 10
  },
  {
    title: 'Reduza o desperdício de alimentos',
    description: 'Planeje suas refeições e aproveite os alimentos disponíveis em casa.',
    points: 15
  },
  {
    title: 'Desconecte aparelhos em stand-by',
    description: 'Retire da tomada aparelhos que não precisam permanecer conectados.',
    points: 10
  }
];

for (const mission of missions) {
  await Mission.updateOne(
    { title: mission.title },
    { $set: { ...mission, active: true } },
    { upsert: true }
  );
}

const tips = [
  {
    title: 'Repense pequenos trajetos',
    content: 'Para deslocamentos curtos, considere caminhar, pedalar ou usar transporte coletivo quando possível.',
    category: 'Transporte'
  },
  {
    title: 'Evite desperdício de alimentos',
    content: 'Planeje as compras e aproveite os alimentos integralmente para reduzir resíduos.',
    category: 'Alimentação'
  },
  {
    title: 'Consumo consciente de energia',
    content: 'Apague as luzes ao sair e evite manter equipamentos ligados sem necessidade.',
    category: 'Energia'
  }
];

for (const tip of tips) {
  await Tip.updateOne(
    { title: tip.title },
    { $set: tip },
    { upsert: true }
  );
}

console.log('Dados iniciais inseridos ou atualizados.');

await mongoose.disconnect();