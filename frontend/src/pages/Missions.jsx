
import React, { useEffect, useState } from 'react';

import { CheckCircle2, Target, CalendarDays } from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [weekStart, setWeekStart] = useState(null);
  const [weekEnd, setWeekEnd] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { refreshUser } = useAuth();

  async function load() {
    try {
      const { data } = await api.get('/missions');

      setMissions(data.missions);
      setWeekStart(data.weekStart);
      setWeekEnd(data.weekEnd);
      setError('');
    } catch {
      setError('Não foi possível carregar as missões.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatDate(date) {
    if (!date) return '';

    return new Date(date).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  }

  async function complete(id) {
    setError('');
    setMessage('');

    try {
      const { data } = await api.post(`/missions/${id}/complete`);

      await refreshUser();
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

      {weekStart && weekEnd && (
        <div className="success">
          <CalendarDays size={18} />
          Missões da semana: {formatDate(weekStart)} até {formatDate(
            new Date(new Date(weekEnd).getTime() - 1)
          )}
        </div>
      )}

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