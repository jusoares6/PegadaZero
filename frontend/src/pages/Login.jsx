
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Não foi possível entrar.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand auth-brand">
          🌱 PegadaZero
        </div>

        <h1>Bem-vindo de volta</h1>
        <p>Acompanhe e reduza seu impacto no planeta.</p>

        {error && <div className="error">{error}</div>}

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="primary" disabled={busy}>
          {busy ? 'Entrando...' : 'Entrar'}
        </button>

        <small>
          Não tem conta? <Link to="/cadastro">Criar cadastro</Link>
        </small>
      </form>
    </div>
  );
}