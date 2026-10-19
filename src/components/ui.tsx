import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`${maxWidth} w-full max-h-[90vh] overflow-y-auto card-base batik-bg p-6 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function AIBadge({ label = 'AI-generated' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/40">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
      {label}
    </span>
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`card-base batik-bg p-5 ${onClick ? 'card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'neon-blue' | 'neon-pink' | 'neon-green' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-batik-400 to-batik-600 text-white hover:from-batik-300 hover:to-batik-500',
    secondary: 'bg-ink-700 text-white hover:bg-ink-600 border border-ink-500',
    'neon-blue': 'bg-neon-blue/20 text-neon-blue border-2 border-neon-blue hover:bg-neon-blue/30',
    'neon-pink': 'bg-neon-pink/20 text-neon-pink border-2 border-neon-pink hover:bg-neon-pink/30',
    'neon-green': 'bg-neon-green/20 text-neon-green border-2 border-neon-green hover:bg-neon-green/30',
    ghost: 'text-white hover:bg-white/10',
    danger: 'bg-red-600/20 text-red-400 border-2 border-red-500 hover:bg-red-600/30',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn-neon ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-display font-bold text-white">{children}</h2>
      {subtitle && <p className="text-ink-300 mt-1">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 animate-float">{emoji}</div>
      <p className="text-ink-400 text-lg">{message}</p>
    </div>
  );
}
