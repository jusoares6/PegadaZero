import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Calculator, Target, Lightbulb, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><Leaf size={27}/><span>PegadaZero</span></div><nav>
    <NavLink to="/"><LayoutDashboard size={18}/>Dashboard</NavLink><NavLink to="/calculadora"><Calculator size={18}/>Calculadora</NavLink><NavLink to="/missoes"><Target size={18}/>Missões</NavLink><NavLink to="/dicas"><Lightbulb size={18}/>Feed de dicas</NavLink>
  </nav><button className="logout" onClick={handleLogout}><LogOut size={17}/>Sair</button></aside><main className="main-content"><header className="topbar"><span>Olá, {user?.name}</span><span className="points">{user?.points ?? 0} pontos</span></header><Outlet/></main></div>;
}