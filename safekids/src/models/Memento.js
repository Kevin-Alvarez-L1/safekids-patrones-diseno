// =============================================================
// PATRÓN: Memento (Comportamiento) — Clase MEMENTO
// models/Memento.js
//
// Responsabilidad: Guardar una "fotografía" inmutable del estado
// del sistema. Estado congelado — sin setters, sin mutación.
//
// v2: soporte serialización JSON para localStorage sin romper
// el encapsulamiento del patrón.
// =============================================================

let _contadorGlobal = 0;

export class Memento {
  #estado;
  #timestamp;
  #id;
  #nombre;
  #numero;

  constructor(estadoPlano, nombre = 'Estado guardado', _meta = null) {
    this.#estado    = Object.freeze({ ...estadoPlano });
    this.#timestamp = _meta?.timestamp ? new Date(_meta.timestamp) : new Date();
    this.#id        = _meta?.id ?? `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.#nombre    = nombre;
    _contadorGlobal += 1;
    this.#numero    = _meta?.numero ?? _contadorGlobal;
  }

  getEstado()    { return { ...this.#estado }; }
  getTimestamp() { return this.#timestamp; }
  getId()        { return this.#id; }
  getNombre()    { return this.#nombre; }
  getNumero()    { return this.#numero; }

  describir() {
    const s = this.#estado;
    const chips = [];
    if (s.abs)             chips.push('ABS');
    if (s.cinturones)      chips.push('Cinturón');
    if (s.sensores)        chips.push('Sensores');
    if (s.bloqueoInfantil) chips.push('Bloqueo');
    chips.push(`${s.velocidad} km/h`);
    return chips.join(' · ');
  }

  // Serialización para PersistenciaService
  toJSON() {
    return {
      estado:    { ...this.#estado },
      nombre:    this.#nombre,
      timestamp: this.#timestamp.toISOString(),
      id:        this.#id,
      numero:    this.#numero,
    };
  }

  static fromJSON(json) {
    return new Memento(json.estado, json.nombre, {
      timestamp: json.timestamp,
      id:        json.id,
      numero:    json.numero,
    });
  }
}
