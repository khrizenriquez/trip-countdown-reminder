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

**💰 Costo**: ~$5 USD/mes + recursos

### **🎨 Backend en Render**

1. **Nuevo Web Service**: https://render.com → New → Web Service
2. **Repositorio**: Conecta tu GitHub
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `node send-whatsapp.js`
5. **Variables de entorno**: Mismas que Railway

**💰 Costo**: ~$7 USD/mes

### **📋 Comparación de opciones de backend**

| Opción | Costo/mes | Facilidad | Cron | Control | Recomendado para |
|--------|-----------|-----------|------|---------|------------------|
| **DigitalOcean** | $4-6 | ⭐⭐⭐ | ✅ | ⭐⭐⭐ | Desarrolladores |
| **Railway** | $5+ | ⭐⭐⭐⭐⭐ | ✅ | ⭐⭐⭐ | Principiantes |
| **Render** | $7+ | ⭐⭐⭐⭐ | ✅ | ⭐⭐⭐ | Empresas |
| VPS (Linode) | $3-5 | ⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ | Expertos |

### **⚡ Despliegue rápido completo**

```bash
# 1. Frontend (GitHub Pages)
git push origin main  # Auto-deploy activado

# 2. Backend (DigitalOcean)
ssh user@tu-droplet
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder
./deploy-production.sh

# ¡Listo en 5 minutos!
```

### **🔧 Comandos de mantenimiento en producción**

```bash
# Ver logs del backend
podman logs -f trip-backend-prod

# Estado del contenedor
podman ps

# Prueba manual de envío
podman exec trip-backend-prod node send-whatsapp.js

# Reiniciar bot
podman restart trip-backend-prod

# Actualizar código
git pull
podman build -f backend/Dockerfile -t trip-backend-prod .
podman stop trip-backend-prod && podman rm trip-backend-prod
# Ejecutar deploy-production.sh nuevamente
```

### **🔒 Seguridad en producción**

```bash
# Configurar firewall básico
sudo ufw allow 22/tcp    # SSH
sudo ufw enable

# Actualizar sistema regularmente
sudo apt update && sudo apt upgrade -y

# Verificar logs periódicamente
podman logs trip-backend-prod | tail -50
```

**💡 Nota importante**: El backend NO necesita puerto HTTP público. Solo ejecuta cron jobs internos.

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

También puedes personalizar los mensajes del bot editando la sección `messages` en `config.json`:

```json
{
  "messages": {
    "countdown": "¡Faltan {days} días para el viaje! 🗓️✈️",
    "hours": "¡Faltan {hours} horas para el viaje! ⏰✈️",
    "today": "¡El viaje es hoy! 🎉✈️",
    "safe_travel": "¡Viaja seguro! 🎉✈️"
  }
}
```

## 💰 Costos de WhatsApp

### Twilio WhatsApp Pricing (aproximado)
- **Mensajes WhatsApp**: $0.005 USD por mensaje (33% más barato que SMS)
- **Conversaciones**: Primeras 1,000 gratis/mes
- **Número Business**: Requiere aprobación (gratuito)
- **Cuentas trial**: $15.50 USD de crédito gratis

### Ejemplo de costos mensuales
- 1 WhatsApp diario × 30 días = $0.15 USD
- Sin costo de número Business
- **Total**: ~$0.15 USD/mes por destinatario (vs $1.25 USD con SMS)

### Comparación con alternativas
| Método | Costo/mensaje | QR Code | Confiabilidad | Configuración |
|--------|---------------|---------|---------------|---------------|
| **Twilio WhatsApp** | $0.005 | ❌ | ⭐⭐⭐⭐⭐ | Fácil |
| Twilio SMS | $0.0075 | ❌ | ⭐⭐⭐⭐⭐ | Fácil |
| whatsapp-web.js | Gratis | ✅ | ⭐⭐ | Compleja |

## 🔒 Firewall y Seguridad

```bash
# Configurar firewall UFW
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw enable
```

## 📊 Límites de recursos

### Límites optimizados (sin Chromium)
- **Frontend**: Memoria: 100MB, CPU: 0.2 cores
- **Backend**: Memoria: 150MB, CPU: 0.2 cores
- **Total**: ~250MB RAM (vs 600MB con whatsapp-web.js)

Ideal para droplets de 512MB - 1GB RAM.

## 🐛 Solución de problemas

### Error de configuración Twilio

```bash
# Verificar credenciales
podman exec trip-backend node -e "
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch().then(account => console.log('✅', account.friendlyName));
"
```

### WhatsApp no se entregan

```bash
# Ver logs detallados
podman logs -f trip-backend

# Verificar formato de números (+código_país)
# Para sandbox: Verificar que destinatarios estén unidos
# Para producción: Verificar templates aprobados
```

### Sandbox: Destinatarios no reciben mensajes

1. **Unirse al sandbox**: Enviar `join <codigo>` al +1 415 523 8886
2. **Verificar código**: Cada cuenta tiene un código único
3. **Formato correcto**: Números con +código_país

### El cron no se ejecuta

```bash
# Verificar zona horaria
podman exec trip-backend date

# Ver configuración de cron
podman exec trip-backend cat /etc/crontabs/root

# Envío manual de prueba
podman exec trip-backend node send-whatsapp.js
```

### Frontend no se ve

```bash
# Verificar puerto
curl -I http://localhost:8080

# Verificar logs de nginx
podman logs trip-frontend
```

## 📁 Estructura del proyecto

```
trip-countdown-reminder/
├── config.json                  # ✨ Configuración centralizada
├── env.example                  # 📄 Variables de entorno (Twilio WhatsApp)
├── frontend/                    # Aplicación Astro
│   ├── src/
│   │   ├── config.js           # Carga configuración compartida
│   │   ├── pages/index.astro   # Página principal con Tailwind
│   │   └── styles/global.css   # Estilos Tailwind personalizados
│   ├── Dockerfile
│   ├── package.json
│   ├── astro.config.mjs
│   └── tailwind.config.mjs     # Configuración de Tailwind
├── backend/                     # Bot WhatsApp
│   ├── send-whatsapp.js        # 💬 Lógica de envío WhatsApp (Twilio)
│   ├── Dockerfile              # 🚀 Optimizado sin Chromium
│   └── package.json
├── run-trip-countdown.sh        # 🚀 Script principal
├── run-backend.sh              # 💬 Script para WhatsApp
├── stop-trip-countdown.sh      # 🛑 Script de limpieza
├── .gitignore
└── README.md
```

## 🏷️ Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/).

- **v0.1.0**: Versión inicial con whatsapp-web.js
- **v0.2.0**: Migración a Twilio SMS + Frontend moderno
- **v0.3.0**: Migración a Twilio WhatsApp (más económico y confiable)

## 📞 Soporte

Si encuentras problemas:

1. **Configuración**: Revisa las variables de entorno de Twilio
2. **Sandbox**: Verifica que los destinatarios estén unidos al sandbox
3. **Números**: Confirma que tengan formato +código_país
4. **Saldo**: Verifica el saldo en tu cuenta Twilio
5. **Logs**: Revisa los logs de los contenedores
6. **Firewall**: Asegúrate de que el firewall permita el tráfico HTTP

---

**¡Disfruta tu viaje!** ✈️🎉