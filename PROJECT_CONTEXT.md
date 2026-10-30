# PROJECT_CONTEXT.md

## 1. Descripción del proyecto

API REST educativa desarrollada con Node.js, Express y TypeScript para archivar canciones de TWICE organizadas por álbum. El proyecto permite practicar cómo una petición HTTP atraviesa rutas, middlewares, controladores y servicios hasta producir una respuesta.

El recurso principal es una canción (`Song`) representada mediante datos almacenados exclusivamente en un arreglo en memoria. Los datos no persisten después de reiniciar el servidor.

La prioridad del proyecto es demostrar:

- Recepción de peticiones HTTP.
- Validación de datos.
- Procesamiento mediante capas separadas.
- Manejo de errores HTTP consistente.
- Construcción de respuestas JSON.
- Uso de middlewares globales y específicos de rutas.

## 2. Stack y dependencias

### Stack conservado de la referencia

- Node.js.
- Express.
- TypeScript.
- Variables de entorno mediante `dotenv`.
- Datos almacenados en memoria.
- Ejecución y compilación con los scripts definidos en `package.json`.

### Dependencias reales presentes en el proyecto de referencia

Dependencias:

- `express`
- `dotenv`

Dependencias de desarrollo:

- `typescript`
- `tsx`
- `@types/express`
- `@types/node`

No se deben incorporar ORM, bases de datos, herramientas de pruebas, validadores externos ni nuevas dependencias salvo que el proyecto de referencia las incluya o exista una instrucción posterior explícita.

## 3. Árbol de carpetas objetivo

```text
.
├── src/
│   ├── tipos.ts
│   ├── apiError.ts
│   ├── app.ts
│   ├── index.ts
│   ├── data/
│   │   └── songs.ts
│   ├── routes/
│   │   └── songs.routes.ts
│   ├── controllers/
│   │   └── songs.controller.ts
│   ├── services/
│   │   └── songs.service.ts
│   └── middlewares/
│       ├── requestLogger.ts
│       ├── validateSong.ts
│       ├── validateDurationFormat.ts
│       └── errorHandler.ts
├── README.md
├── requests.md
├── .env.example
├── package.json
├── package-lock.json
└── tsconfig.json
```

`requests.md` documentará las pruebas manuales realizadas contra la API. `README.md` deberá explicar la instalación y ejecución del proyecto.

## 4. Responsabilidad de cada capa

### `routes`

- Definir endpoints y verbos HTTP.
- Conectar cada ruta con los middlewares y controladores correspondientes.
- No contiene lógica de negocio ni acceso directo a datos.

### `controllers`

- Recibir `Request`, `Response` y `NextFunction`.
- Extraer parámetros, query strings y cuerpo de la petición.
- Invocar el servicio apropiado.
- Construir códigos HTTP y respuestas JSON.
- Delegar excepciones mediante `next(error)`.
- No debe modificar directamente el arreglo de canciones.

### `services`

- Contener la lógica de negocio.
- Listar, buscar, crear, actualizar y eliminar canciones.
- Trabajar con el arreglo almacenado en `data`.
- Lanzar errores HTTP mediante `ApiError`.
- No debe conocer objetos `Request` ni `Response`.

### `middlewares`

- Implementar responsabilidades transversales.
- `requestLogger`: registrar método, ruta y timestamp.
- `validateSong`: validar la estructura y tipos enviados por el cliente.
- `validateDurationFormat`: validar el formato `mm:ss`.
- `errorHandler`: convertir errores conocidos y desconocidos en respuestas JSON consistentes.

### `data`

- Contener el arreglo inicial de canciones.
- Representar temporalmente la base de datos en memoria.

### Punto de entrada y configuración

- `index.ts` carga variables de entorno, crea la aplicación y pone el servidor a escuchar.
- `app.ts` configura Express, el orden de middlewares y los routers.
- `tipos.ts` define interfaces y tipos utilizados por las distintas capas.
- `apiError.ts` define el error HTTP personalizado usado por el proyecto.

## 5. Flujo de una petición

### Peticiones globales

```text
Petición HTTP
→ express.json()
→ requestLogger
→ router específico
→ middlewares de validación, si corresponden
→ controlador
→ servicio
→ arreglo en memoria
→ respuesta del controlador
→ cliente
```

Si se produce un error:

```text
servicio o middleware
→ next(error)
→ errorHandler
→ respuesta HTTP
```

### Orden de middlewares en `app.ts`

1. `express.json()` para poder leer JSON en `req.body`.
2. `requestLogger` para registrar todas las peticiones.
3. Rutas montadas bajo `/songs`.
4. Middleware de ruta no encontrada, opcional pero recomendado.
5. `errorHandler`, siempre al final.

### Middleware de creación y actualización

```text
POST /songs o PUT /songs/:id
→ validateSong
→ validateDurationFormat
→ controlador
→ servicio
```

La validación de duración puede integrarse dentro de `validateSong`, pero debe mantenerse como middleware independiente, tal como lo exige la arquitectura solicitada.

