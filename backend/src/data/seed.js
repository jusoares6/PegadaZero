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
  // TRANSPORTE E MOBILIDADE
  {
    title: 'Adote a carona solidária (Carpooling)',
    content: 'Compartilhar o trajeto diário de carro com outras pessoas reduz as emissões individuais por passageiro e contribui para diminuir o congestionamento urbano.',
    category: 'Transporte e Mobilidade',
    source: 'CETESB / Ministério das Cidades'
  },
  {
    title: 'Priorize o transporte ativo em trajetos curtos',
    content: 'Para deslocamentos curtos, considere caminhar ou utilizar a bicicleta. Além de não gerar emissões diretas durante o trajeto, essas alternativas contribuem para a saúde e reduzem a poluição urbana.',
    category: 'Transporte e Mobilidade',
    source: 'ONU Meio Ambiente'
  },
  {
    title: 'Mantenha a calibragem dos pneus em dia',
    content: 'Pneus com pressão inadequada aumentam a resistência ao rolamento e podem elevar o consumo de combustível. Verifique regularmente a pressão recomendada pelo fabricante.',
    category: 'Transporte e Mobilidade',
    source: 'INMETRO / Programa Brasileiro de Etiquetagem Veicular'
  },
  {
    title: 'Abasteça com etanol quando for vantajoso',
    content: 'Em veículos flex, o etanol pode apresentar menor emissão de gases de efeito estufa no ciclo de vida em comparação à gasolina. Considere também o preço e a eficiência do veículo.',
    category: 'Transporte e Mobilidade',
    source: 'EPE / RenovaBio'
  },

  // CONSUMO DE ENERGIA ELÉTRICA
  {
    title: 'Retire aparelhos em stand-by da tomada',
    content: 'Televisores, micro-ondas e outros aparelhos podem continuar consumindo energia mesmo quando estão em modo de espera. Desconecte equipamentos que não precisam permanecer ligados.',
    category: 'Consumo de Energia Elétrica',
    source: 'PROCEL / Eletrobras'
  },
  {
    title: 'Ajuste o chuveiro elétrico para a posição Verão',
    content: 'Nos dias mais quentes, utilizar a posição Verão reduz a potência do chuveiro e pode diminuir significativamente o consumo de energia elétrica durante o banho.',
    category: 'Consumo de Energia Elétrica',
    source: 'ANEEL / PROCEL'
  },
  {
    title: 'Troque lâmpadas antigas por LED',
    content: 'As lâmpadas LED são mais eficientes energeticamente e possuem maior vida útil em comparação às lâmpadas incandescentes, ajudando a reduzir o consumo de eletricidade.',
    category: 'Consumo de Energia Elétrica',
    source: 'PROCEL / Ministério de Minas e Energia'
  },

  // ALIMENTAÇÃO SUSTENTÁVEL
  {
    title: 'Participe da Segunda Sem Carne',
    content: 'Experimente substituir a proteína animal por leguminosas, como feijão, lentilha e grão-de-bico, em pelo menos um dia da semana. Essa mudança pode contribuir para reduzir sua pegada de carbono alimentar.',
    category: 'Alimentação Sustentável',
    source: 'Sociedade Vegetariana Brasileira / ONU'
  },
  {
    title: 'Evite o desperdício planejando as compras',
    content: 'Planeje suas refeições, confira o que já tem em casa e compre apenas o necessário. O desperdício de alimentos também representa desperdício de água, energia e recursos utilizados na produção e no transporte.',
    category: 'Alimentação Sustentável',
    source: 'FAO / ONU Brasil'
  },
  {
    title: 'Consuma alimentos locais e da estação',
    content: 'Priorize frutas, legumes e verduras produzidos na sua região e que estejam na época de colheita. Essa escolha pode reduzir a necessidade de longos deslocamentos e armazenamento.',
    category: 'Alimentação Sustentável',
    source: 'EMBRAPA / Ministério do Meio Ambiente'
  },

  // GESTÃO DE RESÍDUOS
  {
    title: 'Separe o lixo seco do orgânico',
    content: 'Separe papel, plástico, vidro e metal dos resíduos orgânicos. A destinação correta dos recicláveis favorece o reaproveitamento de materiais e reduz a necessidade de extração de novas matérias-primas.',
    category: 'Gestão de Resíduos',
    source: 'Ministério do Meio Ambiente / SINIR'
  },
  {
    title: 'Faça compostagem doméstica',
    content: 'Restos de frutas, legumes e outros resíduos orgânicos podem ser transformados em adubo por meio da compostagem. Essa prática reduz o volume de resíduos enviados aos aterros sanitários.',
    category: 'Gestão de Resíduos',
    source: 'EMBRAPA / Ministério do Meio Ambiente'
  },
  {
    title: 'Substitua descartáveis por reutilizáveis',
    content: 'Utilize ecobags, garrafas reutilizáveis e canecas próprias no dia a dia. Essas alternativas ajudam a reduzir o descarte de embalagens e produtos de uso único.',
    category: 'Gestão de Resíduos',
    source: 'ONU Meio Ambiente - Campanha Mares Limpos'
  }
];

for (const tip of tips) {
  await Tip.updateOne(
    { title: tip.title },
    { $set: { ...tip, active: true } },
    { upsert: true }
  );
}

for (const tip of tips) {
  await Tip.updateOne(
    { title: tip.title },
    { $set: tip },
    { upsert: true }
  );
}

console.log('Dados iniciais inseridos ou atualizados.');

await mongoose.disconnect();