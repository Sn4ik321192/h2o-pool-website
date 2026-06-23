import { useMemo, useState } from 'react';
import { Droplets, LayoutDashboard, Menu as MenuIcon, Sparkles } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const navItems = [
  { id: 'home', label: 'Главная', icon: Droplets },
  { id: 'menu', label: 'Меню', icon: MenuIcon },
  { id: 'admin', label: 'Админ', icon: LayoutDashboard },
];

export default function App() {
  const [page, setPage] = useState('home');

  const Page = useMemo(() => {
    if (page === 'menu') return <MenuPage />;
    if (page === 'admin') return <AdminPage />;
    return <HomePage onOpenMenu={() => setPage('menu')} />;
  }, [page]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="topbar glass-panel">
        <button className="brand" onClick={() => setPage('home')} aria-label="Открыть главную">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>H2O</span>
        </button>

        <div className="nav-actions" aria-label="Навигация">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-button ${page === item.id ? 'is-active' : ''}`}
                onClick={() => setPage(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {Page}
    </main>
  );
}
