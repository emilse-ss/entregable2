# Pruebas manuales de la API

Base URL: `http://localhost:3000`. Las pruebas se ejecutaron contra la API real con `curl.exe` durante la sesión de desarrollo.

## GET /songs

- Método: `GET`
- URL: `http://localhost:3000/songs`
- Headers: ninguno
- Código HTTP: `200 OK`
- Respuesta real:

```json
[{"id":"1","title":"Feel Special","album":"Feel Special","releaseYear":2019,"duration":"03:24","isTitleTrack":true,"mood":"emotiva"},{"id":"2","title":"Alcohol-Free","album":"Formula of Love: O+T=<3","releaseYear":2021,"duration":"03:04","isTitleTrack":true,"mood":"alegre"},{"id":"ad5e5088-0b64-4815-b5b2-449062120ad3","album":"Formula of Love","mood":"alegre","releaseYear":2021,"duration":"03:18","isTitleTrack":false,"title":"The Feels"}]
```

## GET /songs/search?name=

- Método: `GET`
- URL: `http://localhost:3000/songs/search?name=special`
- Headers: ninguno
- Código HTTP: `200 OK`
- Respuesta real:

```json
[{"id":"1","title":"Feel Special","album":"Feel Special","releaseYear":2019,"duration":"03:24","isTitleTrack":true,"mood":"emotiva"}]
```

## GET /songs/album/:albumName

- Método: `GET`
- URL: `http://localhost:3000/songs/album/Feel%20Special`
- Headers: ninguno
- Código HTTP: `200 OK`
- Respuesta real:

```json
[{"id":"1","title":"Feel Special","album":"Feel Special","releaseYear":2019,"duration":"03:24","isTitleTrack":true,"mood":"emotiva"}]
```

## POST /songs exitoso

- Método: `POST`
- URL: `http://localhost:3000/songs`
- Headers: `Content-Type: application/json`
- Body:

```json
{"title":"The Feels","album":"Formula of Love","releaseYear":2021,"duration":"03:18","isTitleTrack":false,"mood":"alegre"}
```

- Código HTTP: `201 Created`
- Respuesta real:

```json
{"id":"0e7dda8f-e549-491c-98e2-74e433991731","album":"Formula of Love","mood":"alegre","releaseYear":2021,"duration":"03:18","isTitleTrack":false,"title":"The Feels"}
```

## PUT /songs/:id exitoso

- Método: `PUT`
- URL: `http://localhost:3000/songs/1`
- Headers: `Content-Type: application/json`
- Body:

```json
{"title":"Feel Special Actualizada","album":"Feel Special","releaseYear":2019,"duration":"03:24","isTitleTrack":true,"mood":"emotiva"}
```

- Código HTTP: `200 OK`
- Respuesta real:

```json
{"id":"1","album":"Feel Special","mood":"emotiva","releaseYear":2019,"duration":"03:24","isTitleTrack":true,"title":"Feel Special Actualizada"}
```

## DELETE /songs/:id exitoso

- Método: `DELETE`
- URL: `http://localhost:3000/songs/2`
- Headers: ninguno
- Código HTTP: `204 No Content`
- Respuesta real: sin cuerpo.

## Error 400 — campo faltante

- Método: `POST`
- URL: `http://localhost:3000/songs`
- Headers: `Content-Type: application/json`
- Body omitió `title`:

```json
{"album":"Formula of Love","releaseYear":2021,"duration":"03:18","isTitleTrack":false,"mood":"alegre"}
```

- Código HTTP: `400 Bad Request`
- Respuesta real:

```json
{"error":"El campo title debe ser un string no vacío"}
```

## Error 400 — tipo incorrecto

- Método: `POST`
- URL: `http://localhost:3000/songs`
- Headers: `Content-Type: application/json`
- Body:

```json
{"title":"The Feels","album":"Formula of Love","releaseYear":"2021","duration":"03:18","isTitleTrack":false,"mood":"alegre"}
```

- Código HTTP: `400 Bad Request`
- Respuesta real:

```json
{"error":"El campo releaseYear debe ser un entero"}
```

## Error 400 — duración inválida

- Método: `POST`
- URL: `http://localhost:3000/songs`
- Headers: `Content-Type: application/json`
- Body:

```json
{"title":"The Feels","album":"Formula of Love","releaseYear":2021,"duration":"03:60","isTitleTrack":false,"mood":"alegre"}
```

- Código HTTP: `400 Bad Request`
- Respuesta real:

