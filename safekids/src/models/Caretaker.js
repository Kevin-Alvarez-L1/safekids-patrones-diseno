// =============================================================
// PATRÓN: Memento — Clase CARETAKER
// models/Caretaker.js
//
// Custodia el historial de Mementos como "caja negra".
// Nunca lee ni modifica el interior de un Memento.
//
// v2: agrega importarDesdeJSON() para restaurar el historial
// desde localStorage al iniciar la aplicación.
// =============================================================

import { Memento } from './Memento.js';

export class Caretaker {
  #historial = [];
  #limite;

  constructor(limite = 30) {
    this.#limite = limite;
  }

  guardar(memento) {
    if (!(memento instanceof Memento)) throw new Error('Solo acepta instancias Memento');
    this.#historial.unshift(memento);
    if (this.#historial.length > this.#limite) this.#historial.pop();
  }

  obtenerPorId(id) {
    return this.#historial.find(m => m.getId() === id) ?? null;
  }

  eliminar(id) {
    const idx = this.#historial.findIndex(m => m.getId() === id);
    if (idx === -1) return false;
    this.#historial.splice(idx, 1);
    return true;
  }

  limpiar() { this.#historial = []; }

  obtenerTodos() { return [...this.#historial]; }

  get cantidad() { return this.#historial.length; }

  // ── Serialización para PersistenciaService ────────────────────

  /** Exporta el historial como array de objetos JSON planos */
  exportarJSON() {
    return this.#historial.map(m => m.toJSON());
  }

  /**
   * Reconstruye el historial desde objetos JSON guardados.
   * Llamado solo al inicializar el Controller (carga de localStorage).
   * @param {Object[]} jsonArray
   */
  importarDesdeJSON(jsonArray) {
    this.#historial = jsonArray
      .map(json => { try { return Memento.fromJSON(json); } catch { return null; } })
      .filter(Boolean);
  }
}
