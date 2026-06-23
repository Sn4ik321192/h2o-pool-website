import { ArrowRight, Droplets, MapPin, Moon } from 'lucide-react';
import GlassButton from '../components/GlassButton.jsx';

export default function HomePage({ onOpenMenu }) {
  return (
    <section className="hero page-section">
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-kicker glass-panel">
          <Droplets size={18} />
          Pool lounge menu
        </div>
        <h1>H2O</h1>
        <p>
          Вечерняя атмосфера у бассейна, прохладные напитки, легкая еда и премиальный
          сервис в одном цифровом меню.
        </p>
        <div className="hero-actions">
          <GlassButton onClick={onOpenMenu}>
            Меню
            <ArrowRight size={18} />
          </GlassButton>
        </div>
      </div>

      <div className="hero-info">
        <div className="info-card glass-panel">
          <Moon size={20} />
          <span>Evening pool mood</span>
        </div>
        <div className="info-card glass-panel">
          <MapPin size={20} />
          <span>H2O Lounge</span>
        </div>
      </div>
    </section>
  );
}
