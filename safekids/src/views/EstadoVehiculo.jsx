// =============================================================
// PATRÓN MVC — VIEW
// views/EstadoVehiculo.jsx
//
// Panel visual del vehículo. Se actualiza en tiempo real.
// Recibe props del Controller — no accede al Modelo.
// =============================================================

import React from 'react';
import { NivelBarra, SistemaChip, PatternBadge } from '../components/UIComponents.jsx';

function Indicador({ icono, label, activo, detalle }) {
  return (
    <div className={`ind-card ${activo ? 'ind-card--on' : 'ind-card--off'}`}>
      <div className="ind-card__top">
        <span className="ind-card__icono">{icono}</span>
        <span className={`ind-card__badge ${activo ? 'ind-badge--on' : 'ind-badge--off'}`}>
          {activo ? 'ON' : 'OFF'}
        </span>
      </div>
      <div className="ind-card__label">{label}</div>
      <div className="ind-card__detalle">{activo ? detalle.on : detalle.off}</div>
    </div>
  );
}

export function EstadoVehiculo({ estado, perfilActivo }) {
  const activos = [estado.abs, estado.cinturones, estado.sensores, estado.bloqueoInfantil].filter(Boolean).length;
  const nivel   = Math.round((activos / 4) * 100);

  const velPct  = ((estado.velocidad - 20) / (200 - 20)) * 100;
  const velColor = estado.velocidad <= 60 ? '#16a34a' : estado.velocidad <= 100 ? '#d97706' : '#dc2626';

  return (
    <div className="estado-vehiculo">

      {/* Cabecera */}
      <div className="estado-vehiculo__head">
        <div>
          <PatternBadge tipo="mvc" />
          <h2 className="ev-titulo">Estado del Vehículo</h2>
          <p className="ev-subtitulo">Actualización en tiempo real</p>
        </div>
        <div className="ev-perfil-chip">
          <span className="ev-perfil-icon">🛡️</span>
          <span className="ev-perfil-nombre">{estado.nombrePerfil}</span>
        </div>
      </div>

      {/* Velocímetro */}
      <div className="velocimetro">
        <div className="velocimetro__header">
          <span className="velocimetro__label">Velocidad máxima permitida</span>
        </div>
        <div className="velocimetro__display">
          <span className="velocimetro__valor" style={{ color: velColor }}>
            {estado.velocidad}
          </span>
          <span className="velocimetro__unidad">km/h</span>
        </div>
        <div className="velocimetro__track">
          <div
            className="velocimetro__fill"
            style={{ width: `${velPct}%`, background: velColor }}
          />
        </div>
        <div className="velocimetro__rangos">
          <span>20</span><span>60</span><span>100</span><span>140</span><span>200</span>
        </div>
      </div>

      {/* Nivel de seguridad */}
      <div className="nivel-wrap">
        <div className="nivel-row">
          <span className="nivel-label">Nivel de seguridad</span>
          <span className="nivel-chips">
            {activos} de 4 sistemas activos
          </span>
        </div>
        <NivelBarra porcentaje={nivel} />
      </div>

      {/* Grid de indicadores */}
      <div className="ind-grid">
        <Indicador
          icono="🛞" label="ABS" activo={estado.abs}
          detalle={{ on: 'Antibloqueo activo', off: 'Sistema inactivo' }}
        />
        <Indicador
          icono="🔒" label="Cinturones" activo={estado.cinturones}
          detalle={{ on: 'Uso obligatorio', off: 'Sin restricción' }}
        />
        <Indicador
          icono="📡" label="Sensores" activo={estado.sensores}
          detalle={{ on: 'Proximidad ON', off: 'Sin detección' }}
        />
        <Indicador
          icono="🚗" label="Bloqueo" activo={estado.bloqueoInfantil}
          detalle={{ on: 'Puertas bloqueadas', off: 'Puertas libres' }}
        />
      </div>

      {/* Chips resumen */}
      <div className="resumen-chips">
        <SistemaChip activo={estado.abs}            label="ABS" />
        <SistemaChip activo={estado.cinturones}     label="Cinturón" />
        <SistemaChip activo={estado.sensores}       label="Sensores" />
        <SistemaChip activo={estado.bloqueoInfantil} label="Bloqueo" />
      </div>

    </div>
  );
}
