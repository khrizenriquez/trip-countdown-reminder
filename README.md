# Trip Countdown Reminder

Un proyecto completo que combina un frontend estático con cuenta regresiva y un bot de WhatsApp que envía recordatorios diarios sobre un viaje próximo.

## 📋 Descripción

Este proyecto consta de dos componentes principales:

1. **Frontend (Astro)**: Una aplicación web estática que muestra una cuenta regresiva hacia la fecha de un viaje en tiempo real
2. **Backend (Bot WhatsApp)**: Un servicio Node.js que envía mensajes WhatsApp diarios vía Twilio recordando cuántos días faltan para el viaje

Cuando la cuenta regresiva llega a cero, el frontend muestra "¡Viaja Seguro!" y el bot envía un mensaje de despedida.

## ⚡ Inicio rápido

```bash
# 1. Clonar el proyecto
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder

# 2. Configurar Twilio WhatsApp (ver env.example)
cp env.example .env
nano .env

# 3. ¡UN SOLO COMANDO PARA TODO!
./run-trip-countdown.sh

# 4. Configurar WhatsApp (después del paso 3)
./run-backend.sh
```

**🎯 Resultado**: Frontend en http://localhost:8080 + Backend WhatsApp listo para Twilio

## 🚀 Características

- ✅ **Frontend ultra moderno** con Astro y Tailwind CSS
- ✅ **Diseño circular atractivo** similar a la imagen de referencia
- ✅ **Modo oscuro/claro** con toggle automático
- ✅ **Mobile First** completamente responsivo
- ✅ **Animaciones suaves** y efectos visuales modernos
- ✅ **Gradientes dinámicos** con patrones de fondo animados
- ✅ **Tipografía Inter** para mejor legibilidad
- ✅ **Bot WhatsApp con Twilio** - Más barato y confiable que SMS
- ✅ **Múltiples destinatarios** - Envía a varios números a la vez
- ✅ **Sin QR codes** - API oficial de Twilio, sin whatsapp-web.js
- ✅ **Sandbox gratuito** para pruebas + números Business para producción
- ✅ Contenerización con Podman para recursos mínimos
- ✅ Cron job automatizado para envío diario de mensajes
- ✅ Despliegue optimizado para DigitalOcean

## 🚀 Scripts de automatización

Este proyecto incluye scripts que automatizan todo el proceso de construcción y despliegue:

### 📋 **Scripts disponibles**

| Script | Descripción | Cuándo usar |
|--------|-------------|-------------|
| `./run-trip-countdown.sh` | 🚀 **PRINCIPAL** - Construye y ejecuta todo el proyecto | **Usar siempre** para despliegue completo |
| `./run-backend.sh` | Ejecuta solo el backend con opciones | Configurar WhatsApp o pruebas del bot |
| `./stop-trip-countdown.sh` | Para y limpia todo el proyecto | Parar todos los servicios |

### 🎯 **Script principal recomendado**

```bash
# Un solo comando para todo el proyecto
./run-trip-countdown.sh
```

**Este script hace todo automáticamente:**
- ✅ Limpia contenedores e imágenes anteriores
- ✅ Construye frontend (~51MB) y backend (~200MB)
- ✅ Ejecuta el frontend en http://localhost:8080
- ✅ Deja el backend listo para configurar WhatsApp
- ✅ Verifica que todo funcione correctamente

## 📦 Requisitos

- **Servidor**: Droplet de DigitalOcean (mínimo 1GB RAM, 1 CPU)
- **Container Runtime**: Podman
- **Twilio**: Cuenta con WhatsApp (sandbox gratis o número Business)

## 🛠️ Instalación en DigitalOcean

### Método rápido (recomendado)

```bash
# 1. Clonar el proyecto
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder

# 2. Configurar variables (opcional, ver env.example)
cp env.example .env
nano .env

# 3. ¡Un solo comando para todo!
./run-trip-countdown.sh
```

### Método manual (paso a paso)

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
# Usar el archivo de ejemplo como plantilla
cp env.example .env

