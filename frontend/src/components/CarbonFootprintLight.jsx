import React, { useState, useEffect, useRef } from 'react';

export default function CarbonFootprintLight({ totalKgCo2eMonth }) {
  const total = Number(totalKgCo2eMonth);

  if (!Number.isFinite(total) || total < 0) {
    return null;
  }

  let classification;

  if (total <= 250) {
    classification = {
      level: 'low',
      title: 'Baixa',
      message:
        'Parabéns! Sua pegada está excelente e muito abaixo da faixa de referência do projeto.',
    };
  } else if (total <= 550) {
    classification = {
      level: 'medium',
      title: 'Média',
      message:
        'Sua pegada está na faixa intermediária. Há ótimas oportunidades de melhoria no seu dia a dia!',
    };
  } else {
    classification = {
      level: 'high',
      title: 'Alta',
      message:
        'Sua pegada está alta. Que tal conferir as abas de Missões e Dicas para ver como reduzi-la?',
    };
  }

  return (
    <section
      className={`carbon-footprint-light carbon-light--${classification.level}`}
      aria-live="polite"
    >
      <span className="carbon-light-indicator" aria-hidden="true" />

      <div className="carbon-light-content">
        <h3>Emissão: {classification.title}</h3>

        <p>
          Emissão mensal: {total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} kg de CO₂e
        </p>

        <p>{classification.message}</p>
      </div>
    </section>
  );
}