import { Database, LoaderCircle } from 'lucide-react';

export default function EmptyState({ loading, title, text }) {
  const Icon = loading ? LoaderCircle : Database;
  return (
    <div className="empty-state glass-panel">
      <Icon className={loading ? 'spin' : ''} size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
