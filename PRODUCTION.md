# 🚀 Guía de Despliegue en Producción

## 📋 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de tener:

- [ ] **Cuenta de Twilio** con saldo suficiente
- [ ] **Template WhatsApp aprobado** (ID: HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
- [ ] **Repositorio en GitHub** 
- [ ] **Droplet en DigitalOcean** (o cuenta en Railway/Render)
- [ ] **Destinatarios configurados** en `config.json`

## 🎯 Paso a Paso Completo

### **1. Preparar el Frontend (GitHub Pages)**

```bash
# 1. Editar configuración de Astro
nano frontend/astro.config.mjs

# Cambiar estas líneas:
const GITHUB_USERNAME = 'tu-usuario-github';  # ← TU usuario
const REPO_NAME = 'trip-countdown-reminder';   # ← Nombre de tu repo

# 2. Commit y push
git add .
git commit -m "feat(frontend): configure for GitHub Pages deployment"
git push origin main
```

**🔧 Habilitar GitHub Pages:**
1. Ve a tu repo en GitHub
2. **Settings** → **Pages**
3. **Source**: GitHub Actions
4. ¡El deploy es automático!

**🎯 Resultado**: Frontend disponible en `https://tu-usuario.github.io/trip-countdown-reminder`

---

### **2. Preparar el Backend**

#### **Opción A: DigitalOcean** (Recomendada - $4-6/mes)

```bash
# 1. Crear droplet Ubuntu 22.04 (1GB RAM mínimo)
# 2. Conectar vía SSH:
ssh root@tu-droplet-ip

# 3. Instalar dependencias:
apt update && apt upgrade -y
apt install -y podman git jq

# 4. Crear usuario (opcional pero recomendado):
adduser deployuser
usermod -aG sudo deployuser
su - deployuser

# 5. Clonar proyecto:
git clone https://github.com/tu-usuario/trip-countdown-reminder.git
cd trip-countdown-reminder

# 6. Desplegar automáticamente:
./deploy-production.sh
```

**✨ El script te pedirá:**
- TWILIO_ACCOUNT_SID (empieza con AC...)
- TWILIO_AUTH_TOKEN (tu token secreto)
- TWILIO_WHATSAPP_NUMBER (+14155238886 para sandbox)
- Zona horaria (America/Guatemala)

---

#### **Opción B: Railway** (Súper fácil - $5/mes)

1. **Crear cuenta**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Seleccionar tu repositorio**
4. **Add variables**:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxx
   TWILIO_AUTH_TOKEN=tu_token_secreto
   TWILIO_WHATSAPP_NUMBER=+14155238886
   TZ=America/Guatemala
   NODE_ENV=production
   ```
5. **Deploy** - ¡Automático!

---

#### **Opción C: Render** (Alternativa sólida - $7/mes)

1. **Crear cuenta**: https://render.com
2. **New** → **Web Service**
3. **Connect a repository** → tu repo
4. **Settings**:
   - Build Command: `cd backend && npm install`
   - Start Command: `node send-whatsapp.js`
5. **Environment Variables**: Mismas que Railway

---

### **3. Configurar Destinatarios**

```bash
# Editar destinatarios en config.json
nano config.json

# Agregar/quitar personas:
{
  "whatsapp": {
    "template_id": "HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "recipients": [
      {
        "name": "Juan",
        "lastName": "Pérez",
        "phone": "+502XXXXXXXX"
      },
      {
        "name": "María", 
        "lastName": "García",
        "phone": "+502YYYYYYYY"
      }
    ]
  }
}
```

---

### **4. Verificar que Todo Funciona**

```bash
# Backend en DigitalOcean:
podman logs -f trip-backend-prod

# Prueba manual:
podman exec trip-backend-prod node send-whatsapp.js

# Frontend:
# Visita: https://tu-usuario.github.io/trip-countdown-reminder
```

---

## 🔍 Troubleshooting

### **Frontend no carga**
```bash
# Verificar GitHub Actions
# Ir a: tu-repo → Actions → ver logs del último deploy
```

### **Backend no envía mensajes**
```bash
# Ver logs detallados
podman logs trip-backend-prod

# Revisar configuración de Twilio
podman exec trip-backend-prod node -e "console.log(process.env.TWILIO_ACCOUNT_SID)"

# Probar credenciales manualmente
podman exec trip-backend-prod node send-whatsapp.js
```

### **Template no encontrado**
- Verificar que `HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` esté aprobado en Twilio
- Revisar que acepta 3 variables: nombre, días, descripción

### **Destinatarios no reciben mensajes**
- **Sandbox**: Deben enviar `join tu-codigo` al +1 415 523 8886
- **Producción**: Verificar números con código de país correcto

---

## 📊 Costos Estimados

### **Configuración mínima viable:**
- **Frontend**: $0 (GitHub Pages)
- **Backend**: $4-6/mes (DigitalOcean 1GB)
- **WhatsApp**: ~$0.15/mes (1 mensaje diario × 30 días × $0.005)
- **Total**: **~$5-7/mes** para toda la solución

### **Configuración premium:**
- **Frontend**: $0 (GitHub Pages)
- **Backend**: $7/mes (Render Pro)
- **WhatsApp**: ~$0.45/mes (3 destinatarios)
- **Total**: **~$8/mes**

---

## 🎉 ¡Despliegue Exitoso!

Si todo está funcionando:

✅ **Frontend**: Cuenta regresiva visible en tu GitHub Pages  
✅ **Backend**: Logs muestran "✅ Configuración verificada correctamente"  
✅ **WhatsApp**: Prueba manual envía mensajes exitosamente  
✅ **Cron**: Backend ejecutará automáticamente a las 5:55 AM  

**🎯 Resultado final:**
- Cuenta regresiva pública para compartir
- Recordatorios WhatsApp automáticos diarios
- Sistema robusto y económico
- Fácil mantenimiento y actualizaciones

¡Disfruta tu viaje! ✈️🎉 