// =============================================================
// PATRÓN: Memento (Comportamiento) — Clase MEMENTO
// Memento.js
//
// Responsabilidad: Guardar una "fotografía" inmutable del estado
// del sistema en un momento determinado. El estado queda congelado
// y NO puede ser modificado desde fuera (encapsulamiento).
//
// Roles del patrón:
//   → Esta clase ES el Memento
//   → El Originator la crea y la consume
//   → El Caretaker la almacena sin conocer su contenido
// =============================================================

let _contadorGlobal = 0; // contador de snapshots guardados en toda la sesión

export class Memento {
  // Propiedades privadas con # (encapsulamiento real ES2022)
  #estado;
  #timestamp;
  #id;
  #nombre;
  #numero;

  /**
   * @param {Object} estadoPlano - Estado a guardar (objeto plano)
   * @param {string} nombre      - Etiqueta descriptiva del snapshot
   */
  constructor(estadoPlano, nombre = 'Estado guardado') {
    // Object.freeze asegura inmutabilidad total del estado guardado
    this.#estado    = Object.freeze({ ...estadoPlano });
    this.#timestamp = new Date();
    this.#id        = `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.#nombre    = nombre;
    _contadorGlobal += 1;
    this.#numero    = _contadorGlobal;
  }

  // ── Métodos de solo lectura (el Memento nunca expone setters) ──

  /** Devuelve una copia del estado guardado */
  getEstado()     { return { ...this.#estado }; }

  /** Devuelve la fecha/hora en que se creó el snapshot */
  getTimestamp()  { return this.#timestamp; }

  /** Identificador único del snapshot */
  getId()         { return this.#id; }

  /** Etiqueta legible para la UI */
  getNombre()     { return this.#nombre; }

  /** Número de perfil en orden de creación */
  getNumero()     { return this.#numero; }

  /**
   * Genera una descripción resumida del estado guardado
   * (para mostrar en el historial)
   */
  describir() {
    const s = this.#estado;
    const partes = [];
    if (s.abs)             partes.push('ABS');
    if (s.cinturones)      partes.push('Cinturón');
    if (s.sensores)        partes.push('Sensores');
    if (s.bloqueoInfantil) partes.push('Bloqueo');
    partes.push(`${s.velocidad} km/h`);
    return partes.join(' · ');
  }
}
