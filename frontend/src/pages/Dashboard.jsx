import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, TrendingDown, Target } from 'lucide-react';
import api from '../services/api';
export default function Dashboard(){
 const [data,setData]=useState(null);const [error,setError]=useState('');
 useEffect(()=>{api.get('/dashboard').then(r=>setData(r.data)).catch(()=>setError('Não foi possível carregar o dashboard.'));},[]);
 if(error)return <p className="error">{error}</p>;if(!data)return <p className="loading">Carregando dashboard...</p>;
 const chart=(data.history||[]).map((item,index)=>({name:new Date(item.createdAt).toLocaleDateString('pt-BR'),emissao:item.totalKgCo2eMonth,ordem:index+1}));
 return <section><div className="page-heading"><div><span className="eyebrow">VISÃO GERAL</span><h1>Seu impacto em foco</h1><p>Acompanhe seus resultados e avance com pequenas mudanças.</p></div><Link className="primary link-button" to="/calculadora">Novo cálculo</Link></div><div className="stats-grid"><article className="stat-card"><div className="stat-icon"><Leaf/></div><span>Última pegada mensal</span><strong>{data.latest?`${data.latest.totalKgCo2eMonth} kg`:'—'}</strong><small>kg de CO₂ equivalente</small></article><article className="stat-card"><div className="stat-icon"><TrendingDown/></div><span>Cálculos realizados</span><strong>{data.history?.length||0}</strong><small>Registros no histórico</small></article><article className="stat-card"><div className="stat-icon"><Target/></div><span>Pontuação</span><strong>{data.user?.points||0}</strong><small>Pontos acumulados em missões</small></article></div><div className="panel chart-panel"><div className="panel-heading"><div><h2>Evolução da sua pegada</h2><p>Histórico dos cálculos mensais</p></div></div>{chart.length?<div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Line type="monotone" dataKey="emissao" name="CO₂e (kg/mês)" stroke="#23845b" strokeWidth={3} activeDot={{r:6}}/></LineChart></ResponsiveContainer></div>:<div className="empty-state">Você ainda não possui cálculos. <Link to="/calculadora">Faça seu primeiro cálculo.</Link></div>}</div></section>;
}
