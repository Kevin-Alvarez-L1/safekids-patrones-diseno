// =============================================================
// PATRÓN MVC — VIEW + Factory Method + Facade + Memento
// views/PanelSeguridad.jsx
// =============================================================

import React, { useState } from 'react';
import { Toggle, SectionCard } from '../components/UIComponents.jsx';

function PerfilBtn({ perfil, activo, onClick }) {
  return (
    <button
      className={`perfil-card perfil-card--${perfil.color} ${activo ? 'perfil-card--activo' : ''}`}
      onClick={() => onClick(perfil.tipo)}
      style={activo ? { borderColor: perfil.accentColor, background: perfil.bgColor } : {}}
    >
      <span className="perfil-card__icono">{perfil.icono}</span>
      <div className="perfil-card__info">
        <span className="perfil-card__nombre">{perfil.etiqueta}</span>
        <span className="perfil-card__desc">{perfil.descripcion}</span>
      </div>
      {activo && (
        <span className="perfil-card__check" style={{ color: perfil.accentColor }}>✓</span>
      )}
    </button>
  );
}

export function PanelSeguridad({
  estado, perfilActivo, perfiles, limitesVelocidad,
  onAplicarPerfil, onActivarSeguridadTotal,
  onToggleABS, onToggleCinturones, onToggleSensores, onToggleBloqueo,
  onSetVelocidad, onGuardarEstado,
}) {
  const [nombreSnap, setNombreSnap] = useState('');

  const handleGuardar = () => {
    const nombre = nombreSnap.trim() || estado.nombrePerfil;
    onGuardarEstado(nombre);
    setNombreSnap('');
  };

  return (
    <div className="panel-seguridad">

      {/* ── Perfiles rápidos — Factory Method ─────────────── */}
      <SectionCard
        patron="factory"
        titulo="Perfiles de Seguridad"
        descripcion="Cada botón invoca la fábrica correspondiente para crear la configuración automáticamente."
      >
        <div className="perfiles-grid">
          {perfiles.map(p => (
            <PerfilBtn key={p.tipo} perfil={p} activo={perfilActivo === p.tipo} onClick={onAplicarPerfil} />
          ))}
        </div>
        <button
          className={`btn-total ${perfilActivo === 'seguridadTotal' ? 'btn-total--activo' : ''}`}
          onClick={onActivarSeguridadTotal}
        >
          🔴 Seguridad Total — 30 km/h · Todos los sistemas activos
        </button>
      </SectionCard>

      {/* ── Controles manuales — Facade ────────────────────── */}
      <SectionCard
        patron="facade"
        titulo="Configuración Manual"
        descripcion="Los toggles pasan por la Fachada — la UI nunca accede a los subsistemas directamente."
      >
        <div className="toggles-lista">
          <Toggle icono="🛞" etiqueta="Sistema ABS"             descripcion="Frenos antibloqueo"   activo={estado.abs}            onChange={onToggleABS} />
          <Toggle icono="🔒" etiqueta="Cinturones obligatorios" descripcion="Bloqueo de seguridad" activo={estado.cinturones}     onChange={onToggleCinturones} />
          <Toggle icono="📡" etiqueta="Sensores de proximidad"  descripcion="Detección de objetos" activo={estado.sensores}       onChange={onToggleSensores} />
          <Toggle icono="🚗" etiqueta="Bloqueo infantil"        descripcion="Puertas traseras"     activo={estado.bloqueoInfantil} onChange={onToggleBloqueo} />
        </div>

        <div className="vel-control">
          <div className="vel-control__row">
            <span className="vel-control__label">🏎️ Límite de velocidad</span>
            <span className="vel-control__val">{estado.velocidad} <small>km/h</small></span>
          </div>
          <input
            type="range" className="vel-slider"
            min={limitesVelocidad.min} max={limitesVelocidad.max}
            value={estado.velocidad}
            onChange={e => onSetVelocidad(Number(e.target.value))}
          />
          <div className="vel-control__rangos">
            <span>{limitesVelocidad.min} km/h</span>
            <span>{limitesVelocidad.max} km/h</span>
          </div>
        </div>
      </SectionCard>

      {/* ── Guardar estado — Memento ────────────────────────── */}
      <SectionCard
        patron="memento"
        titulo="Guardar Snapshot"
        descripcion="Crea un Memento con el estado actual. El Caretaker lo custodia para restaurarlo después."
      >
        <div className="guardar-row">
          <input
            className="guardar-input"
            placeholder={`Nombre del snapshot (ej: ${estado.nombrePerfil})`}
            value={nombreSnap}
            onChange={e => setNombreSnap(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuardar()}
            maxLength={40}
          />
          <button className="btn-guardar" onClick={handleGuardar}>
            💾 Guardar
          </button>
        </div>
      </SectionCard>

    </div>
  );
}
