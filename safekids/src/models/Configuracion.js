// =============================================================
// PATRÓN MVC — MODEL
// Configuracion.js
// Representa el modelo de datos del estado de seguridad del
// vehículo. Es el objeto central que fluye por todo el sistema.
// =============================================================

export class Configuracion {
  /**
   * @param {Object} data - Valores iniciales de la configuración
   */
  constructor(data = {}) {
    this.velocidad      = data.velocidad      ?? 60;    // km/h máximo
    this.abs            = data.abs            ?? false; // Sistema de frenos ABS
    this.cinturones     = data.cinturones     ?? false; // Cinturones obligatorios
    this.sensores       = data.sensores       ?? false; // Sensores de proximidad
    this.bloqueoInfantil= data.bloqueoInfantil?? false; // Bloqueo puertas traseras
    this.nombrePerfil   = data.nombrePerfil   ?? 'Manual'; // Etiqueta del perfil
  }

  /**
   * Devuelve un objeto plano (útil para serialización y React state)
   */
  toPlainObject() {
    return {
      velocidad:       this.velocidad,
      abs:             this.abs,
      cinturones:      this.cinturones,
      sensores:        this.sensores,
      bloqueoInfantil: this.bloqueoInfantil,
      nombrePerfil:    this.nombrePerfil,
    };
  }

  /**
   * Crea una copia profunda de esta configuración
   */
  clonar() {
    return new Configuracion(this.toPlainObject());
  }
}
