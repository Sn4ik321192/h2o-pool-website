import { useMemo, useRef, useState } from 'react';
import { Droplets, Menu as MenuIcon, Sparkles } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const navItems = [
  { id: 'home', label: 'Главная', icon: Droplets },
  { id: 'menu', label: 'Меню', icon: MenuIcon },
];

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  return params.get('admin') === '1' ? 'admin' : 'home';
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const longPressTimer = useRef(null);
  const longPressOpened = useRef(false);

  function navigate(nextPage) {
    setPage(nextPage);

    const url = new URL(window.location.href);
    if (nextPage === 'admin') {
      url.searchParams.set('admin', '1');
    } else {
      url.searchParams.delete('admin');
    }

    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function startLogoPress() {
    longPressOpened.current = false;
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressOpened.current = true;
      navigate('admin');
    }, 1800);
  }

  function stopLogoPress() {
    window.clearTimeout(longPressTimer.current);
  }

  function handleLogoClick(event) {
    if (longPressOpened.current) {
      event.preventDefault();
      longPressOpened.current = false;
      return;
    }

    navigate(event.altKey ? 'admin' : 'home');
  }

  const Page = useMemo(() => {
    if (page === 'menu') return <MenuPage />;
    if (page === 'admin') return <AdminPage />;
    return <HomePage onOpenMenu={() => navigate('menu')} />;
  }, [page]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="topbar glass-panel">
        <button
          className="brand"
          onClick={handleLogoClick}
          onPointerDown={startLogoPress}
          onPointerUp={stopLogoPress}
          onPointerCancel={stopLogoPress}
          onPointerLeave={stopLogoPress}
          aria-label="Открыть главную"
        >
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
                onClick={() => navigate(item.id)}
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
