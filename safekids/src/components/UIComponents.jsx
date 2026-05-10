// =============================================================
// COMPONENTS — UIComponents.jsx
// src/components/UIComponents.jsx
//
// Componentes atómicos reutilizables.
// No contienen lógica de negocio — solo presentación.
// =============================================================

import React from 'react';

// ── Toggle Switch ─────────────────────────────────────────────

export function Toggle({ activo, onChange, etiqueta, icono, descripcion }) {
  return (
    <div className="toggle-row" onClick={() => onChange(!activo)}>
      <div className="toggle-row__left">
        <span className="toggle-row__icono">{icono}</span>
        <div className="toggle-row__text">
          <span className="toggle-row__label">{etiqueta}</span>
          {descripcion && <span className="toggle-row__desc">{descripcion}</span>}
        </div>
      </div>
      <div className={`switch ${activo ? 'switch--on' : 'switch--off'}`}>
        <div className="switch__thumb" />
      </div>
    </div>
  );
}

// ── Badge de patrón ───────────────────────────────────────────

export function PatternBadge({ tipo }) {
  const map = {
    factory: { label: 'Factory Method', cls: 'badge-factory' },
    facade:  { label: 'Facade',         cls: 'badge-facade'  },
    memento: { label: 'Memento',        cls: 'badge-memento' },
    mvc:     { label: 'MVC',            cls: 'badge-mvc'     },
  };
  const b = map[tipo];
  if (!b) return null;
  return <span className={`pattern-badge ${b.cls}`}>{b.label}</span>;
}

// ── Alert / Toast ─────────────────────────────────────────────

export function Alert({ tipo = 'info', mensaje, onClose }) {
  if (!mensaje) return null;
  return (
    <div className={`alert alert--${tipo}`}>
      <span className="alert__msg">{mensaje}</span>
      {onClose && <button className="alert__close" onClick={onClose}>✕</button>}
    </div>
  );
}

// ── Chip de sistema activo/inactivo ───────────────────────────

export function SistemaChip({ activo, label }) {
  return (
    <span className={`sys-chip ${activo ? 'sys-chip--on' : 'sys-chip--off'}`}>
      {activo ? '✓' : '✕'} {label}
    </span>
  );
}

// ── Barra de nivel de seguridad ───────────────────────────────

export function NivelBarra({ porcentaje }) {
  const color =
    porcentaje >= 75 ? '#16a34a' :
    porcentaje >= 50 ? '#d97706' :
    porcentaje >= 25 ? '#ea580c' : '#dc2626';

  return (
    <div className="nivel-barra-wrap">
      <div className="nivel-barra-track">
        <div
          className="nivel-barra-fill"
          style={{ width: `${porcentaje}%`, background: color }}
        />
      </div>
      <span className="nivel-barra-label" style={{ color }}>{porcentaje}%</span>
    </div>
  );
}

// ── Sección card con badge de patrón ─────────────────────────

export function SectionCard({ patron, titulo, descripcion, children, className = '' }) {
  return (
    <div className={`section-card ${className}`}>
      <div className="section-card__header">
        <PatternBadge tipo={patron} />
        <h2 className="section-card__titulo">{titulo}</h2>
        {descripcion && <p className="section-card__desc">{descripcion}</p>}
      </div>
      <div className="section-card__body">{children}</div>
    </div>
  );
}