`validateSong` se ejecuta antes del controlador. Una solicitud inválida debe detenerse con `400` y no debe llegar al servicio.

## 6. Modelo `Song` y reglas de validación

### Interface principal

```ts
interface Song {
  id: string;
  title: string;
  album: string;
  releaseYear: number;
  duration: string;
  isTitleTrack: boolean;
  mood: string;
}
```

### Reglas generales

- `id`: cadena de texto.
- `title`: cadena de texto no vacía.
- `album`: cadena de texto no vacía.
- `releaseYear`: número entero válido.
- `duration`: cadena de texto con formato `mm:ss`, incluyendo ceros iniciales cuando corresponda.
- `isTitleTrack`: booleano.
- `mood`: cadena de texto no vacía.

### Creación (`POST /songs`)

El cliente debe enviar todos los campos editables, excepto `id`, porque el servicio debe generar el identificador.

Campos editables:

- `title`
- `album`
- `releaseYear`
- `duration`
- `isTitleTrack`
- `mood`

`id` no debe ser aceptado como entrada de creación ni utilizado directamente por el cliente.

### Actualización (`PUT /songs/:id`)

Se utiliza reemplazo completo y se deben validar todos los campos editables. Si el requisito posterior exigiera actualización parcial, será necesario introducir explícitamente un modelo mediante `Partial<NewSong>` y documentarlo.

### Duración

La duración debe cumplir la expresión `mm:ss`.

- Los minutos pueden expresarse con al menos dos dígitos según el formato acordado: `03:42`, `12:05`.
- Los segundos deben estar entre `00` y `59`.
- Ejemplos válidos: `"03:42"`, `"12:05"`, `"00:59"`.
- Ejemplos inválidos: `"3:42"`, `"03:60"`, `"03:5"`, `"03.42"`.