# Editar con tus valores reales
nano .env
```

**📄 Archivo `env.example`**: Este archivo contiene todas las variables necesarias con documentación detallada sobre cómo configurar Twilio WhatsApp, incluido el sandbox gratuito.

### 5. Construir los contenedores

```bash
# Con el script principal (recomendado)
./run-trip-countdown.sh

# O manualmente
podman build -t trip-frontend frontend/
podman build -f backend/Dockerfile -t trip-backend .
```

### 6. Configurar WhatsApp Bot

Después de ejecutar `./run-trip-countdown.sh`, configura el bot:

```bash
# Opción 1: Script interactivo (recomendado)
./run-backend.sh

# Opción 2: Comando directo con variables de entorno
podman run --rm -it --name trip-backend \
  -e TWILIO_ACCOUNT_SID="ACxxx..." \
  -e TWILIO_AUTH_TOKEN="tu_auth_token" \
  -e TWILIO_WHATSAPP_NUMBER="+14155238886" \
  -e RECIPIENT_PHONE_NUMBERS="+502XXXXXXXX,+502YYYYYYYY" \
  -e TZ="America/Guatemala" \
  trip-backend node send-whatsapp.js
```

### 7. Ejecutar backend en producción

Una vez configurado Twilio, ejecuta el backend con cron automático:

```bash
# Con el script
./run-backend.sh
# Selecciona opción 2 (Automático con cron)

# O comando directo
podman run -d --name trip-backend \
  -e TWILIO_ACCOUNT_SID="ACxxx..." \
  -e TWILIO_AUTH_TOKEN="tu_auth_token" \
  -e TWILIO_WHATSAPP_NUMBER="+14155238886" \
  -e RECIPIENT_PHONE_NUMBERS="+502XXXXXXXX,+502YYYYYYYY" \
  -e TZ="America/Guatemala" \
  trip-backend
```

## 🚀 Despliegue en Producción

### **Estrategia recomendada**: Frontend + Backend separados

1. **🌐 Frontend**: GitHub Pages (gratuito, estático)
2. **🖥️ Backend**: DigitalOcean/Railway/Render (bot WhatsApp con cron)

### **🌐 Frontend en GitHub Pages**

#### 1. Configurar astro.config.mjs

```bash
# Edita frontend/astro.config.mjs
const GITHUB_USERNAME = 'tu-usuario';        # ← Cambia esto
const REPO_NAME = 'trip-countdown-reminder';  # ← Cambia esto
```

#### 2. Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. Source: **GitHub Actions**
4. ¡Listo! Cada push a `main` despliega automáticamente

**🎯 Resultado**: Tu frontend estará en `https://tu-usuario.github.io/trip-countdown-reminder`

### **🖥️ Backend en DigitalOcean** (Recomendado)

#### Método súper fácil:

```bash
# 1. Crear droplet Ubuntu en DigitalOcean ($4-6/mes)
# 2. Conectar vía SSH
# 3. Instalar Podman:
sudo apt update && sudo apt install -y podman git

# 4. Clonar y desplegar:
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder
./deploy-production.sh  # ← Script automático completo
```

**✨ El script automático hace todo:**
- ✅ Construye la imagen optimizada
- ✅ Configura variables de entorno
- ✅ Ejecuta con límites de recursos
- ✅ Configura cron automático
- ✅ Verifica que todo funcione

### **🚂 Backend en Railway** (Muy fácil)

1. **Conectar repositorio**: https://railway.app → New Project → GitHub
2. **Variables de entorno**:
   ```
   TWILIO_ACCOUNT_SID=ACxxx...
   TWILIO_AUTH_TOKEN=tu_token
   TWILIO_WHATSAPP_NUMBER=+14155238886
   TZ=America/Guatemala
   NODE_ENV=production
   ```
3. **¡Deploy automático!** Railway detecta el `railway.json` y despliega

### **🎨 Backend en Render**

1. **Nuevo Web Service**: https://render.com → New → Web Service
2. **Repositorio**: Conecta tu GitHub
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `node send-whatsapp.js`
5. **Variables de entorno**: Mismas que Railway

