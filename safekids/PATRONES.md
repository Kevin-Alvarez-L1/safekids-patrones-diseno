# SafeKids — Explicación de Patrones de Diseño

## 1. MEMENTO (Comportamiento)

### ¿Qué hace?
Permite guardar y restaurar el estado anterior de un objeto sin revelar los detalles de su implementación.

### Implementación en el proyecto

| Rol | Clase | Archivo |
|-----|-------|---------|
| **Memento** | `Memento` | `src/models/Memento.js` |
| **Originator** | `Originator` | `src/models/Originator.js` |
| **Caretaker** | `Caretaker` | `src/models/Caretaker.js` |

### Flujo
```
Usuario → "Guardar estado" → Controller
  → Facade.guardarConfiguracion()
    → Originator.guardar()         ← crea el Memento
      → Caretaker.guardar(memento) ← lo custodia

Usuario → "Restaurar" → Controller
  → Facade.restaurarConfiguracion(id)
    → Caretaker.obtenerPorId(id)   ← entrega el Memento
      → Originator.restaurar(m)    ← reconstituye el estado
```

### Encapsulamiento
El `Memento` usa propiedades privadas con `#` (ES2022), garantizando que
solo el `Originator` puede leer el contenido. El `Caretaker` nunca accede
al interior del `Memento`.

---

## 2. FACTORY METHOD (Creacional)

### ¿Qué hace?
Define una interfaz para crear objetos, pero deja a las subclases decidir
qué clase instanciar. Centraliza la lógica de creación.

### Implementación en el proyecto

| Clase | Rol |
|-------|-----|
| `PerfilFactory` | Creator abstracto (define el contrato) |
| `ModoInfantilFactory` | Creator concreto (velocidad 40, todo ON) |
| `ModoAdolescenteFactory` | Creator concreto (velocidad 80) |
| `ModoEmergenciaFactory` | Creator concreto (velocidad 120) |
| `ModoManualFactory` | Creator concreto (todo desactivado) |
| `ConfiguracionFactory` | Punto de entrada con registro de factories |

### Flujo
```
Vista: onAplicarPerfil('infantil')
  → Controller.aplicarPerfil('infantil')
    → ConfiguracionFactory.crear('infantil')    ← Factory Method
      → new ModoInfantilFactory().crear()
        → return new Configuracion({vel:40, abs:true, ...})
    → Facade.aplicarConfiguracion(config)
```

### Ventaja
Si se necesita agregar un nuevo perfil (ej: "Modo Escolar"), solo se añade
una nueva factory concreta al registro. Ningún otro código cambia.

---

## 3. FACADE (Estructural)

### ¿Qué hace?
Provee una interfaz simplificada para un conjunto complejo de subsistemas.
El cliente (Vista/Controller) solo conoce la Fachada.

### Implementación en el proyecto

**Archivo:** `src/facade/SistemaSeguridadFacade.js`

**Subsistemas internos (privados a la Fachada):**
- `SistemaABS` — activar/desactivar frenos antibloqueo
- `SistemaCinturones` — cinturones obligatorios
- `SistemaSensores` — sensores de proximidad + calibración
- `SistemaVelocidad` — validación de límite (20–200 km/h)
- `SistemaBloqueoInfantil` — puertas traseras

**Métodos de la Fachada (interfaz pública):**
```javascript
facade.aplicarConfiguracion(config)
facade.activarSeguridadTotal()
facade.guardarConfiguracion(nombre)    // coordina con Memento
facade.restaurarConfiguracion(id)      // coordina con Memento
facade.toggleABS(valor)
facade.toggleCinturones(valor)
facade.toggleSensores(valor)
facade.toggleBloqueoInfantil(valor)
facade.setVelocidad(valor)
facade.getEstadoActual()
```

La Vista y el Controlador **nunca** instancian ni acceden directamente
a `SistemaABS`, `SistemaCinturones`, etc.

---

## 4. MVC (Arquitectura)

### Estructura de carpetas

```
src/
├── models/           ← MODEL: lógica de datos
│   ├── Configuracion.js  (datos del estado)
│   ├── Memento.js        (snapshot inmutable)
│   ├── Originator.js     (crea/restaura mementos)
│   └── Caretaker.js      (historial de mementos)
│
├── factories/        ← Capa creacional (Factory Method)
│   └── ConfiguracionFactory.js
│
├── facade/           ← Capa estructural (Facade + Subsistemas)
│   └── SistemaSeguridadFacade.js
│
├── controllers/      ← CONTROLLER: coordina M y V
│   └── SeguridadController.js  (React Hook)
│
├── views/            ← VIEW: componentes React
│   ├── PanelSeguridad.jsx    (controles e input)
│   ├── EstadoVehiculo.jsx    (lectura del estado)
│   └── HistorialMemento.jsx  (historial de snapshots)
│
└── App.jsx           ← Punto de entrada, conecta C y V
```

### Flujo MVC completo

```
[VIEW] PanelSeguridad
  → onAplicarPerfil('infantil')           (evento de usuario)

[CONTROLLER] useSeguridadController
  → ConfiguracionFactory.crear('infantil')  (Factory)
  → facade.aplicarConfiguracion(config)     (Facade)
  → setEstado(facade.getEstadoActual())     (sincroniza React)

[MODEL] Originator + Configuracion
  → originator.setConfig(nuevaConfig)
  → config actualizada internamente

[VIEW] EstadoVehiculo + PanelSeguridad
  → recibe nuevos props → re-render        (React)
```

---

## Relación entre patrones

```
┌─────────────────────────────────────────────────────────┐
│                        MVC                              │
│  ┌──────────┐    ┌────────────┐    ┌─────────────────┐  │
│  │  VIEWS   │◄──►│CONTROLLER  │───►│    MODELS       │  │
│  │ (React)  │    │ (Hook)     │    │  Configuracion  │  │
│  └──────────┘    └─────┬──────┘    │  Originator ←──────┐
│                        │           │  Caretaker  │  │   │
│                   ┌────▼──────┐    │  Memento    │  │   │
│                   │  FACTORY  │    └─────────────┘  │   │
│                   │  METHOD   │                     │   │
│                   └────┬──────┘                     │   │
│                        │                            │   │
│                   ┌────▼──────┐    ┌─────────────┐  │   │
│                   │  FACADE   │───►│ Subsistemas │  │   │
│                   │           │    │ ABS         │  │   │
│                   │           ├────► Cinturones  │  │   │
│                   │           │    │ Sensores    │  │   │
│                   │           │    │ Velocidad   │  │   │
│                   │           ├────► Bloqueo     │  │   │
│                   │           │    └─────────────┘  │   │
│                   │  +Memento ├────────────────────►┘   │
│                   └───────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## Ventajas del diseño

| Aspecto | Ventaja |
|---------|---------|
| **Mantenibilidad** | Cada patrón tiene una sola responsabilidad (SRP) |
| **Extensibilidad** | Agregar un perfil = 1 nueva clase Factory, sin tocar nada más |
| **Encapsulamiento** | La Fachada oculta complejidad; el Memento protege sus datos con `#` |
| **Desacoplamiento** | La Vista nunca conoce los Modelos directamente |
| **Historial** | Memento permite deshacer/restaurar cualquier estado sin costo |
| **Separación** | MVC permite trabajar Model, View y Controller de forma independiente |

---

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build
```
