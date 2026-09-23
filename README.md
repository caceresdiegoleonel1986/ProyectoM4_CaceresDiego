<p align="center">
  <img src="src/assets/kairo-logo-full.png" alt="Kairo Tasks" width="420" />
</p>

# Kairo Tasks

Aplicación web para organizar tareas personales, asignar prioridades y fechas, consultar una agenda y enviar un resumen por correo electrónico.

Está construida con React, TypeScript, Vite y Firebase.

🔗 **Demo en producción:** [proyecto-m4-caceres-diego.vercel.app](https://proyecto-m4-caceres-diego.vercel.app)

## Funcionalidades

- Registro e inicio de sesión con correo y contraseña.
- Inicio de sesión con Google.
- Creación, edición, finalización y eliminación de tareas.
- Filtros por estado, prioridad y texto de búsqueda.
- Fechas de vencimiento y vista de agenda.
- Resumen de tareas enviado por correo electrónico.
- Protección de rutas para usuarios autenticados.
- Reglas de Firestore para limitar el acceso a las tareas de cada usuario.

## Capturas

| Landing | Registro |
| --- | --- |
| ![Landing de Kairo Tasks](src/assets/Captura%20de%20pantalla%20(454).png) | ![Formulario de registro](src/assets/Captura%20de%20pantalla%20(455).png) |

| Mis Tareas | Agenda |
| --- | --- |
| ![Panel de tareas](src/assets/Captura%20de%20pantalla%20(456).png) | ![Vista de agenda y calendario](src/assets/Captura%20de%20pantalla%20(457).png) |

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- Firebase Authentication
- Cloud Firestore
- FullCalendar
- AWS SES
- Vercel Functions
- Vitest y Testing Library

## Requisitos

- Node.js 20 o superior.
- npm.
- Un proyecto de Firebase con Authentication y Firestore habilitados.
- Una cuenta de AWS SES configurada si se quiere usar el envío de correos.

## Instalación

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env.local` en la raíz del proyecto.
4. Completar las variables de entorno necesarias.

## Variables de entorno

### Firebase

Las variables `VITE_*` se utilizan en el cliente para inicializar Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Estas variables no deben confundirse con credenciales privadas de servidor. La seguridad de los datos depende de Authentication y de las reglas de Firestore, no de ocultar las variables `VITE_*`.

### AWS SES y API de correo

Estas variables se usan únicamente en el backend o en las variables de entorno del proveedor de despliegue:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
SES_FROM_EMAIL=correo-verificado@ejemplo.com
```

Nunca publiques `AWS_SECRET_ACCESS_KEY`, tokens de Vercel ni otros secretos en el repositorio. El archivo `.env.local` debe permanecer fuera del control de versiones.

## Desarrollo

Iniciar el servidor local:

```bash
npm run dev
```

Vite mostrará en la terminal la URL local, normalmente `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Verifica TypeScript y genera la compilación de producción
npm run preview      # Sirve localmente la compilación de producción
npm run lint         # Ejecuta Oxlint
npm test             # Ejecuta los tests una vez
npm run test:e2e     # Ejecuta los tests E2E en Chromium
npm run test:watch   # Ejecuta los tests en modo watch
```

Para la primera ejecución de los tests E2E, instalar el navegador de Playwright:

```bash
npx playwright install chromium
```

Los tests E2E en [e2e/auth.spec.ts](e2e/auth.spec.ts) no requieren credenciales (validan redirecciones y validación de formularios). El flujo de CRUD en [e2e/tasks.spec.ts](e2e/tasks.spec.ts) sí necesita una cuenta real de prueba y se omite automáticamente si no se definen estas variables:

```env
E2E_TEST_EMAIL=usuario-de-prueba@ejemplo.com
E2E_TEST_PASSWORD=contraseña-de-prueba
```

## Tests

La suite usa Vitest, Testing Library y jsdom. Para ejecutarla:

```bash
npm test -- --run
```

La cobertura incluye autenticación, rutas protegidas, formulario y lista de tareas, envío de emails, fechas, Firestore mockeado y el endpoint de SES.

## Firestore

Las reglas se encuentran en [firestone.rules](firestone.rules). El archivo [firebase.json](firebase.json) ya está configurado para utilizarlas.

Cada tarea debe guardar el `userId` del usuario autenticado. Las reglas permiten leer, modificar y eliminar únicamente las tareas propias:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
                                  && resource.data.userId == request.auth.uid;
    }
  }
}
```

**Evidencia de despliegue:** las reglas se publican con `firebase deploy --only firestore:rules` (o desde la pestaña *Rules* del proyecto en Firebase Console → Firestore Database), donde deben verse exactamente como el bloque anterior y con fecha de "última publicación" reciente. La app en producción ([demo en Vercel](https://proyecto-m4-caceres-diego.vercel.app)) solo puede leer/escribir tareas propias porque `useTasks` siempre filtra por `where("userId", "==", user.uid)` **y** estas reglas lo refuerzan del lado del servidor, aunque el filtro del cliente se manipule.

Para probar las reglas de forma aislada se recomienda usar Firebase Emulator Suite.

## Endpoint de correo

La función [api/send-email.ts](api/send-email.ts) expone:


```text
POST /api/send-email
```

Body esperado:

```json
{
  "to": "destinatario@ejemplo.com",
  "summary": "Pendientes: 2\nCompletadas: 3"
}
```

El endpoint valida el correo y limita el resumen a 10.000 caracteres antes de enviarlo mediante AWS SES.

## Compilación y despliegue

Crear la compilación de producción:

```bash
npm run build
```

El proyecto está desplegado en Vercel: **[proyecto-m4-caceres-diego.vercel.app](https://proyecto-m4-caceres-diego.vercel.app)**.

Antes del despliegue, configurar en el proveedor:

- Las variables `VITE_*` de Firebase.
- Las variables privadas de AWS SES.
- `SES_FROM_EMAIL` con una dirección verificada en AWS SES.

También se deben configurar en Firebase Authentication los proveedores que se quieran utilizar y publicar las reglas de Firestore.

## Estructura principal

```text
api/                 Funciones del backend
public/              Archivos públicos
src/components/      Componentes reutilizables
src/hooks/           Autenticación y tareas
src/pages/           Vistas principales
src/routes/          Enrutamiento y protección de rutas
src/services/        Configuración e integraciones externas
src/tests/           Tests unitarios y de componentes
src/types/           Tipos TypeScript
src/utils/           Funciones auxiliares
```

## Seguridad

- No subir archivos `.env*` al repositorio.
- Rotar inmediatamente cualquier token o clave que haya sido expuesto.
- Mantener las credenciales de AWS solo en el entorno del servidor.
- Revisar las reglas de Firestore antes de pasar a producción.
- Configurar autenticación y límites de solicitudes para el endpoint de correo en un entorno productivo.

## Decisiones técnicas y patrón de trabajo

- **Tipos reutilizados:** `Task` y `TaskPriority` (en [src/types/task.ts](src/types/task.ts)) son la única fuente de verdad para la forma de una tarea; `TodoForm`, `TodoList`, `Agenda`, `useTasks` y las páginas los reutilizan en vez de redefinir literales de tipo. Esto evita duplicación y hace que un cambio de prioridad se propague por tipado.
- **`any` mínimo y justificado:** se eliminó `Record<string, any>` en `useTasks` (ahora usa `Omit<Task, "id">` y `Partial<Task>`) y el cast `as any` en `dateHelpers` (reemplazado por un type guard `hasToDate`). El `any` que queda en los tests es intencional para simular objetos de Firestore/Firebase sin acoplarse a sus tipos internos.
- **Errores de Firebase Auth:** `Login` y `Register` usan un helper compartido (`src/utils/authErrors.ts`) que normaliza `unknown` a `{ code, message }` sin `any`, manteniendo mensajes específicos por `code` (credenciales inválidas, email en uso, contraseña débil, etc.).
- **Integración de email desacoplada:** la llamada a `/api/send-email` vive en `src/services/email.ts` (`sendTaskSummary` + `validateTaskSummaryPayload`), no en el componente. `EmailSummaryButton` solo gestiona estados `idle/loading/success/error` y deshabilita el envío si no hay tareas o no hay `userEmail` (caso borde cubierto por test).

## Registro del uso de IA en el proyecto

Durante el desarrollo se utilizaron herramientas de IA como apoyo para aprender conceptos, realizar consultas técnicas, analizar errores y corregir o mejorar código. Cada sugerencia fue revisada, comprendida, probada y adaptada antes de implementarse, verificando su compatibilidad con la arquitectura del proyecto y las pruebas existentes.

En la carpeta [Capturas del uso de IA](src/assets/CapturasAI/) se incluye un registro visual de consultas, revisiones y parte del proceso de desarrollo asistido por IA.

El uso de IA permitió:

- Resolver dudas sobre React, TypeScript, Firebase y pruebas automatizadas.
- Analizar errores y proponer correcciones compatibles con el proyecto.
- Mejorar componentes, validaciones y la experiencia de usuario.
- Mantener una SPA dinámica y moderna con una base de código revisada y probada.

---

## Licencia

Proyecto educativo y de práctica para el módulo 4 de Soy Henry, realizado por Caceres Diego.

---

## Conclusión

Este proyecto combina una SPA moderna, autenticación, gestión de tareas, agenda, envío de resúmenes por correo y despliegue real en Vercel. Es una buena base para continuar agregando funcionalidades de productividad, mejoras de UX e integraciones futuras.
