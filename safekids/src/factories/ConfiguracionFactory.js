// =============================================================
// PATRÓN: Factory Method (Creacional)
// ConfiguracionFactory.js
//
// Propósito: Centralizar la creación de objetos Configuracion.
// La lógica de qué valores tiene cada perfil está encapsulada
// en las clases Factory concretas, NO dispersa en la UI.
//
// Estructura del patrón:
//   PerfilFactory          → Clase base (Creator abstracto)
//   ModoInfantilFactory    → Creator concreto
//   ModoAdolescenteFactory → Creator concreto
//   ModoEmergenciaFactory  → Creator concreto
//   ModoManualFactory      → Creator concreto
//   ConfiguracionFactory   → Punto de entrada (registro de factories)
// =============================================================

import { Configuracion } from '../models/Configuracion.js';

// ── Clase Base Abstracta (Creator) ──────────────────────────────────────────

/**
 * Define la interfaz que todas las factories concretas deben implementar.
 * El método crear() es el "Factory Method".
 */
class PerfilFactory {
  /**
   * Factory Method — cada subclase define cómo construir su perfil.
   * @returns {Configuracion}
   */
  crear() {
    throw new Error(`${this.constructor.name}: debe implementar el método crear()`);
  }
}

// ── Factories Concretas (Creators Concretos) ─────────────────────────────────

/**
 * Modo Infantil: máxima seguridad, velocidad muy baja.
 * Para niños de 0 a 10 años.
 */
class ModoInfantilFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad:       40,
      abs:             true,
      cinturones:      true,
      sensores:        true,
      bloqueoInfantil: true,
      nombrePerfil:    'Modo Infantil',
    });
  }
}

/**
 * Modo Adolescente: seguridad alta pero sin bloqueo de puertas.
 * Para pasajeros de 11 a 17 años.
 */
class ModoAdolescenteFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad:       80,
      abs:             true,
      cinturones:      true,
      sensores:        true,
      bloqueoInfantil: false,
      nombrePerfil:    'Modo Adolescente',
    });
  }
}

/**
 * Modo Emergencia: velocidad máxima permitida, todos los sensores activos.
 * ABS y cinturones activos para máxima seguridad en emergencias.
 */
class ModoEmergenciaFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad:       120,
      abs:             true,
      cinturones:      true,
      sensores:        true,
      bloqueoInfantil: false,
      nombrePerfil:    'Modo Emergencia',
    });
  }
}

/**
 * Modo Manual: todas las opciones desactivadas por defecto.
 * El usuario configura manualmente cada parámetro.
 */
class ModoManualFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad:       60,
      abs:             false,
      cinturones:      false,
      sensores:        false,
      bloqueoInfantil: false,
      nombrePerfil:    'Modo Manual',
    });
  }
}

/**
 * Seguridad Total: todos los sistemas activos, velocidad mínima.
 * Máxima protección posible.
 */
class SeguridadTotalFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad:       30,
      abs:             true,
      cinturones:      true,
      sensores:        true,
      bloqueoInfantil: true,
      nombrePerfil:    'Seguridad Total',
    });
  }
}

// ── Registro de Factories ────────────────────────────────────────────────────

const REGISTRO_FACTORIES = {
  infantil:       ModoInfantilFactory,
  adolescente:    ModoAdolescenteFactory,
  emergencia:     ModoEmergenciaFactory,
  manual:         ModoManualFactory,
  seguridadTotal: SeguridadTotalFactory,
};

// ── Punto de Entrada Principal ───────────────────────────────────────────────

/**
 * ConfiguracionFactory — Factory Method centralizado.
 *
 * La interfaz React llama únicamente a este método estático.
 * Nunca instancia directamente las clases concretas.
 *
 * Ejemplo de uso:
 *   const config = ConfiguracionFactory.crear('infantil');
 */
export class ConfiguracionFactory {
  /**
   * Crea un perfil de configuración según el tipo indicado.
   *
   * @param {'infantil'|'adolescente'|'emergencia'|'manual'|'seguridadTotal'} tipo
   * @returns {Configuracion}
   */
  static crear(tipo) {
    const FactoryClass = REGISTRO_FACTORIES[tipo];
    if (!FactoryClass) {
      throw new Error(`ConfiguracionFactory: tipo desconocido → "${tipo}"`);
    }
    const factory = new FactoryClass();
    return factory.crear(); // ← invoca el Factory Method
  }

  /**
   * Devuelve los tipos de perfil disponibles con su metadata.
   * Útil para generar botones en la UI sin hardcodear nada.
   */
  static obtenerPerfiles() {
    return [
      {
        tipo:        'infantil',
        etiqueta:    'Modo Infantil',
        descripcion: '0-10 años · 40 km/h máx.',
        icono:       '👶',
        color:       'perfil-infantil',
      },
      {
        tipo:        'adolescente',
        etiqueta:    'Modo Adolescente',
        descripcion: '11-17 años · 80 km/h máx.',
        icono:       '🧑',
        color:       'perfil-adolescente',
      },
      {
        tipo:        'emergencia',
        etiqueta:    'Modo Emergencia',
        descripcion: 'Alta velocidad · 120 km/h',
        icono:       '🚨',
        color:       'perfil-emergencia',
      },
      {
        tipo:        'manual',
        etiqueta:    'Modo Manual',
        descripcion: 'Configura manualmente',
        icono:       '⚙️',
        color:       'perfil-manual',
      },
    ];
  }
}
