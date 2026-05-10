# SafeKids v2 — Patrones de Diseño

## 1. MEMENTO (Comportamiento)

### Propósito
Capturar y externalizar el estado interno de un objeto para poder restaurarlo después, sin violar el encapsulamiento.

### Implementación

| Rol | Clase | Responsabilidad |
|-----|-------|----------------|
| Memento | `Memento` | Guarda estado congelado con propiedades `#privadas` |
| Originator | `Originator` | Crea Mementos y se restaura desde ellos |
| Caretaker | `Caretaker` | Custodia el historial; nunca lee el interior |

### Flujo Memento
```
[GUARDAR]
  Usuario: "Guardar snapshot"
    → Controller.guardarEstado(nombre)
      → Facade.guardarConfiguracion(nombre)
        → Originator.guardar(nombre)        ← crea Memento
          → Caretaker.guardar(memento)      ← custodia
            → PersistenciaService.guardarHistorial()  ← persiste

[RESTAURAR]
  Usuario: "Restaurar #3"
    → Controller.restaurarEstado(id)
      → Facade.restaurarConfiguracion(id)
        → Caretaker.obtenerPorId(id)        ← recupera Memento
          → Originator.restaurar(memento)   ← reconstruye estado
```

### UML (texto ASCII)
```
┌─────────────────┐       crea       ┌───────────────┐
│   Originator    │ ───────────────► │    Memento    │
│─────────────────│                  │───────────────│
│ - #config       │                  │ - #estado     │
│─────────────────│                  │ - #timestamp  │
│ + guardar()     │ ◄──restaurar───  │ - #id         │
│ + restaurar()   │                  │ - #nombre     │
│ + setConfig()   │                  │───────────────│
└─────────────────┘                  │ + getEstado() │
                                     │ + toJSON()    │
        guarda                       │ + fromJSON()  │
           ▼                         └───────────────┘
┌─────────────────┐
│    Caretaker    │
│─────────────────│
│ - #historial[]  │
│─────────────────│
│ + guardar()     │
│ + obtenerPorId()│
│ + exportarJSON()│
└─────────────────┘
```

---

## 2. FACTORY METHOD (Creacional)

### Propósito
Definir una interfaz para crear objetos, pero dejar que las subclases decidan qué clase instanciar. Centraliza la lógica de creación.

### Implementación

| Clase | Tipo | Perfil |
|-------|------|--------|
| `PerfilFactory` | Creator abstracto | — |
| `ModoInfantilFactory` | Creator concreto | 40 km/h, todo ON + bloqueo |
| `ModoAdolescenteFactory` | Creator concreto | 80 km/h, sin bloqueo |
| `ModoEmergenciaFactory` | Creator concreto | 120 km/h |
| `ModoNocturnoFactory` | Creator concreto | 60 km/h, sensores activos |
| `ModoManualFactory` | Creator concreto | Configuración libre |

### UML (texto ASCII)
```
       ┌───────────────────┐
       │   PerfilFactory   │   (Creator abstracto)
       │───────────────────│
       │ + crear(): Config │◄──────────────────────────────┐
       └────────┬──────────┘                               │
                │ hereda                                   │
     ┌──────────┼────────────────────┐                     │
     ▼          ▼           ▼        ▼                     │
  Infantil  Adolescente  Emergencia Nocturno  Manual        │
  Factory   Factory      Factory    Factory   Factory       │
  ─────────────────────────────────────────────────        │
  crear()→  crear()→    crear()→   crear()→  crear()→      │
  Config40  Config80    Config120  Config60  ConfigFree     │
                                                           │
              ┌─────────────────────────┐                  │
              │ ConfiguracionFactory    │──usar────────────►┘
              │─────────────────────────│
              │ + crear(tipo): Config   │
              └─────────────────────────┘
```

---

## 3. FACADE (Estructural)

### Propósito
Proporcionar una interfaz simplificada a un conjunto de interfaces en un subsistema. Reduce la complejidad para el cliente.

### Subsistemas ocultos

```
SistemaSeguridadFacade
      │
      ├── SistemaABS          → activar() / desactivar()
      ├── SistemaCinturones   → activar() / desactivar()
      ├── SistemaSensores     → activar() / calibrar()
      ├── SistemaVelocidad    → establecer(valor)
      └── SistemaBloqueoInfantil → activar() / desactivar()
```