```json
{"error":"El campo duration debe tener formato mm:ss y segundos entre 00 y 59"}
```

## Error 400 — JSON malformado

- Método: `POST`
- URL: `http://localhost:3000/songs`
- Headers: `Content-Type: application/json`
- Body enviado por curl:

```text
{"title":
```

- Código HTTP: `400 Bad Request`
- Respuesta real:

```json
{"error":"JSON malformado"}
```

## Error 404 — id inexistente

- Método: `PUT`
- URL: `http://localhost:3000/songs/no-existe`
- Headers: `Content-Type: application/json`
- Body válido:

```json
{"title":"Test","album":"Test","releaseYear":2021,"duration":"03:18","isTitleTrack":false,"mood":"alegre"}
```

- Código HTTP: `404 Not Found`
- Respuesta real:

```json
{"error":"No existe una canción con id no-existe"}
```

## Error 404 — búsqueda sin resultados

- Método: `GET`
- URL: `http://localhost:3000/songs/search?name=inexistente`
- Headers: ninguno
- Código HTTP: `404 Not Found`
- Respuesta real:

```json
{"error":"No se encontraron canciones con el nombre inexistente"}
```

## Error 404 — ruta inexistente

- Método: `GET`
- URL: `http://localhost:3000/no-existe`
- Headers: ninguno
- Código HTTP: `404 Not Found`
- Respuesta real:

```json
{"error":"Ruta no encontrada: GET /no-existe"}
```

## Evidencia de middlewares

Orden registrado en `app.ts`:

```text
express.json() → requestLogger → /songs → ruta raíz → notFound → errorHandler
```

### requestLogger

La terminal ejecutada con `npm run dev` debe mostrar líneas equivalentes a esta salida real después de cada petición:

```text
[2026-10-30T23:13:28.716Z] GET /songs
[2026-10-30T23:13:28.758Z] GET /songs/search?name=special
[2026-10-30T23:13:28.804Z] GET /songs/album/Feel%20Special
[2026-10-30T23:13:28.994Z] POST /songs
[2026-10-30T23:13:34.555Z] DELETE /songs/2
[2026-10-30T23:13:34.674Z] GET /songs/search?name=inexistente
```

### Detención por validateSong

La petición de campo faltante llegó a `express.json()` y `requestLogger`, pero `validateSong` respondió antes de alcanzar el controlador. La respuesta probada fue:

```json
{"error":"El campo title debe ser un string no vacío"}
```

Por ello no apareció una nueva canción en `GET /songs` ni se ejecutó `crear`.

### Detención por validateDurationFormat

La petición con `duration: "03:60"` pasó `validateSong`, pero fue detenida por `validateDurationFormat`. La respuesta probada fue:

```json
{"error":"El campo duration debe tener formato mm:ss y segundos entre 00 y 59"}
```

No llegó el controlador de creación ni se modificó el arreglo.

## Evidencia de manejo de errores

### 400 Bad Request

```json
{"error":"El campo title debe ser un string no vacío"}
```

También se probó JSON malformado:

```json
{"error":"JSON malformado"}
```

### 404 Not Found

```json
{"error":"No existe una canción con id no-existe"}
```

Y ruta inexistente:

```json
{"error":"Ruta no encontrada: GET /no-existe"}
```

### 500 Internal Server Error

El formato definido por el `errorHandler` para un error no reconocido es:

```json
{"error":"Error interno del servidor"}
```

```text
HTTP/1.1 500 Internal Server Error

[2026-10-30T23:41:22.565Z] GET /debug/error
Error: Fallo simulado para probar el errorHandler
    at <anonymous> (...Entregable2_API\src\app.ts:16:9)
    at Layer.handleRequest (...Entregable2_API\node_modules\router\lib\layer.js:152:17)
    at next (...Entregable2_API\node_modules\router\lib\route.js:157:13)
    at Route.dispatch (...Entregable2_API\node_modules\router\lib\route.js:117:3)
    at handle (...Entregable2_API\node_modules\router\index.js:435:11)
    at Layer.handleRequest (...Entregable2_API\node_modules\router\lib\layer.js:152:17)
    at ...Entregable2_API\node_modules\router\index.js:295:15
    at processParams (...Entregable2_API\node_modules\router\index.js:582:12)
    at next (...Entregable2_API\node_modules\router\index.js:291:5)
    at requestLogger (...Entregable2_API\src\middlewares\requestLogger.ts:5:3)
```