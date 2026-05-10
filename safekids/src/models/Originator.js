// =============================================================
// PATRÓN: Memento (Comportamiento) — Clase ORIGINATOR
// Originator.js
//
// Responsabilidad: Mantener el estado actual del sistema y saber
// cómo crear un Memento (guardar) y cómo restaurar desde uno.
//
// Es el ÚNICO que conoce el contenido interno del Memento.
// El Caretaker solo guarda/entrega, nunca lee el interior.
// =============================================================

import { Memento }       from './Memento.js';
import { Configuracion } from './Configuracion.js';

export class Originator {
  /** @type {Configuracion} */
  #config;

  /**
   * @param {Configuracion} configInicial
   */
  constructor(configInicial = new Configuracion()) {
    this.#config = configInicial;
  }

  // ── Acceso al estado actual ──────────────────────────────────

  /** Devuelve la configuración actual (referencia interna) */
  getConfig() {
    return this.#config;
  }

  /** Reemplaza la configuración actual con una nueva instancia */
  setConfig(nuevaConfig) {
    if (!(nuevaConfig instanceof Configuracion)) {
      throw new Error('setConfig: se esperaba una instancia de Configuracion');
    }
    this.#config = nuevaConfig;
  }

  // ── Operaciones Memento ──────────────────────────────────────

  /**
   * GUARDAR: Crea un Memento con una copia congelada del estado actual.
   * El Caretaker recibirá este Memento y lo almacenará.
   *
   * @param {string} nombre - Etiqueta opcional para el snapshot
   * @returns {Memento}
   */
  guardar(nombre) {
    const etiqueta = nombre || this.#config.nombrePerfil;
    return new Memento(this.#config.toPlainObject(), etiqueta);
  }

  /**
   * RESTAURAR: Recibe un Memento del Caretaker y reconstruye el
   * estado interno a partir de él.
   *
   * @param {Memento} memento
   */
  restaurar(memento) {
    if (!(memento instanceof Memento)) {
      throw new Error('restaurar: el argumento debe ser una instancia de Memento');
    }
    // Reconstruye la configuración desde el estado guardado
    this.#config = new Configuracion(memento.getEstado());
  }
}
