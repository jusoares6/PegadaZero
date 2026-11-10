
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Não foi possível criar a conta.'
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

        <h1>Crie sua conta</h1>
        <p>Comece a acompanhar sua pegada de carbono.</p>

        {error && <div className="error">{error}</div>}

        <label>
          Nome
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength="100"
          />
        </label>

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
            minLength="8"
            required
          />
        </label>

        <button className="primary" disabled={busy}>
          {busy ? 'Criando...' : 'Criar conta'}
        </button>

        <small>
          Já tem conta? <Link to="/login">Entrar</Link>
        </small>
      </form>
    </div>
  );
}