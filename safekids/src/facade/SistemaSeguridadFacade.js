// =============================================================
// PATRÓN: Facade (Estructural)
// SistemaSeguridadFacade.js
//
// Propósito: Proveer una interfaz unificada y simplificada para
// acceder a un conjunto de subsistemas complejos de seguridad.
//
// La interfaz React NUNCA interactúa directamente con los
// subsistemas. Todo pasa por esta Fachada.
//
// Subsistemas internos:
//   - SistemaABS
//   - SistemaCinturones
//   - SistemaSensores
//   - SistemaVelocidad
//   - SistemaBloqueoInfantil
//
// La Fachada también coordina con el Originator y Caretaker
// para las operaciones del patrón Memento.
// =============================================================

import { Configuracion } from '../models/Configuracion.js';

// ── SUBSISTEMAS (lógica interna, oculta del exterior) ────────────────────────

/**
 * Subsistema ABS — Anti-lock Braking System
 * En un sistema real, aquí iría la comunicación con el hardware.
 */
class SistemaABS {
  activar()    { console.log('[ABS] Sistema ABS activado');    return true;  }
  desactivar() { console.log('[ABS] Sistema ABS desactivado'); return false; }
  validar(valor) {
    // Lógica de validación del subsistema
    return typeof valor === 'boolean' ? valor : false;
  }
}

/**
 * Subsistema Cinturones — Verificación y bloqueo de cinturones
 */
class SistemaCinturones {
  activar()    { console.log('[CINTURONES] Cinturones obligatorios ON');  return true;  }
  desactivar() { console.log('[CINTURONES] Cinturones obligatorios OFF'); return false; }
  validar(valor) {
    return typeof valor === 'boolean' ? valor : false;
  }
}

/**
 * Subsistema Sensores — Sensores de proximidad y cámaras
 */
class SistemaSensores {
  activar()    { console.log('[SENSORES] Sensores de proximidad ON');  return true;  }
  desactivar() { console.log('[SENSORES] Sensores de proximidad OFF'); return false; }
  calibrar()   { console.log('[SENSORES] Calibración completada'); }
  validar(valor) {
    return typeof valor === 'boolean' ? valor : false;
  }
}

/**
 * Subsistema Velocidad — Limitador de velocidad
 */
class SistemaVelocidad {
  static MIN = 20;
  static MAX = 200;

  establecer(valor) {
    const v = Math.round(Math.max(SistemaVelocidad.MIN, Math.min(SistemaVelocidad.MAX, Number(valor))));
    console.log(`[VELOCIDAD] Límite establecido a ${v} km/h`);
    return v;
  }
  get min() { return SistemaVelocidad.MIN; }
  get max() { return SistemaVelocidad.MAX; }
}

/**
 * Subsistema Bloqueo Infantil — Puertas y ventanas traseras
 */
class SistemaBloqueoInfantil {
  activar()    { console.log('[BLOQUEO] Bloqueo infantil ACTIVADO');    return true;  }
  desactivar() { console.log('[BLOQUEO] Bloqueo infantil DESACTIVADO'); return false; }
  validar(valor) {
    return typeof valor === 'boolean' ? valor : false;
  }
}

// ── FACADE ───────────────────────────────────────────────────────────────────

/**
 * SistemaSeguridadFacade
 *
 * Interfaz simplificada que:
 * 1. Instancia y coordina todos los subsistemas
 * 2. Expone métodos de alto nivel comprensibles para la UI
 * 3. Coordina las operaciones Memento (guardar/restaurar)
 */
export class SistemaSeguridadFacade {
  /**
   * @param {import('../models/Originator').Originator} originator
   * @param {import('../models/Caretaker').Caretaker}   caretaker
   */
  constructor(originator, caretaker) {
    // Subsistemas — encapsulados, solo la Fachada los conoce
    this._abs      = new SistemaABS();
    this._cinturon = new SistemaCinturones();
    this._sensores = new SistemaSensores();
    this._veloc    = new SistemaVelocidad();
    this._bloqueo  = new SistemaBloqueoInfantil();

    // Referencia al Originator y Caretaker (patrón Memento)
    this._originator = originator;
    this._caretaker  = caretaker;
  }

  // ── Métodos de configuración de perfiles ───────────────────────────────────

