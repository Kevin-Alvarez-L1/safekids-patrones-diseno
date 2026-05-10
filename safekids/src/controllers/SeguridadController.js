// =============================================================
// PATRÓN MVC — CONTROLLER
// SeguridadController.js
//
// Responsabilidad: Coordinar el flujo entre la Vista y el Modelo.
//
// El Controlador:
//  - Instancia el Originator, Caretaker y Facade (una sola vez)
//  - Expone acciones que la Vista puede llamar
//  - Mantiene el estado reactivo de React sincronizado con el Modelo
//  - No contiene lógica de negocio (esa vive en el Facade/Modelo)
//
// Implementado como un React Hook personalizado (useSeguridadController)
// para integrarse naturalmente con el ciclo de vida de React.
// =============================================================

import { useState, useCallback, useRef } from 'react';

// Modelos (M del MVC)
import { Configuracion }         from '../models/Configuracion.js';
import { Originator }            from '../models/Originator.js';
import { Caretaker }             from '../models/Caretaker.js';

// Factory (creacional)
import { ConfiguracionFactory }  from '../factories/ConfiguracionFactory.js';

// Facade (estructural)
import { SistemaSeguridadFacade } from '../facade/SistemaSeguridadFacade.js';

/**
 * Hook principal del Controlador.
 *
 * Uso en la Vista:
 *   const ctrl = useSeguridadController();
 *   ctrl.aplicarPerfil('infantil');
 *   ctrl.toggleABS(true);
 *   ctrl.guardarEstado('Mi perfil personalizado');
 */
export function useSeguridadController() {

  // ── Inicialización única (useRef evita recrear en cada render) ────────────

  const originatorRef = useRef(null);
  const caretakerRef  = useRef(null);
  const facadeRef     = useRef(null);

  if (!originatorRef.current) {
    const configInicial = new Configuracion();          // Modelo inicial
    originatorRef.current = new Originator(configInicial);
    caretakerRef.current  = new Caretaker(20);
    facadeRef.current     = new SistemaSeguridadFacade(
      originatorRef.current,
      caretakerRef.current
    );
  }

  const facade    = facadeRef.current;
  const caretaker = caretakerRef.current;

  // ── Estado Reactivo de React ──────────────────────────────────────────────
  // Estos estados sincronizan el Modelo con el árbol de componentes React

  const [estado, setEstado] = useState(() => facade.getEstadoActual());
  const [historial, setHistorial] = useState([]);
  const [perfilActivo, setPerfilActivo] = useState(null);

  // ── Helpers de sincronización ──────────────────────────────────────────────

  /** Sincroniza el estado de React con el estado del Originator */
  const sincronizarEstado = useCallback(() => {
    setEstado({ ...facade.getEstadoActual() });
  }, [facade]);

  /** Sincroniza el historial de React con el Caretaker */
  const sincronizarHistorial = useCallback(() => {
    setHistorial(caretaker.obtenerTodos());
  }, [caretaker]);

  // ── Acciones del Controlador ──────────────────────────────────────────────
  // La Vista SOLO llama a estas funciones, nunca al Modelo/Facade directamente

  /**
   * Aplica un perfil predefinido usando la Factory y la Facade.
   * Flujo: Vista → Controlador → Factory → Facade → Originator → Estado React
   *
   * @param {'infantil'|'adolescente'|'emergencia'|'manual'} tipo
   */
  const aplicarPerfil = useCallback((tipo) => {
    // 1. Factory Method crea la configuración correcta
    const config = ConfiguracionFactory.crear(tipo);
    // 2. Facade aplica la configuración a los subsistemas
    facade.aplicarConfiguracion(config);
    // 3. Sincronizar React
    setPerfilActivo(tipo);
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /**
   * Activa seguridad total (acceso directo al método de la Facade)
   */
  const activarSeguridadTotal = useCallback(() => {
    facade.activarSeguridadTotal();
    setPerfilActivo('seguridadTotal');
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /** Toggle individual del ABS */
  const toggleABS = useCallback((valor) => {
    facade.toggleABS(valor);
    setPerfilActivo('manual');
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /** Toggle individual de cinturones */
  const toggleCinturones = useCallback((valor) => {
    facade.toggleCinturones(valor);
    setPerfilActivo('manual');
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /** Toggle individual de sensores */
  const toggleSensores = useCallback((valor) => {
    facade.toggleSensores(valor);
    setPerfilActivo('manual');
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /** Toggle individual del bloqueo infantil */
  const toggleBloqueoInfantil = useCallback((valor) => {
    facade.toggleBloqueoInfantil(valor);
    setPerfilActivo('manual');
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  /** Cambia el límite de velocidad */
  const setVelocidad = useCallback((valor) => {
    facade.setVelocidad(valor);
    sincronizarEstado();
  }, [facade, sincronizarEstado]);

  // ── Acciones Memento ──────────────────────────────────────────────────────

  /**
   * Guarda el estado actual en el historial.
   * Flujo: Vista → Controlador → Facade → Originator.guardar() → Caretaker
   *
   * @param {string} [nombre] - Etiqueta para el snapshot
   */
  const guardarEstado = useCallback((nombre) => {
    const etiqueta = nombre || estado.nombrePerfil;
    facade.guardarConfiguracion(etiqueta);
    sincronizarHistorial();
  }, [facade, estado.nombrePerfil, sincronizarHistorial]);

  /**
   * Restaura un estado guardado del historial.
   * Flujo: Vista → Controlador → Facade → Caretaker → Originator.restaurar()
   *
   * @param {string} id - ID del snapshot
   * @returns {boolean}
   */
  const restaurarEstado = useCallback((id) => {
    const ok = facade.restaurarConfiguracion(id);
    if (ok) {
      setPerfilActivo(null);
      sincronizarEstado();
    }
    return ok;
  }, [facade, sincronizarEstado]);

  /**
   * Elimina un snapshot individual del historial
   * @param {string} id
   */
  const eliminarSnapshot = useCallback((id) => {
    caretaker.eliminar(id);
    sincronizarHistorial();
  }, [caretaker, sincronizarHistorial]);

  /**
   * Limpia todo el historial
   */
  const limpiarHistorial = useCallback(() => {
    caretaker.limpiar();
    sincronizarHistorial();
  }, [caretaker, sincronizarHistorial]);

  // ── Retorno del Controlador ───────────────────────────────────────────────

  return {
    // Estado actual del vehículo (para EstadoVehiculo y PanelSeguridad)
    estado,
    perfilActivo,

    // Historial de snapshots (para HistorialMemento)
    historial,

    // Acciones de perfil (Factory + Facade)
    aplicarPerfil,
    activarSeguridadTotal,

    // Acciones de controles manuales (Facade)
    toggleABS,
    toggleCinturones,
    toggleSensores,
    toggleBloqueoInfantil,
    setVelocidad,

    // Acciones Memento
    guardarEstado,
    restaurarEstado,
    eliminarSnapshot,
    limpiarHistorial,

    // Metadata útil para la UI
    limitesVelocidad: facade.getLimitesVelocidad(),
    perfiles: ConfiguracionFactory.obtenerPerfiles(),
  };
}
