// =============================================================
// PATRÓN MVC — VIEW + Memento
// views/HistorialMemento.jsx
//
// Historial visual de snapshots guardados por el Caretaker.
// Muestra tarjetas enriquecidas con toda la info del estado.
// Permite restaurar y eliminar snapshots.
// =============================================================

import React, { useState } from 'react';
import { SistemaChip, PatternBadge } from '../components/UIComponents.jsx';

function formatFecha(date) {
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}
function formatHora(date) {
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function SnapshotCard({ memento, esReciente, enRestauracion, onRestaurar, onEliminar }) {
  const [confirmar, setConfirmar] = useState(false);
  const s = memento.getEstado();

  const velColor = s.velocidad <= 60 ? '#16a34a' : s.velocidad <= 100 ? '#d97706' : '#dc2626';

  return (
    <div className={`snap-card ${esReciente ? 'snap-card--reciente' : ''} ${enRestauracion ? 'snap-card--restaurando' : ''}`}>

      {/* Header de la tarjeta */}
      <div className="snap-card__head">
        <div className="snap-card__num-wrap">
          <span className="snap-card__num">#{memento.getNumero()}</span>
          {esReciente && <span className="snap-card__badge-nuevo">Último</span>}
        </div>
        <div className="snap-card__nombre">{memento.getNombre()}</div>
        <button
          className="snap-card__del"
          onClick={() => setConfirmar(true)}
          title="Eliminar snapshot"
        >✕</button>
      </div>

      {/* Fecha y hora */}
      <div className="snap-card__time">
        <span>📅 {formatFecha(memento.getTimestamp())}</span>
        <span>🕐 {formatHora(memento.getTimestamp())}</span>
      </div>

      {/* Velocidad */}
      <div className="snap-card__vel" style={{ color: velColor }}>
        🏎️ <strong>{s.velocidad} km/h</strong> máximo
      </div>

      {/* Chips de sistemas */}
      <div className="snap-card__sistemas">
        <SistemaChip activo={s.abs}             label="ABS" />
        <SistemaChip activo={s.cinturones}      label="Cinturón" />
        <SistemaChip activo={s.sensores}        label="Sensores" />
        <SistemaChip activo={s.bloqueoInfantil} label="Bloqueo" />
      </div>

      {/* Acciones */}
      {confirmar ? (
        <div className="snap-card__confirmar">
          <span>¿Eliminar este snapshot?</span>
          <div className="snap-card__confirmar-btns">
            <button className="btn-confirmar-si"  onClick={() => onEliminar(memento.getId())}>Eliminar</button>
            <button className="btn-confirmar-no"  onClick={() => setConfirmar(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button className="btn-restaurar" onClick={() => onRestaurar(memento.getId())}>
          ↩️ Restaurar este estado
        </button>
      )}

    </div>
  );
}

export function HistorialMemento({ historial, onRestaurar, onEliminar, onLimpiar, ultimaRestauracion }) {
  return (
    <div className="historial">

      {/* Header */}
      <div className="historial__head">
        <PatternBadge tipo="memento" />
        <h2 className="historial__titulo">Historial de Estados</h2>
        <p className="historial__desc">
          Snapshots guardados por el <strong>Caretaker</strong>. El <strong>Originator</strong> reconstruye el estado al restaurar.
        </p>

        {historial.length > 0 && (
          <div className="historial__meta">
            <span className="historial__count">
              💾 {historial.length} snapshot{historial.length !== 1 ? 's' : ''}
            </span>
            <button className="btn-limpiar" onClick={onLimpiar}>
              🗑️ Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Lista */}
      {historial.length === 0 ? (
        <div className="historial__vacio">
          <div className="historial__vacio-icono">📭</div>
          <p className="historial__vacio-texto">Sin snapshots guardados</p>
          <p className="historial__vacio-sub">
            Usa el botón "Guardar Snapshot" en el panel de configuración.
          </p>
        </div>
      ) : (
        <div className="historial__lista">
          {historial.map((m, i) => (
            <SnapshotCard
              key={m.getId()}
              memento={m}
              esReciente={i === 0}
              enRestauracion={m.getId() === ultimaRestauracion}
              onRestaurar={onRestaurar}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}

    </div>
  );
}
