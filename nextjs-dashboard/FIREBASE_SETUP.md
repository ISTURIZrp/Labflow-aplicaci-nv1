# Configuración de Firebase para GESTION PRO

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: "gestion-pro")
4. Sigue los pasos de configuración

### 2. Configurar Authentication
1. En la consola de Firebase, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Correo electrónico/contraseña"

### 3. Obtener configuración
1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Scroll hacia abajo hasta "Tus apps"
3. Haz clic en el ícono web "</>"
4. Registra tu app con un nombre
5. Copia la configuración de firebaseConfig

### 4. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tu configuración de Firebase

### 5. Crear usuarios de prueba
1. Ve a "Authentication" > "Users"
2. Haz clic en "Agregar usuario"
3. Crea un usuario de prueba con email y contraseña

## Funcionalidades implementadas:

✅ **Autenticación completa**: Login/logout con Firebase Auth
✅ **Protección de rutas**: El dashboard requiere autenticación
✅ **Contexto de autenticación**: Estado global del usuario
✅ **Interfaz en español**: Textos y mensajes localizados
✅ **Manejo de errores**: Mensajes de error amigables
✅ **UI responsive**: Funciona en móvil y desktop

## Uso:
1. Ve a `/login` para iniciar sesión
2. Usa las credenciales que creaste en Firebase
3. Serás redirigido al dashboard al iniciar sesión
4. Usa "Cerrar sesión" en el sidebar para salir
