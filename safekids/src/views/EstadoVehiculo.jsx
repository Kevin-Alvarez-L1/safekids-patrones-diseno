// =============================================================
// PATRÓN MVC — VIEW
// EstadoVehiculo.jsx
//
// Vista que muestra el estado actual del vehículo en tiempo real.
// Recibe datos del Controlador via props, nunca accede al Modelo.
// =============================================================

import React from 'react';

/**
 * Indicador individual de un sistema de seguridad
 */
function Indicador({ etiqueta, activo, icono, descripcion }) {
  return (
    <div className={`indicador ${activo ? 'indicador--activo' : 'indicador--inactivo'}`}>
      <div className="indicador__icono">{icono}</div>
      <div className="indicador__info">
        <span className="indicador__etiqueta">{etiqueta}</span>
        <span className="indicador__desc">{descripcion || (activo ? 'Activado' : 'Desactivado')}</span>
      </div>
      <div className={`indicador__estado ${activo ? 'estado--on' : 'estado--off'}`}>
        {activo ? 'ON' : 'OFF'}
      </div>
    </div>
  );
}

/**
 * EstadoVehiculo — Vista de solo lectura del estado de seguridad.
 *
 * @param {Object}  props
 * @param {Object}  props.estado        - Estado actual del vehículo
 * @param {string}  props.perfilActivo  - Perfil seleccionado actualmente
 */
export function EstadoVehiculo({ estado, perfilActivo }) {
  // Calcular nivel de seguridad (0-4 sistemas activos)
  const sistemasActivos = [estado.abs, estado.cinturones, estado.sensores, estado.bloqueoInfantil]
    .filter(Boolean).length;

  const nivelSeguridad = Math.round((sistemasActivos / 4) * 100);

  const colorNivel =
    nivelSeguridad >= 75 ? 'nivel--alto'   :
    nivelSeguridad >= 50 ? 'nivel--medio'  :
    nivelSeguridad >= 25 ? 'nivel--bajo'   : 'nivel--nulo';

  return (
    <div className="estado-vehiculo">

      {/* Cabecera con perfil y nivel */}
      <div className="estado-vehiculo__header">
        <div className="estado-vehiculo__perfil">
          <span className="estado-vehiculo__perfil-label">Perfil activo</span>
          <span className="estado-vehiculo__perfil-nombre">{estado.nombrePerfil}</span>
        </div>
        <div className={`nivel-seguridad ${colorNivel}`}>
          <span className="nivel-seguridad__num">{nivelSeguridad}%</span>
          <span className="nivel-seguridad__label">Seguridad</span>
        </div>
      </div>

      {/* Velocímetro visual */}
      <div className="velocimetro">
        <div className="velocimetro__valor">{estado.velocidad}</div>
        <div className="velocimetro__unidad">km/h máx.</div>
        <div className="velocimetro__barra-wrap">
          <div
            className="velocimetro__barra"
            style={{ width: `${(estado.velocidad / 200) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid de indicadores de sistemas */}
      <div className="indicadores-grid">
        <Indicador
          etiqueta="ABS"
          activo={estado.abs}
          icono="🛞"
          descripcion={estado.abs ? 'Frenos antibloqueo ON' : 'Sin ABS'}
        />
        <Indicador
          etiqueta="Cinturones"
          activo={estado.cinturones}
          icono="🔒"
          descripcion={estado.cinturones ? 'Obligatorio' : 'Libre'}
        />
        <Indicador
          etiqueta="Sensores"
          activo={estado.sensores}
          icono="📡"
          descripcion={estado.sensores ? 'Proximidad ON' : 'Sin sensores'}
        />
        <Indicador
          etiqueta="Bloqueo Infantil"
          activo={estado.bloqueoInfantil}
          icono="🚗"
          descripcion={estado.bloqueoInfantil ? 'Puertas bloqueadas' : 'Puertas libres'}
        />
      </div>

      {/* Resumen compacto */}
      <div className="resumen-seguridad">
        <span className="resumen-seguridad__label">Sistemas activos:</span>
        <span className="resumen-seguridad__valor">
          {sistemasActivos} de 4
        </span>
      </div>

    </div>
  );
}
