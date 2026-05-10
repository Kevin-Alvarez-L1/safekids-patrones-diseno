// =============================================================
// SERVICE — PersistenciaService.js
// src/services/PersistenciaService.js
//
// Encapsula toda la lógica de localStorage.
// Ninguna otra capa accede directamente a localStorage.
// El Controller llama a este Servicio sin saber cómo se almacenan datos.
// Esto mantiene el principio de responsabilidad única dentro de MVC.
// =============================================================

const KEYS = {
  CONFIG:    'safekids_config_v2',
  HISTORIAL: 'safekids_historial_v2',
  PERFIL:    'safekids_perfil_v2',
};

export class PersistenciaService {

  // ── Configuración actual ──────────────────────────────────────

  static guardarConfig(estadoPlano) {
    try {
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(estadoPlano));
    } catch { /* cuota excedida — ignorar silenciosamente */ }
  }

  static cargarConfig() {
    try {
      const raw = localStorage.getItem(KEYS.CONFIG);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  // ── Historial Memento ─────────────────────────────────────────

  /**
   * Persiste el historial como array de objetos JSON planos.
   * Los Mementos se serializan con .toJSON() antes de llegar aquí.
   * @param {Object[]} mementosJSON
   */
  static guardarHistorial(mementosJSON) {
    try {
      localStorage.setItem(KEYS.HISTORIAL, JSON.stringify(mementosJSON));
    } catch { /* cuota excedida */ }
  }

  /**
   * Recupera el array JSON crudo.
   * La reconstrucción a instancias Memento la hace Caretaker.
   * @returns {Object[]}
   */
  static cargarHistorial() {
    try {
      const raw = localStorage.getItem(KEYS.HISTORIAL);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  // ── Perfil activo ─────────────────────────────────────────────

  static guardarPerfil(tipo) {
    try { localStorage.setItem(KEYS.PERFIL, tipo); } catch { /* ignorar */ }
  }

  static cargarPerfil() {
    return localStorage.getItem(KEYS.PERFIL) ?? null;
  }

  // ── Reset total ───────────────────────────────────────────────

  static limpiarTodo() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  /** Comprueba si localStorage está disponible en este entorno */
  static disponible() {
    try {
      localStorage.setItem('_test', '1');
      localStorage.removeItem('_test');
      return true;
    } catch { return false; }
  }
}
