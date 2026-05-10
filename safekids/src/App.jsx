// =============================================================
// PATRÓN MVC — ROOT
// App.jsx
//
// Conecta el Controlador con las Vistas.
// No contiene lógica de negocio.
// Gestiona el sistema de notificaciones (Toast).
// =============================================================

import React, { useState, useCallback } from 'react';
import { useSeguridadController } from './controllers/SeguridadController.js';
import { PanelSeguridad }         from './views/PanelSeguridad.jsx';
import { EstadoVehiculo }         from './views/EstadoVehiculo.jsx';
import { HistorialMemento }       from './views/HistorialMemento.jsx';

// ── Sistema de Notificaciones ─────────────────────────────────

function Toast({ items }) {
  return (
    <div className="toast-portal">
      {items.map(t => (
        <div key={t.id} className={`toast toast--${t.tipo}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [items, setItems] = useState([]);
  const show = useCallback((msg, tipo = 'info') => {
    const id = Date.now();
    setItems(p => [...p, { id, msg, tipo }]);
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 2800);
  }, []);
  return { items, show };
}

// ── Diagrama de flujo de patrones ────────────────────────────

function DiagramaFlujo() {
  const pasos = [
    { label: 'Vista', sub: 'React Components', cls: 'flujo-mvc' },
    { label: '→' },
    { label: 'Controller', sub: 'useSeguridadController', cls: 'flujo-mvc' },
    { label: '→' },
    { label: 'Factory', sub: 'ConfiguracionFactory', cls: 'flujo-factory' },
    { label: '+' },
    { label: 'Facade', sub: 'SistemaSeguridadFacade', cls: 'flujo-facade' },
    { label: '→' },
    { label: 'Subsistemas', sub: 'ABS · Cinturones · Sensores', cls: 'flujo-sub' },
    { label: '+' },
    { label: 'Memento', sub: 'Originator ↔ Caretaker', cls: 'flujo-memento' },
  ];

  return (
    <div className="diagrama">
      <span className="diagrama__label">Flujo de patrones:</span>
      {pasos.map((p, i) => (
        p.label === '→' || p.label === '+' ? (
          <span key={i} className="diagrama__arrow">{p.label}</span>
        ) : (
          <div key={i} className={`diagrama__paso ${p.cls || ''}`}>
            <span className="diagrama__paso-label">{p.label}</span>
            {p.sub && <span className="diagrama__paso-sub">{p.sub}</span>}
          </div>
        )
      ))}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────

export default function App() {
  const ctrl  = useSeguridadController();
  const toast = useToast();

  const handleAplicarPerfil = (tipo) => {
    ctrl.aplicarPerfil(tipo);
    const p = ctrl.perfiles.find(x => x.tipo === tipo);
    toast.show(`${p?.icono} ${p?.etiqueta} activado`, 'success');
  };

  const handleSeguridadTotal = () => {
    ctrl.activarSeguridadTotal();
    toast.show('🔴 Seguridad Total activada', 'danger');
  };

  const handleGuardar = (nombre) => {
    ctrl.guardarEstado(nombre);
    toast.show(`💾 Snapshot guardado: "${nombre}"`, 'success');
  };

  const handleRestaurar = (id) => {
    const ok = ctrl.restaurarEstado(id);
    if (ok) toast.show('↩️ Estado restaurado exitosamente', 'info');
  };

  const handleEliminar = (id) => {
    ctrl.eliminarSnapshot(id);
    toast.show('🗑️ Snapshot eliminado', 'warning');
  };

  const handleLimpiar = () => {
    ctrl.limpiarHistorial();
    toast.show('🗑️ Historial limpiado', 'warning');
  };

  const handleReset = () => {
    ctrl.resetTotal();
    toast.show('♻️ Sistema reiniciado', 'info');
  };

  return (
    <div className="app">

      {/* ── Header ───────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">🛡️</div>
          <div className="app-header__titles">
            <span className="app-header__name">SafeKids</span>
            <span className="app-header__sub">Sistema Inteligente de Seguridad Vehicular</span>
          </div>
        </div>

        <div className="app-header__badges">
          <span className="header-badge badge-factory">Factory Method</span>
          <span className="header-badge badge-facade">Facade</span>
          <span className="header-badge badge-memento">Memento</span>
          <span className="header-badge badge-mvc">MVC</span>
        </div>

        <button className="btn-reset" onClick={handleReset} title="Reiniciar sistema">
          ♻️ Reset
        </button>
      </header>

      {/* ── Diagrama de patrones ──────────────────────── */}
      <div className="diagrama-bar">
        <DiagramaFlujo />
      </div>

      {/* ── Grid principal ────────────────────────────── */}
      <main className="app-main">
        <div className="app-grid">

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
              onGuardarEstado={handleGuardar}
            />
          </div>

          <div className="col-estado">
            <EstadoVehiculo
              estado={ctrl.estado}
              perfilActivo={ctrl.perfilActivo}
            />
          </div>

          <div className="col-historial">
            <HistorialMemento
              historial={ctrl.historial}
              ultimaRestauracion={ctrl.ultimaRestauracion}
              onRestaurar={handleRestaurar}
              onEliminar={handleEliminar}
              onLimpiar={handleLimpiar}
            />
          </div>

        </div>
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="app-footer">
        <span>SafeKids v2 · Factory Method · Facade · Memento · MVC</span>
        <span>Persistencia localStorage · React + JavaScript ES6 · Vite</span>
      </footer>

      {/* ── Notificaciones ────────────────────────────── */}
      <Toast items={toast.items} />

    </div>
  );
}