### **⚡ Despliegue rápido con Railway**

Ya que elegiste Railway, el proceso es súper sencillo:

```bash
# 1. Frontend (GitHub Pages)
git push origin main  # Auto-deploy activado

# 2. Backend (Railway)
# → Conectar repo en Railway
# → Agregar variables de entorno
# → ¡Deploy automático!
```

### **🔧 Comandos útiles para Railway**

```bash
# Ver logs en tiempo real (desde tu terminal local)
railway logs

# Deploy manual (si es necesario)
git push origin main

# Conectar a Railway CLI (opcional)
railway login
railway link
```

**💡 Nota importante**: Con Railway no necesitas configurar servidores, contenedores ni SSH. Todo es automático.

## 🔧 Comandos útiles

### Scripts de automatización (recomendados)

```bash
# Construir y ejecutar todo el proyecto
./run-trip-countdown.sh

# Configurar solo el backend WhatsApp
./run-backend.sh

# Parar y limpiar todo
./stop-trip-countdown.sh
```

### Gestión manual de contenedores

```bash
# Ver logs del frontend
podman logs -f trip-frontend

# Ver logs del backend
podman logs -f trip-backend

# Ver contenedores ejecutándose
podman ps

# Parar contenedores específicos
podman stop trip-frontend trip-backend

# Eliminar contenedores específicos
podman rm trip-frontend trip-backend
```

## ⚙️ Configuración

### Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio | `AC1234567890abcdef...` |
| `TWILIO_AUTH_TOKEN` | Auth Token de Twilio | `abcdef1234567890...` |
| `TWILIO_WHATSAPP_NUMBER` | Número WhatsApp de Twilio | `+14155238886` (sandbox) |
| `TZ` | Zona horaria | `America/Guatemala` |

### Configuración de destinatarios

Los destinatarios ahora se configuran en `config.json` para mayor personalización:

```json
{
  "whatsapp": {
    "template_id": "HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "recipients": [
      {
        "name": "Persona1",
        "lastName": "Apellido1",
        "phone": "+502XXXXXXXX"
      },
      {
        "name": "Persona2", 
        "lastName": "Apellido2",
        "phone": "+502YYYYYYYY"
      },
      {
        "name": "Persona3",
        "lastName": "Apellido3", 
        "phone": "+502ZZZZZZZZ"
      }
    ]
  }
}
```

**✨ Ventajas del nuevo sistema:**
- 🏷️ **Mensajes personalizados** con nombre de cada destinatario
- 📋 **Organización mejorada** vs variables de entorno
- 🔧 **Fácil mantenimiento** sin redeployar contenedores
- 📱 **Templates Twilio** con variables personalizadas

### Configurar cuenta de Twilio WhatsApp

#### Para pruebas (Sandbox gratuito)
1. **Crear cuenta**: https://www.twilio.com/try-twilio
2. **Acceder al sandbox**: Console > Messaging > Try it out > Send a WhatsApp message
3. **Copiar credenciales**: Account SID y Auth Token
4. **Número sandbox**: `+1 415 523 8886`
5. **Unir destinatarios**: Los números deben enviar `join <codigo>` al sandbox

#### Para producción (WhatsApp Business)
1. **Solicitar número**: Console > Phone Numbers > WhatsApp senders
2. **Verificación de Facebook**: Requiere aprobación de Meta
3. **Configurar perfil**: Nombre, foto, descripción del negocio
4. **Templates**: Crear plantillas de mensaje aprobadas

### Modificar fecha del viaje

Para cambiar la fecha del viaje, edita el archivo `config.json` en la raíz del proyecto:

```json
{
  "trip": {
    "date": "2025-06-26T09:40:00",
    "timezone": "America/Guatemala",
    "description": "Vuelo - Jueves 26 de junio de 2025 a las 9:40 AM"
  }
}
```

**Importante**: Este archivo centraliza la configuración para ambos componentes (frontend y backend). Solo necesitas modificar la fecha aquí y ambos proyectos se actualizarán automáticamente.

### Personalizar mensajes

También puedes personalizar los mensajes del bot editando la sección `