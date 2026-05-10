// =============================================================
// PATRÓN: Memento (Comportamiento) — Clase CARETAKER
// Caretaker.js
//
// Responsabilidad: Custodiar el historial de Mementos.
// NUNCA lee ni modifica el interior de un Memento (caja negra).
// Solo sabe guardar, recuperar y eliminar Mementos por ID.
//
// El Caretaker es el "archivero" del sistema.
// =============================================================

import { Memento } from './Memento.js';

export class Caretaker {
  /** @type {Memento[]} */
  #historial = [];

  /** @type {number} */
  #limite;

  /**
   * @param {number} limite - Máximo de snapshots almacenados
   */
  constructor(limite = 20) {
    this.#limite = limite;
  }

  // ── Operaciones del historial ────────────────────────────────

  /**
   * Agrega un nuevo Memento al inicio del historial (más reciente primero).
   * Si se excede el límite, elimina el más antiguo.
   *
   * @param {Memento} memento
   */
  guardar(memento) {
    if (!(memento instanceof Memento)) {
      throw new Error('Caretaker.guardar: solo acepta instancias de Memento');
    }
    this.#historial.unshift(memento);
    if (this.#historial.length > this.#limite) {
      this.#historial.pop(); // descarta el más antiguo
    }
  }

  /**
   * Busca y devuelve un Memento por su ID único.
   *
   * @param {string} id
   * @returns {Memento|null}
   */
  obtenerPorId(id) {
    return this.#historial.find(m => m.getId() === id) ?? null;
  }

  /**
   * Elimina un Memento específico del historial.
   *
   * @param {string} id
   * @returns {boolean} - true si fue eliminado
   */
  eliminar(id) {
    const idx = this.#historial.findIndex(m => m.getId() === id);
    if (idx === -1) return false;
    this.#historial.splice(idx, 1);
    return true;
  }

  /** Elimina todo el historial */
  limpiar() {
    this.#historial = [];
  }

  /**
   * Devuelve una copia del historial completo (más reciente primero).
   *
   * @returns {Memento[]}
   */
  obtenerTodos() {
    return [...this.#historial];
  }

  /** Cantidad de snapshots en el historial */
  get cantidad() {
    return this.#historial.length;
  }
}
