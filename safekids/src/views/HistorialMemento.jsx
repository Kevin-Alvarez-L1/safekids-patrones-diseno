// =============================================================
// PATRÓN MVC — VIEW
// HistorialMemento.jsx
//
// Vista del historial de snapshots guardados (Patrón Memento).
// Muestra la lista de Mementos custodiada por el Caretaker.
// Permite restaurar o eliminar cada snapshot.
//
// La Vista solo conoce los datos que el Controlador le pasa.
// =============================================================

import React from 'react';

/**
 * Formatea una fecha como "HH:MM:SS"
 */
function formatHora(date) {
  return date.toLocaleTimeString('es-MX', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Elemento individual de snapshot en el historial
 */
function SnapshotItem({ memento, esReciente, onRestaurar, onEliminar }) {
  const estado = memento.getEstado();

  // Indicadores visuales de los sistemas del snapshot
  const sistemas = [
    { key: 'abs',             label: 'ABS',    valor: estado.abs             },
    { key: 'cinturones',      label: 'Cin.',   valor: estado.cinturones      },
    { key: 'sensores',        label: 'Sen.',   valor: estado.sensores        },
    { key: 'bloqueoInfantil', label: 'Blq.',   valor: estado.bloqueoInfantil },
  ];

  return (
    <div className={`snapshot-item ${esReciente ? 'snapshot-item--reciente' : ''}`}>

      <div className="snapshot-item__top">
        {/* Número y nombre */}
        <div className="snapshot-item__id">
          <span className="snapshot-item__num">#{memento.getNumero()}</span>
          {esReciente && <span className="snapshot-item__nuevo-badge">Último</span>}
        </div>

        <div className="snapshot-item__nombre">{memento.getNombre()}</div>

        {/* Hora */}
        <div className="snapshot-item__hora">
          🕐 {formatHora(memento.getTimestamp())}
        </div>
      </div>

      {/* Velocidad */}
      <div className="snapshot-item__velocidad">
        🏎️ {estado.velocidad} km/h
      </div>

      {/* Indicadores de sistemas */}
      <div className="snapshot-item__sistemas">
        {sistemas.map(s => (
          <span
            key={s.key}
            className={`sistema-chip ${s.valor ? 'sistema-chip--on' : 'sistema-chip--off'}`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Descripción completa */}
      <div className="snapshot-item__desc">{memento.describir()}</div>

      {/* Acciones */}
      <div className="snapshot-item__acciones">
        <button
          className="btn-restaurar"
          onClick={() => onRestaurar(memento.getId())}
          title="Restaurar este estado"
        >
          ↩️ Restaurar
        </button>
        <button
          className="btn-eliminar-snap"
          onClick={() => onEliminar(memento.getId())}
          title="Eliminar este snapshot"
        >
          🗑️
        </button>
      </div>

    </div>
  );
}

/**
 * HistorialMemento — Vista completa del historial de snapshots.
 *
 * @param {Object}   props
 * @param {Array}    props.historial      - Lista de Mementos del Caretaker
 * @param {Function} props.onRestaurar    - Llamada al Controlador
 * @param {Function} props.onEliminar     - Llamada al Controlador
 * @param {Function} props.onLimpiar      - Llamada al Controlador
 */
export function HistorialMemento({ historial, onRestaurar, onEliminar, onLimpiar }) {
  return (
    <div className="historial-memento">

      <div className="historial-memento__header">
        <div className="historial-memento__titulo-row">
          <span className="panel-section__badge badge--memento">Memento</span>
          <h2 className="panel-section__titulo">Historial de Estados</h2>
        </div>
        <p className="panel-section__desc">
          Snapshots guardados por el Caretaker. Puedes restaurar cualquier estado anterior.
        </p>
        {historial.length > 0 && (
          <div className="historial-memento__meta">
            <span className="historial-count">{historial.length} snapshot{historial.length !== 1 ? 's' : ''}</span>
            <button className="btn-limpiar" onClick={onLimpiar}>
              🗑️ Limpiar historial
            </button>
          </div>
        )}
      </div>

      {historial.length === 0 ? (
        <div className="historial-vacio">
          <div className="historial-vacio__icono">📭</div>
          <p className="historial-vacio__texto">No hay estados guardados.</p>
          <p className="historial-vacio__sub">
            Usa el botón "Guardar" en el panel de configuración para crear un snapshot.
          </p>
        </div>
      ) : (
        <div className="historial-lista">
          {historial.map((memento, idx) => (
            <SnapshotItem
              key={memento.getId()}
              memento={memento}
              esReciente={idx === 0}
              onRestaurar={onRestaurar}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
