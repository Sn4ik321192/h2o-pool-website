import { useEffect, useMemo, useState } from 'react';
import { Edit3, LogIn, LogOut, Plus, Save, Trash2, X } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import GlassButton from '../components/GlassButton.jsx';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

const blankProduct = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category_id: '',
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [productForm, setProductForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const isReady = hasSupabaseConfig;

  async function loadAdminData() {
    if (!isReady || !session) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
    ]);
    setCategories(categoriesData || []);
    setProducts(productsData || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [isReady]);

  useEffect(() => {
    loadAdminData();
  }, [session]);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Вы вошли в админ-панель.');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProducts([]);
    setCategories([]);
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    if (!categoryName.trim()) return;

    const { error } = await supabase.from('categories').insert({ name: categoryName.trim() });
    setMessage(error ? error.message : 'Категория добавлена.');
    setCategoryName('');
    await loadAdminData();
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price),
      image_url: productForm.image_url.trim() || null,
      category_id: Number(productForm.category_id),
    };

    const request = editingId
      ? supabase.from('products').update(payload).eq('id', editingId)
      : supabase.from('products').insert(payload);

    const { error } = await request;
    setMessage(error ? error.message : editingId ? 'Товар обновлен.' : 'Товар добавлен.');
    setProductForm(blankProduct);
    setEditingId(null);
    await loadAdminData();
  }

  function editProduct(product) {
    setEditingId(product.id);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
    });
  }

  async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    setMessage(error ? error.message : 'Товар удален.');
    await loadAdminData();
  }

  async function deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    setMessage(error ? error.message : 'Категория удалена.');
    await loadAdminData();
  }

  const categoryOptions = useMemo(
    () => categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>),
    [categories],
  );

  if (!isReady) {
    return (
      <section className="page-section admin-page">
        <EmptyState
          title="Supabase не подключен"
          text="Создайте .env по примеру .env.example и добавьте URL проекта и anon key."
        />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page-section admin-page">
        <EmptyState loading title="Проверяем доступ" text="Подготавливаем админ-панель..." />
      </section>
    );
  }

  if (!session) {
    return (
      <section className="page-section admin-page">
        <form className="admin-login glass-panel" onSubmit={handleLogin}>
          <LogIn size={28} />
          <h2>Вход администратора</h2>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Пароль
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <GlassButton type="submit">
            Войти
            <LogIn size={18} />
          </GlassButton>
          {message && <p className="form-message">{message}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <header className="section-heading admin-heading">
        <div>
          <span className="eyebrow">Admin panel</span>
          <h2>Управление меню</h2>
          <p>Добавляйте категории и товары без изменения кода.</p>
        </div>
        <GlassButton variant="secondary" onClick={handleLogout}>
          <LogOut size={18} />
          Выйти
        </GlassButton>
      </header>

      {message && <p className="status-pill glass-panel">{message}</p>}

      <div className="admin-grid">
        <form className="glass-panel admin-card" onSubmit={handleCategorySubmit}>
          <h3>Категории</h3>
          <div className="inline-form">
            <input
              placeholder="Напитки"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
            <GlassButton type="submit" title="Добавить категорию">
              <Plus size={18} />
            </GlassButton>
          </div>
          <div className="admin-list">
            {categories.map((category) => (
              <div className="admin-row" key={category.id}>
                <span>{category.name}</span>
                <button type="button" onClick={() => deleteCategory(category.id)} title="Удалить категорию">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </form>

        <form className="glass-panel admin-card product-form" onSubmit={handleProductSubmit}>
          <h3>{editingId ? 'Редактировать товар' : 'Добавить товар'}</h3>
          <input
            placeholder="Название"
            value={productForm.name}
            onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
            required
          />
          <textarea
            placeholder="Описание"
            value={productForm.description}
            onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
          />
          <div className="form-split">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Цена"
              value={productForm.price}
              onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              required
            />
            <select
              value={productForm.category_id}
              onChange={(event) => setProductForm({ ...productForm, category_id: event.target.value })}
              required
            >
              <option value="">Категория</option>
              {categoryOptions}
            </select>
          </div>
          <input
            placeholder="URL фото"
            value={productForm.image_url}
            onChange={(event) => setProductForm({ ...productForm, image_url: event.target.value })}
          />
          <div className="form-actions">
            <GlassButton type="submit">
              <Save size={18} />
              Сохранить
            </GlassButton>
            {editingId && (
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setProductForm(blankProduct);
                }}
              >
                <X size={18} />
                Отмена
              </GlassButton>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel admin-card">
        <h3>Товары</h3>
        <div className="admin-products">
          {products.map((product) => (
            <div className="admin-product-row" key={product.id}>
              <img src={product.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80'} alt="" />
              <div>
                <strong>{product.name}</strong>
                <span>{product.categories?.name || 'Без категории'} · {Number(product.price).toFixed(2)} MDL</span>
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => editProduct(product)} title="Редактировать">
                  <Edit3 size={16} />
                </button>
                <button type="button" onClick={() => deleteProduct(product.id)} title="Удалить">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
