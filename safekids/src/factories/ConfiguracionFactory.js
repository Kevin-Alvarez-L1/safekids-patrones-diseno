// =============================================================
// PATRÓN: Factory Method (Creacional)
// factories/ConfiguracionFactory.js
//
// Centraliza la creación de objetos Configuracion.
// La lógica de cada perfil está encapsulada en factories concretas.
// La UI solo llama a ConfiguracionFactory.crear(tipo) — nunca
// instancia directamente las clases de configuración.
//
// v2: agrega Modo Nocturno y metadata enriquecida por perfil.
// =============================================================

import { Configuracion } from '../models/Configuracion.js';

// ── Creator Abstracto ────────────────────────────────────────────

class PerfilFactory {
  /** Factory Method — implementado por cada subclase */
  crear() { throw new Error(`${this.constructor.name} debe implementar crear()`); }
}

// ── Creators Concretos ───────────────────────────────────────────

class ModoInfantilFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad: 40, abs: true, cinturones: true,
      sensores: true, bloqueoInfantil: true,
      nombrePerfil: 'Modo Infantil',
    });
  }
}

class ModoAdolescenteFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad: 80, abs: true, cinturones: true,
      sensores: true, bloqueoInfantil: false,
      nombrePerfil: 'Modo Adolescente',
    });
  }
}

class ModoEmergenciaFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad: 120, abs: true, cinturones: true,
      sensores: true, bloqueoInfantil: false,
      nombrePerfil: 'Modo Emergencia',
    });
  }
}

class ModoNocturnoFactory extends PerfilFactory {
  crear() {
    // Velocidad reducida, todos los sensores activos, sin bloqueo
    return new Configuracion({
      velocidad: 60, abs: true, cinturones: true,
      sensores: true, bloqueoInfantil: false,
      nombrePerfil: 'Modo Nocturno',
    });
  }
}

class ModoManualFactory extends PerfilFactory {
  crear() {
    return new Configuracion({
      velocidad: 60, abs: false, cinturones: false,
      sensores: false, bloqueoInfantil: false,
      nombrePerfil: 'Modo Manual',
    });
  }
}

// ── Registro de factories ────────────────────────────────────────

const REGISTRO = {
  infantil:    ModoInfantilFactory,
  adolescente: ModoAdolescenteFactory,
  emergencia:  ModoEmergenciaFactory,
  nocturno:    ModoNocturnoFactory,
  manual:      ModoManualFactory,
};

// ── Punto de entrada ─────────────────────────────────────────────

export class ConfiguracionFactory {

  static crear(tipo) {
    const FactoryClass = REGISTRO[tipo];
    if (!FactoryClass) throw new Error(`Tipo desconocido: "${tipo}"`);
    return new FactoryClass().crear();
  }

  /** Metadata de todos los perfiles para renderizar la UI */
  static obtenerPerfiles() {
    return [
      {
        tipo: 'infantil',
        etiqueta: 'Modo Infantil',
        descripcion: '0-10 años · 40 km/h máx.',
        icono: '👶',
        color: 'infantil',
        accentColor: '#16a34a',
        bgColor: '#dcfce7',
      },
      {
        tipo: 'adolescente',
        etiqueta: 'Modo Adolescente',
        descripcion: '11-17 años · 80 km/h máx.',
        icono: '🧑',
        color: 'adolescente',
        accentColor: '#2563eb',
        bgColor: '#dbeafe',
      },
      {
        tipo: 'emergencia',
        etiqueta: 'Modo Emergencia',
        descripcion: 'Alta velocidad · 120 km/h',
        icono: '🚨',
        color: 'emergencia',
        accentColor: '#dc2626',
        bgColor: '#fee2e2',
      },
      {
        tipo: 'nocturno',
        etiqueta: 'Modo Nocturno',
        descripcion: 'Visibilidad reducida · 60 km/h',
        icono: '🌙',
        color: 'nocturno',
        accentColor: '#7c3aed',
        bgColor: '#ede9fe',
      },
      {
        tipo: 'manual',
        etiqueta: 'Modo Manual',
        descripcion: 'Configuración personalizada',
        icono: '⚙️',
        color: 'manual',
        accentColor: '#b45309',
        bgColor: '#fef3c7',
      },
    ];
  }
}
