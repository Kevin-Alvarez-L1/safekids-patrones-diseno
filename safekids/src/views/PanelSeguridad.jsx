// =============================================================
// PATRÓN MVC — VIEW
// PanelSeguridad.jsx
//
// Panel de control principal. Permite:
//   - Activar perfiles predefinidos (Factory Method via Controlador)
//   - Modificar configuraciones manualmente (Facade via Controlador)
//   - Guardar el estado actual (Memento via Controlador)
//
// La Vista NO conoce el Modelo ni la Facade.
// Solo llama a funciones del Controlador.
// =============================================================

import React, { useState } from 'react';

/**
 * Switch de palanca para controles booleanos
 */
function Toggle({ activo, onChange, disabled = false, etiqueta, icono }) {
  return (
    <div className={`toggle-control ${disabled ? 'toggle-control--disabled' : ''}`}>
      <div className="toggle-control__left">
        <span className="toggle-control__icono">{icono}</span>
        <span className="toggle-control__etiqueta">{etiqueta}</span>
      </div>
      <button
        className={`toggle-btn ${activo ? 'toggle-btn--on' : 'toggle-btn--off'}`}
        onClick={() => !disabled && onChange(!activo)}
        disabled={disabled}
        aria-label={`${etiqueta}: ${activo ? 'activado' : 'desactivado'}`}
      >
        <span className="toggle-btn__thumb" />
      </button>
    </div>
  );
}

/**
 * Botón de perfil rápido (Factory Method)
 */
function PerfilBtn({ perfil, activo, onClick }) {
  return (
    <button
      className={`perfil-btn perfil-btn--${perfil.color} ${activo ? 'perfil-btn--activo' : ''}`}
      onClick={() => onClick(perfil.tipo)}
      title={perfil.descripcion}
    >
      <span className="perfil-btn__icono">{perfil.icono}</span>
      <div className="perfil-btn__info">
        <span className="perfil-btn__nombre">{perfil.etiqueta}</span>
        <span className="perfil-btn__desc">{perfil.descripcion}</span>
      </div>
      {activo && <span className="perfil-btn__activo-badge">●</span>}
    </button>
  );
}

/**
 * PanelSeguridad — Vista principal de controles.
 *
 * @param {Object}   props
 * @param {Object}   props.estado              - Estado actual
 * @param {string}   props.perfilActivo        - Tipo de perfil activo
 * @param {Array}    props.perfiles            - Lista de perfiles disponibles
 * @param {Object}   props.limitesVelocidad    - { min, max }
 * @param {Function} props.onAplicarPerfil     - Llamada al Controlador
 * @param {Function} props.onActivarSeguridadTotal
 * @param {Function} props.onToggleABS
 * @param {Function} props.onToggleCinturones
 * @param {Function} props.onToggleSensores
 * @param {Function} props.onToggleBloqueo
 * @param {Function} props.onSetVelocidad
 * @param {Function} props.onGuardarEstado
 */
export function PanelSeguridad({
  estado,
  perfilActivo,
  perfiles,
  limitesVelocidad,
  onAplicarPerfil,
  onActivarSeguridadTotal,
  onToggleABS,
  onToggleCinturones,
  onToggleSensores,
  onToggleBloqueo,
  onSetVelocidad,
  onGuardarEstado,
}) {
  const [nombreGuardado, setNombreGuardado] = useState('');

  const handleGuardar = () => {
    onGuardarEstado(nombreGuardado.trim() || estado.nombrePerfil);
    setNombreGuardado('');
  };

  return (
    <div className="panel-seguridad">

      {/* ── Sección: Perfiles rápidos (Factory Method) ─────────────────── */}
      <section className="panel-section">
        <div className="panel-section__header">
          <span className="panel-section__badge badge--factory">Factory Method</span>
          <h2 className="panel-section__titulo">Perfiles de Seguridad</h2>
          <p className="panel-section__desc">
            Selecciona un perfil para aplicar configuraciones predefinidas automáticamente.
          </p>
        </div>

        <div className="perfiles-grid">
          {perfiles.map(perfil => (
            <PerfilBtn
              key={perfil.tipo}
              perfil={perfil}
              activo={perfilActivo === perfil.tipo}
              onClick={onAplicarPerfil}
            />
          ))}
        </div>

        {/* Botón especial de Seguridad Total */}
        <button
          className={`btn-seguridad-total ${perfilActivo === 'seguridadTotal' ? 'btn-seguridad-total--activo' : ''}`}
          onClick={onActivarSeguridadTotal}
        >
          🔴 Activar Seguridad Total — 30 km/h · Todos los sistemas ON
        </button>
      </section>

      {/* ── Sección: Controles manuales (Facade) ────────────────────────── */}
      <section className="panel-section">
        <div className="panel-section__header">
          <span className="panel-section__badge badge--facade">Facade</span>
          <h2 className="panel-section__titulo">Configuración Manual</h2>
          <p className="panel-section__desc">
            Ajusta cada sistema independientemente. La Fachada coordina los subsistemas.
          </p>
        </div>

        <div className="controles-lista">
          <Toggle
            icono="🛞"
            etiqueta="Sistema ABS"
            activo={estado.abs}
            onChange={onToggleABS}
          />
          <Toggle
            icono="🔒"
            etiqueta="Cinturones obligatorios"
            activo={estado.cinturones}
            onChange={onToggleCinturones}
          />
          <Toggle
            icono="📡"
            etiqueta="Sensores de proximidad"
            activo={estado.sensores}
            onChange={onToggleSensores}
          />
          <Toggle
            icono="🚗"
            etiqueta="Bloqueo infantil"
            activo={estado.bloqueoInfantil}
            onChange={onToggleBloqueo}
          />
        </div>

        {/* Slider de velocidad */}
        <div className="velocidad-control">
          <div className="velocidad-control__header">
            <span className="velocidad-control__etiqueta">🏎️ Límite de velocidad</span>
            <span className="velocidad-control__valor">{estado.velocidad} km/h</span>
          </div>
          <input
            type="range"
            className="velocidad-slider"
            min={limitesVelocidad.min}
            max={limitesVelocidad.max}
            value={estado.velocidad}
            onChange={(e) => onSetVelocidad(Number(e.target.value))}
          />
          <div className="velocidad-control__rangos">
            <span>{limitesVelocidad.min} km/h</span>
            <span>{limitesVelocidad.max} km/h</span>
          </div>
        </div>
      </section>

      {/* ── Sección: Guardar estado (Memento) ───────────────────────────── */}
      <section className="panel-section">
        <div className="panel-section__header">
          <span className="panel-section__badge badge--memento">Memento</span>
          <h2 className="panel-section__titulo">Guardar Estado</h2>
          <p className="panel-section__desc">
            Crea un snapshot del estado actual para restaurarlo después.
          </p>
        </div>

        <div className="guardar-row">
          <input
            type="text"
            className="guardar-input"
            placeholder={`Nombre del snapshot (ej: ${estado.nombrePerfil})`}
            value={nombreGuardado}
            onChange={(e) => setNombreGuardado(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuardar()}
            maxLength={40}
          />
          <button className="btn-guardar" onClick={handleGuardar}>
            💾 Guardar
          </button>
        </div>
      </section>

    </div>
  );
}
