
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import InfoTooltip from '../components/InfoTooltip';
import CarbonFootprintLight from '../components/CarbonFootprintLight';
import '../components/CarbonFootprintLight.css';

export default function Calculator() {
  const [form, setForm] = useState({
    carKmPerWeek: '',
    electricityKwhPerMonth: '',
    meatMealsPerWeek: '',
    wasteKgPerWeek: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();

    setBusy(true);
    setError('');
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          Number(value)
        ])
      );

      const { data } = await api.post('/calculations', payload);

      setResult(data.calculation);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erro ao calcular.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CALCULADORA</span>

          <h1>Calcule sua pegada</h1>

          <p>
            Informe uma estimativa dos seus hábitos.
            O resultado será apresentado em kg de CO₂e por mês.
          </p>
        </div>
      </div>

      <form
        className="panel form-grid"
        onSubmit={submit}
      >
        <label>
          <span className="field-label-row">
            Quilômetros de carro por semana

            <InfoTooltip title="Emissões dos transportes">
              Veículos movidos a gasolina, etanol ou diesel
              liberam gases de efeito estufa durante a queima
              de combustível. Quanto maior a distância percorrida,
              maior tende a ser a emissão. O impacto também
              depende do combustível e da eficiência do veículo.
            </InfoTooltip>
          </span>

          <input
            name="carKmPerWeek"
            type="number"
            min="0"
            step="0.1"
            value={form.carKmPerWeek}
            onChange={change}
            required
          />
        </label>

        <label>
          <span className="field-label-row">
            Consumo de energia (kWh/mês)

            <InfoTooltip title="Emissões da eletricidade">
              A geração de eletricidade pode produzir gases
              de efeito estufa, dependendo das fontes utilizadas.
              Usinas termelétricas, por exemplo, utilizam
              combustíveis que liberam CO₂. Por isso, o consumo
              de energia também influencia a pegada de carbono.
            </InfoTooltip>
          </span>

          <input
            name="electricityKwhPerMonth"
            type="number"
            min="0"
            step="0.1"
            value={form.electricityKwhPerMonth}
            onChange={change}
            required
          />
        </label>

        <label>
          <span className="field-label-row">
            Refeições com carne por semana

            <InfoTooltip title="Emissões da alimentação">
              A produção de carne envolve emissões relacionadas
              à criação dos animais, produção de ração e uso da
              terra. Os bovinos, por exemplo, liberam metano
              durante a digestão, um gás de efeito estufa potente.
              O tipo de carne consumida também influencia o impacto.
            </InfoTooltip>
          </span>

          <input
            name="meatMealsPerWeek"
            type="number"
            min="0"
            step="1"
            value={form.meatMealsPerWeek}
            onChange={change}
            required
          />
        </label>

        <label>
          <span className="field-label-row">
            Resíduos gerados (kg/semana)

            <InfoTooltip title="Emissões dos resíduos">
              Quando resíduos orgânicos são destinados a aterros,
              sua decomposição pode liberar metano. A quantidade
              gerada e a forma de destinação dos resíduos,
              como reciclagem e compostagem, influenciam
              seu impacto ambiental.
            </InfoTooltip>
          </span>

          <input
            name="wasteKgPerWeek"
            type="number"
            min="0"
            step="0.1"
            value={form.wasteKgPerWeek}
            onChange={change}
            required
          />
        </label>

        <div className="form-actions">
          <button
            className="primary"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Calculando...' : 'Calcular minha pegada'}
          </button>
        </div>

        {error && (
          <div className="error full">
            {error}
          </div>
        )}
      </form>

      {result && (
        <div className="result-card">
          <span>ESTIMATIVA MENSAL</span>

          <strong>
            {result.totalKgCo2eMonth} kg
          </strong>

          <p>de CO₂ equivalente por mês</p>

          <CarbonFootprintLight
            totalKgCo2eMonth={result.totalKgCo2eMonth}
          />

          <button
            className="secondary"
            type="button"
            onClick={() => navigate('/')}
          >
            Ver dashboard
          </button>
        </div>
      )}

      <p className="disclaimer">
      </p>
    </section>
  );
}