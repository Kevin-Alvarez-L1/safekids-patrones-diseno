// =============================================================
// PATRÓN: Facade (Estructural)
// facade/SistemaSeguridadFacade.js
//
// PROPÓSITO: Proveer una interfaz unificada y simple para un
// conjunto de subsistemas complejos. El cliente (Controller/Vista)
// solo conoce la Fachada — nunca los subsistemas internos.
//
// PROBLEMA QUE RESUELVE: Sin Facade, la Vista debería coordinar
// SistemaABS + SistemaCinturones + SistemaSensores + ... por
// separado, acoplando la UI a la lógica interna. La Fachada
// actúa como "punto de entrada único" al sistema de seguridad.
//
// VENTAJA: Si se cambia un subsistema (ej: SistemaABS → ABSv2),
// solo cambia la Fachada internamente. El Controller no se entera.
//
// v2: integra PersistenciaService para sincronizar localStorage
// sin que el Controller conozca detalles de almacenamiento.
// =============================================================

import { Configuracion }     from '../models/Configuracion.js';
import { PersistenciaService } from '../services/PersistenciaService.js';

// ═══════════════════════════════════════════════════════════════
// SUBSISTEMAS — privados, solo la Fachada los instancia
// En un sistema real, aquí iría la comunicación con el hardware
// ═══════════════════════════════════════════════════════════════

class SistemaABS {
  activar()      { return true;  }
  desactivar()   { return false; }
  validar(v)     { return !!v;   }
}

class SistemaCinturones {
  activar()      { return true;  }
  desactivar()   { return false; }
  validar(v)     { return !!v;   }
}

class SistemaSensores {
  activar()      { return true;  }
  desactivar()   { return false; }
  calibrar()     { /* calibración de hardware */ }
  validar(v)     { return !!v;   }
}

class SistemaVelocidad {
  static MIN = 20;
  static MAX = 200;
  establecer(v) {
    return Math.round(Math.max(SistemaVelocidad.MIN, Math.min(SistemaVelocidad.MAX, Number(v))));
  }
  get min() { return SistemaVelocidad.MIN; }
  get max() { return SistemaVelocidad.MAX; }
}

class SistemaBloqueoInfantil {
  activar()      { return true;  }
  desactivar()   { return false; }
  validar(v)     { return !!v;   }
}

// ═══════════════════════════════════════════════════════════════
// FACADE — interfaz pública del sistema de seguridad
// ═══════════════════════════════════════════════════════════════

export class SistemaSeguridadFacade {
  constructor(originator, caretaker) {
    // Subsistemas encapsulados — invisibles para el exterior
    this._abs      = new SistemaABS();
    this._cinturon = new SistemaCinturones();
    this._sensores = new SistemaSensores();
    this._veloc    = new SistemaVelocidad();
    this._bloqueo  = new SistemaBloqueoInfantil();

    // Dependencias del patrón Memento
    this._originator = originator;
    this._caretaker  = caretaker;
  }

  // ── Aplicar configuración (coordinación de todos los subsistemas) ──

  /**
   * Método central: recibe una Configuracion (creada por Factory)
   * y la aplica coordinando todos los subsistemas internos.
   * La UI no sabe cómo funciona ABS, sensores, etc.
   */
  aplicarConfiguracion(config) {
    const nueva = new Configuracion({
      abs:             this._abs.validar(config.abs),
      cinturones:      this._cinturon.validar(config.cinturones),
      sensores:        this._sensores.validar(config.sensores),
      velocidad:       this._veloc.establecer(config.velocidad),
      bloqueoInfantil: this._bloqueo.validar(config.bloqueoInfantil),
      nombrePerfil:    config.nombrePerfil,
    });
    this._originator.setConfig(nueva);
    this._persistirEstado();
  }

  /** Activa todos los sistemas con velocidad mínima de seguridad */
  activarSeguridadTotal() {
    this.aplicarConfiguracion(new Configuracion({
      velocidad: 30, abs: true, cinturones: true,
      sensores: true, bloqueoInfantil: true,
      nombrePerfil: 'Seguridad Total',
    }));
  }

  // ── Controles individuales (Facade ocupa coordinar el estado) ──

  toggleABS(activar) {
    const cfg = this._originator.getConfig();
    this._originator.setConfig(new Configuracion({
      ...cfg.toPlainObject(),
      abs: activar ? this._abs.activar() : this._abs.desactivar(),
      nombrePerfil: 'Manual',
    }));
    this._persistirEstado();
  }

  toggleCinturones(activar) {
    const cfg = this._originator.getConfig();
    this._originator.setConfig(new Configuracion({
      ...cfg.toPlainObject(),
      cinturones: activar ? this._cinturon.activar() : this._cinturon.desactivar(),
      nombrePerfil: 'Manual',
    }));
    this._persistirEstado();
  }

  toggleSensores(activar) {
    const cfg = this._originator.getConfig();
    this._originator.setConfig(new Configuracion({
      ...cfg.toPlainObject(),
      sensores: activar ? this._sensores.activar() : this._sensores.desactivar(),
      nombrePerfil: 'Manual',
    }));
    this._persistirEstado();
  }

  toggleBloqueoInfantil(activar) {
    const cfg = this._originator.getConfig();
    this._originator.setConfig(new Configuracion({
      ...cfg.toPlainObject(),
      bloqueoInfantil: activar ? this._bloqueo.activar() : this._bloqueo.desactivar(),
      nombrePerfil: 'Manual',
    }));
    this._persistirEstado();
  }

  setVelocidad(valor) {
    const cfg = this._originator.getConfig();
    this._originator.setConfig(new Configuracion({
      ...cfg.toPlainObject(),
      velocidad: this._veloc.establecer(valor),
    }));
    this._persistirEstado();
  }

  // ── Operaciones Memento ───────────────────────────────────────

  guardarConfiguracion(nombre) {
    const memento = this._originator.guardar(nombre);
    this._caretaker.guardar(memento);
    this._persistirHistorial();
    return memento;
  }

  restaurarConfiguracion(id) {
    const memento = this._caretaker.obtenerPorId(id);
    if (!memento) return false;
    this._originator.restaurar(memento);
    this._persistirEstado();
    return true;
  }

  // ── Persistencia (interna a la Fachada) ──────────────────────

  /** Guarda el estado actual en localStorage vía PersistenciaService */
  _persistirEstado() {
    PersistenciaService.guardarConfig(this._originator.getConfig().toPlainObject());
  }

  /** Guarda el historial Memento en localStorage */
  _persistirHistorial() {
    PersistenciaService.guardarHistorial(this._caretaker.exportarJSON());
  }

  // ── Lecturas ──────────────────────────────────────────────────

  getEstadoActual()      { return this._originator.getConfig().toPlainObject(); }
  getLimitesVelocidad()  { return { min: this._veloc.min, max: this._veloc.max }; }
}
