import { Waves } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <article className="product-card glass-panel">
      <div className="product-image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <Waves size={30} />
          </div>
        )}
      </div>
      <div className="product-content">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description || 'Свежая позиция меню H2O.'}</p>
        </div>
        <span className="price">{Number(product.price).toFixed(2)} MDL</span>
      </div>
    </article>
  );
}
