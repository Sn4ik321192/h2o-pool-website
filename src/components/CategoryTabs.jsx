export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="category-tabs glass-panel" role="tablist" aria-label="Категории меню">
      <button className={!activeId ? 'is-active' : ''} onClick={() => onChange(null)}>
        Все
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={activeId === category.id ? 'is-active' : ''}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
