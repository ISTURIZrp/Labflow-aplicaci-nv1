# Guía de Despliegue en Netlify

## Configuración Automática

### 1. Conectar Repositorio
1. Ve a [Netlify](https://netlify.com) y crea una cuenta
2. Haz clic en "New site from Git"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio de gestion-pro

### 2. Configuración de Build
Netlify detectará automáticamente la configuración desde `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: `nextjs-dashboard`

### 3. Variables de Entorno
En el dashboard de Netlify, ve a "Site settings" > "Environment variables" y agrega:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXTAUTH_SECRET=tu_secret_super_seguro
NEXTAUTH_URL=https://tu-sitio.netlify.app
```

### 4. Configuración de Firebase
Actualiza tu configuración de Firebase:
1. Ve a Firebase Console > Authentication > Settings
2. En "Authorized domains", agrega tu dominio de Netlify: `tu-sitio.netlify.app`
3. Actualiza las URLs de redirección si usas OAuth

## Configuración Manual (Alternativa)

Si prefieres configurar manualmente:

### Build Settings
```
Build command: cd nextjs-dashboard && npm install --legacy-peer-deps && npm run build
Publish directory: nextjs-dashboard/.next
Base directory: /
```

### Deploy Settings
```
Production branch: main
Deploy previews: Automatically build deploy previews for all pull requests
Branch deploys: Deploy only the production branch
```

## Características Configuradas

✅ **Next.js Plugin**: Optimización automática para Next.js
✅ **Redirects**: Manejo de rutas SPA y API routes
✅ **Security Headers**: Headers de seguridad configurados
✅ **Cache**: Cache optimizado para assets estáticos
✅ **Environment Variables**: Soporte para variables de entorno
✅ **Firebase Integration**: Configurado para Firebase Auth y Firestore

## Dominios Personalizados

Para usar un dominio personalizado:
1. Ve a "Domain settings" en tu dashboard de Netlify
2. Haz clic en "Add custom domain"
3. Sigue las instrucciones para configurar DNS
4. Netlify proporcionará certificado SSL automáticamente

## Troubleshooting

### Error de Build
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Netlify
- Asegúrate de que `--legacy-peer-deps` esté en el comando de build

### Errores de Routing
- Las rutas client-side están configuradas en `netlify.toml`
- Verifica que `trailingSlash: true` esté en `next.config.ts`

### Problemas con Firebase
- Asegúrate de que el dominio de Netlify esté en Firebase Auth domains
- Verifica que `NEXTAUTH_URL` apunte a tu dominio de Netlify

## Deploy Hooks

Para deploys automáticos, puedes usar webhooks:
1. Ve a "Site settings" > "Build & deploy" > "Deploy hooks"
2. Crea un nuevo hook
3. Usa la URL en tu CI/CD o webhooks de Git

## Monitoreo

Netlify proporciona:
- Analytics de tráfico
- Logs de funciones
- Métricas de performance
- Alertas de uptime

## Costos

- **Starter Plan**: Gratis (100GB bandwidth, 300 build minutes)
- **Pro Plan**: $19/mes (1TB bandwidth, 25,000 build minutes)
- **Business Plan**: $99/mes (2TB bandwidth, 50,000 build minutes)
