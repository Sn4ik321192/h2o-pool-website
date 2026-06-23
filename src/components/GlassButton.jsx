export default function GlassButton({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button className={`glass-button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
