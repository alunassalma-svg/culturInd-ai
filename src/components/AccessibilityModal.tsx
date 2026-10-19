import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui';
import type { TextSize } from '@/types';
import { Type, Contrast, Wind, BookOpen } from 'lucide-react';

export function AccessibilityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    accessibility, setTextSize, toggleHighContrast, toggleReduceMotion, toggleDyslexiaFont,
  } = useApp();

  const sizes: { value: TextSize; label: string; sample: string }[] = [
    { value: 'small', label: 'Small', sample: 'Aa' },
    { value: 'medium', label: 'Medium', sample: 'Aa' },
    { value: 'large', label: 'Large', sample: 'Aa' },
    { value: 'xlarge', label: 'X-Large', sample: 'Aa' },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Accessibility" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Text size */}
        <div>
          <h3 className="text-sm font-bold text-batik-400 mb-3 flex items-center gap-2">
            <Type size={16} /> Text Size
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setTextSize(size.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  accessibility.textSize === size.value
                    ? 'border-neon-blue bg-neon-blue/10 text-white'
                    : 'border-ink-600 text-ink-400 hover:border-ink-500'
                }`}
                aria-label={`Text size: ${size.label}`}
                aria-pressed={accessibility.textSize === size.value}
              >
                <span className="font-display font-bold" style={{
                  fontSize: size.value === 'small' ? '14px' : size.value === 'medium' ? '18px' : size.value === 'large' ? '22px' : '28px',
                }}>{size.sample}</span>
                <span className="text-xs">{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High contrast */}
        <div>
          <button
            onClick={toggleHighContrast}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              accessibility.highContrast ? 'border-neon-yellow bg-neon-yellow/10' : 'border-ink-600'
            }`}
            aria-pressed={accessibility.highContrast}
            role="switch"
            aria-label="High contrast mode"
          >
            <div className="flex items-center gap-3">
              <Contrast size={20} className={accessibility.highContrast ? 'text-neon-yellow' : 'text-ink-400'} />
              <div className="text-left">
                <p className="text-sm font-medium text-white">High Contrast</p>
                <p className="text-xs text-ink-400">Stronger colors and borders</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.highContrast ? 'bg-neon-yellow' : 'bg-ink-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Reduce motion */}
        <div>
          <button
            onClick={toggleReduceMotion}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              accessibility.reduceMotion ? 'border-neon-green bg-neon-green/10' : 'border-ink-600'
            }`}
            aria-pressed={accessibility.reduceMotion}
            role="switch"
            aria-label="Reduce motion"
          >
            <div className="flex items-center gap-3">
              <Wind size={20} className={accessibility.reduceMotion ? 'text-neon-green' : 'text-ink-400'} />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Reduce Motion</p>
                <p className="text-xs text-ink-400">Turn off animations and transitions</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.reduceMotion ? 'bg-neon-green' : 'bg-ink-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${accessibility.reduceMotion ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>
          {window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
            <p className="text-xs text-ink-500 mt-1">Auto-enabled by your device settings</p>
          )}
        </div>

        {/* Dyslexia-friendly font */}
        <div>
          <button
            onClick={toggleDyslexiaFont}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              accessibility.dyslexiaFont ? 'border-neon-blue bg-neon-blue/10' : 'border-ink-600'
            }`}
            aria-pressed={accessibility.dyslexiaFont}
            role="switch"
            aria-label="Dyslexia-friendly font"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} className={accessibility.dyslexiaFont ? 'text-neon-blue' : 'text-ink-400'} />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Dyslexia-Friendly Font</p>
                <p className="text-xs text-ink-400">Easier to read letter spacing</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${accessibility.dyslexiaFont ? 'bg-neon-blue' : 'bg-ink-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${accessibility.dyslexiaFont ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        <p className="text-xs text-ink-500 text-center">
          All accessibility settings are remembered on your device.
        </p>
      </div>
    </Modal>
  );
}
