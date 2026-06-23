import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import GlassButton from '../components/GlassButton.jsx';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadMenu() {
    if (!hasSupabaseConfig) {
      setError('Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const [{ data: categoriesData, error: categoriesError }, { data: productsData, error: productsError }] =
      await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      ]);

    if (categoriesError || productsError) {
      setError(categoriesError?.message || productsError?.message || 'Не удалось загрузить меню');
    } else {
      setCategories(categoriesData || []);
      setProducts(productsData || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((product) => product.category_id === activeCategory);
  }, [activeCategory, products]);

  return (
    <section className="page-section menu-page">
      <header className="section-heading">
        <span className="eyebrow">Digital menu</span>
        <h2>Меню H2O</h2>
        <p>Категории и позиции автоматически загружаются из Supabase.</p>
      </header>

      <div className="menu-toolbar">
        <CategoryTabs categories={categories} activeId={activeCategory} onChange={setActiveCategory} />
        <GlassButton variant="secondary" onClick={loadMenu} title="Обновить меню">
          <RefreshCw size={18} />
          Обновить
        </GlassButton>
      </div>

      {loading && <EmptyState loading title="Загружаем меню" text="Подключаемся к Supabase..." />}
      {!loading && error && <EmptyState title="Нужна настройка Supabase" text={error} />}
      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState title="Пока пусто" text="Добавьте товары через админ-панель." />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