### UML (texto ASCII)
```
  ┌──────────────┐          ┌─────────────────────────────────┐
  │  Controller  │          │      SistemaSeguridadFacade      │
  │──────────────│──llama──►│─────────────────────────────────│
  │              │          │ + aplicarConfiguracion(config)  │
  └──────────────┘          │ + activarSeguridadTotal()        │
                            │ + guardarConfiguracion(nombre)   │
  ┌──────────────┐          │ + restaurarConfiguracion(id)     │
  │    Vistas    │──llama──►│ + toggle*(valor)                 │
  │   (React)    │          │ + setVelocidad(v)                │
  └──────────────┘          │─────────────────────────────────│
                            │ - _abs: SistemaABS               │
       NO ACCEDEN           │ - _cinturon: SistemaCinturones   │
       DIRECTAMENTE         │ - _sensores: SistemaSensores     │
       A SUBSISTEMAS        │ - _veloc: SistemaVelocidad       │
                            │ - _bloqueo: SistemaBloqueoInf.   │
                            └─────────────────────────────────┘
```

---

## 4. MVC (Arquitectura)

### Propósito
Separar la aplicación en tres capas: datos (Model), presentación (View) y coordinación (Controller). Cada capa tiene una sola responsabilidad.

### Mapa de capas

```
MODEL                     CONTROLLER                VIEW
─────────────────         ─────────────────         ─────────────────
Configuracion.js          SeguridadController.js    PanelSeguridad.jsx
Memento.js                (React Hook)              EstadoVehiculo.jsx
Originator.js             • instancia M y F         HistorialMemento.jsx
Caretaker.js              • expone acciones
                          • sincroniza estado React

FACTORY                   FACADE                    SERVICE
─────────────────         ─────────────────         ─────────────────
ConfiguracionFactory.js   SistemaSeguridadFacade.js PersistenciaService.js
(crea objetos Config)     (coordina subsistemas)    (localStorage)
```

### Flujo MVC completo
```
1. Usuario pulsa "Modo Infantil"
   ↓
2. VIEW: PanelSeguridad → onAplicarPerfil('infantil')
   ↓
3. CONTROLLER: useSeguridadController.aplicarPerfil('infantil')
   ↓
4. FACTORY: ConfiguracionFactory.crear('infantil')
            → ModoInfantilFactory.crear()
            → return new Configuracion({vel:40, abs:true...})
   ↓
5. FACADE: facade.aplicarConfiguracion(config)
           → SistemaABS.activar()
           → SistemaCinturones.activar()
           → SistemaSensores.activar()
           → SistemaVelocidad.establecer(40)
           → SistemaBloqueoInfantil.activar()
           → Originator.setConfig(nuevaConfig)
           → PersistenciaService.guardarConfig(...)
   ↓
6. CONTROLLER: setEstado({ ...facade.getEstadoActual() })
   ↓
7. VIEW: React re-render con nuevos props → UI actualizada
```

---

## Relación entre patrones

```
┌──────────────────────────────────────────────────────────────┐
│                          MVC                                 │
│                                                              │
│  ┌─────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │  VIEWS  │◄───│   CONTROLLER    │───►│     MODELS      │  │
│  │ (React) │    │ (React Hook)    │    │  Configuracion  │  │
│  └─────────┘    └────────┬────────┘    │  Originator     │  │
│                          │            │  Caretaker      │  │
│                          │            │  Memento        │  │
│              ┌───────────┤            └────────▲────────┘  │
│              ▼           ▼                     │            │
│        ┌─────────┐ ┌──────────┐                │            │
│        │ FACTORY │ │  FACADE  │────coordina────►│  MEMENTO  │
│        │ METHOD  │ │          │                 │  PATTERN  │
│        └─────────┘ └────┬─────┘                └────────────┘
│                         │
│                    ┌────▼──────────────────┐
│                    │     Subsistemas       │
│                    │ ABS · Cinturones      │
│                    │ Sensores · Velocidad  │
│                    │ BloqueoInfantil       │
│                    └───────────────────────┘
│
│                    ┌───────────────────────┐
│                    │  PersistenciaService  │
│                    │   (localStorage)      │
│                    └───────────────────────┘
└──────────────────────────────────────────────────────────────┘
```

## Ventajas del diseño

| Aspecto | Detalle |
|---------|---------|
| **Mantenibilidad** | Cada archivo tiene una sola responsabilidad clara |
| **Extensibilidad** | Nuevo perfil = una nueva clase Factory, nada más cambia |
| **Encapsulamiento** | Fachada oculta subsistemas; Memento protege estado con `#private` |
| **Desacoplamiento** | Vista nunca conoce Modelos ni Subsistemas |
| **Persistencia** | localStorage encapsulado en PersistenciaService |
| **Testabilidad** | Cada capa es independiente y testeable por separado |