## 7. Tabla de endpoints

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/songs` | Lista todas las canciones | `200 OK` |
| GET | `/songs/search?name=Valor` | Busca canciones por nombre o coincidencia parcial | `200 OK`, `404 Not Found` |
| GET | `/songs/album/:albumName` | Filtra canciones por álbum | `200 OK`, `404 Not Found` |
| POST | `/songs` | Crea una canción | `201 Created`, `400 Bad Request` |
| PUT | `/songs/:id` | Reemplaza una canción existente | `200 OK`, `400 Bad Request`, `404 Not Found` |
| DELETE | `/songs/:id` | Elimina una canción | `204 No Content`, `404 Not Found` |

### Respuestas de error

Las respuestas esperadas deben utilizar JSON y deben seguir una forma estable definida por `errorHandler`, por ejemplo:

```json
{
  "error": "Descripción legible del error"
}
```

El formato anterior puede ampliarse posteriormente, pero los controladores y servicios no deben construir formatos incompatibles entre sí.

## 8. Convenciones

### Archivos y nombres

- Archivos de implementación: kebab case o los nombres de capas usados por la referencia.
- Archivos principales de las capas: `songs.routes.ts`, `songs.controller.ts`, `songs.service.ts`.
- Middlewares: nombres de archivo derivados de su función, por ejemplo `validateSong.ts`.
- Interfaces y tipos: PascalCase, por ejemplo `Song`.
- Variables y funciones: camelCase.
- Funciones exportadas de controladores: nombres HTTP semánticos, por ejemplo `listar`, `buscarPorNombre`, `crear`, `actualizar`, `eliminar`.
- Las funciones de servicio deben expresar operaciones de dominio, por ejemplo `listarSongs` y `buscarSongsPorNombre`.

### Imports

- Usar imports relativos entre carpetas.
- Preferir imports nombrados para tipos y servicios.
- Mantener cada archivo concentrado en una responsabilidad.

### Manejo de errores

- Los errores esperados de negocio se representan mediante `ApiError`.
- `ApiError` debe incluir el código HTTP y el mensaje.
- Los controladores capturan errores o permiten su propagación y llaman `next(error)`.
- El controlador no decide el formato completo de errores inesperados.
- `errorHandler` debe ser el único middleware autorizado para convertir errores en respuestas HTTP finales.
- Los errores desconocidos deben responder `500 Internal Server Error`.
- Registrar en el servidor el detalle completo de errores `500` sin revelar información interna innecesaria al cliente.

## 9. Scripts de package.json

Se conservarán los scripts de la referencia:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

- `npm run dev`: ejecuta el servidor en modo desarrollo y reinicia ante cambios.
- `npm run build`: compila el código TypeScript según `tsconfig.json`.
- `npm start`: ejecuta la aplicación compilada desde `dist/index.js`.
- Antes de iniciar con `npm start`, se debe ejecutar `npm run build`.

No se añadirá el script `test` hasta que exista una dependencia o infraestructura de pruebas que forme parte del proyecto acordado.

## 10. Plan de fases de implementación

### Fase 0 — Configuración

- [ ] Copiar la estructura mínima de Express + TypeScript.
- [ ] Configurar `tsconfig.json`.
- [ ] Crear scripts de desarrollo, compilación y ejecución.
- [ ] Configurar variables de entorno.

### Fase 1 — Rama `feature/setup`

- [ ] Crear `src/index.ts`.
- [ ] Crear `src/app.ts`.
- [ ] Configurar `express.json()`.
- [ ] Definir tipos iniciales y clase `ApiError`.
- [ ] Crear datos iniciales de TWICE en memoria.
- [ ] Confirmar que el servidor inicia correctamente.

### Fase 2 — Rama `feature/crud`

- [ ] Implementar `songs.routes.ts`.
- [ ] Implementar `songs.controller.ts`.
- [ ] Implementar `songs.service.ts`.
- [ ] Implementar `GET /songs`.
- [ ] Implementar búsqueda por nombre.
- [ ] Implementar filtro por álbum.
- [ ] Implementar creación, actualización y eliminación.
- [ ] Implementar respuestas `200`, `201`, `204`, `400` y `404`.

### Fase 3 — Rama `feature/middlewares`

- [ ] Crear `requestLogger`.
- [ ] Registrar método, ruta y timestamp.
- [ ] Crear `validateSong`.
- [ ] Validar presencia y tipos de todos los campos editables.
- [ ] Crear `validateDurationFormat`.
- [ ] Validar formato `mm:ss` y segundos entre `00` y `59`.
- [ ] Crear `errorHandler`.
- [ ] Registrar error handler al final de `app.ts`.
- [ ] Incorporar respuesta centralizada para rutas no encontradas.

### Fase 4 — Rama `feature/docs`

- [ ] Crear `README.md`.
- [ ] Crear `requests.md`.
- [ ] Documentar instalación y comandos.
- [ ] Documentar estructura y endpoints.
- [ ] Añadir ejemplos manuales de todas las rutas.
- [ ] Adjuntar evidencia de logs generados por middlewares.
- [ ] Adjuntar evidencia de errores validados y manejo centralizado.

### Entregables de evidencia

El archivo `requests.md` debe incluir para cada operación:

- Método y URL.
- Headers necesarios.
- Cuerpo JSON para POST y PUT.
- Respuesta esperada.
- Código HTTP.
- Ejemplo de respuesta exitosa.
- Ejemplo de respuesta de error, especialmente `400` y `404`.

Debe existir evidencia documental de:

- Orden de ejecución de middlewares.
- Registro de método, ruta y timestamp.
- Validación de campos.
- Validación incorrecta de duración.
- Respuesta del middleware centralizado de errores.
- Respuesta `204` sin cuerpo para eliminaciones exitosas.

### Flujo Git/GitHub

Branches propuestas:

- `main`: versión funcional y documentada.
- `feature/setup`: configuración inicial.
- `feature/crud`: rutas, controladores y servicios.
- `feature/middlewares`: validaciones, logging y errores.
- `feature/docs`: documentación y evidencias.

Commits sugeridos:

- `feat: configurar estructura inicial Express y TypeScript`
- `feat: implementar CRUD de canciones en memoria`
- `feat: agregar búsqueda y filtro por álbum`
- `feat: agregar logger de solicitudes`
- `feat: agregar validación de canciones`
- `feat: agregar validación de duración`
- `feat: agregar manejador centralizado de errores`
- `docs: documentar API de canciones`
- `docs: agregar ejemplos de solicitudes manuales`

## 11. Diferencias entre la referencia y el nuevo proyecto

### Se conserva

- Arquitectura Express con capas `routes → controllers → services`.
- Carpeta `data` con arreglo mutable.
- `tipos.ts` para definir modelos.
- Clase `apiError.ts`.
- Separación entre punto de entrada, aplicación y servidor.
- Middlewares globales registrados desde `app.ts`.
- Middleware centralizado de errores al final.
- Uso de `next(error)` desde controladores y servicios.
- Configuración strict de TypeScript.
- Scripts `dev`, `build` y `start`.
- Dependencias existentes de Express, dotenv, TypeScript y tsx.

### Se cambia

- `Personaje` se reemplaza por `Song`.
- Los datos de Mortal Kombat se reemplazan por canciones de TWICE.
- `personajesRouter` se reemplaza por `songsRouter`.
- Se cambia el prefijo `/api/personajes` por `/songs`.
- Las operaciones incluyen búsquedas específicas por nombre y álbum.
- Los IDs pasan de `number` a `string`.
- Se agrega un middleware específico llamado `requestLogger`.
- Se agregan validaciones específicas para campos y duración.
- La creación genera el ID en el servidor.
- El proyecto debe documentar pruebas manuales en `requests.md`.
- Se incorpora un plan explícito de ramas y commits Git/GitHub.

### No se agregan sin instrucción

- Base de datos.
- ORM.
- Prisma, Mongoose o cualquier cliente HTTP externo.
- Autenticación.
- Frontend.
- Frameworks de validación adicionales.
- Suite de pruebas nueva.
- Librerías de logging externas.