
import React, { useEffect, useState } from 'react';
import { Lightbulb, Leaf, Zap, Utensils, Recycle } from 'lucide-react';

import api from '../services/api';

const categoryIcons = {
  'Transporte e Mobilidade': Leaf,
  'Consumo de Energia Elétrica': Zap,
  'Alimentação Sustentável': Utensils,
  'Gestão de Resíduos': Recycle
};

const categoryOrder = [
  'Transporte e Mobilidade',
  'Consumo de Energia Elétrica',
  'Alimentação Sustentável',
  'Gestão de Resíduos'
];

export default function Tips() {
  const [tips, setTips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tips')
      .then(response => setTips(response.data.tips))
      .catch(() => setError('Não foi possível carregar as dicas.'));
  }, []);

  const groupedTips = categoryOrder.map(category => ({
    category,
    tips: tips.filter(tip => tip.category === category)
  }));

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">INFORMAÇÃO E CONSCIENTIZAÇÃO</span>
          <h1>Dicas sustentáveis</h1>
          <p>
            Descubra práticas para reduzir seu impacto ambiental
            e construir uma rotina mais sustentável.
          </p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tips-categories">
        {groupedTips.map(({ category, tips: categoryTips }) => {
          const CategoryIcon = categoryIcons[category];

          if (!categoryTips.length) return null;

          return (
            <section className="tips-category" key={category}>
              <div className="tips-category-heading">
                <div className="card-symbol">
                  <CategoryIcon />
                </div>

                <div>
                  <span className="eyebrow">
                    {categoryTips.length} {categoryTips.length === 1 ? 'DICA' : 'DICAS'}
                  </span>
                  <h2>{category}</h2>
                </div>
              </div>

              <div className="tips-list">
                {categoryTips.map(tip => (
                  <article className="tip-card" key={tip._id}>
                    <div className="card-symbol">
                      <Lightbulb />
                    </div>

                    <div>
                      <h3>{tip.title}</h3>

                      <p>{tip.content}</p>

                      {tip.source && (
                        <span className="tip-source">
                          Fonte: {tip.source}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {!error && tips.length === 0 && (
        <p className="empty-state">
          Nenhuma dica disponível no momento.
        </p>
      )}
    </section>
  );
}