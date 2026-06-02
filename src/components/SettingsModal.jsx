import { useState } from 'react';
import { getUserApiKey, setUserApiKey } from '../apiKey.js';

export default function SettingsModal({ onClose, theme }) {
  const [key, setKey] = useState(() => getUserApiKey());
  const [saved, setSaved] = useState(false);
  const [reveal, setReveal] = useState(false);

  const isLight = theme === 'light';
  const borderCl = isLight ? 'border-zinc-200' : 'border-white/[0.06]';
  const inputCl = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-500'
    : 'bg-white/[0.04] border-white/[0.08] text-text-primary placeholder:text-text-muted';

  const handleSave = () => {
    setUserApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleClear = () => {
    setKey('');
    setUserApiKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const active = !!getUserApiKey();

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border ${borderCl} ${isLight ? 'bg-white' : 'bg-surface-raised'} shadow-2xl p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <i className="ph ph-key text-lotus-400 text-xl"></i>
            API key
          </h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-lg">
            <i className="ph ph-x text-lg"></i>
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          Optionally add your own Google Gemini API key. It&apos;s used for docs chat, product
          generation, and image generation, and overrides the built-in default. Leave it empty to
          keep using the built-in key.
        </p>

        <label className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
          Google Gemini API key
        </label>
        <div className="relative mb-3">
          <input
            type={reveal ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIza..."
            autoComplete="off"
            spellCheck={false}
            className={`w-full px-4 py-3 pr-11 rounded-xl text-sm border ${inputCl} focus:outline-none focus:ring-2 focus:ring-lotus-400/30`}
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
            aria-label={reveal ? 'Hide key' : 'Show key'}
          >
            <i className={`ph ${reveal ? 'ph-eye-slash' : 'ph-eye'} text-base`} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
              active
                ? 'bg-emerald-500/15 text-emerald-500'
                : isLight
                  ? 'bg-zinc-100 text-zinc-600'
                  : 'bg-white/[0.06] text-text-muted'
            }`}
          >
            <i className={`ph ${active ? 'ph-check-circle' : 'ph-cloud'}`} />
            {active ? 'Using your key' : 'Using built-in default'}
          </span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-lotus-400 hover:underline inline-flex items-center gap-1"
          >
            Get a Gemini key <i className="ph ph-arrow-up-right" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="btn-premium px-4 py-2 text-sm"
          >
            <i className="ph ph-floppy-disk mr-2" />
            Save
          </button>
          <button
            onClick={handleClear}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${borderCl} text-text-primary ${isLight ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.04]'}`}
          >
            Clear
          </button>
          {saved && (
            <span className="text-sm text-emerald-500 flex items-center gap-1 ml-1">
              <i className="ph ph-check" /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
