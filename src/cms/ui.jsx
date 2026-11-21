/** Komponen kecil panel CMS. Semua gaya ada di src/styles/cms.css (scope .cms). */
import { useEffect } from 'react';

export function Panel({ title, hint, actions, children, flush }) {
  return (
    <section className="cms-panel">
      {(title || actions) && (
        <header className="cms-panel-head">
          <div>
            <h2>{title}</h2>
            {hint ? <p>{hint}</p> : null}
          </div>
          {actions ? <div className="cms-panel-actions">{actions}</div> : null}
        </header>
      )}
      <div className={flush ? 'cms-panel-body cms-flush' : 'cms-panel-body'}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, note, tone }) {
  return (
    <div className={`cms-stat${tone ? ` is-${tone}` : ''}`}>
      <span className="cms-stat-label">{label}</span>
      <strong className="cms-stat-value">{value}</strong>
      {note ? <span className="cms-stat-note">{note}</span> : null}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`cms-badge is-${tone}`}>{children}</span>;
}

export function Field({ label, hint, children, wide }) {
  return (
    <label className={wide ? 'cms-field is-wide' : 'cms-field'}>
      <span className="cms-field-label">{label}</span>
      {children}
      {hint ? <span className="cms-field-hint">{hint}</span> : null}
    </label>
  );
}

export function Drawer({ open, title, subtitle, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="cms-drawer-wrap">
      <div className="cms-drawer-scrim" onClick={onClose} />
      <aside className="cms-drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header className="cms-drawer-head">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="cms-icon-btn" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </header>
        <div className="cms-drawer-body">{children}</div>
        {footer ? <footer className="cms-drawer-foot">{footer}</footer> : null}
      </aside>
    </div>
  );
}

export function Empty({ title, hint, children }) {
  return (
    <div className="cms-empty">
      <strong>{title}</strong>
      {hint ? <p>{hint}</p> : null}
      {children}
    </div>
  );
}

export function Progress({ value, max, tone }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`cms-progress${tone ? ` is-${tone}` : ''}`} title={`${value}/${max}`}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
