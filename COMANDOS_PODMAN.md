# Comandos Podman para Trip Countdown Reminder

## 🔨 **Construcción de imágenes**

### Construir Frontend
```bash
podman build -t trip-frontend frontend/
```
**Resultado**: Imagen de ~51MB con Nginx + sitio estático

### Construir Backend
```bash
podman build -f backend/Dockerfile -t trip-backend .
```
**Resultado**: Imagen de ~1.1GB con Node.js + WhatsApp Web + Chromium + Cron

## 🚀 **Ejecución de contenedores**

### Ejecutar Frontend ✅
```bash
podman run -d --name trip-frontend -p 8080:80 trip-frontend
```
- **Acceso**: http://localhost:8080
- **Puerto**: 8080 (local) → 80 (contenedor)
- **Estado**: ✅ Funcionando correctamente

### Ejecutar Backend

#### Primera vez (escanear QR):
```bash
podman run --rm -it --name trip-backend-temp \
  -v ./backend/session:/usr/src/app/session \
  -e WHATSAPP_GROUP_ID="TU_ID_DEL_GRUPO_REAL" \
  -e TZ="America/Guatemala" \
  trip-backend node send-whatsapp.js
```

#### Con cron automático:
```bash
podman run -d --name trip-backend \
  -v ./backend/session:/usr/src/app/session \
  -e WHATSAPP_GROUP_ID="TU_ID_DEL_GRUPO_REAL" \
  -e TZ="America/Guatemala" \
  trip-backend
```

## 📋 **Gestión de contenedores**

### Ver contenedores ejecutándose
```bash
podman ps
```

### Ver todos los contenedores
```bash
podman ps -a
```

### Ver logs
```bash
podman logs trip-frontend
podman logs trip-backend
```

### Parar contenedores
```bash
podman stop trip-frontend
podman stop trip-backend
```

### Eliminar contenedores
```bash
podman rm trip-frontend
podman rm trip-backend
```

### Reiniciar contenedores
```bash
podman restart trip-frontend
podman restart trip-backend
```

## 🧹 **Limpieza**

### Eliminar imágenes
```bash
podman rmi trip-frontend
podman rmi trip-backend
```

### Limpieza general
```bash
podman system prune -a
```

## ⚙️ **Variables de entorno importantes**

### 📄 **Archivo env.example**

El proyecto incluye un archivo `env.example` con todas las variables necesarias y documentación detallada.

```bash
# Usar como plantilla
cp env.example .env

# Editar con tus valores reales
nano .env
```

### Para el Backend:
- `WHATSAPP_GROUP_ID`: ID del grupo de WhatsApp (ejemplo: `123456789012-123456789@g.us`)
- `TZ`: Zona horaria (ejemplo: `America/Guatemala`)

### Obtener ID del grupo:
1. Ejecuta el bot manualmente con un ID temporal
2. Envía un mensaje al grupo donde quieres el bot
3. Revisa los logs para encontrar el ID real del grupo
4. Actualiza la variable de entorno con el ID correcto

## 🔄 **Flujo de desarrollo**

### 1. Modificar configuración
Edita `config.json` para cambiar fecha del viaje o mensajes:
```json
{
  "trip": {
    "date": "2025-06-26T09:40:00",
    "timezone": "America/Guatemala"
  }
}
```

### 2. Reconstruir (solo si cambias código)
```bash
# Reconstruir frontend
podman build -t trip-frontend frontend/

# Reconstruir backend  
podman build -f backend/Dockerfile -t trip-backend .
```

### 3. Recrear contenedores
```bash
# Parar y eliminar
podman stop trip-frontend trip-backend
podman rm trip-frontend trip-backend

# Volver a ejecutar
podman run -d --name trip-frontend -p 8080:80 trip-frontend
podman run -d --name trip-backend \
  -v ./backend/session:/usr/src/app/session \
  -e WHATSAPP_GROUP_ID="TU_ID" \
  trip-backend
```

## 📊 **Monitoreo**

### Ver recursos utilizados
```bash
podman stats
```

### Inspeccionar contenedor
```bash
podman inspect trip-frontend
podman inspect trip-backend
```

### Ejecutar comandos dentro del contenedor
```bash
podman exec -it trip-backend sh
```

## ⚠️ **Solución de problemas**

### Frontend no carga
```bash
# Verificar que esté corriendo
podman ps | grep trip-frontend

# Ver logs
podman logs trip-frontend

# Probar conexión
curl -I http://localhost:8080
```

### Backend no envía mensajes
```bash
# Ver logs del cron
podman logs trip-backend

# Ejecutar manualmente
podman exec -it trip-backend node send-whatsapp.js

# Verificar sesión de WhatsApp
ls -la backend/session/
```

### Error de módulos ES/CommonJS ✅ SOLUCIONADO
Si ves error `Named export 'LocalAuth' not found`, ya está arreglado en la versión actual.

### Problemas de permisos
```bash
# Verificar propietario de archivos
ls -la backend/session/

# Cambiar permisos si es necesario
chmod -R 755 backend/session/
```

## 🎯 **Estado actual del proyecto**

- ✅ **Frontend**: Funcionando en http://localhost:8080
- ✅ **Backend**: Construido y probado, listo para WhatsApp
- ✅ **Configuración**: Centralizada en `config.json`
- ✅ **Fecha del viaje**: 26 de junio 2025, 9:40 AM Guatemala
- ✅ **Nombres de contenedores**: `trip-frontend` y `trip-backend`
- ⏳ **Pendiente**: Configurar ID real del grupo de WhatsApp

## 🚀 **Comandos de automatización**

### Ejecutar todo automáticamente
```bash
./run-trip-countdown.sh
```

### Parar y limpiar todo
```bash
./stop-trip-countdown.sh
```

## 🚀 **Para desplegar en DigitalOcean**

Los mismos comandos funcionarán en el servidor. Solo necesitas:

1. Instalar Podman en el droplet
2. Clonar el repositorio
3. Configurar la variable `WHATSAPP_GROUP_ID`
4. Ejecutar `./run-trip-countdown.sh` 