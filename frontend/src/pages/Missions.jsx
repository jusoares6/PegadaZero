
import React, { useEffect, useState } from 'react';

import { CheckCircle2, Target } from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { refreshUser } = useAuth();

  async function load() {
    try {
      const { data } = await api.get('/missions');
      setMissions(data.missions);
    } catch {
      setError('Não foi possível carregar as missões.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(id) {
    setError('');
    setMessage('');

    try {
      const { data } = await api.post(`/missions/${id}/complete`);

      // Atualiza os dados do usuário, incluindo a pontuação.
      await refreshUser();

      // Atualiza a lista de missões.
      await load();

      setMessage(`${data.message} Total: ${data.points} pontos.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Não foi possível concluir a missão.'
      );
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">GAMIFICAÇÃO</span>
          <h1>Missões sustentáveis</h1>
          <p>Transforme atitudes do cotidiano em ações positivas.</p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}

      {error && <div className="error">{error}</div>}

      <div className="cards-grid">
        {missions.map((m) => (
          <article className="mission-card" key={m._id}>
            <div className="card-symbol">
              <Target />
            </div>

            <span className="points-tag">
              +{m.points} pontos
            </span>

            <h2>{m.title}</h2>

            <p>{m.description}</p>

            <button
              className={m.completed ? 'completed-button' : 'primary'}
              disabled={m.completed}
              onClick={() => complete(m._id)}
            >
              {m.completed ? (
                <>
                  <CheckCircle2 size={16} />
                  Concluída
                </>
              ) : (
                'Concluir missão'
              )}
            </button>
          </article>
        ))}
      </div>

      {!missions.length && (
        <p className="empty-state">
          Nenhuma missão disponível no momento.
        </p>
      )}
    </section>
  );
}