  /**
   * Aplica una configuración completa coordinando todos los subsistemas.
   * Llamado internamente tras crear un perfil con la Factory.
   *
   * @param {Configuracion} config - Configuración creada por la Factory
   */
  aplicarConfiguracion(config) {
    console.log(`[FACADE] Aplicando configuración: ${config.nombrePerfil}`);

    const nueva = new Configuracion({
      abs:             this._abs.validar(config.abs),
      cinturones:      this._cinturon.validar(config.cinturones),
      sensores:        this._sensores.validar(config.sensores),
      velocidad:       this._veloc.establecer(config.velocidad),
      bloqueoInfantil: this._bloqueo.validar(config.bloqueoInfantil),
      nombrePerfil:    config.nombrePerfil,
    });

    // Activa o desactiva cada subsistema según el perfil
    if (nueva.abs)             this._abs.activar();      else this._abs.desactivar();
    if (nueva.cinturones)      this._cinturon.activar(); else this._cinturon.desactivar();
    if (nueva.sensores)        this._sensores.activar(); else this._sensores.desactivar();
    if (nueva.bloqueoInfantil) this._bloqueo.activar();  else this._bloqueo.desactivar();

    this._originator.setConfig(nueva);
    console.log('[FACADE] Configuración aplicada exitosamente.');
  }

  /**
   * Activa todos los sistemas de seguridad al máximo.
   * Velocidad fija en 30 km/h.
   */
  activarSeguridadTotal() {
    console.log('[FACADE] ¡SEGURIDAD TOTAL ACTIVADA!');
    const config = new Configuracion({
      velocidad:       30,
      abs:             true,
      cinturones:      true,
      sensores:        true,
      bloqueoInfantil: true,
      nombrePerfil:    'Seguridad Total',
    });
    this.aplicarConfiguracion(config);
  }

  // ── Controles individuales (toggles manuales) ──────────────────────────────

  /** Cambia el estado del ABS */
  toggleABS(activar) {
    const cfg = this._originator.getConfig();
    const nuevaConfig = new Configuracion({
      ...cfg.toPlainObject(),
      abs: activar ? this._abs.activar() : this._abs.desactivar(),
      nombrePerfil: 'Manual',
    });
    this._originator.setConfig(nuevaConfig);
  }

  /** Cambia el estado de los cinturones */
  toggleCinturones(activar) {
    const cfg = this._originator.getConfig();
    const nuevaConfig = new Configuracion({
      ...cfg.toPlainObject(),
      cinturones: activar ? this._cinturon.activar() : this._cinturon.desactivar(),
      nombrePerfil: 'Manual',
    });
    this._originator.setConfig(nuevaConfig);
  }

  /** Cambia el estado de los sensores */
  toggleSensores(activar) {
    const cfg = this._originator.getConfig();
    const nuevaConfig = new Configuracion({
      ...cfg.toPlainObject(),
      sensores: activar ? this._sensores.activar() : this._sensores.desactivar(),
      nombrePerfil: 'Manual',
    });
    this._originator.setConfig(nuevaConfig);
  }

  /** Cambia el estado del bloqueo infantil */
  toggleBloqueoInfantil(activar) {
    const cfg = this._originator.getConfig();
    const nuevaConfig = new Configuracion({
      ...cfg.toPlainObject(),
      bloqueoInfantil: activar ? this._bloqueo.activar() : this._bloqueo.desactivar(),
      nombrePerfil: 'Manual',
    });
    this._originator.setConfig(nuevaConfig);
  }

  /** Establece el límite de velocidad */
  setVelocidad(valor) {
    const cfg = this._originator.getConfig();
    const nuevaConfig = new Configuracion({
      ...cfg.toPlainObject(),
      velocidad: this._veloc.establecer(valor),
    });
    this._originator.setConfig(nuevaConfig);
  }

  // ── Operaciones Memento ────────────────────────────────────────────────────

  /**
   * GUARDAR: Crea un snapshot del estado actual y lo entrega al Caretaker.
   *
   * @param {string} nombre - Etiqueta del snapshot
   * @returns {import('../models/Memento').Memento}
   */
  guardarConfiguracion(nombre) {
    console.log(`[FACADE] Guardando configuración: "${nombre}"`);
    const memento = this._originator.guardar(nombre);
    this._caretaker.guardar(memento);
    return memento;
  }

  /**
   * RESTAURAR: Recupera un snapshot por ID y restaura el estado del Originator.
   *
   * @param {string} id - ID único del snapshot
   * @returns {boolean} - true si la restauración fue exitosa
   */
  restaurarConfiguracion(id) {
    const memento = this._caretaker.obtenerPorId(id);
    if (!memento) {
      console.warn(`[FACADE] No se encontró snapshot con id: ${id}`);
      return false;
    }
    console.log(`[FACADE] Restaurando snapshot: ${memento.getNombre()}`);
    this._originator.restaurar(memento);
    return true;
  }

  // ── Lecturas de estado ─────────────────────────────────────────────────────

  /**
   * Devuelve el estado actual como objeto plano (para React state).
   * @returns {Object}
   */
  getEstadoActual() {
    return this._originator.getConfig().toPlainObject();
  }

  /** Límites del slider de velocidad */
  getLimitesVelocidad() {
    return { min: this._veloc.min, max: this._veloc.max };
  }
}
