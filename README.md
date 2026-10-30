# API de canciones de TWICE

API REST educativa para consultar y administrar canciones de TWICE almacenadas en memoria.

## Stack

- Node.js
- Express
- TypeScript
- dotenv

## Estructura

```text
src/
├── apiError.ts
├── tipos.ts
├── index.ts
├── app.ts
├── data/songs.ts
├── routes/songs.routes.ts
├── controllers/songs.controller.ts
├── services/songs.service.ts
└── middlewares/
    ├── requestLogger.ts
    ├── validateSong.ts
    ├── validateDurationFormat.ts
    └── errorHandler.ts
```

## Instalación

```powershell
npm install
Copy-Item .env.example .env
```

`PORT` admite configuración mediante el archivo `.env`; el valor predeterminado es `3000`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta la API en modo desarrollo con recarga automática. |
| `npm run build` | Compila TypeScript a `dist/`. |
| `npm start` | Ejecuta la compilación existente. |

## Endpoints

| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| GET | `/songs` | Lista todas las canciones | 200 |
| GET | `/songs/search?name=valor` | Busca coincidencias parciales por título | 200, 400, 404 |
| GET | `/songs/album/:albumName` | Filtra por álbum con coincidencia exacta | 200, 404 |
| POST | `/songs` | Crea una canción; el servidor genera el `id` | 201, 400 |
| PUT | `/songs/:id` | Reemplaza una canción existente | 200, 400, 404 |
| DELETE | `/songs/:id` | Elimina una canción | 204, 404 |

Las rutas inexistentes responden 404 y los errores internos responden 500.

## Middlewares personalizados

- **requestLogger:** registra cada petición con método, `originalUrl` y timestamp ISO.
- **validateSong:** valida los campos editables, sus tipos, los valores no vacíos y rechaza `id` en POST y PUT.
- **validateDurationFormat:** exige duración con formato `mm:ss` y segundos entre `00` y `59`.
- **errorHandler:** es el manejador final de errores. Devuelve `ApiError` con su estado, interpreta JSON malformado como 400, registra errores inesperados y devuelve un error 500 genérico. También incluye el middleware `notFound` para rutas inexistentes.

Las pruebas manuales se encuentran en [requests.md](requests.md).
