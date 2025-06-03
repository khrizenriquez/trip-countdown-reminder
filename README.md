# Trip Countdown Reminder

Un proyecto completo que combina un frontend estático con cuenta regresiva y un bot de WhatsApp que envía recordatorios diarios sobre un viaje próximo.

## 📋 Descripción

Este proyecto consta de dos componentes principales:

1. **Frontend (Astro)**: Una aplicación web estática que muestra una cuenta regresiva hacia la fecha de un viaje en tiempo real
2. **Backend (Bot WhatsApp)**: Un servicio Node.js que envía mensajes diarios a un grupo de WhatsApp recordando cuántos días faltan para el viaje

Cuando la cuenta regresiva llega a cero, el frontend muestra "¡Viaja Seguro!" y el bot envía un mensaje de despedida.

## 🚀 Características

- ✅ Frontend ultra liviano con Astro y vanilla JavaScript
- ✅ Diseño responsivo moderno con CSS Grid/Flexbox
- ✅ Bot de WhatsApp con persistencia de sesión
- ✅ Contenerización con Podman para recursos mínimos
- ✅ Cron job automatizado para envío diario de mensajes
- ✅ Despliegue optimizado para DigitalOcean

## 📦 Requisitos

- **Servidor**: Droplet de DigitalOcean (mínimo 1GB RAM, 1 CPU)
- **Container Runtime**: Podman
- **WhatsApp**: Número de teléfono activo para escanear QR

## 🛠️ Instalación en DigitalOcean

### 1. Preparar el servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Podman
sudo apt install -y podman podman-compose

# Verificar instalación
podman --version
```

### 2. Configurar usuario (opcional)

```bash
# Crear usuario para deploy
sudo adduser deployuser

# Agregar a grupo podman
sudo usermod -aG podman deployuser

# Cambiar a usuario deploy
su - deployuser
```

### 3. Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder
```

### 4. Configurar variables de entorno

```bash
# Crear archivo de variables de entorno
echo "WHATSAPP_GROUP_ID=TU_ID_DEL_GRUPO" > .env

# Ejemplo de ID de grupo: 123456789012-123456789@g.us
```

### 5. Construir los contenedores

```bash
podman-compose build
```

### 6. Primera configuración del bot WhatsApp

```bash
# Ejecutar manualmente para escanear QR
podman run --rm -it \
  -v ./backend/session:/usr/src/app/session \
  -e WHATSAPP_GROUP_ID="TU_ID_DEL_GRUPO" \
  bot-whatsapp:latest node send-whatsapp.js
```

**Importante**: Escanea el código QR con tu teléfono para autenticar WhatsApp Web.

### 7. Desplegar los servicios

```bash
# Levantar todos los servicios
podman-compose up -d

# Verificar que estén corriendo
podman ps
```

## 🔧 Comandos útiles

### Gestión de contenedores

```bash
# Ver logs del frontend
podman logs -f frontend-static

# Ver logs del backend
podman logs -f bot-whatsapp

# Reiniciar servicios
podman-compose restart

# Parar servicios
podman-compose down

# Reconstruir después de cambios
podman-compose build --no-cache
```

### Verificación del sistema

```bash
# Verificar recursos utilizados
podman stats

# Ver configuración de cron
podman exec bot-whatsapp cat /etc/crontabs/root

# Probar envío manual
podman exec bot-whatsapp node send-whatsapp.js
```

## ⚙️ Configuración

### Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `WHATSAPP_GROUP_ID` | ID del grupo de WhatsApp | `123456789012-123456789@g.us` |
| `TZ` | Zona horaria | `America/Guatemala` |

### Obtener ID del grupo de WhatsApp

1. Agrega el bot a tu grupo
2. Envía cualquier mensaje al grupo
3. Ve los logs del contenedor para encontrar el ID

### Modificar fecha del viaje

Edita las siguientes líneas en:

**Frontend** (`frontend/src/pages/index.astro`):
```javascript
const tripDate = new Date('2024-12-25T00:00:00').getTime();
```

**Backend** (`backend/send-whatsapp.js`):
```javascript
const TRIP_DATE = new Date('2024-12-25T00:00:00').getTime();
```

## 🔒 Firewall y Seguridad

```bash
# Configurar firewall UFW
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw enable
```

## 📊 Límites de recursos

Cada contenedor está configurado con:
- **Memoria máxima**: 300MB
- **CPU máxima**: 0.5 cores

Ideal para droplets de 1GB RAM.

## 🐛 Solución de problemas

### El bot perdió la sesión de WhatsApp

```bash
# Eliminar sesión actual
rm -rf backend/session/*

# Volver a autenticar
podman-compose restart bot-whatsapp
podman logs -f bot-whatsapp
```

### El cron no se ejecuta

```bash
# Verificar zona horaria
podman exec bot-whatsapp date

# Ver logs de cron
podman exec bot-whatsapp tail -f /var/log/cron.log
```

### Frontend no se ve

```bash
# Verificar puerto
curl -I http://localhost

# Verificar logs de nginx
podman logs frontend-static
```

## 📁 Estructura del proyecto

```
trip-countdown-reminder/
├── frontend/                 # Aplicación Astro
│   ├── src/
│   │   ├── pages/index.astro
│   │   └── styles/global.css
│   ├── Dockerfile
│   ├── package.json
│   └── astro.config.mjs
├── backend/                  # Bot WhatsApp
│   ├── session/             # Sesión persistente (gitignored)
│   ├── send-whatsapp.js
│   ├── Dockerfile
│   └── package.json
├── podman-compose.yml       # Orquestación de contenedores
├── .gitignore
└── README.md
```

## 🏷️ Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/).

- **v0.1.0**: Versión inicial con funcionalidad básica

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de los contenedores
2. Verifica las variables de entorno
3. Confirma que la sesión de WhatsApp esté activa
4. Asegúrate de que el firewall permita el tráfico necesario

---

**¡Disfruta tu viaje!** ✈️🎉