// =============================================================
// PATRÓN MVC — ENTRY POINT
// App.jsx
//
// Punto de entrada de la aplicación.
// Responsabilidades de App.jsx:
//  1. Instanciar el Controlador (useSeguridadController)
//  2. Distribuir datos y acciones a las Vistas
//  3. Manejar el Toast de notificaciones
//
// App.jsx NO contiene lógica de negocio.
// Solo conecta el Controlador con las Vistas.
// =============================================================

import React, { useState, useCallback } from 'react';

// ── Controlador (MVC) ────────────────────────────────────────
import { useSeguridadController } from './controllers/SeguridadController.js';

// ── Vistas (MVC) ────────────────────────────────────────────
import { PanelSeguridad }   from './views/PanelSeguridad.jsx';
import { EstadoVehiculo }   from './views/EstadoVehiculo.jsx';
import { HistorialMemento } from './views/HistorialMemento.jsx';

// ─────────────────────────────────────────────────────────────
// Componente Toast (feedback visual para el usuario)
// ─────────────────────────────────────────────────────────────
function Toast({ mensaje }) {
  if (!mensaje) return null;
  return <div className="toast">{mensaje}</div>;
}

// Hook para manejar el toast
function useToast() {
  const [mensaje, setMensaje] = useState(null);
  const mostrar = useCallback((msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(null), 2400);
  }, []);
  return { mensaje, mostrar };
}

// ─────────────────────────────────────────────────────────────
// App — Raíz de la aplicación
// ─────────────────────────────────────────────────────────────
export default function App() {
  // 1. Instancia el Controlador
  const ctrl = useSeguridadController();

  // 2. Sistema de notificaciones
  const { mensaje: toast, mostrar: showToast } = useToast();

  // ── Handlers que envuelven las acciones del Controlador ────
  // Aquí se agrega el toast sin ensuciar el Controlador

  const handleAplicarPerfil = (tipo) => {
    ctrl.aplicarPerfil(tipo);
    const p = ctrl.perfiles.find(p => p.tipo === tipo);
    showToast(`${p?.icono} ${p?.etiqueta} activado`);
  };

  const handleSeguridadTotal = () => {
    ctrl.activarSeguridadTotal();
    showToast('🔴 Seguridad Total activada — 30 km/h · Todos los sistemas ON');
  };

  const handleGuardarEstado = (nombre) => {
    ctrl.guardarEstado(nombre);
    showToast(`💾 Estado guardado: "${nombre}"`);
  };

  const handleRestaurarEstado = (id) => {
    const ok = ctrl.restaurarEstado(id);
    if (ok) showToast('↩️ Estado restaurado exitosamente');
  };

  const handleEliminarSnapshot = (id) => {
    ctrl.eliminarSnapshot(id);
    showToast('🗑️ Snapshot eliminado');
  };

  const handleLimpiarHistorial = () => {
    ctrl.limpiarHistorial();
    showToast('🗑️ Historial limpiado');
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="app-layout">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">🛡️</div>
          <div>
            <div className="app-header__titulo">SafeKids</div>
            <div className="app-header__subtitulo">
              Sistema Inteligente de Seguridad Vehicular
            </div>
          </div>
        </div>
        <div className="app-header__tags">
          <span className="header-tag header-tag--factory">Factory Method</span>
          <span className="header-tag header-tag--facade">Facade</span>
          <span className="header-tag header-tag--memento">Memento</span>
          <span className="header-tag header-tag--mvc">MVC</span>
        </div>
      </header>

      {/* ── Diagrama de flujo de patrones ────────────────── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '16px 24px 0' }}>
        <div className="diagrama-patrones">
          <div className="diagrama-patrones__titulo">Flujo de patrones de diseño</div>
          <div className="diagrama-flujo">
            <span className="flujo-paso flujo-paso--mvc">Vista (React)</span>
            <span className="flujo-flecha">→</span>
            <span className="flujo-paso flujo-paso--mvc">Controlador (MVC)</span>
            <span className="flujo-flecha">→</span>
            <span className="flujo-paso flujo-paso--factory">Factory Method</span>
            <span className="flujo-flecha">→</span>
            <span className="flujo-paso flujo-paso--facade">Facade</span>
            <span className="flujo-flecha">→</span>
            <span className="flujo-paso">Subsistemas</span>
            <span className="flujo-flecha">+</span>
            <span className="flujo-paso flujo-paso--memento">Memento (Originator)</span>
            <span className="flujo-flecha">→</span>
            <span className="flujo-paso flujo-paso--memento">Caretaker</span>
          </div>
        </div>
      </div>

      {/* ── Contenido principal ───────────────────────────── */}
      <main className="app-main">
        <div className="app-grid">

          {/* Columna 1: Panel de configuración (Factory + Facade + Memento) */}
          <div className="col-panel">
            <PanelSeguridad
              estado={ctrl.estado}
              perfilActivo={ctrl.perfilActivo}
              perfiles={ctrl.perfiles}
              limitesVelocidad={ctrl.limitesVelocidad}
              onAplicarPerfil={handleAplicarPerfil}
              onActivarSeguridadTotal={handleSeguridadTotal}
              onToggleABS={ctrl.toggleABS}
              onToggleCinturones={ctrl.toggleCinturones}
              onToggleSensores={ctrl.toggleSensores}
              onToggleBloqueo={ctrl.toggleBloqueoInfantil}
              onSetVelocidad={ctrl.setVelocidad}
              onGuardarEstado={handleGuardarEstado}
            />
          </div>

          {/* Columna 2: Estado actual del vehículo */}
          <div className="col-estado">
            <EstadoVehiculo
              estado={ctrl.estado}
              perfilActivo={ctrl.perfilActivo}
            />
          </div>

          {/* Columna 3: Historial Memento (sticky, toda la altura) */}
          <div className="col-historial">
            <HistorialMemento
              historial={ctrl.historial}
              onRestaurar={handleRestaurarEstado}
              onEliminar={handleEliminarSnapshot}
              onLimpiar={handleLimpiarHistorial}
            />
          </div>

        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="app-footer">
        <span>SafeKids · Patrones de Diseño: Factory Method · Facade · Memento · MVC</span>
        <span>React + JavaScript ES6 · Vite</span>
      </footer>

      {/* ── Toast de notificaciones ───────────────────────── */}
      <Toast mensaje={toast} />

    </div>
  );
}
