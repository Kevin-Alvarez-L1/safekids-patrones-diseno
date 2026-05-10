// =============================================================
// PATRÓN MVC — CONTROLLER
// controllers/SeguridadController.js
//
// Coordina el flujo Vista ↔ Modelo.
// Instancia el Originator, Caretaker y Facade (una sola vez).
// Restaura estado persistido desde localStorage al iniciar.
// Expone acciones para las Vistas via hook personalizado.
// =============================================================

import { useState, useCallback, useRef } from 'react';

import { Configuracion }          from '../models/Configuracion.js';
import { Originator }             from '../models/Originator.js';
import { Caretaker }              from '../models/Caretaker.js';
import { ConfiguracionFactory }   from '../factories/ConfiguracionFactory.js';
import { SistemaSeguridadFacade } from '../facade/SistemaSeguridadFacade.js';
import { PersistenciaService }    from '../services/PersistenciaService.js';

export function useSeguridadController() {

  // ── Inicialización única ──────────────────────────────────────

  const originatorRef = useRef(null);
  const caretakerRef  = useRef(null);
  const facadeRef     = useRef(null);

  if (!originatorRef.current) {
    // 1. Carga configuración persistida (o usa la por defecto)
    const configGuardada = PersistenciaService.cargarConfig();
    const configInicial  = configGuardada
      ? new Configuracion(configGuardada)
      : new Configuracion();

    originatorRef.current = new Originator(configInicial);
    caretakerRef.current  = new Caretaker(30);
    facadeRef.current     = new SistemaSeguridadFacade(
      originatorRef.current,
      caretakerRef.current
    );

    // 2. Reconstruye el historial Memento desde localStorage
    const historialJSON = PersistenciaService.cargarHistorial();
    if (historialJSON.length > 0) {
      caretakerRef.current.importarDesdeJSON(historialJSON);
    }
  }

  const facade    = facadeRef.current;
  const caretaker = caretakerRef.current;

  // ── Estado Reactivo ────────────────────────────────────────────

  const [estado, setEstado]         = useState(() => facade.getEstadoActual());
  const [historial, setHistorial]   = useState(() => caretaker.obtenerTodos());
  const [perfilActivo, setPerfilActivo] = useState(
    () => PersistenciaService.cargarPerfil()
  );
  const [ultimaRestauracion, setUltimaRestauracion] = useState(null);

  const sync = useCallback(() => {
    setEstado({ ...facade.getEstadoActual() });
    setHistorial(caretaker.obtenerTodos());
  }, [facade, caretaker]);

  // ── Acciones del Controlador ───────────────────────────────────

  const aplicarPerfil = useCallback((tipo) => {
    const config = ConfiguracionFactory.crear(tipo);
    facade.aplicarConfiguracion(config);
    PersistenciaService.guardarPerfil(tipo);
    setPerfilActivo(tipo);
    sync();
  }, [facade, sync]);

  const activarSeguridadTotal = useCallback(() => {
    facade.activarSeguridadTotal();
    PersistenciaService.guardarPerfil('seguridadTotal');
    setPerfilActivo('seguridadTotal');
    sync();
  }, [facade, sync]);

  const toggleABS              = useCallback((v) => { facade.toggleABS(v);              setPerfilActivo('manual'); sync(); }, [facade, sync]);
  const toggleCinturones       = useCallback((v) => { facade.toggleCinturones(v);       setPerfilActivo('manual'); sync(); }, [facade, sync]);
  const toggleSensores         = useCallback((v) => { facade.toggleSensores(v);         setPerfilActivo('manual'); sync(); }, [facade, sync]);
  const toggleBloqueoInfantil  = useCallback((v) => { facade.toggleBloqueoInfantil(v);  setPerfilActivo('manual'); sync(); }, [facade, sync]);
  const setVelocidad           = useCallback((v) => { facade.setVelocidad(v);           sync(); }, [facade, sync]);

  // ── Acciones Memento ────────────────────────────────────────────

  const guardarEstado = useCallback((nombre) => {
    facade.guardarConfiguracion(nombre || estado.nombrePerfil);
    setHistorial(caretaker.obtenerTodos());
  }, [facade, caretaker, estado.nombrePerfil]);

  const restaurarEstado = useCallback((id) => {
    const ok = facade.restaurarConfiguracion(id);
    if (ok) {
      setPerfilActivo(null);
      setUltimaRestauracion(id);
      sync();
    }
    return ok;
  }, [facade, sync]);

  const eliminarSnapshot = useCallback((id) => {
    caretaker.eliminar(id);
    PersistenciaService.guardarHistorial(caretaker.exportarJSON());
    setHistorial(caretaker.obtenerTodos());
  }, [caretaker]);

  const limpiarHistorial = useCallback(() => {
    caretaker.limpiar();
    PersistenciaService.guardarHistorial([]);
    setHistorial([]);
  }, [caretaker]);

  const resetTotal = useCallback(() => {
    PersistenciaService.limpiarTodo();
    caretaker.limpiar();
    const cfg = new Configuracion();
    facade._originator.setConfig(cfg);
    setPerfilActivo(null);
    sync();
  }, [facade, caretaker, sync]);

  return {
    estado,
    historial,
    perfilActivo,
    ultimaRestauracion,
    aplicarPerfil,
    activarSeguridadTotal,
    toggleABS,
    toggleCinturones,
    toggleSensores,
    toggleBloqueoInfantil,
    setVelocidad,
    guardarEstado,
    restaurarEstado,
    eliminarSnapshot,
    limpiarHistorial,
    resetTotal,
    limitesVelocidad: facade.getLimitesVelocidad(),
    perfiles: ConfiguracionFactory.obtenerPerfiles(),
  };
}
