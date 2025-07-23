# Configuración de Reglas de Firestore para GESTION PRO

## Error: "Missing or insufficient permissions"

Este error ocurre cuando las reglas de seguridad de Firestore bloquean el acceso a las colecciones.

## Solución: Configurar Reglas de Firestore

### 1. Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `labflow-manager`
3. En el menú lateral, ve a "Firestore Database"
4. Haz clic en la pestaña "Rules"

### 2. Configurar Reglas de Seguridad

Reemplaza las reglas existentes con estas reglas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección 'insumos'
    match /insumos/{document} {
      // Permitir lectura y escritura para usuarios autenticados
      allow read, write: if request.auth != null;
    }
    
    // Reglas para la colección 'lotes'
    match /lotes/{document} {
      // Permitir lectura y escritura para usuarios autenticados
      allow read, write: if request.auth != null;
    }
    
    // Reglas para otras colecciones futuras
    match /{document=**} {
      // Permitir lectura y escritura para usuarios autenticados
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Reglas Alternativas (Solo para Desarrollo/Testing)

Si necesitas acceso sin autenticación para testing (NO recomendado para producción):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // SOLO PARA DESARROLLO - Permitir acceso completo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Reglas de Producción (Más Seguras)

Para un entorno de producción, usa reglas más específicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para insumos
    match /insumos/{insumoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.auth.token.email_verified == true;
      allow update: if request.auth != null && 
                       request.auth.token.email_verified == true;
      allow delete: if request.auth != null && 
                       request.auth.token.email_verified == true;
    }
    
    // Reglas para lotes
    match /lotes/{loteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.auth.token.email_verified == true;
      allow update: if request.auth != null && 
                       request.auth.token.email_verified == true;
      allow delete: if request.auth != null && 
                       request.auth.token.email_verified == true;
    }
  }
}
```

## 5. Aplicar las Reglas

1. Copia las reglas que prefieras
2. Pégalas en el editor de reglas de Firebase Console
3. Haz clic en "Publish" para aplicar los cambios

## 6. Verificar que funcione

Después de aplicar las reglas:
1. Recarga la aplicación
2. Inicia sesión si usas reglas con autenticación
3. Ve a la página de Insumos para verificar que carguen los datos

## Notas Importantes

- **Desarrollo**: Usa reglas permisivas (`allow read, write: if true;`) solo durante desarrollo
- **Producción**: Siempre requiere autenticación y validación adicional
- **Testing**: Las reglas con `if true` permiten acceso sin autenticación, útil para testing inicial
- **Seguridad**: Las reglas de producción incluyen verificación de email y permisos granulares

## Troubleshooting

Si sigues teniendo problemas:
1. Verifica que el usuario esté autenticado (si usas reglas con auth)
2. Revisa la consola del navegador para errores adicionales
3. Confirma que las colecciones 'insumos' y 'lotes' existan en Firestore
4. Asegúrate de que las reglas se hayan publicado correctamente
